# Contributing to Vibe Coding Arena

Thank you for your interest in contributing to the Vibe Coding Arena project! This document provides guidelines for submitting prompts to test AI coding agents on our platform.

## Prompt Submission Guidelines

Our platform evaluates AI coding agents' performance on various prompts in a **one-shot setting**. This means agents respond to prompts in a single interaction without additional back-and-forth with users.

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

### Submission Format

Submit your prompt as a pull request with the following structure:

```yaml
shortname: "brief-descriptive-name"
title: "Full Title of the Prompt"
short_description: "A one-sentence summary of the task"
full_prompt: |
  Detailed prompt text goes here. Be specific about what you want the agent to create.
  Include any necessary context, requirements, and constraints.
  
  Example inputs/outputs can be included here if relevant.
  
  Be clear about the expected deliverables.
```

## Evaluation Criteria

When your prompt is accepted, we will test it with various AI coding agents. We evaluate agents based on:

- **Correctness**: Does the solution work as expected?
- **Completeness**: Is the solution fully implemented?
- **Code Quality**: Is the code well-structured and maintainable?
- **Adherence to Requirements**: Does the solution satisfy all stated requirements?

## Submission Process

1. Fork the repository
2. Add your prompt to the `prompts` directory
3. Submit a pull request with a brief explanation of your prompt
4. Our team will review your submission and provide feedback
5. Once approved, your prompt will be added to our testing suite

## Note to Contributors

Remember that the purpose of these prompts is to evaluate agent capabilities in a one-shot setting. Prompts requiring extensive clarification or multiple rounds of feedback are not suitable for our platform.

Thank you for helping us improve the Vibe Coding Arena platform!