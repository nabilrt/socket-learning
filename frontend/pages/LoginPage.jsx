import React from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../libs/context/auth-context";
import { useState } from "react";

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
    <div className="flex flex-col justify-center items-center h-screen">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-4 p-4 bg-slate-100 border border-blue-400">
          <h2 className="text-xl mr-auto">Login</h2>
          <div className="">
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
              })}
              className="px-4 py-2 outline-none border border-blue-400  rounded-md"
              placeholder="Email"
            />
          </div>
          <div>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
              })}
              className="px-4 py-2 outline-none border border-blue-400  rounded-md"
              placeholder="Password"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-800 hover:bg-blue-950 text-white rounded-md w-1/2 m-auto"
          >
            {loginLoader ? "Loading..." : "Log In"}
          </button>
          <div
            style={{
              textAlign: "center",
              fontSize: "14px",
              lineHeight: "21px",
              fontWeight: "300",
              color: "#E03838",
              marginTop: "12px",
              height: "21px",
            }}
          >
            {loginError && <span>{loginError}</span>}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
