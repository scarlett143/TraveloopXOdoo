import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { activities } from "@db/schema";
import { eq } from "drizzle-orm";

export const activityRouter = createRouter({
  list: authedQuery
    .input(
      z.object({ tripId: z.number().optional(), stopId: z.number().optional() })
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (input.stopId) {
        return db
          .select()
          .from(activities)
          .where(eq(activities.stopId, input.stopId))
          .orderBy(activities.dayNumber, activities.startTime);
      }
      if (input.tripId) {
        return db
          .select()
          .from(activities)
          .where(eq(activities.tripId, input.tripId))
          .orderBy(activities.dayNumber, activities.startTime);
      }
      return db.select().from(activities).orderBy(activities.dayNumber, activities.startTime);
    }),

  create: authedQuery
    .input(
      z.object({
        stopId: z.number(),
        tripId: z.number(),
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        type: z.enum(["sightseeing", "food", "transport", "stay", "other"]).optional(),
        cost: z.number().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        dayNumber: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [activity] = await db.insert(activities).values({
        stopId: input.stopId,
        tripId: input.tripId,
        name: input.name,
        description: input.description,
        type: input.type,
        cost: input.cost ? input.cost.toString() : "0",
        startTime: input.startTime,
        endTime: input.endTime,
        dayNumber: input.dayNumber ?? 1,
      });
      return db.select().from(activities).where(eq(activities.id, activity.insertId)).limit(1);
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        type: z.enum(["sightseeing", "food", "transport", "stay", "other"]).optional(),
        cost: z.number().optional(),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        dayNumber: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.cost !== undefined) {
        updateData.cost = data.cost.toString();
      }
      await db.update(activities).set(updateData).where(eq(activities.id, id));
      const [activity] = await db.select().from(activities).where(eq(activities.id, id)).limit(1);
      return activity;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(activities).where(eq(activities.id, input.id));
      return { success: true };
    }),
});
