import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { stops } from "@db/schema";
import { eq, and } from "drizzle-orm";

export const stopRouter = createRouter({
  list: authedQuery
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(stops)
        .where(eq(stops.tripId, input.tripId))
        .orderBy(stops.order);
    }),

  create: authedQuery
    .input(
      z.object({
        tripId: z.number(),
        city: z.string().min(1).max(255),
        country: z.string().optional(),
        arrivalDate: z.string().optional(),
        departureDate: z.string().optional(),
        order: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(stops).values([{
        tripId: input.tripId,
        city: input.city,
        country: input.country,
        arrivalDate: input.arrivalDate ? new Date(input.arrivalDate) : undefined,
        departureDate: input.departureDate ? new Date(input.departureDate) : undefined,
        order: input.order ?? 0,
        notes: input.notes,
      }]);
      const newId = result[0].insertId;
      return db.select().from(stops).where(eq(stops.id, newId)).limit(1);
    }),

  update: authedQuery
    .input(
      z.object({
        id: z.number(),
        city: z.string().min(1).max(255).optional(),
        country: z.string().optional(),
        arrivalDate: z.string().optional(),
        departureDate: z.string().optional(),
        order: z.number().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...rawData } = input;
      const data: Record<string, unknown> = { ...rawData };
      if (rawData.arrivalDate) data.arrivalDate = new Date(rawData.arrivalDate);
      if (rawData.departureDate) data.departureDate = new Date(rawData.departureDate);
      await db.update(stops).set(data).where(eq(stops.id, id));
      const [stop] = await db.select().from(stops).where(eq(stops.id, id)).limit(1);
      return stop;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(stops).where(eq(stops.id, input.id));
      return { success: true };
    }),

  reorder: authedQuery
    .input(
      z.object({
        tripId: z.number(),
        stopIds: z.array(z.number()),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      for (let i = 0; i < input.stopIds.length; i++) {
        await db
          .update(stops)
          .set({ order: i })
          .where(and(eq(stops.id, input.stopIds[i]), eq(stops.tripId, input.tripId)));
      }
      return db
        .select()
        .from(stops)
        .where(eq(stops.tripId, input.tripId))
        .orderBy(stops.order);
    }),
});
