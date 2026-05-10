import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { tripNotes } from "@db/schema";
import { eq } from "drizzle-orm";

export const noteRouter = createRouter({
  list: authedQuery
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(tripNotes)
        .where(eq(tripNotes.tripId, input.tripId))
        .orderBy(tripNotes.createdAt);
    }),

  create: authedQuery
    .input(
      z.object({
        tripId: z.number(),
        stopId: z.number().optional(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [note] = await db.insert(tripNotes).values({
        tripId: input.tripId,
        stopId: input.stopId,
        content: input.content,
      });
      return db.select().from(tripNotes).where(eq(tripNotes.id, note.insertId)).limit(1);
    }),

  update: authedQuery
    .input(z.object({ id: z.number(), content: z.string().min(1) }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(tripNotes)
        .set({ content: input.content })
        .where(eq(tripNotes.id, input.id));
      const [note] = await db
        .select()
        .from(tripNotes)
        .where(eq(tripNotes.id, input.id))
        .limit(1);
      return note;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(tripNotes).where(eq(tripNotes.id, input.id));
      return { success: true };
    }),
});
