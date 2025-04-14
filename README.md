# Vibe Coding Arena

<div align="center">
  <img src="public/favicon.ico" alt="Vibe Coding Arena Logo" width="150" />
  
  A dynamic AI coding agent showcase platform for crowdsourced AI benchmarking in building actual web applications.
</div>

## Introduction

Vibe Coding Arena is an open platform that allows you to compare different AI coding agents side-by-side. The platform showcases how various AI agents approach the same coding tasks, providing valuable insights into their capabilities, strengths, and unique approaches.

Currently, the platform features "simple" prompts that demonstrate basic web development tasks. In the near future, we plan to expand our prompt categories to include:

- **Hard** - More complex coding challenges that test advanced capabilities
- **Games** - Game development scenarios to showcase interactive experiences
- **4Devs** - Advanced web applications ready for production, aimed at professional developers

Our goal is to create a comprehensive resource for understanding how AI coding agents perform across different types of development tasks, enabling users to make informed decisions about which agents are best suited for their specific needs.

## Quickstart

To run the Vibe Coding Arena locally, follow these steps:

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/vibe-coding-arena.git
   cd vibe-coding-arena
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

### Project Structure

- `/client` - React frontend with Tailwind CSS
- `/server` - Express backend for API endpoints
- `/data` - YAML configuration files
- `/shared` - Shared types and schemas
- `/scripts` - Utility scripts

## Features

- Side-by-side comparison of multiple AI agents' solutions to the same prompt
- Dynamic YAML-driven agent configuration
- Responsive and accessible UI design for both desktop and mobile
- Filtering system to compare agents by categories
- Video/GIF previews of working applications
- Links to source code and deployed examples

## Evaluation (Rules for Contribution)

We evaluate AI coding agents' performance on various prompts in a **one-shot setting**. This means agents respond to prompts in a single interaction without additional back-and-forth with users.

### Requirements for Prompts

1. **One-Shot Compatibility**: Prompts must be designed for one-shot completion. Agents should be able to deliver a complete solution without needing clarification or follow-up.

2. **Clear Problem Statement**: Each prompt must include:
   - A detailed description of the task
   - Expected output or deliverables
   - Any specific constraints or requirements

3. **Technical Focus**: Prompts should focus on coding tasks such as:
   - Creating specific UI components
   - Implementing algorithms
   - Building small applications
   - Fixing bugs in existing code
   - Optimizing code for better performance

4. **Scope Appropriateness**: Tasks should be achievable in a single response. Avoid overly complex projects that would naturally require multiple iterations.

5. **Input/Output Examples**: Where applicable, include sample inputs and expected outputs to clarify requirements.

## Contributing

We welcome contributions from the community! If you're interested in submitting new prompts, improving existing ones, or enhancing the platform itself, please check out our [Contribution Guidelines](CONTRIBUTE.md).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions, suggestions, or collaboration opportunities:

- **X (Twitter)**: [https://x.com/aicagents](https://x.com/aicagents)
- **GitHub**: [https://github.com/all-mute/vibecoding-arena](https://github.com/all-mute/vibecoding-arena)
- **Email**: [vibecoding-arena@gmail.com](mailto:vibecoding-arena@gmail.com)

### Team

- Dmitry Zhechkov - [https://x.com/dzhechkov](https://x.com/dzhechkov)
- David Merkulov - [https://x.com/0xMerkulov](https://x.com/0xMerkulov)
- Artem Bulgakov - [https://x.com/w0ltage](https://x.com/w0ltage)