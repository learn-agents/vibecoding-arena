// scripts/generate-static-data.js
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { v4 as uuidv4 } from 'uuid';

const outputDir = path.join(process.cwd(), 'public', 'data');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateStaticData() {
  try {
    console.log('Generating static data files...');
    
    // Generate prompts data directly from YAML
    const promptsData = generatePromptsFromYaml();
    fs.writeFileSync(
      path.join(outputDir, 'prompts.json'),
      JSON.stringify(promptsData, null, 2)
    );
    console.log('Generated prompts.json');
    
    // Generate social links data
    const socialLinksPath = path.join(process.cwd(), 'data', 'social_links.yaml');
    if (fs.existsSync(socialLinksPath)) {
      const fileContents = fs.readFileSync(socialLinksPath, 'utf8');
      const data = yaml.load(fileContents);
      fs.writeFileSync(
        path.join(outputDir, 'social-links.json'),
        JSON.stringify(data, null, 2)
      );
      console.log('Generated social-links.json');
    } else {
      console.warn('Warning: social_links.yaml not found, skipping social links generation');
    }
    
    console.log('Static data generation complete!');
  } catch (error) {
    console.error('Error generating static data:', error);
    process.exit(1);
  }
}

function generatePromptsFromYaml() {
  try {
    // Read the YAML file from the root directory
    const yamlPath = path.join(process.cwd(), 'prompts-metadata.yaml');
    const fileContents = fs.readFileSync(yamlPath, 'utf8');
    const yamlData = yaml.load(fileContents);
    
    if (!yamlData || !yamlData.prompts) {
      console.error('Invalid YAML file structure. Expected "prompts" array.');
      return [];
    }

    // Transform YAML data to match the API format
    return yamlData.prompts.map((yamlPrompt, index) => {
      // Process agents for this prompt
      const agents = yamlPrompt.agents.map(yamlAgent => {
        return {
          id: uuidv4(),
          promptId: yamlPrompt.shortname,
          agentName: yamlAgent.name,
          gifUrl: yamlAgent.video_url,
          codeLink: yamlAgent.code_link,
          originalGifUrl: yamlAgent.image_link,
          createdAt: yamlAgent.created_at,
          siteLink: yamlAgent.site_link,
        };
      });
      
      // Return the formatted prompt with its agents
      return {
        id: yamlPrompt.shortname,
        text: yamlPrompt.title,
        description: yamlPrompt.short_description,
        carouselIndex: index,
        fullPromptLink: yamlPrompt.full_prompt_link || undefined,
        agents: agents,
      };
    });
  } catch (error) {
    console.error('Error processing YAML data:', error);
    return [];
  }
}

generateStaticData();