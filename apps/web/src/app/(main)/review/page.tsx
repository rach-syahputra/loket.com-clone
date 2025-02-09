"use client";
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function Review() {
  const formik = useFormik({
    initialValues: {
      content: '',
      rating: 0,
      user_id:20,
      event_id:14
    },
    validationSchema: Yup.object({
      content: Yup.string().required('Deskripsi Wajib Diisi'),
      rating: Yup.number().min(1).required('Rating Wajib DiisiQ'),
    }),
    onSubmit: async (values,{ resetForm }) => {
      console.log('form submitted', values);
      const payload = {
            userId:values.user_id,
            eventId:values.event_id,
            content:values.content,
            rating:values.rating

        }
        
      
      try {
        const response = await fetch('http://localhost:8000/api/review',{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify(payload)
            
           
        })

        if (response.ok) {
            const data = await response.json();
            console.log("Review Created Successfully:", data);
            alert("Review Created Successfully");
            resetForm();
          } else {
            const errorData = await response.json();
            console.error("Error Creating Review:", errorData);
            alert("Error Creating Review");
          }
      } catch (error) {
        console.error("Network Error:", error);
        alert("A Network Error Occurred, Please Try Again");
      }
    },
  });

  return (
  <form action="" onSubmit={formik.handleSubmit}>
      <div className="flex min-h-screen w-full items-center justify-center bg-white md:p-[20px]">
      <div className="flex h-auto w-[374px] flex-col rounded-lg border bg-white md:w-[1170px]">
        <div className="flex justify-between bg-white p-[15px] text-black">
          <span>Booking ID 1028049108</span>
          <span>RM 878.35</span>
        </div>
        <div className="bg-[#F2F3F3] p-[15px] text-black">
          <span>FORMULA 1 SINGAPORE AIRLINES SINGAPORE GRAND PRIX 2023</span>
        </div>
        <div className="flex flex-col gap-4 p-[15px]">
          <div className="z-50 flex w-[170px] items-center justify-center rounded-full bg-[#05A569] p-[10px]">
            <span className="text-white">Events Done</span>
          </div>
          {formik.touched.rating && formik.errors.rating ? (
            <div>{formik.errors.rating}</div>
          ) : null}
          <div className="rating pointer-events-auto z-50">
            {[1, 2, 3, 4, 5].map((value) => (
              <input
                key={value}
                type="radio"
                name="rating"
                value={value}
                // Apply dynamic classes based on whether the star is within the current rating.
                className={`mask mask-star-2 cursor-pointer ${
                  formik.values.rating >= value ? 'bg-orange-400' : 'bg-gray-300'
                }`}
                checked={formik.values.rating === value}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            ))}
          </div>
          {formik.touched.content && formik.errors.content ? (
            <div>{formik.errors.content}</div>
          ) : null}
          <textarea
            value={formik.values.content}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            name="content"
            id="content"
            className="pointer-events-auto z-50 h-[170px] text-black"
          ></textarea>
           <button className="h-[39px] rounded-lg bg-[#0049CC] font-bold text-white md:w-[190px] lg:w-[190px] pointer-events-auto z-50" type="submit">
                Buat Review
              </button>
        </div>
      </div>
    </div>
  </form>
  );
}
