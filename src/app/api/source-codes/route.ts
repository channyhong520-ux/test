import { getSourceCodes, getCategories } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const search = searchParams.get("search") || undefined;
  const sort = (searchParams.get("sort") as "newest" | "price-asc" | "price-desc" | "popular") || "newest";
  const limit = Number(searchParams.get("limit")) || 12;
  const offset = Number(searchParams.get("offset")) || 0;

  const [data, categories] = await Promise.all([
    getSourceCodes({ category, search, sort, limit, offset }),
    getCategories(),
  ]);

  return Response.json({ ...data, categories });
}
