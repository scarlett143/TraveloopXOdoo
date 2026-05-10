import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Plus,
  MapPin,
  Clock,
  DollarSign,
  Trash2,
  Loader2,
  Backpack,
  StickyNote,
  PieChart,
  Eye,
  Hotel,
  Utensils,
  Camera,
  Bus,
  CircleDot,
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

export default function ItineraryBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = parseInt(id || "0");
  const utils = trpc.useUtils();

  const { data: trip, isLoading } = trpc.trip.getById.useQuery({ id: tripId });
  const { data: stops } = trpc.stop.list.useQuery({ tripId });
  const { data: activities } = trpc.activity.list.useQuery({ tripId });
  const { data: budget } = trpc.budget.getSummary.useQuery({ tripId });

  const stopMutation = trpc.stop.create.useMutation({
    onSuccess: () => {
      utils.stop.list.invalidate();
      setShowStopModal(false);
      setStopCity("");
      setStopCountry("");
      setStopArrival("");
      setStopDeparture("");
    },
  });
  const activityMutation = trpc.activity.create.useMutation({
    onSuccess: () => {
      utils.activity.list.invalidate();
      utils.budget.getSummary.invalidate();
      setShowActivityModal(false);
      resetActivityForm();
    },
  });
  const stopDeleteMutation = trpc.stop.delete.useMutation({
    onSuccess: () => {
      utils.stop.list.invalidate();
      utils.activity.list.invalidate();
    },
  });
  const activityDeleteMutation = trpc.activity.delete.useMutation({
    onSuccess: () => {
      utils.activity.list.invalidate();
      utils.budget.getSummary.invalidate();
    },
  });

  const [showStopModal, setShowStopModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [selectedStopId, setSelectedStopId] = useState<number>(0);

  // Stop form
  const [stopCity, setStopCity] = useState("");
  const [stopCountry, setStopCountry] = useState("");
  const [stopArrival, setStopArrival] = useState("");
  const [stopDeparture, setStopDeparture] = useState("");

  // Activity form
  const [actName, setActName] = useState("");
  const [actDescription, setActDescription] = useState("");
  const [actType, setActType] = useState("sightseeing");
  const [actCost, setActCost] = useState("");
  const [actStartTime, setActStartTime] = useState("");
  const [actEndTime, setActEndTime] = useState("");
  const [actDay, setActDay] = useState("1");

  const resetActivityForm = () => {
    setActName("");
    setActDescription("");
    setActType("sightseeing");
    setActCost("");
    setActStartTime("");
    setActEndTime("");
    setActDay("1");
  };

  const handleAddStop = (e: React.FormEvent) => {
    e.preventDefault();
    stopMutation.mutate({
      tripId,
      city: stopCity,
      country: stopCountry || undefined,
      arrivalDate: stopArrival || undefined,
      departureDate: stopDeparture || undefined,
      order: (stops?.length || 0),
    });
  };

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStopId) return;
    activityMutation.mutate({
      stopId: selectedStopId,
      tripId,
      name: actName,
      description: actDescription || undefined,
      type: actType as "sightseeing" | "food" | "transport" | "stay" | "other",
      cost: actCost ? parseFloat(actCost) : undefined,
      startTime: actStartTime || undefined,
      endTime: actEndTime || undefined,
      dayNumber: parseInt(actDay),
    });
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
        <div className="text-center">
          <p className="text-black/40 font-body mb-4">Trip not found.</p>
          <Button onClick={() => navigate("/trips")} className="btn-primary">
            Back to My Trips
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      {/* Header */}
      <div className="relative h-[250px] overflow-hidden">
        <img
          src={trip.coverImage || "https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&q=80"}
          alt={trip.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10 lg:px-16">
          <button
            onClick={() => navigate("/trips")}
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors font-body mb-4 w-fit"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <h1 className="font-display text-3xl sm:text-4xl text-white mb-2">
            {trip.name}
          </h1>
          <div className="flex items-center gap-4 text-sm text-white/70 font-body">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {stops?.length || 0} stops
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {activities?.length || 0} activities
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              {budget?.total?.toLocaleString() || 0} / {Number(trip.totalBudget).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white border-b border-black/5 px-4 sm:px-8 py-3 flex items-center gap-3 overflow-x-auto">
        <Button
          onClick={() => setShowStopModal(true)}
          className="btn-primary text-[10px] py-2 flex items-center gap-1 shrink-0"
        >
          <Plus className="w-3 h-3" />
          Add Stop
        </Button>
        <Button
          onClick={() => navigate(`/trips/${tripId}/budget`)}
          variant="outline"
          className="text-[10px] py-2 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1 shrink-0"
        >
          <PieChart className="w-3 h-3" />
          Budget
        </Button>
        <Button
          onClick={() => navigate(`/trips/${tripId}/packing`)}
          variant="outline"
          className="text-[10px] py-2 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1 shrink-0"
        >
          <Backpack className="w-3 h-3" />
          Packing
        </Button>
        <Button
          onClick={() => navigate(`/trips/${tripId}/notes`)}
          variant="outline"
          className="text-[10px] py-2 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1 shrink-0"
        >
          <StickyNote className="w-3 h-3" />
          Notes
        </Button>
        <Button
          onClick={() => navigate(`/trips/${tripId}/view`)}
          variant="outline"
          className="text-[10px] py-2 rounded-full border-black/15 hover:bg-[#f5f6f0] flex items-center gap-1 shrink-0"
        >
          <Eye className="w-3 h-3" />
          View
        </Button>
      </div>

      <div className="container-main py-8 px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timeline */}
          <div className="lg:col-span-2">
            {stops && stops.length > 0 ? (
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-black/10 hidden sm:block" />

                {stops.map((stop, stopIndex) => {
                  const stopActivities =
                    activities?.filter((a) => a.stopId === stop.id) || [];

                  return (
                    <div key={stop.id} className="relative mb-10">
                      {/* Stop marker */}
                      <div className="hidden sm:flex absolute left-0 w-10 h-10 bg-black rounded-full items-center justify-center text-white text-sm font-medium z-10">
                        {stopIndex + 1}
                      </div>

                      <div className="sm:ml-16">
                        {/* Stop header */}
                        <div className="bg-white rounded-xl p-5 border border-black/5 mb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="sm:hidden w-6 h-6 bg-black rounded-full flex items-center justify-center text-white text-xs font-medium">
                                  {stopIndex + 1}
                                </span>
                                <h3 className="font-display text-xl">
                                  {stop.city}
                                </h3>
                                {stop.country && (
                                  <span className="pill-tag text-[10px]">
                                    <MapPin className="w-2.5 h-2.5 text-[#ff7a6e]" />
                                    {stop.country}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-black/40 font-body">
                                {stop.arrivalDate && stop.departureDate
                                  ? `${new Date(stop.arrivalDate).toLocaleDateString()} - ${new Date(stop.departureDate).toLocaleDateString()}`
                                  : "Dates not set"}
                              </p>
                              {stop.notes && (
                                <p className="text-xs text-black/40 font-body mt-1 italic">
                                  {stop.notes}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => {
                                if (confirm("Delete this stop and all its activities?")) {
                                  stopDeleteMutation.mutate({ id: stop.id });
                                }
                              }}
                              className="text-black/20 hover:text-red-500 transition-colors p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Activities */}
                          {stopActivities.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {stopActivities.map((activity) => (
                                <div
                                  key={activity.id}
                                  className="flex items-center gap-3 py-2 px-3 rounded-lg border border-black/5 hover:border-black/10 transition-colors"
                                >
                                  <div
                                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                                    style={{
                                      backgroundColor:
                                        activityTypeColors[activity.type || "other"],
                                    }}
                                  >
                                    {activityTypeIcons[activity.type || "other"]}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium font-body truncate">
                                      {activity.name}
                                    </p>
                                    <div className="flex items-center gap-2 text-[10px] text-black/40 font-body">
                                      {activity.startTime && (
                                        <span className="flex items-center gap-0.5">
                                          <Clock className="w-2.5 h-2.5" />
                                          {activity.startTime}
                                        </span>
                                      )}
                                      <span>Day {activity.dayNumber}</span>
                                    </div>
                                  </div>
                                  <span className="text-sm text-[#96cbb5] font-body shrink-0">
                                    ${Number(activity.cost).toLocaleString()}
                                  </span>
                                  <button
                                    onClick={() =>
                                      activityDeleteMutation.mutate({ id: activity.id })
                                    }
                                    className="text-black/20 hover:text-red-500 transition-colors shrink-0"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add Activity button */}
                          <Button
                            onClick={() => {
                              setSelectedStopId(stop.id);
                              setShowActivityModal(true);
                            }}
                            variant="outline"
                            className="mt-3 text-[10px] py-1.5 px-3 rounded-full border-dashed border-black/20 hover:border-black/40 hover:bg-[#f5f6f0] flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            Add Activity
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-black/5">
                <MapPin className="w-12 h-12 text-black/10 mx-auto mb-4" />
                <h3 className="font-display text-xl mb-2">No stops yet</h3>
                <p className="text-sm text-black/40 font-body mb-6">
                  Add your first destination to start building your itinerary.
                </p>
                <Button
                  onClick={() => setShowStopModal(true)}
                  className="btn-primary flex items-center gap-2 mx-auto"
                >
                  <Plus className="w-4 h-4" />
                  Add First Stop
                </Button>
              </div>
            )}
          </div>

          {/* Cost Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 bg-white rounded-xl p-6 border border-black/5 shadow-sm">
              <h3 className="font-display text-lg mb-4">Cost Breakdown</h3>

              {budget && (
                <>
                  <div className="space-y-2 mb-4">
                    {Object.entries(budget.byCategory).map(([cat, cost]) => (
                      <div
                        key={cat}
                        className="flex justify-between items-center py-1.5 border-b border-black/5"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className="w-2.5 h-2.5 rounded-full"
                            style={{
                              backgroundColor: activityTypeColors[cat] || "#ccc",
                            }}
                          />
                          <span className="text-sm text-black/60 font-body capitalize">
                            {cat}
                          </span>
                        </div>
                        <span className="text-sm font-body">
                          ${Number(cost).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t-2 border-black">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium font-body">Total</span>
                      <span className="text-base font-display">
                        ${budget.total.toLocaleString()}
                      </span>
                    </div>
                    {Number(trip.totalBudget) > 0 && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs font-body text-black/40 mb-1">
                          <span>Budget Usage</span>
                          <span>
                            {Math.round(
                              (budget.total / Number(trip.totalBudget)) * 100
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-2 bg-[#f5f6f0] rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min(
                                (budget.total / Number(trip.totalBudget)) * 100,
                                100
                              )}%`,
                              backgroundColor:
                                budget.total > Number(trip.totalBudget)
                                  ? "#ff7a6e"
                                  : "#96cbb5",
                            }}
                          />
                        </div>
                        {budget.total > Number(trip.totalBudget) && (
                          <p className="text-xs text-[#ff7a6e] font-body mt-1">
                            Over budget by ${(budget.total - Number(trip.totalBudget)).toLocaleString()}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Quick nav */}
              <div className="mt-6 pt-4 border-t border-black/5 space-y-2">
                <button
                  onClick={() => navigate(`/trips/${tripId}/budget`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-black/60 hover:bg-[#f5f6f0] transition-colors text-left"
                >
                  <PieChart className="w-4 h-4" />
                  Full Budget Dashboard
                </button>
                <button
                  onClick={() => navigate(`/trips/${tripId}/packing`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-black/60 hover:bg-[#f5f6f0] transition-colors text-left"
                >
                  <Backpack className="w-4 h-4" />
                  Packing Checklist
                </button>
                <button
                  onClick={() => navigate(`/trips/${tripId}/notes`)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-body text-black/60 hover:bg-[#f5f6f0] transition-colors text-left"
                >
                  <StickyNote className="w-4 h-4" />
                  Trip Notes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Stop Modal */}
      {showStopModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#f5f6f0] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-auto animate-fade-in-up">
            <h2 className="font-display text-2xl mb-6">Add Stop</h2>
            <form onSubmit={handleAddStop} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-black/40 font-body">City *</Label>
                <Input
                  value={stopCity}
                  onChange={(e) => setStopCity(e.target.value)}
                  placeholder="e.g., Tokyo"
                  className="border-black/15 rounded-xl font-body"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-black/40 font-body">Country</Label>
                <Input
                  value={stopCountry}
                  onChange={(e) => setStopCountry(e.target.value)}
                  placeholder="e.g., Japan"
                  className="border-black/15 rounded-xl font-body"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">Arrival</Label>
                  <Input
                    type="date"
                    value={stopArrival}
                    onChange={(e) => setStopArrival(e.target.value)}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">Departure</Label>
                  <Input
                    type="date"
                    value={stopDeparture}
                    onChange={(e) => setStopDeparture(e.target.value)}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowStopModal(false)}
                  variant="outline"
                  className="flex-1 rounded-full border-black/15"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={stopMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {stopMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Stop"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Activity Modal */}
      {showActivityModal && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#f5f6f0] rounded-2xl w-full max-w-md p-6 max-h-[90vh] overflow-auto animate-fade-in-up">
            <h2 className="font-display text-2xl mb-6">Add Activity</h2>
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div className="space-y-1">
                <Label className="text-xs text-black/40 font-body">Name *</Label>
                <Input
                  value={actName}
                  onChange={(e) => setActName(e.target.value)}
                  placeholder="e.g., Visit Senso-ji Temple"
                  className="border-black/15 rounded-xl font-body"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-black/40 font-body">Description</Label>
                <Input
                  value={actDescription}
                  onChange={(e) => setActDescription(e.target.value)}
                  placeholder="Optional details..."
                  className="border-black/15 rounded-xl font-body"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-black/40 font-body">Type</Label>
                <div className="flex flex-wrap gap-2">
                  {["sightseeing", "food", "transport", "stay", "other"].map(
                    (type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setActType(type)}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-body capitalize transition-all ${
                          actType === type
                            ? "bg-black text-white"
                            : "bg-white text-black/60 border border-black/15 hover:bg-[#f5f6f0]"
                        }`}
                      >
                        {type}
                      </button>
                    )
                  )}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">Cost ($)</Label>
                  <Input
                    type="number"
                    value={actCost}
                    onChange={(e) => setActCost(e.target.value)}
                    placeholder="0"
                    min={0}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">Day</Label>
                  <Input
                    type="number"
                    value={actDay}
                    onChange={(e) => setActDay(e.target.value)}
                    min={1}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">Start Time</Label>
                  <Input
                    type="time"
                    value={actStartTime}
                    onChange={(e) => setActStartTime(e.target.value)}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-black/40 font-body">End Time</Label>
                  <Input
                    type="time"
                    value={actEndTime}
                    onChange={(e) => setActEndTime(e.target.value)}
                    className="border-black/15 rounded-xl font-body"
                  />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setShowActivityModal(false)}
                  variant="outline"
                  className="flex-1 rounded-full border-black/15"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={activityMutation.isPending}
                  className="flex-1 btn-primary"
                >
                  {activityMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Activity"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
