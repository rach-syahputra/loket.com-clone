export default function Review() {
    return (
        <div className="bg-white w-full min-h-screen flex justify-center items-center md:p-[20px]">
            <div className="bg-white md:w-[1170px] w-[374px] h-auto border rounded-lg flex flex-col">
                <div className="p-[15px] bg-white flex justify-between text-black">
                    <span>
                        Booking ID 1028049108
                    </span>
                    <span>
                        RM 878.35
                    </span>
                </div>
                <div className="bg-[#F2F3F3] p-[15px] text-black">
                    <span>FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023</span>
                </div>
                <div className="flex flex-col gap-4 p-[15px]">
                    <div className="bg-[#05A569] p-[10px] rounded-full w-[170px] flex justify-center items-center">
                        <span>Events Done</span>
                    </div>
                    <div className="rating">
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" defaultChecked />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                        <input type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" />
                    </div>
                    <textarea className="h-[170px] text-black" name="" id="" ></textarea>
                </div>
            </div>
        </div>
    )
}
