"use client";
import { useEffect, useState } from "react";
import { CardExplore } from "@/components/cards";

interface Province {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

type TicketType = "FREE" | "PAID" | null;

export default function Explore() {
  const [province, setProvince] = useState<Province[]>([]);
  const [category, setCategory] = useState<Category[]>([]);

  const [selectedProvinceId, setSelectedProvinceId] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType>(null);

  const [filterTabActive, setFilterTabActive] = useState(false);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (filterTabActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [filterTabActive]);
  const cleanFilters = () => {
    setSelectedProvinceId(null);
    setSelectedCategoryId(null);
    setSelectedTicketType(null);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch("http://localhost:8000/api/categories");
        const categoryData = await categoryResponse.json();
        if (categoryData.data) {
          setCategory(categoryData.data);
        }

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

  // Use tabIndex and collapse-arrow to ensure the dropdown (details) is interactive in desktop view
  const filterContent = (
    <div className="w-full ">
      {/* Lokasi (Province) */}
      <details tabIndex={0} className="collapse collapse-arrow rounded-box z-50">
        <summary className="collapse-title text-lg font-medium text-black">
          Lokasi
        </summary>
        <div className="collapse-content max-h-[300px] overflow-y-auto">
          <div className="text-black flex flex-col gap-4">
            {province.length > 0 &&
              province.map((prov) => (
                <button
                  key={prov.id}
                  className={`text-black no-underline text-left p-1 ${
                    selectedProvinceId === prov.id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setSelectedProvinceId(selectedProvinceId === prov.id ? null : prov.id);
                  }}
                >
                  {prov.name}
                </button>
              ))}
          </div>
        </div>
      </details>

      {/* Kategori (Category) */}
      <details tabIndex={0} className="collapse collapse-arrow mt-2 rounded-box">
        <summary className="collapse-title text-lg font-medium text-black">
          Kategori
        </summary>
        <div className="collapse-content max-h-[300px] overflow-y-auto">
          <div className="text-black flex flex-col gap-4">
            {category.length > 0 &&
              category.map((cat) => (
                <button
                  key={cat.id}
                  className={`text-black no-underline text-left p-1 ${
                    selectedCategoryId === cat.id ? "bg-gray-300" : ""
                  }`}
                  onClick={() => {
                    setSelectedCategoryId(selectedCategoryId === cat.id ? null : cat.id);
                  }}
                >
                  {cat.name}
                </button>
              ))}
          </div>
        </div>
      </details>

      {/* Tipe Tiket (TicketType) */}
      <details tabIndex={0} className="collapse collapse-arrow mt-2 rounded-box">
        <summary className="collapse-title text-lg font-medium text-black">
          Tipe Tiket
        </summary>
        <div className="collapse-content max-h-[200px] overflow-y-auto">
          <div className="text-black flex flex-col gap-4">
            <button
              className={`text-left p-1 ${selectedTicketType === "PAID" ? "bg-gray-300" : ""}`}
              onClick={() => {
                setSelectedTicketType(selectedTicketType === "PAID" ? null : "PAID");
              }}
            >
              Berbayar
            </button>
            <button
              className={`text-left p-1 ${selectedTicketType === "FREE" ? "bg-gray-300" : ""}`}
              onClick={() => {
                setSelectedTicketType(selectedTicketType === "FREE" ? null : "FREE");
              }}
            >
              Gratis
            </button>
          </div>
        </div>
      </details>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-white p-[20px] sm:p-0">
      <div className="sm:flex block gap-4 sm:gap-0">
        {/* Desktop Filter Panel */}
        <div className="sm:block hidden bg-white border lg:w-[300px] sm:w-[230px] min-h-[100%] sticky top-0 p-[50px] md:p-[20px] relative z-[9999]">
          <span className="text-[20px] text-black font-bold">Filter</span>
          <hr />
          {filterContent}
          <button className="border rounded p-2 w-full text-black" onClick={() => cleanFilters()}>
                    Bersihkan Filters
                  </button>
        </div>

        <div className="flex flex-col gap-4 w-full">
          {/* Mobile Filter Button */}
          <div className="px-[20px] z-30">
            <button
              tabIndex={0}
              className="sm:hidden p-2 border rounded-lg w-full h-[36px] text-black text-center"
              onClick={() => setFilterTabActive(true)}
            >
              Filter
            </button>
          </div>

          <CardExplore
            selectedProvinceId={selectedProvinceId}
            selectedCategoryId={selectedCategoryId}
            selectedTicketType={selectedTicketType}
          />

          {/* Mobile Filter Modal */}
          {filterTabActive && (
            <div className="fixed inset-0 bg-white w-full h-full flex flex-col justify-center items-center z-[9999]">
              <div className="w-full px-4 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-bold">Filter</span>
                  <button onClick={() => setFilterTabActive(false)} className="text-black">
                    Close
                  </button>
                </div>
                {filterContent}
                <div className="mt-4 px-4 flex flex-col gap-4">
                  <button className="border rounded p-2 w-full text-black" onClick={() => setFilterTabActive(false)}>
                    Terapkan Filters
                  </button>
                  <button className="border rounded p-2 w-full text-black" onClick={() => cleanFilters()}>
                    Bersihkan Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
