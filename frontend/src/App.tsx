import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DatabaseManager from './features/database-manager';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DatabaseManager />} />
        </Routes>
      </Router>

    </QueryClientProvider>
  )
}


export default App
