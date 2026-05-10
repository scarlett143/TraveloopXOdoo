import { Routes, Route } from "react-router";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import MyTrips from "./pages/MyTrips";
import CreateTrip from "./pages/CreateTrip";
import ItineraryBuilder from "./pages/ItineraryBuilder";
import ItineraryView from "./pages/ItineraryView";
import Explore from "./pages/Explore";
import Budget from "./pages/Budget";
import Packing from "./pages/Packing";
import Notes from "./pages/Notes";
import PublicItinerary from "./pages/PublicItinerary";
import Profile from "./pages/Profile";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/trip/:slug" element={<PublicItinerary />} />
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/trips" element={<MyTrips />} />
        <Route path="/trips/new" element={<CreateTrip />} />
        <Route path="/trips/:id/builder" element={<ItineraryBuilder />} />
        <Route path="/trips/:id/view" element={<ItineraryView />} />
        <Route path="/trips/:id/budget" element={<Budget />} />
        <Route path="/trips/:id/packing" element={<Packing />} />
        <Route path="/trips/:id/notes" element={<Notes />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
