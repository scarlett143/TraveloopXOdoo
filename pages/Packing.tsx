import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Plus,
  Trash2,
  Check,
  Shirt,
  FileText,
  Laptop,
  Bath,
  CircleDot,
  Loader2,
  Backpack,
} from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
  clothing: <Shirt className="w-4 h-4" />,
  documents: <FileText className="w-4 h-4" />,
  electronics: <Laptop className="w-4 h-4" />,
  toiletries: <Bath className="w-4 h-4" />,
  misc: <CircleDot className="w-4 h-4" />,
};

const categoryLabels: Record<string, string> = {
  clothing: "Clothing",
  documents: "Documents",
  electronics: "Electronics",
  toiletries: "Toiletries",
  misc: "Miscellaneous",
};

const categories = ["clothing", "documents", "electronics", "toiletries", "misc"] as const;

export default function Packing() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = parseInt(id || "0");
  const utils = trpc.useUtils();

  const { data: items, isLoading } = trpc.packing.list.useQuery({ tripId });
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] =
    useState<typeof categories[number]>("misc");
  const [showAddForm, setShowAddForm] = useState(false);

  const createMutation = trpc.packing.create.useMutation({
    onSuccess: () => {
      utils.packing.list.invalidate();
      setNewItemName("");
      setShowAddForm(false);
    },
  });
  const toggleMutation = trpc.packing.toggle.useMutation({
    onSuccess: () => utils.packing.list.invalidate(),
  });
  const deleteMutation = trpc.packing.delete.useMutation({
    onSuccess: () => utils.packing.list.invalidate(),
  });

  const groupedItems = categories.map((cat) => ({
    category: cat,
    items: items?.filter((i) => i.category === cat) || [],
  }));

  const totalItems = items?.length || 0;
  const packedItems = items?.filter((i) => i.isPacked).length || 0;
  const progress = totalItems > 0 ? (packedItems / totalItems) * 100 : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black/40" />
      </div>
    );
  }

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

        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#e0dffb] flex items-center justify-center">
                <Backpack className="w-5 h-5 text-[#6366f1]" />
              </div>
              <div>
                <h1 className="font-display text-2xl">Packing Checklist</h1>
                <p className="text-xs text-black/40 font-body">
                  {packedItems} of {totalItems} items packed
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="btn-primary text-[10px] py-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              Add Item
            </Button>
          </div>

          {/* Progress */}
          {totalItems > 0 && (
            <div className="bg-white rounded-xl p-4 border border-black/5 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-black/40 font-body">Progress</span>
                <span className="text-xs font-body">{Math.round(progress)}%</span>
              </div>
              <div className="h-2.5 bg-[#f5f6f0] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${progress}%`,
                    backgroundColor: progress === 100 ? "#96cbb5" : "#ff7a6e",
                  }}
                />
              </div>
            </div>
          )}

          {/* Add Item Form */}
          {showAddForm && (
            <div className="bg-white rounded-xl p-5 border border-black/5 mb-6 animate-fade-in-up">
              <h3 className="font-display text-lg mb-4">Add Item</h3>
              <div className="space-y-3">
                <Input
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Item name..."
                  className="border-black/15 rounded-xl font-body"
                  autoFocus
                />
                <div className="flex gap-2 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setNewItemCategory(cat)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-body capitalize transition-all ${
                        newItemCategory === cat
                          ? "bg-black text-white"
                          : "bg-[#f5f6f0] text-black/60 hover:bg-[#e0dffb]"
                      }`}
                    >
                      {categoryLabels[cat]}
                    </button>
                  ))}
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={() => setShowAddForm(false)}
                    variant="outline"
                    className="flex-1 rounded-full border-black/15 text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      if (newItemName.trim()) {
                        createMutation.mutate({
                          tripId,
                          name: newItemName.trim(),
                          category: newItemCategory,
                        });
                      }
                    }}
                    disabled={createMutation.isPending || !newItemName.trim()}
                    className="flex-1 btn-primary text-xs"
                  >
                    {createMutation.isPending ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Add"
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Checklist */}
          <div className="space-y-4">
            {groupedItems.map(
              ({ category, items: catItems }) =>
                catItems.length > 0 && (
                  <div
                    key={category}
                    className="bg-white rounded-xl p-5 border border-black/5"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-[#e0dffb] flex items-center justify-center">
                        {categoryIcons[category]}
                      </div>
                      <h3 className="font-display text-sm capitalize">
                        {categoryLabels[category]}
                      </h3>
                      <span className="text-xs text-black/30 font-body ml-auto">
                        {catItems.filter((i) => i.isPacked).length}/{catItems.length}
                      </span>
                    </div>
                    <div className="space-y-1">
                      {catItems.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 py-2 group"
                        >
                          <button
                            onClick={() => toggleMutation.mutate({ id: item.id })}
                            className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-all ${
                              item.isPacked
                                ? "bg-[#ff7a6e] border-[#ff7a6e]"
                                : "border-black/30 hover:border-[#ff7a6e]"
                            }`}
                          >
                            {item.isPacked && <Check className="w-3 h-3 text-white" />}
                          </button>
                          <span
                            className={`text-sm font-body flex-1 transition-all ${
                              item.isPacked
                                ? "line-through text-black/30"
                                : "text-black"
                            }`}
                          >
                            {item.name}
                          </span>
                          <button
                            onClick={() => deleteMutation.mutate({ id: item.id })}
                            className="opacity-0 group-hover:opacity-100 text-black/20 hover:text-red-500 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>

          {totalItems === 0 && (
            <div className="text-center py-16 bg-white rounded-xl border border-black/5">
              <Backpack className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <h3 className="font-display text-lg mb-2">No items yet</h3>
              <p className="text-sm text-black/40 font-body mb-4">
                Start adding items to your packing list.
              </p>
              <Button
                onClick={() => setShowAddForm(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Add First Item
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
