import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { activities, trips } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const budgetRouter = createRouter({
  getSummary: authedQuery
    .input(z.object({ tripId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [trip] = await db
        .select()
        .from(trips)
        .where(and(eq(trips.id, input.tripId), eq(trips.userId, ctx.user.id)))
        .limit(1);

      const acts = await db
        .select()
        .from(activities)
        .where(eq(activities.tripId, input.tripId));

      const total = acts.reduce((sum, a) => sum + Number(a.cost), 0);
      const byCategory: Record<string, number> = {};
      const daily: Record<number, number> = {};

      for (const a of acts) {
        const type = a.type || "other";
        byCategory[type] = (byCategory[type] || 0) + Number(a.cost);
        const day = a.dayNumber || 1;
        daily[day] = (daily[day] || 0) + Number(a.cost);
      }

      const dailyArray = Object.entries(daily)
        .map(([day, cost]) => ({ day: Number(day), cost }))
        .sort((a, b) => a.day - b.day);

      return {
        total,
        totalBudget: Number(trip?.totalBudget || 0),
        byCategory,
        daily: dailyArray,
      };
    }),

  updateTotal: authedQuery
    .input(z.object({ tripId: z.number(), totalBudget: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .update(trips)
        .set({ totalBudget: input.totalBudget.toString() })
        .where(and(eq(trips.id, input.tripId), eq(trips.userId, ctx.user.id)));
      const [trip] = await db.select().from(trips).where(eq(trips.id, input.tripId)).limit(1);
      return trip;
    }),
});
