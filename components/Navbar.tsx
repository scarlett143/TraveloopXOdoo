import { Link, useLocation, useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import {
  Compass,
  Home,
  Briefcase,
  Globe,
  Settings,
  LogOut,
  User,
  Shield,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/trips", label: "My Trips", icon: Briefcase },
    { path: "/explore", label: "Explore", icon: Globe },
  ];

  const isTransparent = location.pathname === "/";

  if (!isAuthenticated && location.pathname === "/login") return null;

  return (
    <nav
      className={`w-full h-14 sticky top-0 z-50 flex items-center justify-between px-4 sm:px-8 transition-all duration-300 ${
        isTransparent
          ? "bg-white/10 backdrop-blur-md border-b border-white/20 text-white"
          : "bg-white border-b border-black/10 text-black"
      }`}
    >
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <Compass
          className={`w-6 h-6 ${isTransparent ? "text-white" : "text-[#ff7a6e]"}`}
          strokeWidth={1.5}
        />
        <span className="font-display text-xl tracking-tight">Traveloop</span>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={`font-body text-sm relative transition-colors duration-300 pb-1 ${
              isActive(link.path)
                ? isTransparent
                  ? "text-white border-b border-white"
                  : "text-black border-b border-black"
                : isTransparent
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {user?.role === "admin" && (
          <Link
            to="/admin"
            className={`font-body text-sm relative transition-colors duration-300 pb-1 ${
              isActive("/admin")
                ? isTransparent
                  ? "text-white border-b border-white"
                  : "text-black border-b border-black"
                : isTransparent
                ? "text-white/80 hover:text-white"
                : "text-black/60 hover:text-black"
            }`}
          >
            <span className="flex items-center gap-1">
              <Shield className="w-3.5 h-3.5" />
              Admin
            </span>
          </Link>
        )}
      </div>

      {/* Desktop User */}
      <div className="hidden md:flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 text-sm font-body hover:opacity-70 transition-opacity"
            >
              <div className="w-7 h-7 rounded-full bg-[#e0dffb] flex items-center justify-center">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover"
                  />
                ) : (
                  <User className="w-3.5 h-3.5" />
                )}
              </div>
              <span className="max-w-[100px] truncate">
                {user?.name || "User"}
              </span>
            </button>
            <button
              onClick={logout}
              className={`text-sm font-body transition-colors ${
                isTransparent
                  ? "text-white/60 hover:text-white"
                  : "text-black/40 hover:text-black"
              }`}
            >
              <LogOut className="w-4 h-4" />
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className={`text-sm font-body ${
              isTransparent
                ? "text-white hover:text-white/80"
                : "text-black hover:text-black/60"
            }`}
          >
            Sign In
          </Link>
        )}
      </div>

      {/* Mobile menu button */}
      <button
        className="md:hidden"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Menu className="w-6 h-6" />
        )}
      </button>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div
          className={`absolute top-14 left-0 right-0 border-b p-4 flex flex-col gap-3 md:hidden ${
            isTransparent ? "bg-black/90 backdrop-blur-md" : "bg-white"
          }`}
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-body py-2 ${
                isTransparent ? "text-white" : "text-black"
              }`}
            >
              <link.icon className="w-4 h-4" />
              {link.label}
            </Link>
          ))}
          {user?.role === "admin" && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-2 text-sm font-body py-2 ${
                isTransparent ? "text-white" : "text-black"
              }`}
            >
              <Shield className="w-4 h-4" />
              Admin
            </Link>
          )}
          <Link
            to="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className={`flex items-center gap-2 text-sm font-body py-2 ${
              isTransparent ? "text-white" : "text-black"
            }`}
          >
            <Settings className="w-4 h-4" />
            Settings
          </Link>
          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}
              className={`flex items-center gap-2 text-sm font-body py-2 ${
                isTransparent ? "text-white" : "text-black"
              }`}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
