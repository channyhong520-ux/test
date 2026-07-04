import { db } from "@/db";
import { sourceCodes, transactions } from "@/db/schema";
import { eq, ilike, or, and, desc, asc, sql } from "drizzle-orm";

export type SourceCode = typeof sourceCodes.$inferSelect;
export type Transaction = typeof transactions.$inferSelect;

export async function getSourceCodes(options?: {
  category?: string;
  search?: string;
  sort?: "newest" | "price-asc" | "price-desc" | "popular";
  limit?: number;
  offset?: number;
}) {
  const { category, search, sort = "newest", limit = 12, offset = 0 } = options || {};

  const conditions = [];

  if (category && category !== "All") {
    conditions.push(eq(sourceCodes.category, category));
  }

  if (search) {
    conditions.push(
      or(
        ilike(sourceCodes.title, `%${search}%`),
        ilike(sourceCodes.description, `%${search}%`)
      )
    );
  }

  const orderBy =
    sort === "price-asc"
      ? [asc(sourceCodes.price)]
      : sort === "price-desc"
        ? [desc(sourceCodes.price)]
        : sort === "popular"
          ? [desc(sourceCodes.sales)]
          : [desc(sourceCodes.createdAt)];

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const results = await db
    .select()
    .from(sourceCodes)
    .where(where)
    .orderBy(...orderBy)
    .limit(limit)
    .offset(offset);

  const countResult = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sourceCodes)
    .where(where);

  return { items: results, total: countResult[0]?.count ?? 0 };
}

export async function getSourceCodeById(id: number) {
  const results = await db
    .select()
    .from(sourceCodes)
    .where(eq(sourceCodes.id, id))
    .limit(1);

  return results[0] || null;
}

export async function getCategories() {
  const results = await db
    .selectDistinct({ category: sourceCodes.category })
    .from(sourceCodes)
    .orderBy(asc(sourceCodes.category));

  return results.map((r) => r.category);
}

export async function incrementSales(id: number) {
  await db
    .update(sourceCodes)
    .set({ sales: sql`${sourceCodes.sales} + 1` })
    .where(eq(sourceCodes.id, id));
}

export async function createTransaction(data: {
  productId: number;
  amount: string;
  currency: string;
  md5: string;
  qrString: string;
  deeplink: string;
}) {
  const result = await db
    .insert(transactions)
    .values({
      productId: data.productId,
      amount: data.amount,
      currency: data.currency,
      md5: data.md5,
      qrString: data.qrString,
      deeplink: data.deeplink,
      status: "PENDING",
    })
    .returning();

  return result[0];
}

export async function getTransactionByMd5(md5: string) {
  const result = await db
    .select()
    .from(transactions)
    .where(eq(transactions.md5, md5))
    .limit(1);

  return result[0] || null;
}

export async function markTransactionPaid(md5: string) {
  const result = await db
    .update(transactions)
    .set({ status: "PAID", paidAt: new Date() })
    .where(eq(transactions.md5, md5))
    .returning();

  return result[0] || null;
}

export async function markTransactionExpired(md5: string) {
  await db
    .update(transactions)
    .set({ status: "EXPIRED" })
    .where(eq(transactions.md5, md5));
}
