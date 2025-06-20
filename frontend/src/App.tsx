import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import DatabaseManager from './features/database-manager';
import ResultUD from './features/ResultUD';
import Demo from './features/Demo.tsx';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<DatabaseManager />} />
          <Route path="/underDev" element={<ResultUD />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </Router>

    </QueryClientProvider>
  )
}


export default App
