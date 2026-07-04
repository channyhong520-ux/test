import { db } from "./index";
import { sourceCodes } from "./schema";

export async function seed() {
  const existing = await db.select().from(sourceCodes).limit(1);
  if (existing.length > 0) {
    console.log("Database already seeded.");
    return;
  }

  const items = [
    {
      id: 1,
      title: "Fivem Graphic Performent",
      description: "High-quality FiveM graphic performance pack for immersive server visuals.",
      price: "4.99",
      category: "FiveM",
      imageUrl: "/images/fivem-hud.svg",
      fileUrl: "https://drive.google.com/file/d/1mIMcWVtbFCUlPNo-dnxIyyQIrtM87ltO/view?usp=sharing",
      fileSize: "1.2 MB",
      sales: 0,
    },
    {
      id: 2,
      title: "Coffee Store Web",
      description: "Modern coffee shop website template with responsive layout and checkout-ready pages.",
      price: "29.99",
      category: "Web",
      imageUrl: "/images/coffee-store-web.jpg",
      fileUrl: "https://drive.google.com/file/d/1TnMeNQZvxAgyPqmV5sAhxXn6wLdq9ZuI/view?usp=sharing",
      fileSize: "18.5 MB",
      sales: 0,
    },
  ];

  for (const item of items) {
    await db.insert(sourceCodes).values(item);
  }

  console.log(`Seeded ${items.length} products at $0.01 each.`);
}

if (require.main === module) {
  seed()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
