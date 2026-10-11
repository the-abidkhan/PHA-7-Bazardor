"use client";

import { useState } from "react";
import { GoChevronDown } from "react-icons/go";

// বাংলা সংখ্যাকে ইংরেজিতে রূপান্তর করার ফাংশন
const parseBengaliNumber = (str: string) => {
  const bengaliDigits: { [key: string]: string } = {
    '০': '0', '১': '1', '২': '2', '৩': '3', '৪': '4',
    '৫': '5', '৬': '6', '৭': '7', '৮': '8', '৯': '9'
  };
  const englishStr = str.replace(/[০-৯]/g, (w) => bengaliDigits[w]);
  const match = englishStr.match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export default function SortDropdown({ products, setSortedProducts }: any) {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState("ডিফল্ট");

  const handleSort = (type: string) => {
    setSelected(type);
    setIsOpen(false);

    let sorted = [...products];
    if (type === "দাম: কম থেকে বেশি") {
      sorted.sort((a, b) => parseBengaliNumber(a.price) - parseBengaliNumber(b.price));
    } else if (type === "দাম: বেশি থেকে কম") {
      sorted.sort((a, b) => parseBengaliNumber(b.price) - parseBengaliNumber(a.price));
    }
    setSortedProducts(sorted);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-[#1D271F] shadow-sm hover:bg-gray-50"
      >
        <span>সাজান: {selected}</span>
        <GoChevronDown />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-gray-100 z-50 p-1">
          <button onClick={() => handleSort("ডিফল্ট")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
            ডিফল্ট
          </button>
          <button onClick={() => handleSort("দাম: কম থেকে বেশি")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
            দাম: কম থেকে বেশি
          </button>
          <button onClick={() => handleSort("দাম: বেশি থেকে কম")} className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100">
            দাম: বেশি থেকে কম
          </button>
        </div>
      )}
    </div>
  );
}