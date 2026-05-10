import { relations } from "drizzle-orm";
import {
  users,
  trips,
  stops,
  activities,
  packingItems,
  tripNotes,
  destinations,
  destinationActivities,
} from "./schema";

export const usersRelations = relations(users, ({ many }) => ({
  trips: many(trips),
}));

export const tripsRelations = relations(trips, ({ one, many }) => ({
  user: one(users, { fields: [trips.userId], references: [users.id] }),
  stops: many(stops),
  activities: many(activities),
  packingItems: many(packingItems),
  notes: many(tripNotes),
}));

export const stopsRelations = relations(stops, ({ one, many }) => ({
  trip: one(trips, { fields: [stops.tripId], references: [trips.id] }),
  activities: many(activities),
  notes: many(tripNotes),
}));

export const activitiesRelations = relations(activities, ({ one }) => ({
  trip: one(trips, { fields: [activities.tripId], references: [trips.id] }),
  stop: one(stops, { fields: [activities.stopId], references: [stops.id] }),
}));

export const packingItemsRelations = relations(packingItems, ({ one }) => ({
  trip: one(trips, { fields: [packingItems.tripId], references: [trips.id] }),
}));

export const tripNotesRelations = relations(tripNotes, ({ one }) => ({
  trip: one(trips, { fields: [tripNotes.tripId], references: [trips.id] }),
  stop: one(stops, { fields: [tripNotes.stopId], references: [stops.id] }),
}));

export const destinationsRelations = relations(destinations, ({ many }) => ({
  activities: many(destinationActivities),
}));

export const destinationActivitiesRelations = relations(
  destinationActivities,
  ({ one }) => ({
    destination: one(destinations, {
      fields: [destinationActivities.destinationId],
      references: [destinations.id],
    }),
  })
);
