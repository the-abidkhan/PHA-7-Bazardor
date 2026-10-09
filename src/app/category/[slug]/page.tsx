"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
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
    const [sortOption, setSortOption] = useState("default");

    useEffect(() => {
        fetch("https://api.api-store.workers.dev/api/bazardor/products")
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error("Failed to fetch products:", error);
            });

        fetch("https://api.api-store.workers.dev/api/bazardor/categories")
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
            })
            .catch((error) => {
                console.error("Failed to fetch categories:", error);
            });
    }, []);

    const categoryProducts = products.filter(
        (product) => product.category === categorySlug
    );

    const matchedCategory = categories.find((cat) => cat.slug === categorySlug);
    const categoryNameBn = matchedCategory ? matchedCategory.nameBn : categorySlug;

    const sortedProducts = [...categoryProducts].sort((a, b) => {
        if (sortOption === "low-to-high") {
            return a.today - b.today;
        } else if (sortOption === "high-to-low") {
            return b.today - a.today;
        }
        return 0;
    });

    return (
        <section className="bg-gray-50 py-12 min-h-screen">
            <div className="mx-auto max-w-6xl px-4">
                
                <div className="mb-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-200">
                    <h1 className="text-2xl font-bold text-[#1D271F]">
                        {categoryNameBn}
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        এই ক্যাটেগরির পণ্যের আজকের দাম ও পরিবর্তন
                    </p>
                </div>

                <div className="mb-6 flex items-center justify-between bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                    <p className="text-sm text-gray-600">
                        মোট {toBanglaNumber(sortedProducts.length)}টি পণ্য দেখানো হচ্ছে
                    </p>

                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">সাজান</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-[#1D271F] focus:outline-none focus:ring-2 focus:ring-[#05893E]"
                        >
                            <option value="default">ডিফল্ট</option>
                            <option value="low-to-high">কম দাম থেকে বেশি দাম</option>
                            <option value="high-to-low">বেশি দাম থেকে কম দাম</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>

            </div>
        </section>
    );
}

function ProductCard({ product }: { product: Product }) {
    return (
        <Link
            href={`/product/${product.slug}`}
            className="block rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-gray-50 text-5xl">
                {product.image}
            </div>

            <h3 className="text-lg font-bold text-[#1D271F]">
                {product.nameBn}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
                প্রতি {getUnitName(product.unit)}
            </p>

            <div className="mt-4 flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500">আজকের দাম</p>
                    <p className="text-xl font-bold text-[#1D271F]">
                        {toBanglaNumber(product.today)} টাকা
                    </p>
                </div>

                <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold ${
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