import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="py-8 px-4 md:px-8 lg:px-16 flex-grow">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold mb-8 text-center">
            About the Author
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            {/* Left Column - Avatar */}
            <div className="flex flex-col items-center justify-start">
              <img 
                src="https://avatars.githubusercontent.com/u/25614260" 
                alt="David Merkulov" 
                className="rounded-lg w-full max-w-md shadow-lg"
              />
            </div>
            
            {/* Right Column - Bio */}
            <div className="prose max-w-none">
              <h3 className="text-xl font-medium mb-4">David Merkulov</h3>
              <p>
                My name is David Merkulov. I'm an AI Agents enthusiast, deeply immersed in this field since 2022. Previously, I worked as an AI architect in the YandexGPT team, was involved in DL development, and participated in more than 10 AI startups, including big tech projects.
              </p>
              <p>
                Currently, I'm the CTO at an international venture fund, where I focus on automating internal processes using agents and creating AI-insight tools. I also run a free online course (learn-agents.diy), offer mentorship (similar to ds-mentor.ru), and provide consulting services.
              </p>
              <div className="mt-6">
                <a 
                  href="https://www.merkulov.ai/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 rounded-md border-2 border-black text-black hover:bg-black hover:text-white transition-all"
                >
                  Visit Personal Website
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}