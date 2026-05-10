import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { trips, stops, activities } from "@db/schema";
import { eq, and, desc } from "drizzle-orm";
import { randomBytes } from "crypto";

export const tripRouter = createRouter({
  list: authedQuery.query(async ({ ctx }) => {
    const db = getDb();
    return db
      .select()
      .from(trips)
      .where(eq(trips.userId, ctx.user.id))
      .orderBy(desc(trips.createdAt));
  }),

  getById: authedQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = getDb();
      const [trip] = await db
        .select()
        .from(trips)
        .where(and(eq(trips.id, input.id), eq(trips.userId, ctx.user.id)))
        .limit(1);
      if (!trip) return null;
      const tripStops = await db
        .select()
        .from(stops)
        .where(eq(stops.tripId, input.id))
        .orderBy(stops.order);
      const tripActivities = await db
        .select()
        .from(activities)
        .where(eq(activities.tripId, input.id));
      return { ...trip, stops: tripStops, activities: tripActivities };
    }),

  getBySlug: authedQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [trip] = await db
        .select()
        .from(trips)
        .where(and(eq(trips.publicSlug, input.slug), eq(trips.isPublic, true)))
        .limit(1);
      if (!trip) return null;
      const tripStops = await db
        .select()
        .from(stops)
        .where(eq(stops.tripId, trip.id))
        .orderBy(stops.order);
      const tripActivities = await db
        .select()
        .from(activities)
        .where(eq(activities.tripId, trip.id));
      return { ...trip, stops: tripStops, activities: tripActivities };
    }),

  create: authedQuery
    .input(
      z.object({
        name: z.string().min(1).max(255),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        totalBudget: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const result = await db.insert(trips).values([{
        userId: ctx.user.id,
        name: input.name,
        description: input.description,
        startDate: input.startDate ? new Date(input.startDate) : undefined,
        endDate: input.endDate ? new Date(input.endDate) : undefined,
        totalBudget: input.totalBudget ? input.totalBudget.toString() : "0",
      }]);
      const newId = result[0].insertId;
      return db.select().from(trips).where(eq(trips.id, newId)).limit(1);
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        name: z.string().min(1).max(255).optional(),
        description: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional(),
        coverImage: z.string().optional(),
        isPublic: z.boolean().optional(),
        totalBudget: z.number().optional(),
        status: z.enum(["planning", "upcoming", "active", "completed"]).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const { id, ...data } = input;
      const updateData: Record<string, unknown> = { ...data };
      if (data.isPublic && !data.isPublic) {
        // keep existing slug
      } else if (data.isPublic) {
        updateData.publicSlug = randomBytes(8).toString("hex");
      }
      if (data.totalBudget !== undefined) {
        updateData.totalBudget = data.totalBudget.toString();
      }
      await db
        .update(trips)
        .set(updateData)
        .where(and(eq(trips.id, id), eq(trips.userId, ctx.user.id)));
      const [trip] = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
      return trip;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      await db
        .delete(trips)
        .where(and(eq(trips.id, input.id), eq(trips.userId, ctx.user.id)));
      return { success: true };
    }),

  copy: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = getDb();
      const [original] = await db
        .select()
        .from(trips)
        .where(eq(trips.id, input.id))
        .limit(1);
      if (!original) throw new Error("Trip not found");

      const [newTrip] = await db.insert(trips).values({
        userId: ctx.user.id,
        name: original.name + " (Copy)",
        description: original.description,
        startDate: original.startDate,
        endDate: original.endDate,
        totalBudget: original.totalBudget,
        status: "planning",
      });
      const newTripId = newTrip.insertId;

      const originalStops = await db
        .select()
        .from(stops)
        .where(eq(stops.tripId, input.id))
        .orderBy(stops.order);

      const stopIdMap = new Map<number, number>();
      for (const stop of originalStops) {
        const [newStop] = await db.insert(stops).values({
          tripId: newTripId,
          city: stop.city,
          country: stop.country,
          arrivalDate: stop.arrivalDate,
          departureDate: stop.departureDate,
          order: stop.order,
          notes: stop.notes,
        });
        stopIdMap.set(stop.id, newStop.insertId);
      }

      const originalActivities = await db
        .select()
        .from(activities)
        .where(eq(activities.tripId, input.id));

      for (const activity of originalActivities) {
        await db.insert(activities).values({
          stopId: stopIdMap.get(activity.stopId) || 0,
          tripId: newTripId,
          name: activity.name,
          description: activity.description,
          type: activity.type,
          cost: activity.cost,
          startTime: activity.startTime,
          endTime: activity.endTime,
          dayNumber: activity.dayNumber,
        });
      }

      const [result] = await db
        .select()
        .from(trips)
        .where(eq(trips.id, newTripId))
        .limit(1);
      return result;
    }),
});
