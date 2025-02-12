"use client";
import React, { useEffect, useState, useRef } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import Link from "next/link";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-time-picker/dist/TimePicker.css";

export default function CreateEvent() {
  // Define interfaces for data
  interface Category {
    id: number;
    name: string;
  }
  interface Province {
    id: number;
    name: string;
  }

  // Local state variables for modals
  const [modalDate, setModalDate] = useState(false);
  const [modalTime, setModalTime] = useState(false);
  const [modalLocation, setModalLocation] = useState(false);
  const [modalTicketPaid, setModalTicketPaid] = useState(false);
  const [modalTicketFree, setModalTicketFree] = useState(false);

  // For registration dates
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [startTicketDate, setStartTicketDate] = useState<Date | null>(null);
  const [endTicketDate, setEndTicketDate] = useState<Date | null>(null);
  
  // For event time inputs
  const [localEventStartTime, setLocalEventStartTime] = useState("09:00");
  const [localEventEndTime, setLocalEventEndTime] = useState("18:00");
  const [startTime, setStartTime] = useState<string>("09:00");
  const [endTime, setEndTime] = useState<string>("18:00");

  // For event (ticket) dates
  const [startEventDate, setStartEventDate] = useState<Date | null>(null);
  const [endEventDate, setEndEventDate] = useState<Date | null>(null);

  // For location display (in modalLocation)
  const [displayLocation, setDisplayLocation] = useState("Pilih Lokasi");
  const [displayCity, setDisplayCity] = useState("");

  // For dropdowns
  const [category, setCategory] = useState<Category[]>([]);
  const [province, setProvince] = useState<Province[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);

  // For ticket type (PAID / FREE)
  const [ticketType, setTicketType] = useState("");

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Function to trigger the file explorer
  const handleBannerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      console.log("Selected file:", file);
      // Optionally update state to preview or upload the file.
    }
  };

  // Helper: add 7 hours to the Date and return a valid ISO-8601 string.
  const toAdjustedISOString = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return adjustedDate.toISOString();
  };

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      registrationStartDate: toAdjustedISOString(new Date()),
      registrationEndDate: toAdjustedISOString(new Date(Date.now() + 86400000)),
      eventStartDate: toAdjustedISOString(new Date()),
      eventEndDate: toAdjustedISOString(new Date(Date.now() + 86400000)),
      eventStartTime: "09:00",
      eventEndTime: "18:00",
      price: 0,
      availableSeats: 0,
      categoryId: 1,
      ticketType: "PAID",
      organizerId: 20,
      streetAddress: "",
      city: "",
      provinceId: 0,
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Title is required"),
      description: Yup.string().required("Description is required"),
      registrationStartDate: Yup.string().required("Registration Start Date is required"),
      registrationEndDate: Yup.string().required("Registration End Date is required"),
      eventStartDate: Yup.string().required("Event Start Date is required"),
      eventEndDate: Yup.string().required("Event End Date is required"),
      eventStartTime: Yup.string().required("Waktu mulai wajib diisi"),
      eventEndTime: Yup.string().required("Waktu berakhir wajib diisi"),
      price: Yup.number().min(0, "Price must be at least 0").required("Price is required"),
      availableSeats: Yup.number().min(0, "Available Seats must be at least 0").required("Available Seats is required"),
      categoryId: Yup.number().required("Category ID is required"),
      ticketType: Yup.string().oneOf(["PAID", "FREE"]).required("Ticket Type is required"),
      organizerId: Yup.number().required("Organizer ID is required"),
      streetAddress: Yup.string().required("Street Address is required"),
      city: Yup.string().required("City is required"),
      provinceId: Yup.number().required("Province ID is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      const payload = {
        eventData: {
          slug: values.title.toLowerCase().trim().replace(/\s+/g, "-"),
          title: values.title,
          description: values.description,
          bannerUrl: "https://example.com/banner.jpg",
          registrationStartDate: values.registrationStartDate,
          registrationEndDate: values.registrationEndDate,
          eventStartDate: values.eventStartDate,
          eventEndDate: values.eventEndDate,
          eventStartTime: values.eventStartTime,
          eventEndTime: values.eventEndTime,
          price: Number(values.price),
          availableSeats: Number(values.availableSeats),
          categoryId: Number(values.categoryId),
          ticketType: values.ticketType,
          organizerId: Number(values.organizerId),
        },
        locationData: {
          streetAddress: values.streetAddress,
          city: values.city,
          provinceId: Number(values.provinceId),
        },
      };

      console.log("Sending payload:", JSON.stringify(payload, null, 2));

      try {
        const response = await fetch("http://localhost:8000/api/eventcreate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Event Created Successfully:", data);
          alert("Event Created Successfully");
          resetForm();
        } else {
          const errorData = await response.json();
          console.error("Error Creating Event:", errorData);
          alert("Error Creating Event");
        }
      } catch (error) {
        console.error("Network Error:", error);
        alert("A Network Error Occurred, Please Try Again");
      }
    },
  });

  const combineDateAndTime = (date: Date, time: string): Date => {
    const [hours, minutes] = time.split(":").map(Number);
    const combined = new Date(date);
    combined.setHours(hours, minutes, 0, 0);
    return combined;
  };

  // Fetch categories and provinces on mount.
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

  return (
    <form onSubmit={formik.handleSubmit}>
      {/* Hidden file input for banner upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: "none" }}
      />
      <div className="h-full w-full bg-white py-[100px]">
        <div className="flex flex-col items-center justify-center gap-[50px]">
          {/* Banner Section */}
          <div
            onClick={handleBannerClick}
            className="cursor-pointer flex flex-col rounded-[20px] border sm:w-[900px]"
          >
            <div className="relative">
              <Image
                className="rounded-t-[20px] md:rounded-t-[70px] lg:rounded-t-[20px]"
                src="https://assets.loket.com/images/banner-event.jpg"
                width={900}
                height={421}
                alt=""
              />
              <div className="absolute bottom-[80px] left-[165px] flex flex-col gap-4 sm:bottom-[180px] sm:left-[415px]">
                <Image src="/add.png" width={60} height={128} alt="" />
              </div>
              <div className="absolute bottom-[50px] left-[100px] flex flex-col gap-4 sm:bottom-[130px] sm:left-[290px]">
                <span className="text-[13px] sm:text-[24px]">Unggah gambar/poster/banner</span>
              </div>
            </div>
            {/* Event Details */}
            <div className="flex flex-col gap-4 p-[20px] sm:p-[50px]">
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500">{formik.errors.title}</div>
              )}
              <input
                type="text"
                className="border-none p-0 text-[24px] focus:outline-none focus:ring-0 z-50"
                placeholder="Nama Event*"
                name="title"
                id="title"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                value={formik.values.title}
              />
              <details className="dropdown z-50">
                <summary className="btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-[#ADBAD1] hover:bg-white">
                  {selectedCategory
                    ? category.find((cat) => cat.id === selectedCategory)?.name
                    : "Pilih Kategori*"}
                </summary>
                <ul className="menu dropdown-content rounded-box z-[1] w-full bg-white p-2 shadow">
                  {category.map((cat) => (
                    <li key={cat.id}>
                      <button
                        type="button"
                        className="text-black no-underline"
                        onClick={() => {
                          setSelectedCategory(cat.id);
                          formik.setFieldValue("categoryId", cat.id);
                        }}
                      >
                        {cat.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </details>
              <hr />
              <div className="flex flex-col gap-2 sm:grid sm:grid-cols-3">
                {/* Organizer Info */}
                <div className="hidden flex-col gap-4 sm:flex">
                  <span className="hidden text-[14px] font-medium text-black sm:flex">
                    Diselenggarakan Oleh
                  </span>
                  <div className="flex items-center gap-4">
                    <div className="h-[58px] w-[58px] overflow-hidden rounded-full border">
                      <Image
                        src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                        width={58}
                        height={58}
                        alt=""
                      />
                    </div>
                    <span className="font-light text-black">
                      Andi Farrel Athalla Pasha
                    </span>
                  </div>
                </div>
                {/* Date & Time */}
                <div className="flex flex-col gap-4 sm:ml-[50px]">
                  <span className="hidden text-[14px] font-medium text-black sm:flex">
                    Tanggal & Waktu
                  </span>
                  <div className="flex items-center gap-4" onClick={() => setModalDate(true)}>
                    <Image src="/calendar.png" width={20} height={20} alt="" />
                    {startDate && endDate ? (
                      <div className="flex flex-col gap-2">
                        <span className="font-light text-black">
                          {startDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                        <span className="font-light text-black">
                          {endDate.toLocaleDateString("en-US", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[#ADBAD1]">Pilih Tanggal</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4" onClick={() => setModalTime(true)}>
                    <Image src="/clock.png" width={20} height={20} alt="" />
                    {formik.values.eventStartTime && formik.values.eventEndTime ? (
                      <div className="flex gap-2">
                        <span className="font-light text-[#ADBAD1]">
                          {`${formik.values.eventStartTime} - ${formik.values.eventEndTime}`}
                        </span>
                      </div>
                    ) : (
                      <span className="font-light text-[#ADBAD1]">Pilih Waktu</span>
                    )}
                  </div>
                </div>
                {/* Location */}
                <div className="flex flex-col gap-4 sm:ml-[20px]">
                  <span className="hidden text-[14px] font-medium text-black sm:flex">Lokasi</span>
                  <div className="flex items-center gap-4" onClick={() => setModalLocation(true)}>
                    <Image src="/calendar.png" width={20} height={20} alt="" />
                    <span className="font-light text-[#ADBAD1]">
                      {displayLocation === "Pilih Lokasi" ? displayLocation : `${displayLocation}, ${displayCity}`}
                    </span>
                  </div>
                </div>
                {/* Organizer (Mobile) */}
                <div className="mt-[5px] flex flex-col gap-4 sm:hidden">
                  <span className="hidden text-[14px] font-medium text-black sm:flex">Diselenggarakan Oleh</span>
                  <div className="flex items-center gap-4">
                    <div className="h-[58px] w-[58px] overflow-hidden rounded-full border">
                      <Image
                        src="https://assets.loket.com/neo/production/images/organization/20241209131322_67568a8253c48.png"
                        width={58}
                        height={58}
                        alt=""
                      />
                    </div>
                    <span className="font-light text-black">Andi Farrel Athalla Pasha</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ... Rest of the form remains unchanged ... */}
        </div>
      </div>
    </form>
  );
}
