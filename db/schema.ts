import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  bigint,
  decimal,
  boolean,
  int,
  date,
  time,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export const trips = mysqlTable("trips", {
  id: serial("id").primaryKey(),
  userId: bigint("userId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  coverImage: varchar("coverImage", { length: 500 }),
  startDate: date("startDate"),
  endDate: date("endDate"),
  isPublic: boolean("isPublic").default(false),
  publicSlug: varchar("publicSlug", { length: 100 }).unique(),
  status: mysqlEnum("status", ["planning", "upcoming", "active", "completed"]).default("planning"),
  totalBudget: decimal("totalBudget", { precision: 12, scale: 2 }).default("0"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const stops = mysqlTable("stops", {
  id: serial("id").primaryKey(),
  tripId: bigint("tripId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }),
  arrivalDate: date("arrivalDate"),
  departureDate: date("departureDate"),
  order: int("order").default(0),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const activities = mysqlTable("activities", {
  id: serial("id").primaryKey(),
  stopId: bigint("stopId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => stops.id, { onDelete: "cascade" }),
  tripId: bigint("tripId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["sightseeing", "food", "transport", "stay", "other"]).default("sightseeing"),
  cost: decimal("cost", { precision: 10, scale: 2 }).default("0"),
  currency: varchar("currency", { length: 3 }).default("USD"),
  startTime: time("startTime"),
  endTime: time("endTime"),
  dayNumber: int("dayNumber").default(1),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const packingItems = mysqlTable("packing_items", {
  id: serial("id").primaryKey(),
  tripId: bigint("tripId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  category: mysqlEnum("category", ["clothing", "documents", "electronics", "toiletries", "misc"]).default("misc"),
  isPacked: boolean("isPacked").default(false),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const tripNotes = mysqlTable("trip_notes", {
  id: serial("id").primaryKey(),
  tripId: bigint("tripId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => trips.id, { onDelete: "cascade" }),
  stopId: bigint("stopId", { mode: "number", unsigned: true })
    .references(() => stops.id, { onDelete: "set null" }),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export const destinations = mysqlTable("destinations", {
  id: serial("id").primaryKey(),
  city: varchar("city", { length: 255 }).notNull(),
  country: varchar("country", { length: 255 }).notNull(),
  region: mysqlEnum("region", ["asia", "europe", "americas", "africa", "oceania"]).notNull(),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }),
  costIndex: int("costIndex").default(50),
  popularity: int("popularity").default(0),
  tags: json("tags").$type<string[]>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const destinationActivities = mysqlTable("destination_activities", {
  id: serial("id").primaryKey(),
  destinationId: bigint("destinationId", { mode: "number", unsigned: true })
    .notNull()
    .references(() => destinations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: mysqlEnum("type", ["sightseeing", "food", "transport", "stay", "other"]).default("sightseeing"),
  avgCost: decimal("avgCost", { precision: 10, scale: 2 }).default("0"),
  duration: varchar("duration", { length: 50 }),
  imageUrl: varchar("imageUrl", { length: 500 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Trip = typeof trips.$inferSelect;
export type InsertTrip = typeof trips.$inferInsert;
export type Stop = typeof stops.$inferSelect;
export type Activity = typeof activities.$inferSelect;
export type PackingItem = typeof packingItems.$inferSelect;
export type TripNote = typeof tripNotes.$inferSelect;
export type Destination = typeof destinations.$inferSelect;
export type DestinationActivity = typeof destinationActivities.$inferSelect;
