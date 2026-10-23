import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage.jsx";
import AdminHome from "./Components/AdminHome.jsx";
import ScoringPage from "./Components/ScoringPage.jsx";
import ScoreSheet from "./ScoreSheet.jsx";
import ConsolidatedResults from "./Components/ConsolidatedResults.jsx";
import NotFound from "./Components/NotFound.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ConsolidatedSheet from "./Components/ConsolidatedSheet.jsx";
import GradeHelper from "./Components/GradeHelper.jsx";
import SecretaryScoringPage from "./Components/SecretaryScoringPage.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route
          path="/scoresheet/:ageGroup/:type/:apparatus"
          element={<ScoreSheet />}
        />
        <Route
          path="/consolidated/:ageGroup/:type"
          element={<ConsolidatedResults />}
        />

        {/* Secretary routes authenticate using the HttpOnly secretary session cookie. */}
        <Route path="/secretary" element={<SecretaryScoringPage />} />
        <Route
          path="/secretary/scoring/:ageGroup/:type"
          element={<SecretaryScoringPage />}
        />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminHome />} />
          <Route
            path="/scoring/:ageGroup/:type"
            element={<ScoringPage />}
          />
        </Route>
        <Route path="/consolidatedSheet/:ageGroup/:type" element={<ConsolidatedSheet />} />

        <Route path="grade-helper" element={<GradeHelper />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
