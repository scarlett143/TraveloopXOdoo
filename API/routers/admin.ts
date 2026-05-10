import { z } from "zod";
import { createRouter, adminQuery } from "../middleware";
import { getDb } from "../queries/connection";
import { users, trips, activities } from "@db/schema";
import { eq, desc } from "drizzle-orm";

export const adminRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db = getDb();
    const allUsers = await db.select().from(users);
    const allTrips = await db.select().from(trips);
    const allActivities = await db.select().from(activities);

    const activeTrips = allTrips.filter(
      (t) => t.status === "upcoming" || t.status === "active"
    ).length;

    return {
      totalUsers: allUsers.length,
      totalTrips: allTrips.length,
      totalActivities: allActivities.length,
      activeTrips,
      usersByMonth: {} as Record<string, number>,
    };
  }),

  users: adminQuery
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const allUsers = await db.select().from(users).orderBy(desc(users.createdAt));

      let filtered = allUsers;
      if (input.search) {
        const s = input.search.toLowerCase();
        filtered = allUsers.filter(
          (u) =>
            (u.name?.toLowerCase().includes(s) ?? false) ||
            (u.email?.toLowerCase().includes(s) ?? false)
        );
      }

      const limit = input.limit ?? 20;
      const page = input.page ?? 1;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);

      return { users: paginated, total: filtered.length };
    }),

  trips: adminQuery
    .input(
      z.object({
        search: z.string().optional(),
        page: z.number().min(1).optional(),
        limit: z.number().min(1).max(100).optional(),
      })
    )
    .query(async ({ input }) => {
      const db = getDb();
      const allTrips = await db.select().from(trips).orderBy(desc(trips.createdAt));

      let filtered = allTrips;
      if (input.search) {
        const s = input.search.toLowerCase();
        filtered = allTrips.filter((t) => t.name.toLowerCase().includes(s));
      }

      const limit = input.limit ?? 20;
      const page = input.page ?? 1;
      const offset = (page - 1) * limit;
      const paginated = filtered.slice(offset, offset + limit);

      return { trips: paginated, total: filtered.length };
    }),

  userDetail: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);
      if (!user) return null;
      const userTrips = await db
        .select()
        .from(trips)
        .where(eq(trips.userId, input.id));
      return { ...user, tripCount: userTrips.length };
    }),

  updateUserRole: adminQuery
    .input(
      z.object({
        id: z.number(),
        role: z.enum(["user", "admin"]),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      await db
        .update(users)
        .set({ role: input.role })
        .where(eq(users.id, input.id));
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);
      return user;
    }),
});
