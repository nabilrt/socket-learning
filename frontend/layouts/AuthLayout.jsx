import React from "react";
import { Link } from "react-router-dom";
import darKLogo from "../src/assets/logo-dark.png";
import { useLocation } from "react-router-dom";
const AuthLayout = ({ children }) => {
  let location = useLocation();

  return (
    <div className="bg-[#f3f2fd] font-inter">
      <div className="w-full h-screen">
        <div className="px-5 py-24 sm:px-24 lg:px-0">
          <div className="grid items-center justify-center grid-cols-1 lg:grid-cols-12 auth-bg">
            <div className="mx-5 lg:mx-20 lg:col-start-5 lg:col-span-4">
              <div className="text-center">
                <Link to="/" class="block mb-10">
                  <img src={darKLogo} alt="" class="block h-8 mx-auto " />
                </Link>
                <h4 className="mb-2 text-gray-800 text-xl font-semibold ">
                  {location.pathname === "/" && "Sign in"}
                  {location.pathname === "/register" && "Sign up"}
                  {location.pathname === "/forget-password" &&
                    "Forget Password"}
                </h4>
                <p className="mb-6 text-gray-500 ">
                  {location.pathname === "/" &&
                    "Sign in to continue to Chatvia."}
                  {location.pathname === "/register" &&
                    "Get your Chatvia account now."}
                  {location.pathname === "/forget-password" &&
                    "Reset Password With Chatvia."}
                 
                </p>
              </div>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
