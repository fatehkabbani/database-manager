import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DatabaseManager from './features/database-manager';
import LandingPage from './features/landing-page';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function NotFound() {
  return <div className="text-red-500 text-center h-[100vh] w-full flex justify-center items-center"><h1 className="font-extrabold text-4xl">404 - Page Not Found</h1></div>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DatabaseManager />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App
