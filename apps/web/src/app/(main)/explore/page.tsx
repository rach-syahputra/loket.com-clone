"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CardExplore } from "@/components/cards";
// Province & Category interfaces for the filter lists
interface Province {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

// TicketType can be "FREE" or "PAID"; for state, allow null for "none selected"
type TicketType = "FREE" | "PAID" | null;

export default function Explore() {
  const [province, setProvince] = useState<Province[]>([]);
  const [category, setCategory] = useState<Category[]>([]);

  // States to track what the user selected
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>(null);

  // Fetch available provinces and categories for the filter lists
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1) Categories
        const categoryResponse = await fetch("http://localhost:8000/api/categories");
        const categoryData = await categoryResponse.json();
        if (categoryData.data) {
          setCategory(categoryData.data);
        }

        // 2) Provinces
        const provinceResponse = await fetch("http://localhost:8000/api/provinces");
        const provinceData = await provinceResponse.json();
        if (provinceData.data) {
          setProvince(provinceData.data);
        }
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-full h-full bg-white p-[20px] sm:p-0">
      <div className="sm:flex block gap-4">

        {/* ====================== */}
        {/*    FILTER SIDEBAR     */}
        {/* ====================== */}
        <div className="sm:block hidden bg-white border w-[300px] min-h-[100%] sticky top-0 p-[50px] md:p-[20px] relative z-20">
          <span className="text-[20px] text-black font-bold">Filter</span>
          <hr />
          <div className="w-full">
            {/* Lokasi (Province) */}
            <details className="collapse rounded-box">
              <summary className="collapse-title text-lg font-medium text-black">
                Lokasi
              </summary>
              <div className="collapse-content">
                <div className="text-black flex flex-col gap-4">
                  {province.length > 0 &&
                    province.map((prov) => (
                      <button
                        key={prov.id}
                        className={`text-black no-underline text-left p-1 ${
                          selectedProvinceId === prov.id ? "bg-gray-300" : ""
                        }`}
                        onClick={() => {
                          // Toggle logic: if the user clicks the same item again, unselect it
                          setSelectedProvinceId(
                            selectedProvinceId === prov.id ? null : prov.id
                          );
                        }}
                      >
                        {prov.name}
                      </button>
                    ))}
                </div>
              </div>
            </details>

            {/* Kategori (Category) */}
            <details className="collapse mt-2">
              <summary className="collapse-title text-lg font-medium text-black">
                Kategori
              </summary>
              <div className="collapse-content">
                <div className="text-black flex flex-col gap-4">
                  {category.length > 0 &&
                    category.map((cat) => (
                      <button
                        key={cat.id}
                        className={`text-black no-underline text-left p-1 ${
                          selectedCategoryId === cat.id ? "bg-gray-300" : ""
                        }`}
                        onClick={() => {
                          setSelectedCategoryId(
                            selectedCategoryId === cat.id ? null : cat.id
                          );
                        }}
                      >
                        {cat.name}
                      </button>
                    ))}
                </div>
              </div>
            </details>

            {/* Tipe Tiket (TicketType) */}
            <details className="collapse mt-2">
              <summary className="collapse-title text-lg font-medium text-black">
                Tipe Tiket
              </summary>
              <div className="collapse-content">
                <div className="text-black flex flex-col gap-4">
                  {/* Paid */}
                  <button
                    className={`text-left p-1 ${
                      selectedTicketType === "PAID" ? "bg-gray-300" : ""
                    }`}
                    onClick={() => {
                      setSelectedTicketType(
                        selectedTicketType === "PAID" ? null : "PAID"
                      );
                    }}
                  >
                    Berbayar
                  </button>
                  {/* Free */}
                  <button
                    className={`text-left p-1 ${
                      selectedTicketType === "FREE" ? "bg-gray-300" : ""
                    }`}
                    onClick={() => {
                      setSelectedTicketType(
                        selectedTicketType === "FREE" ? null : "FREE"
                      );
                    }}
                  >
                    Gratis
                  </button>
                </div>
              </div>
            </details>
          </div>
        </div>

        {/* ====================== */}
        {/*    MAIN CONTENT        */}
        {/* ====================== */}
        <div className="flex flex-col gap-4 w-full">
          {/* Some top bar with sort button, etc. (optional) */}
          <div className="w-full sm:p-[20px]">
            <div className="flex sm:justify-end justify-between gap-2">
              {/* Mobile filter button */}
              <button
                tabIndex={0}
                className="sm:hidden p-2 border rounded-lg w-[200px] h-[36px] text-black text-center"
              >
                Filter
              </button>

              {/* Sorting button (placeholder) */}
              <button
                id="dropdownHoverButton"
                data-dropdown-toggle="dropdownHover"
                data-dropdown-trigger="hover"
                className="p-2 border rounded-lg w-[200px] h-[36px] text-black text-center bg-white"
                type="button"
              >
                Urutkan
                <svg
                  className="w-2.5 h-2.5 ms-3 inline"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>

              {/* Example dropdown (hidden by default) */}
              <div
                id=" dropdownHover"
                className="z-50 hidden bg-white divide-y divide-gray-100 rounded-lg shadow-sm w-44"
              >
                <ul
                  className="py-2 text-sm text-gray-700"
                  aria-labelledby="dropdownHoverButton"
                >
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Settings
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Earnings
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-4 py-2 hover:bg-gray-100">
                      Sign out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 
             Pass our chosen filters to <CardExplore>, 
             which will fetch and display the filtered events.
          */}
          <CardExplore
            selectedProvinceId={selectedProvinceId}
            selectedCategoryId={selectedCategoryId}
            selectedTicketType={selectedTicketType}
          />
        </div>
      </div>
    </div>
  );
}
