import { pgTable, serial, text, numeric, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const sourceCodes = pgTable("source_codes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size").notNull(),
  sales: integer("sales").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  productId: integer("product_id").notNull().references(() => sourceCodes.id),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("USD"),
  md5: text("md5").notNull(),
  qrString: text("qr_string").notNull(),
  deeplink: text("deeplink"),
  status: text("status").notNull().default("PENDING"), // PENDING, PAID, EXPIRED, FAILED
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
