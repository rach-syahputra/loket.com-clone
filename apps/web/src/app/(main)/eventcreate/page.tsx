"use client";
import React, { useEffect, useRef, useState } from "react";
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
  const [endDate, setEndDate] = useState<Date | null>(null); // +1 day

  const [startTicketDate,setStartTicketDate] =useState<Date | null>(null);
  const [endTicketDate,setEndTicketDate] = useState<Date | null>(null)
  
  // Local state for event time inputs (used in the time modal)
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

  // Helper: add 7 hours to the Date and return a valid ISO-8601 string.
  const toAdjustedISOString = (date: Date): string => {
    const adjustedDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);
    return adjustedDate.toISOString();
  };

  // For testing purposes, we prepopulate all required fields.
  // In production, you might want these fields to be filled via user input.
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
      // Build the eventData and locationData objects
      const eventData = {
        slug: values.title.toLowerCase().trim().replace(/\s+/g, "-"),
        title: values.title,
        description: values.description,
        // The bannerUrl will be replaced on the backend if a file is provided
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
      };
      const locationData = {
        streetAddress: values.streetAddress,
        city: values.city,
        provinceId: Number(values.provinceId),
      };

      // ADDED CODE: Create FormData and append JSON data and file
      const formData = new FormData();
      formData.append("eventData", JSON.stringify(eventData));
      formData.append("locationData", JSON.stringify(locationData));
      if (bannerFile) {
        formData.append("banner", bannerFile);
      }
      // -------------------------------

      console.log("Sending FormData payload");

      try {
        const response = await fetch("http://localhost:8000/api/eventcreate", {
          method: "POST",
          body: formData,
          // Notice that we do NOT set "Content-Type" here; the browser sets it automatically.
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

  // Create a ref for the file input
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState("https://assets.loket.com/images/banner-event.jpg");
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
      // Update state for file to be submitted later
      setBannerFile(file);
      // Generate a temporary URL to preview the image
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
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
          <div className="flex flex-col rounded-[20px] border sm:w-[900px]"           
          >
            <div className="relative z-50 w-[900px] h-[421px] cursor-pointer"  onClick={handleBannerClick}>
            <Image
    src={bannerPreview}
    alt="Banner Preview"
    fill
    className="rounded-t-[20px] md:rounded-t-[70px] lg:rounded-t-[20px] object-cover"
  />
              <div className={`${bannerPreview=="https://assets.loket.com/images/banner-event.jpg"?"block":"hidden"} absolute bottom-[80px] left-[165px] flex flex-col gap-4 sm:bottom-[180px] sm:left-[415px]`}>
                <Image src="/add.png" width={60} height={128} alt="" />
              </div>
              <div className={`${bannerPreview=="https://assets.loket.com/images/banner-event.jpg"?"block":"hidden"} absolute bottom-[50px] left-[100px] flex flex-col gap-4 sm:bottom-[130px] sm:left-[290px]`}>
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
                    <span className="font-light text-black">Andi Farrel Athalla Pasha</span>
                  </div>
                </div>
                {/* Date & Time */}
                <div className="flex flex-col gap-4 sm:ml-[50px]">
                  <span className="hidden text-[14px] font-medium text-black sm:flex">Tanggal & Waktu</span>
                  <div className="flex items-center gap-4" onClick={() => setModalDate(true)}>
                    <Image src="/calendar.png" width={20} height={20} alt="" />
                    {startDate && endDate ? (
                      <div className="flex flex-col gap-2">
                        <span className="font-light text-black">
                          {startDate.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                        <span className="font-light text-black">
                          {endDate.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" })}
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
          {/* Ticket Category */}
          <span className="flex justify-start text-[20px] text-black">Kategori Tiket</span>
          <div>
            <div className="flex flex-col justify-center gap-4 px-[20px] sm:flex-row sm:px-0">
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalTicketPaid(true);
                  setTicketType("PAID");
                  formik.setFieldValue("ticketType", "PAID");
                }}
              >
                <div className="flex h-[90px] w-[400px] items-center justify-between rounded-lg border bg-white p-[20px]">
                  <div className="flex flex-col gap-1 text-black">
                    <span>Buat Tiket</span>
                    <span className="font-semibold">Berbayar</span>
                  </div>
                  <Image className="rounded-t-[20px]" src="/add.png" width={40} height={50} alt="" />
                </div>
              </Link>
              <Link
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setModalTicketFree(true);
                  setTicketType("FREE");
                  formik.setFieldValue("ticketType", "FREE");
                }}
              >
                <div className="flex h-[90px] w-[400px] items-center justify-between rounded-lg border bg-white p-[20px]">
                  <div className="flex flex-col gap-1 text-black">
                    <span>Buat Tiket</span>
                    <span className="font-semibold">Gratis</span>
                  </div>
                  <Image className="rounded-t-[20px]" src="/add.png" width={40} height={50} alt="" />
                </div>
              </Link>
            </div>
          </div>
          {/* Description */}
          <span className="text-[20px] text-black">Deskripsi</span>
          <div className="px-[20px]">
            <textarea
              className="h-[200px] w-screen text-black sm:h-[400px] lg:w-[900px]"
              name="description"
              id="description"
              onBlur={formik.handleBlur}
              onChange={formik.handleChange}
              value={formik.values.description}
            ></textarea>
          </div>

          {/* MODAL for Registration Date */}
          {modalDate && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative h-[300px] w-[300px] rounded-xl bg-white">
                <button
                  type="button"
                  className="absolute right-0 m-[10px] h-[20px] w-[20px]"
                  onClick={() => setModalDate(false)}
                >
                  X
                </button>
                <div className="flex h-full w-full flex-col items-center justify-center p-[20px]">
                  <label>Tanggal Mulai</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date);
                      formik.setFieldValue("eventStartDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                  <label>Tanggal Berakhir</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: Date | null) => {
                      setEndDate(date);
                      formik.setFieldValue("eventEndDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Registration Time */}
          {modalTime && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative w-[300px] rounded-xl bg-white p-4">
                <button
                  type="button"
                  className="absolute right-0 m-[10px] h-[20px] w-[20px]"
                  onClick={() => setModalTime(false)}
                >
                  X
                </button>
                <div className="flex flex-col gap-4">
                  <label htmlFor="eventStartTime">Waktu Mulai</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="eventStartTime"
                      name="eventStartTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="09:00"
                      max="18:00"
                      value={localEventStartTime}
                      onChange={(e) => setLocalEventStartTime(e.target.value)}
                      required
                    />
                  </div>
                  <label htmlFor="eventEndTime">Waktu Berakhir</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="eventEndTime"
                      name="eventEndTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="09:00"
                      max="18:00"
                      value={localEventEndTime}
                      onChange={(e) => setLocalEventEndTime(e.target.value)}
                      required
                    />
                  </div>
                  <button
                    type="button"
                    className="mt-4 rounded-lg bg-blue-500 py-2 text-white"
                    onClick={() => {
                      // Update Formik's time fields from local state
                      formik.setFieldValue("eventStartTime", localEventStartTime);
                      formik.setFieldValue("eventEndTime", localEventEndTime);
                      setModalTime(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Location */}
          {modalLocation && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative h-auto w-[300px] rounded-xl bg-white">
                <button
                  type="button"
                  className="absolute right-0 m-[10px] h-[20px] w-[20px]"
                  onClick={() => {
                    setModalLocation(false);
                    if (formik.values.streetAddress) {
                      setDisplayLocation(formik.values.streetAddress);
                    }
                    if (formik.values.city) {
                      setDisplayCity(formik.values.city);
                    }
                  }}
                >
                  X
                </button>
                <div className="flex flex-col gap-4 p-[20px]">
                  <label>Alamat</label>
                  {formik.touched.streetAddress && formik.errors.streetAddress && (
                    <div className="text-red-500">{formik.errors.streetAddress}</div>
                  )}
                  <input
                    type="text"
                    name="streetAddress"
                    id="streetAddress"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.streetAddress}
                  />
                  <label>Kota</label>
                  {formik.touched.city && formik.errors.city && (
                    <div className="text-red-500">{formik.errors.city}</div>
                  )}
                  <input
                    type="text"
                    name="city"
                    id="city"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.city}
                  />
                  <span>Provinsi</span>
                  <details className="dropdown">
                    <summary className="btn btn-ghost m-0 flex w-full justify-start border bg-white p-2 font-light text-black shadow hover:bg-white">
                      {selectedProvince ? province.find((prov) => prov.id === selectedProvince)?.name : "Pilih Provinsi"}
                    </summary>
                    <ul className="menu dropdown-content rounded-box z-[1] max-h-[230px] w-full overflow-y-auto bg-white p-2 shadow">
                      {province.map((prov) => (
                        <li key={prov.id} className="truncate">
                          <button
                            type="button"
                            className="text-black no-underline"
                            onClick={(e) => {
                              e.preventDefault();
                              setSelectedProvince(prov.id);
                              formik.setFieldValue("provinceId", prov.id);
                            }}
                          >
                            {prov.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </details>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Ticket (Paid) details */}
          {modalTicketPaid && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative h-auto w-[300px] rounded-xl bg-white">
                <button
                  type="button"
                  className="absolute right-0 m-[10px] h-[20px] w-[20px]"
                  onClick={() => {
                    setModalTicketPaid(false);
                    if (startTicketDate && startTime) {
                      const combinedStart = combineDateAndTime(startTicketDate, startTime);
                      formik.setFieldValue("registrationStartDate", toAdjustedISOString(combinedStart));
                    }
                    if (endTicketDate && endTime) {
                      const combinedEnd = combineDateAndTime(endTicketDate, endTime);
                      formik.setFieldValue("registrationEndDate", toAdjustedISOString(combinedEnd));
                    }
                  }}
                    
                >
                  X
                </button>
                <div className="flex flex-col gap-4 p-[20px]">
                  <label>Jumlah Tiket</label>
                  {formik.touched.availableSeats && formik.errors.availableSeats && (
                    <div className="text-red-500">{formik.errors.availableSeats}</div>
                  )}
                  <input
                    type="number"
                    name="availableSeats"
                    id="availableSeats"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.availableSeats}
                  />
                  <label>Harga</label>
                  {formik.touched.price && formik.errors.price && (
                    <div className="text-red-500">{formik.errors.price}</div>
                  )}
                  <input
                    type="number"
                    name="price"
                    id="price"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.price}
                  />
                  <label>Tanggal Mulai</label>
                  {/* <DatePicker
                    id="registrationStartDate"
                    name="registrationStartDate"
                    selected={startDate}
                    onChange={(date: Date | null) => {
                      setStartDate(date);
                      formik.setFieldValue("registrationStartDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  /> */}
                    <DatePicker
                    selected={startTicketDate}
                    onChange={(date: Date | null) => {
                      setStartTicketDate(date);
                      if (date && startTime) {
                        const combined = combineDateAndTime(date, startTime);
                        formik.setFieldValue("registrationStartDate", toAdjustedISOString(combined));
                      }
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                  <label htmlFor="">Waktu Mulai</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="registrationStartTime"
                      name="registrationStartTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="09:00"
                      max="18:00"
                      value={startTime}
                      onChange={(e) => {
                        setStartTime(e.target.value);
                        if (startDate) {
                          const combined = combineDateAndTime(startDate, e.target.value);
                          formik.setFieldValue("registrationStartDate", toAdjustedISOString(combined));
                        }
                      }}
                      required
                    />
                  </div>
                  <label>Tanggal Berakhir</label>
                  {/* <DatePicker
                    id="registrationEndDate"
                    name="registrationEndDate"
                    selected={endDate}
                    onChange={(date: Date | null) => {
                      setEndDate(date);
                      formik.setFieldValue("registrationEndDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  /> */}
                  
                  <DatePicker
                    selected={endTicketDate}
                    onChange={(date: Date | null) => {
                      setEndTicketDate(date);
                      if (date && endTime) {
                        const combined = combineDateAndTime(date, endTime);
                        formik.setFieldValue("registrationEndDate", toAdjustedISOString(combined));
                      }
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                  <label htmlFor="">Waktu Berakhir</label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 end-0 flex items-center pe-3.5">
                      <svg
                        className="h-4 w-4 text-gray-500"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm11-4a1 1 0 1 0-2 0v4a1 1 0 0 0 .293.707l3 3a1 1 0 0 0 1.414-1.414L13 11.586V8Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <input
                      type="time"
                      id="registrationEndTime"
                      name="registrationEndTime"
                      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500"
                      min="09:00"
                      max="18:00"
                      value={endTime}
                      onChange={(e) => {
                        setEndTime(e.target.value);
                        if (endDate) {
                          const combined = combineDateAndTime(endDate, e.target.value);
                          formik.setFieldValue("registrationEndDate", toAdjustedISOString(combined));
                        }
                      }}
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MODAL for Ticket (Free) details */}
          {modalTicketFree && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
              <div className="relative h-auto w-[300px] rounded-xl bg-white">
                <button
                  type="button"
                  className="absolute right-0 m-[10px] h-[20px] w-[20px]"
                  onClick={() => setModalTicketFree(false)}
                >
                  X
                </button>
                <div className="flex flex-col gap-4 p-[20px]">
                  <label>Jumlah Tiket</label>
                  {formik.touched.availableSeats && formik.errors.availableSeats && (
                    <div className="text-red-500">{formik.errors.availableSeats}</div>
                  )}
                  <input
                    type="number"
                    name="availableSeats"
                    id="availableSeats"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    value={formik.values.availableSeats}
                  />
                  <label>Tanggal Mulai</label>
                  <DatePicker
                    id="eventStartDate"
                    name="eventStartDate"
                    selected={startEventDate}
                    onChange={(date: Date | null) => {
                      setStartEventDate(date);
                      formik.setFieldValue("eventStartDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                  <label>Tanggal Berakhir</label>
                  <DatePicker
                    id="eventEndDate"
                    name="eventEndDate"
                    selected={endEventDate}
                    onChange={(date: Date | null) => {
                      setEndEventDate(date);
                      formik.setFieldValue("eventEndDate", date ? toAdjustedISOString(date) : "");
                    }}
                    className="w-full rounded border p-2"
                    placeholderText="Select a date"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer with submit button */}
          <div className="fixed bottom-0 h-[70px] w-full border-t bg-white px-[20px] py-[15px] md:px-[80px] lg:px-[100px] ">
            <div className="flex items-center justify-between">
              <p className="hidden text-[14px] text-black md:block">
                <span className="text-[24px] font-semibold text-black">Yeay!</span> Tinggal Selangkah lagi dan event kamu berhasil dibuat.
              </p>
              <button className="h-[39px] rounded-lg bg-[#0049CC] font-bold text-white md:w-[190px] lg:w-[190px]" type="submit">
                Buat Event Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
