import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Clock,
  DollarSign,
  Calendar,
  List,
  LayoutGrid,
  Hotel,
  Utensils,
  Camera,
  Bus,
  CircleDot,
  Share2,
  Copy,
  Loader2,
} from "lucide-react";

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

export default function ItineraryView() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = parseInt(id || "0");
  const [viewMode, setViewMode] = useState<"timeline" | "calendar">("timeline");
  const [copied, setCopied] = useState(false);

  const { data: trip, isLoading } = trpc.trip.getById.useQuery({ id: tripId });
  const { data: stops } = trpc.stop.list.useQuery({ tripId });
  const { data: activities } = trpc.activity.list.useQuery({ tripId });
  const { data: budget } = trpc.budget.getSummary.useQuery({ tripId });
  const copyMutation = trpc.trip.copy.useMutation({
    onSuccess: () => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    },
  });

  const handleShare = async () => {
    const url = `${window.location.origin}/trips/${tripId}/view`;
    if (navigator.share) {
      await navigator.share({ title: trip?.name || "Trip", url });
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/40 font-body">Trip not found.</p>
      </div>
    );
  }

  // Group activities by day
  const activitiesByDay: Record<number, typeof activities> = {};
  activities?.forEach((a) => {
    const day = a.dayNumber || 1;
    if (!activitiesByDay[day]) activitiesByDay[day] = [];
    activitiesByDay[day].push(a);
  });

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      {/* Header */}
      <div className="relative h-[200px] overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
          <button
            onClick={() => navigate("/trips")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-body mb-3 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-display text-3xl text-white mb-2">{trip.name}</h1>
          <div className="flex items-center gap-4 text-sm text-white/70 font-body">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {trip.startDate
                ? new Date(trip.startDate).toLocaleDateString()
                : "No date"}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {budget?.total?.toLocaleString() || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b border-black/5 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("timeline")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body transition-all ${
              viewMode === "timeline"
                ? "bg-black text-white"
                : "text-black/60 hover:bg-[#f5f6f0]"
            }`}
          >
            <List className="w-3.5 h-3.5" />
            List
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-body transition-all ${
              viewMode === "calendar"
                ? "bg-black text-white"
                : "text-black/60 hover:bg-[#f5f6f0]"
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            By Day
          </button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={handleShare}
            variant="outline"
            className="text-[10px] py-1.5 px-3 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1"
          >
            <Share2 className="w-3 h-3" />
            {copied ? "Copied!" : "Share"}
          </Button>
          <Button
            onClick={() => copyMutation.mutate({ id: tripId })}
            variant="outline"
            className="text-[10px] py-1.5 px-3 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1"
          >
            <Copy className="w-3 h-3" />
            Copy Trip
          </Button>
        </div>
      </div>

      <div className="container-main py-8 px-4 sm:px-6">
        {viewMode === "timeline" ? (
          /* Timeline View */
          <div className="max-w-3xl mx-auto">
            {stops && stops.length > 0 ? (
              stops.map((stop, idx) => {
                const stopActivities =
                  activities?.filter((a) => a.stopId === stop.id) || [];
                return (
                  <div key={stop.id} className="relative mb-8">
                    <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-black/10" />
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium shrink-0 z-10">
                        {idx + 1}
                      </div>
                      <div className="flex-1 bg-white rounded-xl p-5 border border-black/5">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-display text-lg">{stop.city}</h3>
                          {stop.country && (
                            <span className="pill-tag text-[10px]">
                              <MapPin className="w-2.5 h-2.5 text-[#ff7a6e]" />
                              {stop.country}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-black/40 font-body mb-3">
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
                                      {a.startTime}
                                      {a.endTime ? ` - ${a.endTime}` : ""} | Day{" "}
                                      {a.dayNumber}
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
                <p className="text-black/40 font-body">No stops added yet.</p>
              </div>
            )}
          </div>
        ) : (
          /* Calendar / Day View */
          <div className="max-w-4xl mx-auto">
            {Object.keys(activitiesByDay).length > 0 ? (
              Object.entries(activitiesByDay)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([day, dayActivities]) => {
                  const dayStop = stops?.find(
                    (s) =>
                      dayActivities?.some(
                        (a) => a.stopId === s.id
                      )
                  );
                  return (
                    <div key={day} className="mb-8">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center text-white text-sm font-display">
                          {day}
                        </div>
                        <div>
                          <h3 className="font-display text-lg">
                            Day {day}
                          </h3>
                          {dayStop && (
                            <p className="text-xs text-black/40 font-body">
                              {dayStop.city}, {dayStop.country}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="ml-5 space-y-2">
                        {dayActivities
                          ?.sort((a, b) =>
                            (a.startTime || "").localeCompare(b.startTime || "")
                          )
                          .map((a) => (
                            <div
                              key={a.id}
                              className="bg-white rounded-xl p-4 border border-black/5 flex items-center gap-3"
                            >
                              <div
                                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                                style={{
                                  backgroundColor:
                                    activityTypeColors[a.type || "other"],
                                }}
                              >
                                {activityTypeIcons[a.type || "other"]}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium font-body">
                                  {a.name}
                                </p>
                                {a.description && (
                                  <p className="text-xs text-black/40 font-body">
                                    {a.description}
                                  </p>
                                )}
                              </div>
                              <div className="text-right shrink-0">
                                {a.startTime && (
                                  <p className="text-xs text-black/40 font-body">
                                    {a.startTime}
                                  </p>
                                )}
                                <p className="text-sm text-[#96cbb5] font-body">
                                  ${Number(a.cost).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  );
                })
            ) : (
              <div className="text-center py-16">
                <Calendar className="w-12 h-12 text-black/10 mx-auto mb-4" />
                <p className="text-black/40 font-body">No activities scheduled yet.</p>
              </div>
            )}
          </div>
        )}

        {/* Cost Summary Footer */}
        {budget && (
          <div className="max-w-3xl mx-auto mt-10 pt-6 border-t-2 border-black">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <p className="text-xs text-black/40 font-body">Total Estimated Cost</p>
                <p className="font-display text-3xl">
                  ${budget.total.toLocaleString()}
                </p>
              </div>
              {Number(trip.totalBudget) > 0 && (
                <div className="text-right">
                  <p className="text-xs text-black/40 font-body">
                    Budget: ${Number(trip.totalBudget).toLocaleString()}
                  </p>
                  <p
                    className={`text-sm font-body ${
                      budget.total > Number(trip.totalBudget)
                        ? "text-[#ff7a6e]"
                        : "text-[#96cbb5]"
                    }`}
                  >
                    {budget.total > Number(trip.totalBudget)
                      ? `Over by $${(budget.total - Number(trip.totalBudget)).toLocaleString()}`
                      : `Under by $${(Number(trip.totalBudget) - budget.total).toLocaleString()}`}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
