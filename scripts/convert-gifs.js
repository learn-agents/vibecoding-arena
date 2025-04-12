import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
const execPromise = promisify(exec);

// Paths
const yamlPath = path.join(process.cwd(), 'prompts-metadata.yaml');
const outputDir = path.join(process.cwd(), 'public/videos');
const tempDir = path.join(process.cwd(), 'temp');

// Ensure directories exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Load the YAML file
async function loadYaml() {
  try {
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    return yaml.load(fileContents);
  } catch (error) {
    console.error('Error loading YAML file:', error);
    throw error;
  }
}

// Save the YAML file
async function saveYaml(data) {
  try {
    const yamlString = yaml.dump(data, { lineWidth: -1 });
    fs.writeFileSync(yamlPath, yamlString, 'utf8');
  } catch (error) {
    console.error('Error saving YAML file:', error);
    throw error;
  }
}

// Download a file from URL
async function downloadFile(url, outputPath) {
  try {
    console.log(`Downloading ${url} to ${outputPath}`);
    await execPromise(`curl -L "${url}" -o "${outputPath}"`);
    return true;
  } catch (error) {
    console.error(`Error downloading ${url}:`, error);
    return false;
  }
}

// Convert GIF to MP4 using ffmpeg
async function convertGifToMp4(gifPath, outputPath) {
  try {
    console.log(`Converting ${gifPath} to ${outputPath}`);
    await execPromise(`ffmpeg -i "${gifPath}" -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" -y "${outputPath}"`);
    return true;
  } catch (error) {
    console.error(`Error converting ${gifPath}:`, error);
    return false;
  }
}

// Process all GIFs in the YAML file
async function processGifs() {
  try {
    // Load YAML data
    const yamlData = await loadYaml();
    if (!yamlData || !yamlData.prompts) {
      console.error('Invalid YAML structure. Expected "prompts" array.');
      return;
    }

    // Track all unique GIF URLs
    const uniqueGifs = new Map();
    
    // First, identify all unique GIFs
    yamlData.prompts.forEach(prompt => {
      prompt.agents.forEach(agent => {
        const gifUrl = agent.gif_url;
        if (!uniqueGifs.has(gifUrl)) {
          // Generate a sanitized filename from the GIF URL
          const urlParts = new URL(gifUrl).pathname.split('/');
          const filename = urlParts[urlParts.length - 1].replace(/[^a-zA-Z0-9._-]/g, '_');
          const sanitizedName = `${agent.name}_${filename}`.replace('.gif', '');
          
          uniqueGifs.set(gifUrl, {
            originalUrl: gifUrl,
            tempPath: path.join(tempDir, `${sanitizedName}.gif`),
            outputPath: path.join(outputDir, `${sanitizedName}.mp4`),
            publicPath: `/videos/${sanitizedName}.mp4`
          });
        }
      });
    });

    console.log(`Found ${uniqueGifs.size} unique GIFs to process`);

    // Download and convert each unique GIF
    for (const [url, fileInfo] of uniqueGifs.entries()) {
      // Download the GIF
      const downloaded = await downloadFile(url, fileInfo.tempPath);
      if (!downloaded) {
        console.error(`Failed to download ${url}, skipping conversion`);
        continue;
      }

      // Convert to MP4
      const converted = await convertGifToMp4(fileInfo.tempPath, fileInfo.outputPath);
      if (!converted) {
        console.error(`Failed to convert ${fileInfo.tempPath}, keeping original GIF URL`);
        continue;
      }

      console.log(`Successfully processed: ${url} -> ${fileInfo.publicPath}`);
    }

    // Update the YAML file with new video paths
    yamlData.prompts.forEach(prompt => {
      prompt.agents.forEach(agent => {
        const gifUrl = agent.gif_url;
        if (uniqueGifs.has(gifUrl)) {
          const fileInfo = uniqueGifs.get(gifUrl);
          
          // Check if the MP4 file exists before updating the URL
          if (fs.existsSync(fileInfo.outputPath)) {
            // Keep the original URL as a comment or in a new field
            agent.original_gif_url = gifUrl;
            // Update with the new video path
            agent.gif_url = fileInfo.publicPath;
          }
        }
      });
    });

    // Save the updated YAML
    await saveYaml(yamlData);
    console.log('YAML file updated successfully');

    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log('Cleaned up temporary files');
    }
    
    console.log('All GIFs processed and converted to MP4');
  } catch (error) {
    console.error('Error processing GIFs:', error);
    throw error;
  }
}

// Run the script
processGifs()
  .then(() => console.log('Finished processing GIFs'))
  .catch(error => console.error('Script failed:', error));