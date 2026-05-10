import { useState } from "react";
import { trpc } from "@/providers/trpc";
import {
  Search,
  MapPin,
  DollarSign,
  Loader2,
  Globe,
} from "lucide-react";

const regions = ["all", "asia", "europe", "americas", "africa", "oceania"];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("all");

  const { data: destinations, isLoading } = trpc.destination.list.useQuery({
    region: region === "all" ? undefined : region,
    search: search || undefined,
    limit: 50,
  });

  const { data: popular } = trpc.destination.getPopular.useQuery({ limit: 3 });

  return (
    <div className="min-h-screen bg-[#f5f6f0]">
      {/* Header */}
      <div className="bg-white border-b border-black/5 px-4 sm:px-8 py-6 sticky top-14 z-10">
        <div className="container-main">
          <h1 className="font-display text-3xl sm:text-4xl mb-4">
            Explore Destinations
          </h1>

          {/* Search */}
          <div className="flex items-center gap-3 bg-[#f5f6f0] rounded-full px-4 py-2.5 max-w-xl mb-4">
            <Search className="w-4 h-4 text-black/30 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search cities or countries..."
              className="flex-1 bg-transparent text-sm font-body outline-none"
            />
          </div>

          {/* Region Filters */}
          <div className="flex gap-2 flex-wrap">
            {regions.map((r) => (
              <button
                key={r}
                onClick={() => setRegion(r)}
                className={`px-4 py-2 rounded-full text-xs font-body capitalize transition-all duration-300 ${
                  region === r
                    ? "bg-[#ff7a6e] text-white"
                    : "bg-white text-black/60 border border-black/15 hover:bg-[#f5f6f0]"
                }`}
              >
                <Globe className="w-3 h-3 inline mr-1" />
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="section-padding">
        <div className="container-main">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-6 h-6 animate-spin text-black/40" />
            </div>
          ) : destinations && destinations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <div
                  key={dest.id}
                  className="bg-white rounded-xl overflow-hidden border border-black/5 cursor-pointer group hover:shadow-xl transition-all duration-300"
                  onClick={() => {}}
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={dest.imageUrl || ""}
                      alt={dest.city}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-1">
                      <h3 className="font-display text-xl">{dest.city}</h3>
                      <span className="pill-tag text-[10px]">
                        <MapPin className="w-2.5 h-2.5 text-[#ff7a6e]" />
                        {dest.country}
                      </span>
                    </div>
                    <p className="text-xs text-black/40 font-body capitalize mb-3">
                      {dest.region}
                    </p>
                    <p className="text-sm text-black/40 font-body line-clamp-2 mb-4">
                      {dest.description}
                    </p>

                    {/* Cost Index */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-black/40 font-body flex items-center gap-1">
                        <DollarSign className="w-3 h-3" />
                        Cost Index
                      </span>
                      <div className="flex-1 h-1.5 bg-[#f5f6f0] rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#ff7a6e]"
                          style={{ width: `${dest.costIndex || 50}%` }}
                        />
                      </div>
                      <span className="text-xs font-body">{dest.costIndex}%</span>
                    </div>

                    {/* Tags */}
                    {dest.tags && Array.isArray(dest.tags) && dest.tags.length > 0 && (
                      <div className="flex gap-1 mt-3 flex-wrap">
                        {(dest.tags as string[]).slice(0, 3).map((tag) => (
                          <span
                            key={tag}
                            className="px-2 py-0.5 bg-[#e0dffb] rounded-full text-[10px] font-body capitalize"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <Globe className="w-12 h-12 text-black/10 mx-auto mb-4" />
              <h3 className="font-display text-xl mb-2">No destinations found</h3>
              <p className="text-sm text-black/40 font-body">
                Try adjusting your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Popular Section */}
      {popular && popular.length > 0 && !search && region === "all" && (
        <div className="section-padding bg-white">
          <div className="container-main">
            <h2 className="font-display text-2xl mb-6">Most Popular</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {popular.map((dest) => (
                <div
                  key={dest.id}
                  className="relative h-64 rounded-xl overflow-hidden cursor-pointer group"
                >
                  <img
                    src={dest.imageUrl || ""}
                    alt={dest.city}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <h3 className="font-display text-xl text-white mb-1">
                      {dest.city}
                    </h3>
                    <p className="text-xs text-white/70 font-body flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {dest.country}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
