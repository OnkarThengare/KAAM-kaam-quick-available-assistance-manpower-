import { Routes, Route, Navigate } from "react-router-dom";
import RequireRole from "./components/RequireRole";
import ClientLayout from "./components/ClientLayout";
import WorkerLayout from "./components/WorkerLayout";
import Landing from "./pages/Landing";
import Signup from "./pages/Signup";
import Otp from "./pages/Otp";
import Login from "./pages/Login";
import ClientDashboard from "./pages/client/Dashboard";
import Services from "./pages/client/Services";
import ServiceTypes from "./pages/client/ServiceTypes";
import Workers from "./pages/client/Workers";
import WorkerProfile from "./pages/client/WorkerProfile";
import Book from "./pages/client/Book";
import Pin from "./pages/client/Pin";
import Tracking from "./pages/client/Tracking";
import Review from "./pages/client/Review";
import Bookings from "./pages/client/Bookings";
import ReviewsList from "./pages/client/ReviewsList";
import Profile from "./pages/client/Profile";
import WorkerDashboard from "./pages/worker/Dashboard";
import Jobs from "./pages/worker/Jobs";
import ActiveJob from "./pages/worker/ActiveJob";
import History from "./pages/worker/History";
import WorkerSelfProfile from "./pages/worker/Profile";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/otp" element={<Otp />} />
      <Route path="/login" element={<Login />} />

      <Route element={<RequireRole role="client" />}>
        <Route path="/client" element={<ClientLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<ClientDashboard />} />
          <Route path="services" element={<Services />} />
          <Route path="services/:category" element={<ServiceTypes />} />
          <Route path="workers" element={<Workers />} />
          <Route path="worker/:id" element={<WorkerProfile />} />
          <Route path="book/:id" element={<Book />} />
          <Route path="pin" element={<Pin />} />
          <Route path="tracking" element={<Tracking />} />
          <Route path="review" element={<Review />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="reviews" element={<ReviewsList />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireRole role="worker" />}>
        <Route path="/worker" element={<WorkerLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<WorkerDashboard />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="active-job" element={<ActiveJob />} />
          <Route path="history" element={<History />} />
          <Route path="profile" element={<WorkerSelfProfile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
