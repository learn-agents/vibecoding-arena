import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import About from "@/pages/About";
import ComingSoon from "@/pages/ComingSoon";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/hard">
        {() => <ComingSoon title="Hard Challenges" description="Advanced AI coding challenges are coming soon. Stay tuned!" />}
      </Route>
      <Route path="/games">
        {() => <ComingSoon title="AI Game Development" description="AI-powered game development challenges are in the works!" />}
      </Route>
      <Route path="/for-devs">
        {() => <ComingSoon title="For Developers" description="Developer-focused resources and comparisons are coming soon." />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
