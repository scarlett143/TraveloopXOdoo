import { authRouter } from "./auth-router";
import { createRouter, publicQuery } from "./middleware";
import { tripRouter } from "./routers/trip";
import { stopRouter } from "./routers/stop";
import { activityRouter } from "./routers/activity";
import { budgetRouter } from "./routers/budget";
import { packingRouter } from "./routers/packing";
import { noteRouter } from "./routers/note";
import { destinationRouter } from "./routers/destination";
import { destinationActivityRouter } from "./routers/destinationActivity";
import { adminRouter } from "./routers/admin";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),
  auth: authRouter,
  trip: tripRouter,
  stop: stopRouter,
  activity: activityRouter,
  budget: budgetRouter,
  packing: packingRouter,
  note: noteRouter,
  destination: destinationRouter,
  destinationActivity: destinationActivityRouter,
  admin: adminRouter,
});

export type AppRouter = typeof appRouter;
