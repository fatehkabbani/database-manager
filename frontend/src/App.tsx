import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DatabaseManager from './features/database-manager';
import LandingPage from './features/landing-page';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<DatabaseManager />} />

        </Routes>
      </Router>

    </QueryClientProvider>
  )
}


export default App
