import { useNavigate } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Users,
  Briefcase,
  Activity,
  TrendingUp,
  Loader2,
  ArrowLeft,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

export default function Admin() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [userPage, setUserPage] = useState(1);
  const [tripPage, setTripPage] = useState(1);
  const [userSearch, setUserSearch] = useState("");
  const [tripSearch, setTripSearch] = useState("");

  const isAdmin = user?.role === "admin";

  const { data: stats, isLoading: statsLoading } = trpc.admin.stats.useQuery(
    undefined,
    { enabled: isAdmin }
  );
  const { data: usersData, isLoading: usersLoading } = trpc.admin.users.useQuery(
    { search: userSearch || undefined, page: userPage, limit: 10 },
    { enabled: isAdmin }
  );
  const { data: tripsData, isLoading: tripsLoading } = trpc.admin.trips.useQuery(
    { search: tripSearch || undefined, page: tripPage, limit: 10 },
    { enabled: isAdmin }
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-black/40 font-body mb-4">Please sign in.</p>
          <Button onClick={() => navigate("/login")} className="btn-primary">
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-12 h-12 text-black/10 mx-auto mb-4" />
          <h1 className="font-display text-2xl mb-2">Access Denied</h1>
          <p className="text-sm text-black/40 font-body mb-6">
            You need admin privileges to access this page.
          </p>
          <Button onClick={() => navigate("/")} className="btn-primary">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      <div className="container-main py-8 px-4 sm:px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-sm text-black/40 hover:text-black transition-colors font-body mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <h1 className="font-display text-3xl">Admin Dashboard</h1>
        </div>

        {/* Stats Cards */}
        {statsLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-black/40" />
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[
              {
                label: "Total Users",
                value: stats?.totalUsers || 0,
                icon: Users,
                color: "#e0dffb",
              },
              {
                label: "Total Trips",
                value: stats?.totalTrips || 0,
                icon: Briefcase,
                color: "#96cbb5",
              },
              {
                label: "Activities",
                value: stats?.totalActivities || 0,
                icon: Activity,
                color: "#fff066",
              },
              {
                label: "Active Trips",
                value: stats?.activeTrips || 0,
                icon: TrendingUp,
                color: "#ffb3c1",
              },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-white rounded-xl p-5 border border-black/5"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: stat.color }}
                  >
                    <stat.icon className="w-4 h-4 text-black/60" />
                  </div>
                  <span className="text-xs text-black/40 font-body">
                    {stat.label}
                  </span>
                </div>
                <p className="font-display text-2xl">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-xl border border-black/5 overflow-hidden mb-8">
          <div className="p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-display text-lg">Users</h2>
            <div className="flex items-center gap-2 bg-[#f5f6f0] rounded-full px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-black/30" />
              <input
                type="text"
                value={userSearch}
                onChange={(e) => { setUserSearch(e.target.value); setUserPage(1); }}
                placeholder="Search..."
                className="bg-transparent text-xs font-body outline-none w-32"
              />
            </div>
          </div>

          {usersLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-black/40" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5f6f0]">
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        ID
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Name
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Email
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Role
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersData?.users.map((u) => (
                      <tr
                        key={u.id}
                        className="border-b border-black/5 hover:bg-[#f5f6f0]/50 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm font-body">{u.id}</td>
                        <td className="px-5 py-3 text-sm font-body">
                          {u.name || "-"}
                        </td>
                        <td className="px-5 py-3 text-sm font-body text-black/60">
                          {u.email || "-"}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-body capitalize ${
                              u.role === "admin"
                                ? "bg-[#ff7a6e]/10 text-[#ff7a6e]"
                                : "bg-[#96cbb5]/20 text-black/60"
                            }`}
                          >
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs font-body text-black/40">
                          {u.createdAt
                            ? new Date(u.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {usersData && usersData.total > 10 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-black/5">
                  <p className="text-xs text-black/40 font-body">
                    {usersData.total} total
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setUserPage(Math.max(1, userPage - 1))}
                      disabled={userPage === 1}
                      className="p-1 rounded hover:bg-[#f5f6f0] disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-body px-2 py-1">{userPage}</span>
                    <button
                      onClick={() => setUserPage(userPage + 1)}
                      disabled={userPage * 10 >= usersData.total}
                      className="p-1 rounded hover:bg-[#f5f6f0] disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Trips Table */}
        <div className="bg-white rounded-xl border border-black/5 overflow-hidden">
          <div className="p-5 border-b border-black/5 flex items-center justify-between">
            <h2 className="font-display text-lg">Trips</h2>
            <div className="flex items-center gap-2 bg-[#f5f6f0] rounded-full px-3 py-1.5">
              <Search className="w-3.5 h-3.5 text-black/30" />
              <input
                type="text"
                value={tripSearch}
                onChange={(e) => { setTripSearch(e.target.value); setTripPage(1); }}
                placeholder="Search..."
                className="bg-transparent text-xs font-body outline-none w-32"
              />
            </div>
          </div>

          {tripsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-5 h-5 animate-spin text-black/40" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#f5f6f0]">
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        ID
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Name
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        User ID
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Status
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Budget
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] font-medium text-black/40 font-body">
                        Created
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tripsData?.trips.map((t) => (
                      <tr
                        key={t.id}
                        className="border-b border-black/5 hover:bg-[#f5f6f0]/50 transition-colors"
                      >
                        <td className="px-5 py-3 text-sm font-body">{t.id}</td>
                        <td className="px-5 py-3 text-sm font-body">{t.name}</td>
                        <td className="px-5 py-3 text-sm font-body text-black/60">
                          {t.userId}
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-body capitalize ${
                              t.status === "active"
                                ? "bg-[#96cbb5]/20 text-black/60"
                                : t.status === "completed"
                                ? "bg-[#fff066]/30 text-black/60"
                                : "bg-[#e0dffb]/50 text-black/60"
                            }`}
                          >
                            {t.status}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-sm font-body">
                          ${Number(t.totalBudget).toLocaleString()}
                        </td>
                        <td className="px-5 py-3 text-xs font-body text-black/40">
                          {t.createdAt
                            ? new Date(t.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {tripsData && tripsData.total > 10 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-black/5">
                  <p className="text-xs text-black/40 font-body">
                    {tripsData.total} total
                  </p>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setTripPage(Math.max(1, tripPage - 1))}
                      disabled={tripPage === 1}
                      className="p-1 rounded hover:bg-[#f5f6f0] disabled:opacity-30"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-body px-2 py-1">{tripPage}</span>
                    <button
                      onClick={() => setTripPage(tripPage + 1)}
                      disabled={tripPage * 10 >= tripsData.total}
                      className="p-1 rounded hover:bg-[#f5f6f0] disabled:opacity-30"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
