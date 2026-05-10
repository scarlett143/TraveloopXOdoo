import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Hotel,
  Utensils,
  Camera,
  Bus,
  CircleDot,
  Loader2,
  PieChart,
} from "lucide-react";
import { useState } from "react";

const categoryIcons: Record<string, React.ReactNode> = {
  sightseeing: <Camera className="w-5 h-5" />,
  food: <Utensils className="w-5 h-5" />,
  transport: <Bus className="w-5 h-5" />,
  stay: <Hotel className="w-5 h-5" />,
  other: <CircleDot className="w-5 h-5" />,
};

const categoryColors: Record<string, string> = {
  sightseeing: "#e0dffb",
  food: "#fff066",
  transport: "#96cbb5",
  stay: "#ffb3c1",
  other: "#f5f6f0",
};

const categoryLabels: Record<string, string> = {
  sightseeing: "Sightseeing",
  food: "Food & Drink",
  transport: "Transport",
  stay: "Accommodation",
  other: "Other",
};

export default function Budget() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = parseInt(id || "0");
  const utils = trpc.useUtils();

  const { data: trip, isLoading: tripLoading } = trpc.trip.getById.useQuery({ id: tripId });
  const { data: budget, isLoading: budgetLoading } = trpc.budget.getSummary.useQuery({ tripId });

  const [newBudget, setNewBudget] = useState("");
  const [showBudgetEdit, setShowBudgetEdit] = useState(false);

  const updateBudgetMutation = trpc.budget.updateTotal.useMutation({
    onSuccess: () => {
      utils.trip.getById.invalidate();
      utils.budget.getSummary.invalidate();
      setShowBudgetEdit(false);
      setNewBudget("");
    },
  });

  if (tripLoading || budgetLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

  if (!trip || !budget) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-black/40 font-body">Trip not found.</p>
      </div>
    );
  }

  const totalBudget = Number(trip.totalBudget);
  const totalSpent = budget.total;
  const remaining = totalBudget - totalSpent;
  const percentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
  const isOverBudget = totalSpent > totalBudget && totalBudget > 0;

  // Prepare chart data
  const categories = Object.entries(budget.byCategory).sort((a, b) => b[1] - a[1]);
  const maxDaily = Math.max(...budget.daily.map((d) => d.cost), 1);

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      <div className="container-main py-8 px-4 sm:px-6">
        <button
          onClick={() => navigate(`/trips/${tripId}/builder`)}
          className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors font-body mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Itinerary
        </button>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <h1 className="font-display text-3xl">Budget Dashboard</h1>
          <Button
            onClick={() => setShowBudgetEdit(true)}
            variant="outline"
            className="rounded-full border-black/15 hover:bg-[#f5f6f0] text-xs"
          >
            <DollarSign className="w-3.5 h-3.5 mr-1" />
            Edit Budget
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-black/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#e0dffb] flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
              <span className="text-xs text-black/40 font-body">Total Budget</span>
            </div>
            <p className="font-display text-2xl">${totalBudget.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-black/5">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-[#fff066] flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
              <span className="text-xs text-black/40 font-body">Total Spent</span>
            </div>
            <p className="font-display text-2xl">${totalSpent.toLocaleString()}</p>
          </div>
          <div className={`rounded-xl p-6 border ${isOverBudget ? "bg-[#ff7a6e]/10 border-[#ff7a6e]/20" : "bg-white border-black/5"}`}>
            <div className="flex items-center gap-2 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isOverBudget ? "bg-[#ff7a6e]" : "bg-[#96cbb5]"}`}>
                {isOverBudget ? (
                  <AlertTriangle className="w-4 h-4 text-white" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
              </div>
              <span className="text-xs text-black/40 font-body">Remaining</span>
            </div>
            <p className={`font-display text-2xl ${isOverBudget ? "text-[#ff7a6e]" : ""}`}>
              ${isOverBudget ? `-${Math.abs(remaining).toLocaleString()}` : remaining.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {totalBudget > 0 && (
          <div className="bg-white rounded-xl p-6 border border-black/5 mb-8">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-body text-black/60">Budget Usage</span>
              <span className={`text-sm font-body ${isOverBudget ? "text-[#ff7a6e]" : ""}`}>
                {Math.round(percentage)}%
              </span>
            </div>
            <div className="h-3 bg-[#f5f6f0] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${Math.min(percentage, 100)}%`,
                  backgroundColor: isOverBudget ? "#ff7a6e" : "#96cbb5",
                }}
              />
            </div>
            {isOverBudget && (
              <p className="text-xs text-[#ff7a6e] font-body mt-2">
                You are over budget by ${(totalSpent - totalBudget).toLocaleString()}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-black/5">
            <h2 className="font-display text-xl mb-6 flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              By Category
            </h2>
            {categories.length > 0 ? (
              <div className="space-y-4">
                {categories.map(([cat, cost]) => {
                  const catPercent = totalSpent > 0 ? (cost / totalSpent) * 100 : 0;
                  return (
                    <div key={cat}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center"
                            style={{ backgroundColor: categoryColors[cat] }}
                          >
                            {categoryIcons[cat]}
                          </div>
                          <span className="text-sm font-body">
                            {categoryLabels[cat] || cat}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-body">${Number(cost).toLocaleString()}</span>
                          <span className="text-xs text-black/40 font-body ml-2">
                            {Math.round(catPercent)}%
                          </span>
                        </div>
                      </div>
                      <div className="h-2 bg-[#f5f6f0] rounded-full overflow-hidden ml-10">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${catPercent}%`,
                            backgroundColor: categoryColors[cat],
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-black/40 font-body text-center py-8">
                No expenses yet. Add activities to see the breakdown.
              </p>
            )}
          </div>

          {/* Daily Breakdown */}
          <div className="bg-white rounded-xl p-6 border border-black/5">
            <h2 className="font-display text-xl mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Daily Costs
            </h2>
            {budget.daily.length > 0 ? (
              <div className="space-y-3">
                {budget.daily.map((d) => {
                  const barWidth = (d.cost / maxDaily) * 100;
                  const dayBudget = totalBudget > 0 ? totalBudget / budget.daily.length : 0;
                  const isOverDay = dayBudget > 0 && d.cost > dayBudget * 1.2;
                  return (
                    <div key={d.day} className="flex items-center gap-3">
                      <span className="text-xs font-body text-black/40 w-12 shrink-0">
                        Day {d.day}
                      </span>
                      <div className="flex-1 h-6 bg-[#f5f6f0] rounded-full overflow-hidden relative">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${isOverDay ? "bg-[#ff7a6e]" : "bg-[#96cbb5]"}`}
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                      <span className={`text-xs font-body w-16 text-right shrink-0 ${isOverDay ? "text-[#ff7a6e]" : ""}`}>
                        ${d.cost.toLocaleString()}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-black/40 font-body text-center py-8">
                No daily data yet. Add activities with day numbers.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Budget Modal */}
      {showBudgetEdit && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-[#f5f6f0] rounded-2xl w-full max-w-sm p-6 animate-fade-in-up">
            <h2 className="font-display text-xl mb-4">Set Total Budget</h2>
            <Input
              type="number"
              value={newBudget}
              onChange={(e) => setNewBudget(e.target.value)}
              placeholder={`Current: $${totalBudget.toLocaleString()}`}
              min={0}
              className="border-black/15 rounded-xl font-body mb-4"
            />
            <div className="flex gap-3">
              <Button
                onClick={() => setShowBudgetEdit(false)}
                variant="outline"
                className="flex-1 rounded-full border-black/15"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (newBudget) {
                    updateBudgetMutation.mutate({
                      tripId,
                      totalBudget: parseFloat(newBudget),
                    });
                  }
                }}
                disabled={updateBudgetMutation.isPending}
                className="flex-1 btn-primary"
              >
                {updateBudgetMutation.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Update"
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
