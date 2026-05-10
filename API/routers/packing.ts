import { z } from "zod";
import { createRouter, authedQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { packingItems } from "@db/schema";
import { eq } from "drizzle-orm";

export const packingRouter = createRouter({
  list: authedQuery
    .input(z.object({ tripId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db
        .select()
        .from(packingItems)
        .where(eq(packingItems.tripId, input.tripId))
        .orderBy(packingItems.category, packingItems.createdAt);
    }),

  create: authedQuery
    .input(
      z.object({
        tripId: z.number(),
        name: z.string().min(1).max(255),
        category: z
          .enum(["clothing", "documents", "electronics", "toiletries", "misc"])
          .optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const [item] = await db.insert(packingItems).values({
        tripId: input.tripId,
        name: input.name,
        category: input.category,
      });
      return db
        .select()
        .from(packingItems)
        .where(eq(packingItems.id, item.insertId))
        .limit(1);
    }),

  toggle: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const [item] = await db
        .select()
        .from(packingItems)
        .where(eq(packingItems.id, input.id))
        .limit(1);
      if (!item) throw new Error("Item not found");
      await db
        .update(packingItems)
        .set({ isPacked: !item.isPacked })
        .where(eq(packingItems.id, input.id));
      const [updated] = await db
        .select()
        .from(packingItems)
        .where(eq(packingItems.id, input.id))
        .limit(1);
      return updated;
    }),

  delete: authedQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(packingItems).where(eq(packingItems.id, input.id));
      return { success: true };
    }),
});
