import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import IndexedDBService from "./utils/idb";
import { Toaster } from "sonner";
import SelfSourcePage from "./pages/SelfSourcePage";
import FilterResultsPage from "./pages/FilterResultsPage";
import React from "react";
const AppRoutes = () => {
  const navigate = useNavigate();
  const [showSessionExpiredDialog, setShowSessionExpiredDialog] =
    useState(false);
          IndexedDBService.initializeDatabase();

  return (
    <>
      <Routes>
          <Route path="/" element={<SelfSourcePage />} />
          <Route path="/self-source/results" element={<FilterResultsPage />} />
      </Routes>
    </>
  );
};

function App() {
  // Add a key based on timestamp to force providers to remount on refresh
  const refreshKey = React.useMemo(() => Date.now().toString(), []);

  return (
          <Router>
            <AppRoutes />
            <Toaster />
          </Router>
)}

export default App;
