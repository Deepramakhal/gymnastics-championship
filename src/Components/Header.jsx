import React from "react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  const handleLogoClick = () =>{
    localStorage.removeItem("admin_token_secret21122025");
    navigate("/");
  }
  return (
    <header className="w-full bg-white border-b-2 border-gray-600">
      <div className="max-w-7xl mx-auto flex items-center px-3 py-2">

        {/* Logo */}
        <div className="shrink-0 w-20 sm:w-24 md:w-28">
          <img
            src={logo}
            alt="HDGA Logo"
            onClick={handleLogoClick}
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Text Section */}
        <div
          className="
            flex-1
            flex
            flex-col
            justify-center
            text-left
            sm:text-left
            md:text-center
            px-2
          "
        >
          {/* Main Line */}
          <h1 className="text-xl font-serif sm:text-lg md:text-xl font-bold text-gray-900">
            {import.meta.env.VITE_MAIN_HEAD}
          </h1>
          {/* 
          <p className="text-xs sm:text-sm text-gray-600">
            Registered Under Societies Act XXVI, 1961
          </p> */}

          <p className="text-xs sm:text-sm text-gray-600">
            {import.meta.env.VITE_SECOND_LINE}
          </p>

          <p className="text-xs sm:text-sm text-gray-600">{import.meta.env.VITE_THIRD_LINE}</p>
        </div>

      </div>
    </header>
  );
}

export default Header;
