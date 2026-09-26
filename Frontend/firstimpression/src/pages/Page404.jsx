import React from "react";
import { useNavigate } from "react-router-dom";
import notFoundImage from "../Assets/images/page_404.png";

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-white flex  justify-center px-5 ">
      <div className="w-full max-w-5xl flex flex-col items-center text-center">
        {/* 404 Illustration */}
        <img
          src={notFoundImage}
          alt="404 - Page Not Found"
          className="w-full max-w-[850px] max-h-[620px] object-contain"
        />

        {/* Content */}
        <div className="-mt-6 relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold text-[#202337] tracking-tight">
            Oops! Page Not Found
          </h1>

          <p className="mt-3 mb-6 text-sm md:text-base text-[#77798A] leading-relaxed">
            Looks like this page got lost somewhere.
            <br />
            Let's get you back to building your perfect resume.
          </p>

          {/* Home Button */}
          <button
            onClick={() => navigate("/")}
            className="
              inline-flex items-center justify-center gap-2
              px-7 py-3
              rounded-xl
              bg-[#C9037A]
              text-white
              text-sm font-semibold
              shadow-md shadow-[#C9037A]/20
              transition-all duration-200
              hover:bg-[#A90267]
              hover:-translate-y-0.5
              hover:shadow-lg hover:shadow-[#C9037A]/30
              active:translate-y-0
            ">
            <span className="text-lg leading-none">←</span>
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page404;
