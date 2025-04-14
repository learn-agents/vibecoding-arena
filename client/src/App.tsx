import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { staticQueryClient } from "./lib/staticDataClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import NotFound from "./pages/not-found";
import Home from "./pages/Home";
import About from "./pages/About";

// Determine if we're running in static mode
const isStaticMode = import.meta.env.VITE_STATIC_MODE === 'true';
const client = isStaticMode ? staticQueryClient : queryClient;

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={client}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
