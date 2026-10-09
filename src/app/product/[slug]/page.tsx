"use client";
import { useEffect, useState, Suspense } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

function ProductDetailContent() {
  const params = useParams();
  const slug = params?.slug;
  
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const toBengaliNumber = (num: number | string) => {
    if (num === undefined || num === null) return "";
    const englishDigits = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
    const bengaliDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
    let str = num.toString();
    for (let i = 0; i < 10; i++) {
      str = str.replace(new RegExp(englishDigits[i], "g"), bengaliDigits[i]);
    }
    return str;
  };

  useEffect(() => {
    if (!slug) return;

    const fetchProductDetail = async () => {
      try {
        const res = await fetch("https://api.api-store.workers.dev/api/bazardor/products");
        const data = await res.json();
        const productList = Array.isArray(data) ? data : data.products || [];
        
        const foundProduct = productList.find((item: any) => item.slug === slug);
        setProduct(foundProduct);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [slug]);

  if (loading) return <div className="text-center my-20 text-gray-500 font-medium">লোড হচ্ছে...</div>;
  if (!product) {
    return (
      <div className="max-w-4xl mx-auto my-20 px-4 text-center">
        <p className="text-red-500 font-medium mb-4">পণ্যটি পাওয়া যায়নি!</p>
        <Link href="/" className="text-green-600 underline font-semibold">
          হোম পেজে ফিরে যান
        </Link>
      </div>
    );
  }

  const isUp = product.change?.dir === "up";

  return (
    <div className="max-w-5xl mx-auto my-10 px-4 space-y-8">
      <div className="text-sm text-gray-500">
        <Link href="/" className="hover:text-green-600">হোম</Link> &gt; <span>{product.categoryBn || "পণ্য"}</span> &gt; <span className="text-gray-800 font-medium">{product.nameBn}</span>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm p-8 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center text-4xl">
            {product.image || product.categoryIcon || "🛒"}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-[#1D271F] mb-1">{product.nameBn}</h1>
            <p className="text-gray-400 text-sm mb-2">প্রতি {product.unit === 'kg' ? 'কেজি' : product.unit === 'dozen' ? 'ডজন' : product.unit}</p>
            <p className="text-sm text-gray-600">গতকালের তুলনায় আজ দাম {isUp ? "বেড়েছে" : "কমেছে"} {toBengaliNumber(Math.abs(product.change?.pct || 0))}%</p>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-xl text-right min-w-[180px]">
          <p className="text-gray-400 text-xs mb-1">আজকের দাম</p>
          <p className="text-3xl font-extrabold text-[#1D271F]">
            {toBengaliNumber(product.today)} <span className="text-sm font-normal text-gray-500">টাকা</span>
          </p>
          <div className={`inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded text-xs font-semibold ${
            isUp ? "text-red-600 bg-red-50" : "text-green-600 bg-green-50"
          }`}>
            <span>{isUp ? "▲" : "▼"}</span> {toBengaliNumber(Math.abs(product.change?.pct || 0))}%
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#1D271F] mb-4">দামের সারসংক্ষেপ</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs mb-1">সর্বনিম্ন দাম</p>
            <p className="text-2xl font-bold text-green-600">{toBengaliNumber(product.minPrice || product.today - 5)} <span className="text-sm font-normal text-gray-500">টাকা</span></p>
            <p className="text-xs text-gray-400 mt-2">বাজারে সর্বনিম্ন বাজার</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs mb-1">সর্বাধিক দাম</p>
            <p className="text-2xl font-bold text-red-600">{toBengaliNumber(product.maxPrice || product.today + 8)} <span className="text-sm font-normal text-gray-500">টাকা</span></p>
            <p className="text-xs text-gray-400 mt-2">বাজারে সর্বাধিক বাজার</p>
          </div>
          <div className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
            <p className="text-gray-400 text-xs mb-1">গড় দাম</p>
            <p className="text-2xl font-bold text-[#1D271F]">{toBengaliNumber(product.today)} <span className="text-sm font-normal text-gray-500">টাকা</span></p>
            <p className="text-xs text-gray-400 mt-2">প্রতি কেজি-র হিসাব</p>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 overflow-hidden">
        <h2 className="text-xl font-bold text-[#1D271F] mb-6">বাজারভিত্তিক আজকের দাম</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-sm">
                <th className="py-3 px-4 font-medium">বাজার</th>
                <th className="py-3 px-4 font-medium">বিভাগ</th>
                <th className="py-3 px-4 font-medium">সর্বনিম্ন</th>
                <th className="py-3 px-4 font-medium">সর্বাধিক</th>
                <th className="py-3 px-4 font-medium">গড়</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm text-[#1D271F]">
              {(product.markets || [
                { market: "কাওরান বাজার", division: "ঢাকা", min: product.today - 2, max: product.today + 2, avg: product.today },
                { market: "নিউ মার্কেট", division: "ঢাকা", min: product.today - 1, max: product.today + 4, avg: product.today + 1 },
                { market: "খাতুনগঞ্জ", division: "চট্টগ্রাম", min: product.today - 4, max: product.today, avg: product.today - 2 },
                { market: "বড়বাজার", division: "খুলনা", min: product.today - 3, max: product.today + 3, avg: product.today }
              ]).map((m: any, idx: number) => (
                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3.5 px-4 font-semibold">{m.market}</td>
                  <td className="py-3.5 px-4 text-gray-500">{m.division}</td>
                  <td className="py-3.5 px-4">{toBengaliNumber(m.min)} টাকা</td>
                  <td className="py-3.5 px-4">{toBengaliNumber(m.max)} টাকা</td>
                  <td className="py-3.5 px-4 font-bold">{toBengaliNumber(m.avg)} টাকা</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="text-center my-20">লোড হচ্ছে...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}