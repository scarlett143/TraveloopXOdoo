import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Calendar,
  DollarSign,
  Clock,
  Camera,
  Utensils,
  Bus,
  Hotel,
  CircleDot,
  Compass,
  Copy,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useState } from "react";

const activityTypeIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="w-4 h-4" />,
  food: <Utensils className="w-4 h-4" />,
  transport: <Bus className="w-4 h-4" />,
  stay: <Hotel className="w-4 h-4" />,
  other: <CircleDot className="w-4 h-4" />,
};

const activityTypeColors: Record<string, string> = {
  sightseeing: "#e0dffb",
  food: "#fff066",
  transport: "#96cbb5",
  stay: "#ffb3c1",
  other: "#f5f6f0",
};

export default function PublicItinerary() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Try to get by slug first, then by id
  const { data: tripBySlug, isLoading: slugLoading } =
    trpc.trip.getBySlug.useQuery(
      { slug: slug || "" },
      { enabled: !!slug }
    );

  // Fallback: treat slug as trip id
  const tripId = parseInt(slug || "0");
  const { data: tripById, isLoading: idLoading } = trpc.trip.getById.useQuery(
    { id: tripId },
    { enabled: !tripBySlug && !!slug && !isNaN(tripId) }
  );

  const trip = tripBySlug || tripById;
  const isLoading = slugLoading && idLoading;

  const { data: stops } = trpc.stop.list.useQuery(
    { tripId: trip?.id || 0 },
    { enabled: !!trip }
  );
  const { data: activities } = trpc.activity.list.useQuery(
    { tripId: trip?.id || 0 },
    { enabled: !!trip }
  );
  const { data: budget } = trpc.budget.getSummary.useQuery(
    { tripId: trip?.id || 0 },
    { enabled: !!trip }
  );

  const copyMutation = trpc.trip.copy.useMutation({
    onSuccess: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6f0]">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f6f0]">
        <Compass className="w-16 h-16 text-black/10 mb-4" />
        <h1 className="font-display text-2xl mb-2">Trip Not Found</h1>
        <p className="text-sm text-black/40 font-body mb-6">
          This itinerary may not exist or is not public.
        </p>
        <Button onClick={() => navigate("/")} className="btn-primary">
          Go Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      {/* Header */}
      <div className="relative h-[300px] overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-body mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
          <h1 className="font-display text-4xl text-white mb-2">{trip.name}</h1>
          <p className="text-white/70 font-body text-sm max-w-lg">
            {trip.description || "A carefully curated travel itinerary."}
          </p>
          <div className="flex items-center gap-4 text-sm text-white/70 font-body mt-3">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {trip.startDate
                ? new Date(trip.startDate).toLocaleDateString()
                : "Dates TBD"}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {stops?.length || 0} stops
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {budget?.total?.toLocaleString() || 0} est.
            </span>
          </div>
        </div>
      </div>

      {/* Copy CTA */}
      <div className="bg-white border-b border-black/5 px-4 sm:px-8 py-4">
        <div className="container-main flex items-center justify-between">
          <p className="text-sm text-black/40 font-body">
            Like this itinerary? Make it your own.
          </p>
          <Button
            onClick={() => copyMutation.mutate({ id: trip.id })}
            disabled={copyMutation.isPending}
            className="btn-primary text-[10px] py-2 flex items-center gap-1"
          >
            {copied ? (
              "Copied to Your Trips!"
            ) : (
              <>
                <Copy className="w-3 h-3" />
                Copy Trip
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Itinerary */}
      <div className="container-main py-12 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          {stops && stops.length > 0 ? (
            stops.map((stop, idx) => {
              const stopActivities =
                activities?.filter((a) => a.stopId === stop.id) || [];
              return (
                <div key={stop.id} className="relative mb-10">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/10" />
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0 z-10">
                      {idx + 1}
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-5 border border-black/5">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-display text-xl">{stop.city}</h3>
                        {stop.country && (
                          <span className="pill-tag text-[10px]">
                            <MapPin className="w-2.5 h-2.5 text-[#ff7a6e]" />
                            {stop.country}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-black/40 font-body mb-4">
                        {stop.arrivalDate && stop.departureDate
                          ? `${new Date(stop.arrivalDate).toLocaleDateString()} - ${new Date(stop.departureDate).toLocaleDateString()}`
                          : ""}
                      </p>

                      {stopActivities.length > 0 && (
                        <div className="space-y-2">
                          {stopActivities.map((a) => (
                            <div
                              key={a.id}
                              className="flex items-center gap-3 py-2 px-3 rounded-lg bg-[#f5f6f0]"
                            >
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor:
                                    activityTypeColors[a.type || "other"],
                                }}
                              >
                                {activityTypeIcons[a.type || "other"]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium font-body truncate">
                                  {a.name}
                                </p>
                                {a.startTime && (
                                  <p className="text-[10px] text-black/40 font-body">
                                    <Clock className="w-2.5 h-2.5 inline mr-1" />
                                    {a.startTime} | Day {a.dayNumber}
                                  </p>
                                )}
                              </div>
                              <span className="text-sm text-[#96cbb5] font-body">
                                ${Number(a.cost).toLocaleString()}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-16">
              <MapPin className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <p className="text-black/40 font-body">No stops in this itinerary yet.</p>
            </div>
          )}

          {/* Cost Summary */}
          {budget && budget.total > 0 && (
            <div className="bg-white rounded-xl p-6 border border-black/5 mt-8">
              <h3 className="font-display text-lg mb-4">Estimated Cost</h3>
              <div className="space-y-2">
                {Object.entries(budget.byCategory).map(([cat, cost]) => (
                  <div key={cat} className="flex justify-between text-sm font-body">
                    <span className="text-black/60 capitalize">{cat}</span>
                    <span>${Number(cost).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3 mt-3 border-t-2 border-black flex justify-between">
                <span className="font-body font-medium">Total</span>
                <span className="font-display text-xl">
                  ${budget.total.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
