import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Loader2,
  Compass,
} from "lucide-react";

export default function CreateTrip() {
  const navigate = useNavigate();
  const utils = trpc.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalBudget, setTotalBudget] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const createMutation = trpc.trip.create.useMutation({
    onSuccess: (data) => {
      utils.trip.list.invalidate();
      const trip = Array.isArray(data) ? data[0] : data;
      if (trip) {
        navigate(`/trips/${trip.id}/builder`);
      }
    },
  });

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Trip name is required";
    if (startDate && endDate && new Date(startDate) > new Date(endDate)) {
      newErrors.dates = "End date must be after start date";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    createMutation.mutate({
      name,
      description: description || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      totalBudget: totalBudget ? parseFloat(totalBudget) : undefined,
    });
  };

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      <div className="container-main py-8 px-4 sm:px-6">
        {/* Header */}
        <button
          onClick={() => navigate("/trips")}
          className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors font-body mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to My Trips
        </button>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-black/5">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#e0dffb] flex items-center justify-center">
                <Compass className="w-6 h-6 text-[#6366f1]" />
              </div>
              <div>
                <h1 className="font-display text-2xl">Create New Trip</h1>
                <p className="text-sm text-black/40 font-body">
                  Start planning your next adventure
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-black/40 font-body">
                  Trip Name *
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Summer in Japan"
                    className="input-travel pl-6 rounded-none"
                    required
                  />
                </div>
                {errors.name && (
                  <p className="text-xs text-[#ff7a6e] font-body">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-xs text-black/40 font-body">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your trip..."
                  className="min-h-[100px] border-black/15 rounded-xl font-body text-sm resize-none focus:border-[#ff7a6e] focus:ring-[#ff7a6e]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-xs text-black/40 font-body">
                    Start Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <Input
                      id="startDate"
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="input-travel pl-6 rounded-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate" className="text-xs text-black/40 font-body">
                    End Date
                  </Label>
                  <div className="relative">
                    <Calendar className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                    <Input
                      id="endDate"
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="input-travel pl-6 rounded-none"
                    />
                  </div>
                </div>
              </div>
              {errors.dates && (
                <p className="text-xs text-[#ff7a6e] font-body">{errors.dates}</p>
              )}

              <div className="space-y-2">
                <Label htmlFor="budget" className="text-xs text-black/40 font-body">
                  Total Budget (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 text-black/20" />
                  <Input
                    id="budget"
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    placeholder="5000"
                    min={0}
                    className="input-travel pl-6 rounded-none"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  onClick={() => navigate("/trips")}
                  variant="outline"
                  className="flex-1 rounded-full border-black/15 hover:bg-[#f5f6f0] font-body text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Compass className="w-4 h-4" />
                      Create Trip
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
