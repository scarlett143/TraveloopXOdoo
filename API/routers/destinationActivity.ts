import { z } from "zod";
import { createRouter, publicQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { destinationActivities } from "@db/schema";
import { eq } from "drizzle-orm";

export const destinationActivityRouter = createRouter({
  list: publicQuery
    .input(
      z.object({
        destinationId: z.number().optional(),
        type: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      if (input.destinationId) {
        return db
          .select()
          .from(destinationActivities)
          .where(eq(destinationActivities.destinationId, input.destinationId));
      }
      return db.select().from(destinationActivities);
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [act] = await db
        .select()
        .from(destinationActivities)
        .where(eq(destinationActivities.id, input.id))
        .limit(1);
      return act ?? null;
    }),
});
