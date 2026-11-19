// TEMPORARY one-off tool: wipes all stockSculpt data (except the admin's own
// account) and reseeds fresh dummy data. Added 19 Nov 2026 at the owner's
// request because the old data was orphaned test data. Remove after the
// reseed is verified live.

const KEEP_EMAIL = "tanzilhasan140@gmail.com";

const arr = (d) =>
  Array.isArray(d)
    ? d
    : d && (d.data || d.items || d.users)
      ? d.data || d.items || d.users
      : [];

const PRODUCTS = [
  {
    name: "Wireless Headphones",
    image: "https://picsum.photos/seed/stocksculpt-headphones/400/300",
    description: "Bluetooth wireless headphones with noise cancellation.",
    price: 89,
    stock: 24,
    category: "Electronics",
    rating: 4.5,
  },
  {
    name: "Gaming Laptop Pro",
    image: "https://picsum.photos/seed/stocksculpt-laptop/400/300",
    description: "High-performance gaming laptop with 16GB RAM and RTX graphics.",
    price: 1299,
    stock: 3,
    category: "Electronics",
    rating: 4.8,
  },
  {
    name: "Cotton T-Shirt",
    image: "https://picsum.photos/seed/stocksculpt-tshirt/400/300",
    description: "Soft 100% cotton t-shirt, comfortable everyday fit.",
    price: 19,
    stock: 120,
    category: "Clothing",
    rating: 4.2,
  },
  {
    name: "Denim Jacket",
    image: "https://picsum.photos/seed/stocksculpt-jacket/400/300",
    description: "Classic denim jacket with button front.",
    price: 59,
    stock: 8,
    category: "Clothing",
    rating: 4.6,
  },
  {
    name: "Smart Watch",
    image: "https://picsum.photos/seed/stocksculpt-watch/400/300",
    description: "Fitness smartwatch with heart-rate tracking and GPS.",
    price: 199,
    stock: 0,
    category: "Electronics",
    rating: 4.4,
  },
  {
    name: "Leather Wallet",
    image: "https://picsum.photos/seed/stocksculpt-wallet/400/300",
    description: "Genuine leather bifold wallet with RFID protection.",
    price: 45,
    stock: 42,
    category: "Accessories",
    rating: 4.7,
  },
  {
    name: "Sunglasses",
    image: "https://picsum.photos/seed/stocksculpt-sunglasses/400/300",
    description: "UV-protection sunglasses with polarized lenses.",
    price: 35,
    stock: 5,
    category: "Accessories",
    rating: 4.1,
  },
  {
    name: "Running Shoes",
    image: "https://picsum.photos/seed/stocksculpt-shoes/400/300",
    description: "Lightweight running shoes with cushioned sole.",
    price: 79,
    stock: 17,
    category: "Clothing",
    rating: 4.5,
  },
];

const ORDERS = [
  {
    items: [
      ["Cotton T-Shirt", 2],
      ["Leather Wallet", 1],
    ],
    totalPrice: 83,
    orderStatus: "completed",
    createdAt: "2026-06-14T10:00:00.000Z",
  },
  {
    items: [["Wireless Headphones", 1]],
    totalPrice: 89,
    orderStatus: "completed",
    createdAt: "2026-07-09T10:00:00.000Z",
  },
  {
    items: [
      ["Running Shoes", 1],
      ["Sunglasses", 2],
    ],
    totalPrice: 149,
    orderStatus: "completed",
    createdAt: "2026-08-21T10:00:00.000Z",
  },
  {
    items: [["Denim Jacket", 1]],
    totalPrice: 59,
    orderStatus: "completed",
    createdAt: "2026-09-05T10:00:00.000Z",
  },
  {
    items: [["Gaming Laptop Pro", 1]],
    totalPrice: 1299,
    orderStatus: "completed",
    createdAt: "2026-10-18T10:00:00.000Z",
  },
  {
    items: [
      ["Wireless Headphones", 1],
      ["Leather Wallet", 1],
    ],
    totalPrice: 134,
    orderStatus: "pending",
    createdAt: "2026-11-18T10:00:00.000Z",
  },
  {
    items: [["Cotton T-Shirt", 1]],
    totalPrice: 19,
    orderStatus: "canceled",
    createdAt: "2026-11-15T10:00:00.000Z",
  },
];

