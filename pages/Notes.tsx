import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft,
  Plus,
  Trash2,
  StickyNote,
  Clock,
  Loader2,
  Edit3,
} from "lucide-react";

export default function Notes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const tripId = parseInt(id || "0");
  const utils = trpc.useUtils();

  const { data: notes, isLoading } = trpc.note.list.useQuery({ tripId });

  const [content, setContent] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editContent, setEditContent] = useState("");
  const [showForm, setShowForm] = useState(false);

  const createMutation = trpc.note.create.useMutation({
    onSuccess: () => {
      utils.note.list.invalidate();
      setContent("");
      setShowForm(false);
    },
  });
  const updateMutation = trpc.note.update.useMutation({
    onSuccess: () => {
      utils.note.list.invalidate();
      setEditingId(null);
      setEditContent("");
    },
  });
  const deleteMutation = trpc.note.delete.useMutation({
    onSuccess: () => utils.note.list.invalidate(),
  });

  const handleCreate = () => {
    if (!content.trim()) return;
    createMutation.mutate({ tripId, content: content.trim() });
  };

  const handleUpdate = (id: number) => {
    if (!editContent.trim()) return;
    updateMutation.mutate({ id, content: editContent.trim() });
  };

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
              <div className="w-10 h-10 rounded-full bg-[#fff066] flex items-center justify-center">
                <StickyNote className="w-5 h-5 text-black/60" />
              </div>
              <div>
                <h1 className="font-display text-2xl">Trip Notes</h1>
                <p className="text-xs text-black/40 font-body">
                  {notes?.length || 0} notes
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="btn-primary text-[10px] py-2 flex items-center gap-1"
            >
              <Plus className="w-3 h-3" />
              New Note
            </Button>
          </div>

          {/* Create Form */}
          {showForm && (
            <div className="bg-white rounded-xl p-5 border border-black/5 mb-6 animate-fade-in-up">
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note..."
                className="min-h-[100px] border-black/15 rounded-xl font-body text-sm resize-none mb-3"
                autoFocus
              />
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowForm(false)}
                  variant="outline"
                  className="rounded-full border-black/15 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending || !content.trim()}
                  className="btn-primary text-xs"
                >
                  {createMutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save Note"
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {notes && notes.length > 0 ? (
            <div className="space-y-3">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="bg-white rounded-xl p-5 border border-black/5 group"
                >
                  {editingId === note.id ? (
                    <div className="space-y-3">
                      <Textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="min-h-[80px] border-black/15 rounded-xl font-body text-sm resize-none"
                        autoFocus
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleUpdate(note.id)}
                          disabled={updateMutation.isPending}
                          className="btn-primary text-[10px] py-1.5"
                        >
                          Save
                        </Button>
                        <Button
                          onClick={() => setEditingId(null)}
                          variant="outline"
                          className="text-[10px] py-1.5 rounded-full border-black/15"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-sm font-body leading-relaxed whitespace-pre-wrap">
                        {note.content}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-[10px] text-black/30 font-body flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5" />
                          {note.createdAt
                            ? new Date(note.createdAt).toLocaleString()
                            : ""}
                        </span>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => {
                              setEditingId(note.id);
                              setEditContent(note.content);
                            }}
                            className="p-1.5 text-black/30 hover:text-black rounded-full hover:bg-[#f5f6f0] transition-all"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this note?")) {
                                deleteMutation.mutate({ id: note.id });
                              }
                            }}
                            className="p-1.5 text-black/30 hover:text-red-500 rounded-full hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-white rounded-xl border border-black/5">
              <StickyNote className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <h3 className="font-display text-lg mb-2">No notes yet</h3>
              <p className="text-sm text-black/40 font-body mb-4">
                Jot down reminders, ideas, or travel tips.
              </p>
              <Button
                onClick={() => setShowForm(true)}
                className="btn-primary flex items-center gap-2 mx-auto"
              >
                <Plus className="w-4 h-4" />
                Write First Note
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
