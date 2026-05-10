import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { destinations, destinationActivities } from "@db/schema";
import { eq, desc, like, or } from "drizzle-orm";

export const destinationRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        region: z.string().optional(),
        search: z.string().optional(),
        limit: z.number().min(1).max(50).optional(),
        offset: z.number().min(0).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const conditions = [];

      if (input.region && input.region !== "all") {
        conditions.push(eq(destinations.region, input.region as "asia" | "europe" | "americas" | "africa" | "oceania"));
      }

      if (input.search) {
        const s = `%${input.search}%`;
        conditions.push(
          or(like(destinations.city, s), like(destinations.country, s))
        );
      }

      let query = db.select().from(destinations).orderBy(desc(destinations.popularity));

      const all = await query;
      let filtered = all;

      if (conditions.length > 0) {
        filtered = all.filter((d) => {
          if (input.region && input.region !== "all" && d.region !== input.region) return false;
          if (input.search) {
            const s = input.search.toLowerCase();
            if (!d.city.toLowerCase().includes(s) && !d.country.toLowerCase().includes(s)) return false;
          }
          return true;
        });
      }

      const limit = input.limit ?? 20;
      const offset = input.offset ?? 0;
      return filtered.slice(offset, offset + limit);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [dest] = await db
        .select()
        .from(destinations)
        .where(eq(destinations.id, input.id))
        .limit(1);
      if (!dest) return null;
      const acts = await db
        .select()
        .from(destinationActivities)
        .where(eq(destinationActivities.destinationId, input.id));
      return { ...dest, activities: acts };
    }),

  getPopular: publicQuery
    .input(z.object({ limit: z.number().min(1).max(20).optional() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(destinations)
        .orderBy(desc(destinations.popularity))
        .limit(input.limit ?? 6);
    }),
});
