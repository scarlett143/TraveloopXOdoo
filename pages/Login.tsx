import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, UserPlus, Compass } from "lucide-react";

function getOAuthUrl() {
  const kimiAuthUrl = import.meta.env.VITE_KIMI_AUTH_URL;
  const appID = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${kimiAuthUrl}/api/oauth/authorize`);
  url.searchParams.set("client_id", appID);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "profile");
  url.searchParams.set("state", state);

  return url.toString();
}

export default function Login() {
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    window.location.href = getOAuthUrl();
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError("");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#f5f6f0] relative overflow-hidden">
      {/* Morphing SVG Background */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <path
            d={
              isSignup
                ? "M 100 0 C 95.45 0 90.9 0 86.35 0 C 79.63 5.73 77.83 16.73 72.7 22.75 C 67.57 28.77 54.5 25.67 54.5 34.5 C 54.5 43.33 69.32 38.67 72.7 47.5 C 76.08 56.33 65.42 60.17 72.7 68.25 C 79.98 76.33 95.45 74.67 100 81.5 L 100 0 Z"
                : "M 0 0 C 4.55 0 9.1 0 13.65 0 C 20.37 5.73 22.17 16.73 27.3 22.75 C 32.43 28.77 45.5 25.67 45.5 34.5 C 45.5 43.33 30.68 38.67 27.3 47.5 C 23.92 56.33 34.58 60.17 27.3 68.25 C 20.02 76.33 4.55 74.67 0 81.5 L 0 0 Z"
            }
            fill="#e0dffb"
            stroke="#00c9d3"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            opacity="0.9"
            className="transition-all duration-1000 ease-in-out"
          />
          <path
            d={
              isSignup
                ? "M 100 0 C 95.45 0 90.9 0 86.35 0 C 83.62 4.67 81.8 10.67 77.25 13.65 C 72.7 16.63 61.43 12.23 61.43 18.2 C 61.43 24.17 76.08 20.97 77.25 27.3 C 78.42 33.63 64.17 36.77 72.7 43.6 C 81.23 50.43 95.45 46.73 100 53.65 L 100 0 Z"
                : "M 0 0 C 4.55 0 9.1 0 13.65 0 C 16.38 4.67 18.2 10.67 22.75 13.65 C 27.3 16.63 38.57 12.23 38.57 18.2 C 38.57 24.17 23.92 20.97 22.75 27.3 C 21.58 33.63 35.83 36.77 27.3 43.6 C 18.77 50.43 4.55 46.73 0 53.65 L 0 0 Z"
            }
            fill="#96cbb5"
            stroke="#e0dffb"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            opacity="0.9"
            className="transition-all duration-1000 ease-in-out delay-75"
          />
          <path
            d={
              isSignup
                ? "M 100 0 C 95.45 0 90.9 0 86.35 0 C 82.43 7.17 83.83 18.57 77.25 22.75 C 70.67 26.93 56.7 19.87 56.7 27.3 C 56.7 34.73 69.32 28.77 77.25 36.5 C 85.18 44.23 65.42 50.43 77.25 56.93 C 89.08 63.43 95.45 58.9 100 64.17 L 100 0 Z"
                : "M 0 0 C 4.55 0 9.1 0 13.65 0 C 17.57 7.17 16.17 18.57 22.75 22.75 C 29.33 26.93 43.3 19.87 43.3 27.3 C 43.3 34.73 30.68 28.77 22.75 36.5 C 14.82 44.23 34.58 50.43 22.75 56.93 C 10.92 63.43 4.55 58.9 0 64.17 L 0 0 Z"
            }
            fill="#ffb3c1"
            stroke="#ff7a6e"
            strokeWidth="0.75"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            opacity="0.9"
            className="transition-all duration-1000 ease-in-out delay-150"
          />
          <path
            d={
              isSignup
                ? "M 100 0 C 95.45 0 90.9 0 86.35 0 C 80.52 7.67 87.27 21.27 77.25 27.3 C 67.23 33.33 55.43 24.57 55.43 34.5 C 55.43 44.43 71.53 38.67 77.25 47.5 C 82.97 56.33 65.42 63.97 77.25 70.67 C 89.08 77.37 95.45 72.73 100 79.03 L 100 0 Z"
                : "M 0 0 C 4.55 0 9.1 0 13.65 0 C 19.48 7.67 12.73 21.27 22.75 27.3 C 32.77 33.33 44.57 24.57 44.57 34.5 C 44.57 44.43 28.47 38.67 22.75 47.5 C 17.03 56.33 34.58 63.97 22.75 70.67 C 10.92 77.37 4.55 72.73 0 79.03 L 0 0 Z"
            }
            fill="#f5f6f0"
            stroke="#fff066"
            strokeWidth="1.25"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
            opacity="0.9"
            className="transition-all duration-1000 ease-in-out delay-200"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-black/5">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-8">
            <Compass className="w-8 h-8 text-[#ff7a6e]" strokeWidth={1.5} />
            <span className="font-display text-2xl tracking-tight">Traveloop</span>
          </div>

          {/* Title */}
          <h1 className="font-display text-3xl text-center mb-2">
            {isSignup ? "Welcome!" : "Welcome Back!"}
          </h1>
          <p className="text-sm text-black/40 text-center mb-8 font-body">
            {isSignup
              ? "Create an account to start planning your journeys."
              : "Sign in to continue your travel planning."}
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs text-black/40 font-body">
                  Full Name
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="input-travel rounded-none px-0"
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-xs text-black/40 font-body">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="input-travel rounded-none px-0"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-xs text-black/40 font-body">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-travel rounded-none px-0"
                required
              />
            </div>

            {error && (
              <p className="text-sm text-[#ff7a6e] text-center">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full btn-primary flex items-center justify-center gap-2 mt-6"
            >
              {isSignup ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  Sign Up
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          {/* OAuth */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-black/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white/80 px-3 text-black/40 font-body">
                  or continue with
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full mt-4 rounded-full border-black/15 font-body text-sm hover:bg-black hover:text-white transition-all"
              onClick={() => {
                window.location.href = getOAuthUrl();
              }}
            >
              Sign in with Kimi
            </Button>
          </div>

          {/* Toggle */}
          <p className="text-sm text-center text-black/40 mt-6 font-body">
            {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={toggleMode}
              className="text-black font-medium hover:text-[#ff7a6e] transition-colors"
            >
              {isSignup ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
