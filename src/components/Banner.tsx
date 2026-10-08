"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const BannerPage = () => {
  const [date, setDate] = useState("");

  useEffect(() => {
    const currentDate = new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });
    setDate(currentDate);
  }, []);

  return (
    <div className="max-w-6xl mx-auto bg-white border border-gray-100 shadow-sm rounded-3xl p-8 my-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <div className="flex">
            <h3 className="text-[#05893E] font-bold px-3 py-1 bg-[#05893e15] rounded-full text-sm">
              {date}
            </h3>
          </div>
          <h2 className="text-[#1D271F] font-bold text-3xl md:text-4xl py-3">
            আজকের বাজারের দাম এক নজরে
          </h2>
          <p className="text-[#1D271F]/70 pb-6 text-sm md:text-base leading-relaxed">
            চাল, ডাল, তেল, সবজি, মাছ, মাংস, ডিম ও মসলার দাম — বাজারভিত্তিক
            বিস্তারিত, গড়, সর্বনিম্ন-<br />সর্বাধিক এবং দামের পরিবর্তন এক জায়গায়।
          </p>
          <Link href={"/products"}>
            <button className="bg-[#05893E] text-white font-medium px-6 py-2.5 rounded-xl shadow-md hover:bg-[#047533] transition-all">
              সব পণ্য দেখুন
            </button>
          </Link>
        </div>

        <div className="shrink-0">
          <Image
            width={280}
            height={280}
            src={"/bazar-hero.png"}
            alt="bannerLogo"
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default BannerPage;