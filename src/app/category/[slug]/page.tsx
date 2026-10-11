"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";

type Product = {
  id: number;
  slug: string;
  nameBn: string;
  image: string;
  today: number;
  unit: string;
  category: string;
  change: {
    dir: "up" | "down";
    pct: number;
  };
};

type Category = {
  slug: string;
  nameBn: string;
};

export default function CategoryProductsPage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-gray-500">লোড হচ্ছে...</div>}>
      <CategoryContent />
    </Suspense>
  );
}

function CategoryContent() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default");

  useEffect(() => {
    fetch("https://api.api-store.workers.dev/api/bazardor/products")
      .then((res) => res.json())
      .then((data) => setProducts(data));

    fetch("https://api.api-store.workers.dev/api/bazardor/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        
        const exists = data.some((cat: Category) => cat.slug === categorySlug);
        if (!exists && data.length > 0) {
          notFound();
        }
      })
      .finally(() => setLoading(false));
  }, [categorySlug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="h-20 animate-pulse rounded-xl bg-gray-200 mb-6"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
          <div className="h-48 animate-pulse rounded-xl bg-gray-200"></div>
        </div>
      </div>
    );
  }

  const categoryProducts = products.filter((p) => p.category === categorySlug);
  const currentCategory = categories.find((c) => c.slug === categorySlug);

  const sortedProducts = [...categoryProducts].sort((a, b) => {
    if (sortOption === "low-to-high") return a.today - b.today;
    if (sortOption === "high-to-low") return b.today - a.today;
    return 0;
  });

  return (
    <section className="bg-gray-50 py-10 min-h-screen">
      <div className="mx-auto max-w-6xl px-4">
        
        <div className="mb-6 rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-[#1D271F]">
            {currentCategory ? currentCategory.nameBn : categorySlug}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            এই ক্যাটেগরির পণ্যের আজকের দাম ও পরিবর্তন
          </p>
        </div>

        <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
          <p className="text-sm text-gray-600">
            মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য
          </p>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">সাজান ▾</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-[#05893E]"
            >
              <option value="default">ডিফল্ট</option>
              <option value="low-to-high">দাম: কম থেকে বেশি</option>
              <option value="high-to-low">দাম: বেশি থেকে কম</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {sortedProducts.map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-50 text-4xl">
                {product.image}
              </div>

              <h3 className="text-lg font-bold text-[#1D271F]">
                {product.nameBn}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                প্রতি {getUnitName(product.unit)}
              </p>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-400">আজকের দাম</p>
                  <p className="text-lg font-bold text-[#1D271F]">
                    {toBanglaNumber(product.today)} টাকা
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    product.change.dir === "up"
                      ? "bg-red-50 text-red-500"
                      : "bg-green-50 text-[#05893E]"
                  }`}
                >
                  {product.change.dir === "up" ? "▲" : "▼"}{" "}
                  {toBanglaNumber(product.change.pct)}%
                </span>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}

function getUnitName(unit: string) {
  if (unit === "kg") return "কেজি";
  if (unit === "liter") return "লিটার";
  if (unit === "dozen") return "ডজন";
  if (unit === "piece") return "পিস";
  return unit;
}

function toBanglaNumber(value: number) {
  const banglaDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
  return value
    .toString()
    .replace(/\d/g, (digit) => banglaDigits[Number(digit)]);
}