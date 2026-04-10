import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./layout/AppLayout";

// pages
// import Dashboard from "./pages/Dashboard";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Form from "./pages/Form";
import FounderDetail from "./pages/FounderDetailV2";
import MissingInfo from "./pages/MissingInfo";
import "./global.scss";

import AnalyzePage from "./pages/AnalyzePage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        <Route path="/form" element={<Form />} />
        <Route
          path="/founders/:founderId/missing-info"
          element={<MissingInfo />}
        />

        {/* App shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/founders/:founderId" element={<FounderDetail />} />
          <Route path="/excelanalyzer" element={<AnalyzePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
