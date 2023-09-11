import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import ConfirmationPage from "./pages/ConfirmationPage";
import HomePage from "./pages/HomePage";
import CongratulationPage from "./pages/CongratulationPage";
import JobDetails from "./pages/JobDetails";
import PostJob from "./pages/PostJob";
import ApplicationPage from "./pages/ApplicationPage";
import ApplicationListPage from "./pages/ApplicationListPage";
import ContinueRegistrationPage from "./pages/ContinueRegistrationPage";
import ProfilePage from "./pages/ProfilePage";
import JobsPage from "./pages/JobsPage";
import ApplicationsJobPage from "./pages/ApplicationsJobPage";
import PayPalPage from "./pages/PayPalPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/confirm" element={<ConfirmationPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/home" element={<HomePage />} />
        <Route
          path="/congratulation/:token?"
          element={<CongratulationPage />}
        />
        <Route
          path="/job/:jobTitle?/:companyName?/:id?"
          element={<JobDetails />}
        />
        <Route path="/job/post" element={<PostJob />} />
        <Route path="/application/:id?" element={<ApplicationPage />} />
        <Route path="/profile/applications" element={<ApplicationListPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route
          path="/register/continue"
          element={<ContinueRegistrationPage />}
        />
        <Route path="/jobs" element={<JobsPage />} />
        <Route
          path="/applications/job/:id?"
          element={<ApplicationsJobPage />}
        />
        <Route path="/paypal" element={<PayPalPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
