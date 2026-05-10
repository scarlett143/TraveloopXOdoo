import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  DollarSign,
  Plus,
  Loader2,
  Trash2,
  Eye,
  Edit3,
} from "lucide-react";
import { useState } from "react";

export default function MyTrips() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const utils = trpc.useUtils();
  const { data: trips, isLoading } = trpc.trip.list.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const deleteMutation = trpc.trip.delete.useMutation({
    onSuccess: () => utils.trip.list.invalidate(),
  });
  const [filter, setFilter] = useState<string>("all");

  if (!isAuthenticated) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-black/40 font-body mb-4">
            Please sign in to view your trips.
          </p>
          <Button onClick={() => navigate("/login")} className="btn-primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  const filteredTrips =
    filter === "all"
      ? trips
      : trips?.filter((t) => t.status === filter);

  const filters = [
    { key: "all", label: "All" },
    { key: "planning", label: "Planning" },
    { key: "upcoming", label: "Upcoming" },
    { key: "active", label: "Active" },
    { key: "completed", label: "Completed" },
  ];

  return (
    <div className="section-padding">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-3xl sm:text-4xl">My Trips</h1>
          <Button
            onClick={() => navigate("/trips/new")}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create New Trip
          </Button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-full text-xs font-body font-medium transition-all duration-300 ${
                filter === f.key
                  ? "bg-black text-white"
                  : "bg-white text-black/60 border border-black/15 hover:bg-[#f5f6f0]"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Trips Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
          </div>
        ) : filteredTrips && filteredTrips.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTrips.map((trip) => (
              <div
                key={trip.id}
                className="card-travel group relative"
              >
                <div className="w-full h-44 rounded-lg bg-gradient-to-br from-[#e0dffb] via-[#96cbb5] to-[#f5f6f0] mb-4 flex items-center justify-center overflow-hidden relative">
                  {trip.coverImage ? (
                    <img
                      src={trip.coverImage}
                      alt={trip.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <MapPin className="w-12 h-12 text-white/50" />
                  )}
                  <span
                    className={`absolute top-3 right-3 px-2 py-1 rounded-full text-[10px] font-medium uppercase tracking-wider ${
                      trip.status === "active"
                        ? "bg-[#96cbb5] text-black"
                        : trip.status === "completed"
                        ? "bg-[#fff066] text-black"
                        : trip.status === "upcoming"
                        ? "bg-[#e0dffb] text-black"
                        : "bg-white/80 text-black"
                    }`}
                  >
                    {trip.status}
                  </span>
                </div>

                <h3 className="font-display text-xl mb-2">{trip.name}</h3>
                <p className="text-sm text-black/40 font-body line-clamp-2 mb-4">
                  {trip.description || "No description yet."}
                </p>

                <div className="flex items-center gap-4 text-xs text-black/40 font-body mb-4">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {trip.startDate
                      ? new Date(trip.startDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })
                      : "No date"}
                  </span>
                  <span className="flex items-center gap-1">
                    <DollarSign className="w-3 h-3" />
                    {Number(trip.totalBudget).toLocaleString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => navigate(`/trips/${trip.id}/builder`)}
                    className="flex-1 btn-primary text-[10px] py-2 flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    Builder
                  </Button>
                  <Button
                    onClick={() => navigate(`/trips/${trip.id}/view`)}
                    variant="outline"
                    className="px-3 py-2 rounded-full border-black/15 hover:bg-[#f5f6f0]"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </Button>
                  <Button
                    onClick={() => {
                      if (confirm("Delete this trip?")) {
                        deleteMutation.mutate({ id: trip.id });
                      }
                    }}
                    variant="outline"
                    className="px-3 py-2 rounded-full border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl">
            <MapPin className="w-12 h-12 text-black/10 mx-auto mb-4" />
            <h3 className="font-display text-xl mb-2">No trips yet</h3>
            <p className="text-sm text-black/40 font-body mb-6">
              Start planning your first adventure!
            </p>
            <Button
              onClick={() => navigate("/trips/new")}
              className="btn-primary flex items-center gap-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              Create Trip
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
