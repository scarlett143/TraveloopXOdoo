import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  User,
  LogOut,
  Shield,
  MapPin,
  Calendar,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { trpc } from "@/providers/trpc";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const { data: trips } = trpc.trip.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black/40 font-body mb-4">
            Please sign in to view your profile.
          </p>
          <Button onClick={() => navigate("/login")} className="btn-primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const totalTrips = trips?.length || 0;
  const upcomingTrips =
    trips?.filter((t) => t.status === "upcoming" || t.status === "planning")
      .length || 0;
  const totalBudget =
    trips?.reduce((s, t) => s + Number(t.totalBudget), 0) || 0;

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      <div className="container-main py-12 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 border border-black/5 mb-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-[#e0dffb] flex items-center justify-center">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name || ""}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-7 h-7 text-[#6366f1]" />
                )}
              </div>
              <div>
                <h1 className="font-display text-2xl">
                  {user.name || "Traveler"}
                </h1>
                <p className="text-sm text-black/40 font-body">{user.email}</p>
                <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full text-[10px] font-body capitalize bg-[#f5f6f0]">
                  <Shield className="w-2.5 h-2.5" />
                  {user.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-3 bg-[#f5f6f0] rounded-xl">
                <p className="font-display text-xl">{totalTrips}</p>
                <p className="text-[10px] text-black/40 font-body">Trips</p>
              </div>
              <div className="text-center p-3 bg-[#f5f6f0] rounded-xl">
                <p className="font-display text-xl">{upcomingTrips}</p>
                <p className="text-[10px] text-black/40 font-body">Upcoming</p>
              </div>
              <div className="text-center p-3 bg-[#f5f6f0] rounded-xl">
                <p className="font-display text-xl">
                  ${totalBudget.toLocaleString()}
                </p>
                <p className="text-[10px] text-black/40 font-body">Budget</p>
              </div>
            </div>

            {user.role === "admin" && (
              <Button
                onClick={() => navigate("/admin")}
                variant="outline"
                className="w-full rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center justify-center gap-2 mb-3 text-xs"
              >
                <Shield className="w-3.5 h-3.5" />
                Admin Dashboard
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Button>
            )}

            <Button
              onClick={logout}
              variant="outline"
              className="w-full rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600 flex items-center justify-center gap-2 text-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </Button>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-2xl p-6 border border-black/5">
            <h2 className="font-display text-lg mb-4">Quick Links</h2>
            <div className="space-y-2">
              <button
                onClick={() => navigate("/trips")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-black/60 hover:bg-[#f5f6f0] transition-colors text-left"
              >
                <MapPin className="w-4 h-4" />
                My Trips
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
              <button
                onClick={() => navigate("/explore")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-body text-black/60 hover:bg-[#f5f6f0] transition-colors text-left"
              >
                <Calendar className="w-4 h-4" />
                Explore Destinations
                <ArrowRight className="w-3 h-3 ml-auto" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
