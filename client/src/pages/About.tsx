import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Github } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";

interface SocialLinks {
  project: {
    x: string;
    github: string;
    email: string;
  };
  authors: Array<{
    name: string;
    x: string;
  }>;
}

export default function About() {
  const { data: socialLinks } = useQuery<SocialLinks>({
    queryKey: ['/api/social-links'],
    retry: false,
  });

  // Construct the CONTRIBUTE.md URL from the GitHub repo URL
  const contributeUrl = socialLinks?.project?.github
    ? `${socialLinks.project.github}/blob/main/CONTRIBUTE.md` 
    : "#";

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans text-foreground">
      <Header />
      
      <main className="py-6 px-4 md:px-8 lg:px-16 flex-grow">
        <div className="max-w-3xl mx-auto prose prose-stone prose-headings:mb-2 prose-p:my-2 prose-ul:my-2">
          <section className="mb-6">
            <h1 className="text-2xl font-bold">About Us</h1>
            <p className="text-sm">
              VibeCoding Arena is an open platform for crowdsourced AI benchmarking in development. 
              We're creating learn-agents.diy so everyone can learn the art of making agents for free. 
              We always welcome contributions from the community. If you're interested in collaboration, 
              we'd love to hear from you!
            </p>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold">Open-source contributors</h2>
            <ul className="list-disc pl-6 space-y-0 text-sm">
              <li>
                <span className="font-medium">Leads:</span>{" "}
                {socialLinks?.authors ? (
                  <>
                    {socialLinks.authors.map((author, index) => (
                      <span key={author.name}>
                        <a 
                          href={author.x} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {author.name}
                        </a>
                        {index < socialLinks.authors.length - 1 ? ", " : ""}
                      </span>
                    ))}
                  </> 
                ) : (
                  "David Merkulov, Dmitry Zhechkov, Artem Bulgakov"
                )}
              </li>
              <li>
                <span className="font-medium">Contributors:</span> here could be your name!
              </li>
            </ul>
          </section>

          <section className="mb-6">
            <h2 className="text-xl font-bold">Learn More</h2>
            <ul className="list-disc pl-6 text-sm">
              <li>
                <a 
                  href={contributeUrl}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  How to contribute
                </a>
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold">Contact Us</h2>
            <ul className="list-disc pl-6 space-y-1 text-sm">
              <li>
                Follow our{" "}
                {socialLinks?.project?.x && (
                  <a 
                    href={socialLinks.project.x}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                    aria-label="X (Twitter)"
                  >
                    <FaXTwitter className="inline" size={16} />
                    <span className="sr-only">X</span>
                  </a>
                )} or email us at{" "}
                {socialLinks?.project?.email ? (
                  <a 
                    href={`mailto:${socialLinks.project.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                  >
                    <Mail className="inline mr-1" size={16} />
                    {socialLinks.project.email}
                  </a>
                ) : (
                  <a 
                    href="mailto:vibecoding-arena@gmail.com"
                    className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                  >
                    <Mail className="inline mr-1" size={16} />
                    vibecoding-arena@gmail.com
                  </a>
                )}
              </li>
              <li>
                File issues on{" "}
                {socialLinks?.project?.github && (
                  <a 
                    href={socialLinks.project.github}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                  >
                    <Github className="inline mr-1" size={16} />
                    GitHub
                  </a>
                )}
              </li>
            </ul>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}