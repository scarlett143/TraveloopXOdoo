import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Compass } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f6f0]">
      <div className="text-center">
        <Compass className="w-16 h-16 text-black/10 mx-auto mb-6" />
        <h1 className="font-display text-6xl mb-2">404</h1>
        <p className="text-lg text-black/40 font-body mb-8">
          This page doesn't exist or has moved.
        </p>
        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </Button>
          <Button
            onClick={() => navigate(-1)}
            variant="outline"
            className="rounded-full border-black/15 hover:bg-[#f5f6f0]"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
