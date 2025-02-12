"use client";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function Transaction() {
    const { data: session } = useSession();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [id, setId] = useState(0);
    const [paymentProof, setPaymentProof] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setEmail(session.user.email || '');
            setId(session.user.id);
        }
    }, [session]);

    const searchParams = useSearchParams();
    const eventId = searchParams.get("id");
    const title = searchParams.get("title") || "Event";
    const price = parseInt(searchParams.get("price") || "0");
    const quantity = parseInt(searchParams.get("quantity") || "1");
    const location = searchParams.get("location") || "Unknown Location";
    const totalPrice = price * quantity;

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            const file = event.target.files[0];
            setPaymentProof(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleBuyTicket = async () => {
        try {
            const formData = new FormData();
            formData.append("userId", id.toString());
            formData.append("eventId", eventId || "");
            formData.append("transactionStatus", "WAITING_FOR_PAYMENT");
            formData.append("totalPrice", totalPrice.toString());
            if (paymentProof) {
                formData.append("paymentProofImage", paymentProof);
            }

            const res = await fetch("http://localhost:8000/api/transactions", {
                method: 'POST',
                body: formData
            });

            const data = await res.json();
            alert("Transaction created successfully!");
            console.log("Server response:", data);
        } catch (error) {
            console.error("Error creating transaction:", error);
        }
    };

    return (
        <div className="bg-white w-full h-full">
            <div className="flex lg:gap-[50px] lg:p-[100px] p-[20px]">
                <div className="flex flex-col gap-4 text-black w-full">
                    <span className="text-[21px] font-bold">Detail Pemesanan</span>
                    <div className="border rounded-lg p-[20px] flex flex-col gap-4 w-full ">
                        <div className="flex gap-4">
                            <Image className="rounded-lg hidden lg:block" src="https://assets.loket.com/neo/production/images/banner/VGSBz_1733741307486312.jpeg" width={260} height={122} alt="" />
                            <div className="flex flex-col gap-4">
                                <span>{title}</span>
                                <div className="flex gap-4">
                                    <Image src="/location.png" width={20} height={20} alt="" />
                                    <span>{location}</span>
                                </div>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>Jenis Tiket</span>
                            <div className="flex gap-[50px]">
                                <span>Harga</span>
                                <span>Jumlah</span>
                            </div>
                        </div>
                        <hr />
                        <div className="flex justify-between">
                            <span>{title}</span>
                            <div className="flex gap-[50px]">
                                <span>{`Rp ${price.toLocaleString()}`}</span>
                                <span>{`x${quantity}`}</span>
                            </div>
                        </div>
                    </div>
                    <span className="text-[21px] font-bold">Pembayaran</span>
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-36 lg:h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-100">
                            {preview ? (
                                <Image src={preview} alt="Payment Proof Preview" width={250} height={180} className="rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                                    </svg>
                                    <p className="mb-2 text-sm text-black"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                                </div>
                            )}
                            <input id="dropzone-file" type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
