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
      title: "StoreWeb.rar",
      description: "Complete E-Commerce Store Website — a production-ready, fully responsive online store. Includes storefront, product listings, shopping cart, checkout, user authentication, admin dashboard, order management, inventory tracking, and payment integration. Clean, documented code, easy to deploy.",
      price: "0.01",
      category: "Web",
      imageUrl: "/images/storeweb-hero.jpg",
      fileUrl: "/files/StoreWeb.rar",
      fileSize: "18.5 MB",
      sales: 47,
    },
    {
      id: 2,
      title: "FivemHud.rar",
      description: "Custom FiveM HUD resource for GTA V roleplay servers. Features health bar, armor indicator, hunger/thirst system, speedometer, fuel gauge, compass, voice proximity indicator, and weapon ammo display. Fully configurable via config file. ESX & QBCore compatible.",
      price: "0.01",
      category: "FiveM",
      imageUrl: "/images/fivem-hud.svg",
      fileUrl: "/files/FivemHud.rar",
      fileSize: "3.2 MB",
      sales: 126,
    },
    {
      id: 3,
      title: "FivemMinimap.rar",
      description: "Custom FiveM minimap resource for GTA V. Replaces the default GTA minimap with a modern, sleek circular or square design. Includes street names, zone display, compass heading, postal codes, and customizable colors. Works with ESX, QBCore, and standalone.",
      price: "0.01",
      category: "FiveM",
      imageUrl: "/images/fivem-minimap.svg",
      fileUrl: "/files/FivemMinimap.rar",
      fileSize: "1.8 MB",
      sales: 203,
    },
    {
      id: 4,
      title: "FivemKhmerFlag.rar",
      description: "Khmer (Cambodian) flag resource pack for FiveM GTA V servers. Includes waving flag props, flag textures for vehicles, clothing overlays, and decorative map objects. Proudly represent Cambodia on your roleplay server. Simple drag-and-drop install.",
      price: "0.01",
      category: "FiveM",
      imageUrl: "/images/fivem-khmerflag.svg",
      fileUrl: "/files/FivemKhmerFlag.rar",
      fileSize: "2.1 MB",
      sales: 89,
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