export async function resetDemoData(axiosSecure, log) {
  const call = async (method, path, body) => {
    try {
      const res = await axiosSecure({ method, url: path, data: body });
      return { status: res.status, data: res.data };
    } catch (err) {
      return {
        status: err.response?.status || 0,
        data: err.response?.data,
        error: err.message,
      };
    }
  };

  // List everything first.
  const users = arr((await call("get", "/users")).data);
  const shops = arr((await call("get", "/shop")).data);
  const products = arr((await call("get", "/products")).data);
  const orders = arr((await call("get", "/order")).data);
  const subs = arr((await call("get", "/subscriptions")).data);
  log(
    `BEFORE users=${users.length} shops=${shops.length} products=${products.length} orders=${orders.length} subs=${subs.length}`
  );
  log(`BEFORE users: ${users.map((u) => u.email).join(", ")}`);
  log(`BEFORE shops: ${shops.map((s) => s.name).join(", ")}`);
  log(`BEFORE products: ${products.map((p) => p.name).join(", ")}`);

  // Wipe: orders -> products -> shops -> subscriptions -> users (except owner).
  // Products go before shops: deleting a product 404s when its shop is gone.
  const fails = [];
  const wipe = async (label, items, path) => {
    for (const item of items) {
      const r = await call("delete", `${path}/${item._id}`);
      if (r.status !== 200 && r.status !== 404) {
        fails.push(`${label} ${item.name || item.email || item._id} -> ${r.status}`);
      }
    }
    log(`${label} deleted: ${items.length}`);
  };
  await wipe("orders", orders, "/order");
  await wipe("products", products, "/products");
  await wipe("shops", shops, "/shop");
  await wipe("subs", subs, "/subscriptions");
  const others = users.filter((u) => u.email !== KEEP_EMAIL);
  await wipe("users", others, "/users");
  log(`kept user: ${KEEP_EMAIL}`);
  if (fails.length) log(`WIPE FAILURES: ${fails.join(" | ")}`);

  // Verify the wipe before reseeding anything.
  const u2 = arr((await call("get", "/users")).data);
  const s2 = arr((await call("get", "/shop")).data);
  const p2 = arr((await call("get", "/products")).data);
  const o2 = arr((await call("get", "/order")).data);
  const b2 = arr((await call("get", "/subscriptions")).data);
  log(
    `AFTER-WIPE users=${u2.length} shops=${s2.length} products=${p2.length} orders=${o2.length} subs=${b2.length}`
  );
  if (
    u2.length !== 1 ||
    s2.length !== 0 ||
    p2.length !== 0 ||
    o2.length !== 0 ||
    b2.length !== 0
  ) {
    log("WIPE INCOMPLETE — stopping before reseed.");
    return false;
  }

  // Reseed: shop first (products and orders attach to the caller's shop).
  const shopRes = await call("post", "/shop", {
    name: "Birir Dokan",
    location: "Dhaka, Bangladesh",
  });
  log(`shop created: ${shopRes.status} ${shopRes.data?.name || ""}`);
  if (shopRes.status !== 201) {
    log("SHOP CREATE FAILED — stopping");
    return false;
  }

  const byName = {};
  for (const p of PRODUCTS) {
    const r = await call("post", "/products", p);
    log(`product ${p.name}: ${r.status}`);
    if (r.status === 201) byName[p.name] = r.data._id;
  }
  if (Object.keys(byName).length !== 8) {
    log("NOT ALL PRODUCTS CREATED — stopping before orders");
    return false;
  }

  for (const o of ORDERS) {
    const body = {
      products: o.items.map(([n, q]) => ({ product: byName[n], quantity: q })),
      totalPrice: o.totalPrice,
      orderStatus: o.orderStatus,
      createdAt: o.createdAt,
    };
    const r = await call("post", "/order", body);
    log(`order ${o.orderStatus} ${o.createdAt.slice(0, 10)} $${o.totalPrice}: ${r.status}`);
  }

  // Final verification.
  const u3 = arr((await call("get", "/users")).data);
  const s3 = arr((await call("get", "/shop")).data);
  const p3 = arr((await call("get", "/products")).data);
  const o3 = arr((await call("get", "/order")).data);
  const st = await call("get", "/admin/state");
  log(
    `FINAL users=${u3.length} shops=${s3.length} products=${p3.length} orders=${o3.length}`
  );
  log(`FINAL admin stats: ${JSON.stringify(st.data)}`);
  log(
    `FINAL products: ${p3
      .map((p) => `${p.name} ($${p.price}, stock ${p.stock})`)
      .join(" | ")}`
  );
  log("DONE");
  return true;
}
