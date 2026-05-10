import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  Compass,
  ArrowRight,
  MapPin,
  Calendar,
  DollarSign,
  TrendingUp,
  Loader2,
} from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { data: trips } = trpc.trip.list.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const { data: popularDestinations } =
    trpc.destination.getPopular.useQuery({ limit: 6 });

  const upcomingTrips = trips?.filter(
    (t) => t.status === "upcoming" || t.status === "planning"
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] min-h-[500px] overflow-hidden">
        {/* Video/Image background */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1600&q=80"
            alt="Santorini"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/50" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col justify-center h-full px-6 sm:px-10 lg:px-20 max-w-[1400px] mx-auto pt-10">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl text-white leading-tight mb-4">
            Plan your next journey.
          </h1>
          <p className="text-base sm:text-lg text-white/80 font-body mb-8 max-w-lg">
            Discover, build, and share your perfect itinerary with Traveloop.
          </p>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-white/95 backdrop-blur-xl rounded-full px-5 py-3 max-w-xl shadow-xl transition-transform duration-400 hover:scale-[1.01]">
            <Compass
              className="w-5 h-5 text-black shrink-0"
              strokeWidth={1.5}
            />
            <input
              type="text"
              placeholder="Where do you want to go?"
              className="flex-1 bg-transparent text-sm font-body outline-none text-black placeholder:text-black/40"
              onFocus={() => navigate("/explore")}
            />
            <button
              onClick={() => navigate("/explore")}
              className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white shrink-0 hover:bg-black/80 transition-colors"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Actions */}
          {isAuthenticated && (
            <div className="flex gap-4 mt-8">
              <Button
                onClick={() => navigate("/trips/new")}
                className="btn-primary flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Create New Trip
              </Button>
              <Button
                onClick={() => navigate("/trips")}
                variant="outline"
                className="bg-white/20 backdrop-blur-sm text-white border-white/30 hover:bg-white/30 rounded-full px-6 py-3 text-xs font-medium tracking-wider"
              >
                My Trips
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Trips Section */}
      {isAuthenticated && upcomingTrips && upcomingTrips.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-display text-3xl sm:text-4xl">
                Your Upcoming Trips
              </h2>
              <button
                onClick={() => navigate("/trips")}
                className="flex items-center gap-1 text-sm text-black/40 hover:text-[#ff7a6e] transition-colors font-body"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingTrips.slice(0, 3).map((trip) => (
                <div
                  key={trip.id}
                  className="card-travel cursor-pointer group"
                  onClick={() => navigate(`/trips/${trip.id}/builder`)}
                >
                  <div className="w-full h-40 rounded-lg bg-gradient-to-br from-[#e0dffb] to-[#96cbb5] mb-4 flex items-center justify-center overflow-hidden">
                    {trip.coverImage ? (
                      <img
                        src={trip.coverImage}
                        alt={trip.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <MapPin className="w-10 h-10 text-white/60" />
                    )}
                  </div>
                  <h3 className="font-display text-xl mb-1">{trip.name}</h3>
                  <div className="flex items-center gap-3 text-xs text-black/40 font-body">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {trip.startDate
                        ? new Date(trip.startDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "TBD"}
                    </span>
                    <span className="flex items-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      {trip.totalBudget}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Popular Destinations */}
      <section className="section-padding bg-[#f5f6f0]">
        <div className="container-main">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-display text-3xl sm:text-4xl">
              Destinations you might like
            </h2>
            <button
              onClick={() => navigate("/explore")}
              className="flex items-center gap-1 text-sm text-black/40 hover:text-[#ff7a6e] transition-colors font-body"
            >
              Explore all
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {popularDestinations ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularDestinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-xl overflow-hidden cursor-pointer group border border-black/5 hover:shadow-xl transition-all duration-300"
                  onClick={() => navigate("/explore")}
                >
                  <div className="w-full h-52 overflow-hidden">
                    <img
                      src={dest.imageUrl || ""}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl mb-1">{dest.city}</h3>
                    <span className="pill-tag mb-2">
                      <MapPin className="w-3 h-3 text-[#ff7a6e]" />
                      {dest.country}
                    </span>
                    <p className="text-sm text-black/40 font-body mt-2 line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative w-full h-[400px] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1600&q=80"
          alt="Travel"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="font-display text-3xl sm:text-4xl text-white mb-3">
            Start building your story
          </h2>
          <p className="text-white/80 font-body mb-6">
            Create a new trip in seconds
          </p>
          <Button
            onClick={() =>
              navigate(isAuthenticated ? "/trips/new" : "/login")
            }
            className="bg-white text-black rounded-full px-8 py-3 font-medium text-xs tracking-wider hover:bg-white/90 transition-all"
          >
            {isAuthenticated ? "Create New Trip" : "Get Started"}
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      {isAuthenticated && trips && (
        <section className="section-padding bg-white">
          <div className="container-main">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  label: "Total Trips",
                  value: trips.length,
                  icon: MapPin,
                  color: "#e0dffb",
                },
                {
                  label: "Upcoming",
                  value: upcomingTrips?.length || 0,
                  icon: Calendar,
                  color: "#96cbb5",
                },
                {
                  label: "Completed",
                  value: trips.filter((t) => t.status === "completed").length,
                  icon: TrendingUp,
                  color: "#fff066",
                },
                {
                  label: "Total Budget",
                  value: `$${trips.reduce((s, t) => s + Number(t.totalBudget), 0).toLocaleString()}`,
                  icon: DollarSign,
                  color: "#ffb3c1",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#f5f6f0] rounded-xl p-6 text-center"
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="w-5 h-5 text-black/60" />
                  </div>
                  <p className="font-display text-2xl mb-1">{stat.value}</p>
                  <p className="text-xs text-black/40 font-body">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
