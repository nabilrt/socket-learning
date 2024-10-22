import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../libs/context/auth-context";
import { useState } from "react";
import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";

const LoginPage = () => {
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { userLogin, loginLoader } = useAuth();

  const onSubmit = async (data) => {
    setLoginError(null); // Clear previous error
    const errorMessage = await userLogin(data);
    if (errorMessage) {
      setLoginError(errorMessage); // Set error message if login fails
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white rounded-md border border-solid border-gray-200 mb-5">
        <div className="p-5">
          <div className="p-4">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="font-medium text-gray-700 ">Email</label>
                <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200   placeholder:text-[14px] bg-slate-50/50 text-[14px] focus:ring-0 outline-none rounded-md"
                    placeholder="Enter Email Address"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                </div>
              </div>
              <div className="mb-6">
                <div className="float-right">
                  <Link
                    to="/forget-password"
                    className="text-gray-500 text-[13px] cursor-pointer hover:underline "
                  >
                    Forgot password?
                  </Link>
                </div>
                <label className="font-medium text-gray-700 ">Password</label>
                <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-200 rounded-md outline-none placeholder:text-[14px] bg-slate-50/50 text-[14px] focus:ring-0 "
                    placeholder="Enter Password"
                    aria-label="Enter Password"
                    aria-describedby="basic-addon4"
                  />
                </div>
              </div>
              <div
                style={{
                  textAlign: "center",
                  fontSize: "14px",
                  lineHeight: "21px",
                  fontWeight: "400",
                  color: "#E03838",
                  marginTop: "8px",
                  marginbottom: "8px",
                  height: "25px",
                }}
              >
                {loginError && <span>{loginError}</span>}
              </div>
              <div className="grid">
                <button
                  className="py-2 text-white border-transparent rounded-md bg-violet-500 hover:bg-violet-600 text-[16px]"
                  type="submit"
                >
                  {loginLoader ? "Loading..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Don't have an account ?{" "}
          <Link to="/register" className="fw-medium text-violet-500">
            Signup now
          </Link>
        </p>
        <p class="text-gray-700 ">
          © {new Date().getFullYear()} Chatvia. Crafted by Nabil
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
