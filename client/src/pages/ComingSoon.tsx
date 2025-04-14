import { Link } from "wouter";
import { Button } from "../components/ui/button";

interface ComingSoonProps {
  title: string;
  description?: string;
}

export default function ComingSoon({ title, description }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-4xl md:text-5xl font-bold mb-6">{title}</h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-2xl">
        {description || "This section is currently in development. Check back soon for updates!"}
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild variant="default" size="lg">
          <Link to="/">
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}