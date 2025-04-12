import { Prompt } from "@/lib/types";

export const mockPrompts: Prompt[] = [
  {
    id: "todo-app",
    text: "Build a minimalist to-do list app with dark mode",
    description: "See how different AI agents approach a simple productivity application",
    carouselIndex: 0,
    agents: [
      {
        id: "v0-todo",
        promptId: "todo-app",
        agentName: "v0",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcWR0amZic3hlNTJiaGR2M3NoMDQxNHkwdzRrYWF3c2RlanlucXdpaCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7btQ8jDTPGDpgc6I/giphy.gif",
        codeLink: "#",
      },
      {
        id: "replit-todo",
        promptId: "todo-app",
        agentName: "Replit",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnJ6ZTNyN2xpemQ4M3B5ZnpkcWUyeTh4YmgyOGlzbWp0cG5xbW5hdSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/RGXg1aS4GJ1RUFXgny/giphy.gif",
        codeLink: "#",
      },
      {
        id: "lovable-todo",
        promptId: "todo-app",
        agentName: "Lovable",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExemZkcHlvZm5sODk5aGlwdnRleDgxaXc4YWNla3NrbnF3NHNkY2x5ZCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/IdD0JBbJYQ2RTTRldr/giphy.gif",
        codeLink: "#",
      },
      {
        id: "bolt-todo",
        promptId: "todo-app",
        agentName: "Bolt",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeHVraHF2NXd4bDUzaG9yanJ0bXMxZWZ3MXgyYmw4eTRjbzViZjQyNSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/rtRflhLVzbNWU/giphy.gif",
        codeLink: "#",
      }
    ],
  },
  {
    id: "weather-app",
    text: "Create a weather dashboard with animated visualizations",
    description: "Explore different approaches to data visualization and user experience",
    carouselIndex: 1,
    agents: [
      {
        id: "v0-weather",
        promptId: "weather-app",
        agentName: "v0",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcmU5Y2VuYzZneWVrZW81ZTVuNWE5eTYzeXFiYXZ2ejM3MTc1dDJxZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/VipFNUBbuoeZVegbL4/giphy.gif",
        codeLink: "#",
      },
      {
        id: "replit-weather",
        promptId: "weather-app",
        agentName: "Replit",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExZDQ1bTZvZnYzdzMxOHU2Mmt2emRyZXV5ZzVwa2J4dGpjcG51MnpmZyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/26BGCwC9DTGRR9Cm4/giphy.gif",
        codeLink: "#",
      },
      {
        id: "lovable-weather",
        promptId: "weather-app",
        agentName: "Lovable",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnloZHl5ZWlqdjRudHhxdW93NGZneTltcXNvZm52ZWRxZDJwbWFmeCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/cPGPxsC38mJ1e/giphy.gif",
        codeLink: "#",
      },
      {
        id: "bolt-weather",
        promptId: "weather-app",
        agentName: "Bolt",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3QzOHdueHJ3bWU3OTFqankyMmYwMzY2aGEyMnlndG1tZXZ2MzBnbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUPJULZTnMbhkNqf9m/giphy.gif",
        codeLink: "#",
      }
    ],
  },
  {
    id: "ecommerce-app",
    text: "Design an interactive e-commerce product page",
    description: "Compare different approaches to product showcases and shopping experiences",
    carouselIndex: 2,
    agents: [
      {
        id: "v0-ecommerce",
        promptId: "ecommerce-app",
        agentName: "v0",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGJtMDVib29qZTdrd3dlcHBrNThmMHBid2tqaDFhdHZ2eTk3ZDQwbCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPflLYzfTcpsuxG/giphy.gif",
        codeLink: "#",
      },
      {
        id: "replit-ecommerce",
        promptId: "ecommerce-app",
        agentName: "Replit",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExczdib2czM29yeWdhbzJrNmJtbjR3emY2NWd1ejJyY2Z2Ymk3ZHc5NSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/7D59fPgwkLT4EhHfDN/giphy.gif",
        codeLink: "#",
      },
      {
        id: "lovable-ecommerce",
        promptId: "ecommerce-app",
        agentName: "Lovable",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExY3JsOWZ6aGZoN25zZHM0bnY0N2R6a2J3aWZkY2Fmc2MwZThiMnBpYSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YnucrXGV0EAII0zYsN/giphy.gif",
        codeLink: "#",
      },
      {
        id: "bolt-ecommerce",
        promptId: "ecommerce-app",
        agentName: "Bolt",
        gifUrl: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExeW1iY3BuaWZ3YnZ3bW95c2RzYnZqdmJodGJrYW9xYmU2d3Nta3RhYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/x5Ujb8YzWwBV58TKhg/giphy.gif",
        codeLink: "#",
      }
    ],
  },
];
