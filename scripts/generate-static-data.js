// scripts/generate-static-data.js
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { YamlStorage } from '../server/yamlStorage.js';

const outputDir = path.join(process.cwd(), 'public', 'data');

// Make sure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateStaticData() {
  try {
    console.log('Generating static data files...');
    
    // Generate prompts data
    const storage = new YamlStorage();
    const promptsWithAgents = await storage.getAllPromptsWithAgents();
    fs.writeFileSync(
      path.join(outputDir, 'prompts.json'),
      JSON.stringify(promptsWithAgents, null, 2)
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

generateStaticData();