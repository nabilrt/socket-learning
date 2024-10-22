import React from "react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { registerUser } from "../libs/utils/api";

const Register = () => {
  const [loginError, setLoginError] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [registerLoader, setRegisterLoader] = useState(false);

  let navigate = useNavigate();

  const onSubmit = async (data) => {
    setRegisterLoader(true);
    try {
      const response = await registerUser(data);
      setRegisterLoader(false);
      navigate("/");
    } catch (err) {
      setRegisterLoader(false);
      setLoginError("Unable to Complete Registration. Try Again");
    }
  };

  return (
    <AuthLayout>
      <div className="bg-white card rounded-sm">
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
              <div className="mb-5">
                <label className="font-medium text-gray-700 ">Full Name</label>
                <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200   placeholder:text-[14px] bg-slate-50/50 text-[14px] focus:ring-0 outline-none rounded-md"
                    placeholder="Enter Full Name"
                    {...register("name", {
                      required: "Name is required",
                    })}
                  />
                </div>
              </div>
              <div className="mb-6">
                <label className="font-medium text-gray-700 ">Password</label>
                <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 ">
                  <input
                    type="password"
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="w-full px-4 py-2 border border-gray-200 outline-none rounded rounded-l-none placeholder:text-[14px] bg-slate-50/50 text-[14px] focus:ring-0 "
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
                  marginTop: "12px",
                  height: "21px",
                }}
              >
                {loginError && <span>{loginError}</span>}
              </div>
              <div className="grid">
                <button
                  className="py-2 text-white border-transparent rounded-md bg-violet-500 hover:bg-violet-600 text-[16px] disabled:bg-slate-400"
                  type="submit"
                  disabled={registerLoader}
                >
                  {registerLoader ? "Signing Up..." : "Sign Up"}
                </button>
              </div>
              <div className="mt-5 text-center">
                <p className="mb-0 text-gray-500 ">
                  By registering you agree to the Chatvia{" "}
                  <Link href="/" className="text-violet-500">
                    Terms of Use
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Already have an account ?{" "}
          <Link to="/" className="fw-medium text-violet-500">
            Signin
          </Link>
        </p>
        <p class="text-gray-700 ">
          © {new Date().getFullYear()} Chatvia. Crafted by Nabil
        </p>
      </div>
    </AuthLayout>
  );
};

export default Register;
