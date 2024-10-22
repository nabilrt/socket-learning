import { Link } from "react-router-dom";
import AuthLayout from "../layouts/AuthLayout";
import { useForm } from "react-hook-form";
import { forgetPassword } from "../libs/utils/api";
import { useState } from "react";

const ForgotPassword = () => {
  const [errorState, setErrorState] = useState("");
  const [successState, setSuccessState] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await forgetPassword(data);
      setSuccessState("New Password has been sent to your email");
      setTimeout(() => {
        setSuccessState("");
      }, 2000);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setErrorState("User Not Found. Please enter correct email address");
      setTimeout(() => {
        setErrorState("");
      }, 2000);
    }
  };
  return (
    <AuthLayout>
      <div className="bg-white card rounded-md">
        <div className="p-5">
          <div className="p-4">
            <div
              className={`px-8 py-5 mb-4 text-center ${
                errorState !== ""
                  ? "text-red-800 border rounded border-red-500/30 bg-red-500/20"
                  : "text-green-800 border rounded border-green-500/30 bg-green-500/20"
              }`}
              role="alert"
            >
              {errorState !== ""
                ? errorState
                : successState !== ""
                ? successState
                : "Enter your Email and instructions will be sent to you!"}
              {}
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-5">
                <label className="font-medium text-gray-700 ">Email</label>
                <div className="flex items-center mt-2 mb-3 rounded-3 bg-slate-50/50 dark:bg-transparent">
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-200   placeholder:text-[14px] bg-slate-50/50 text-[14px] focus:ring-0 outline-none rounded-md"
                    placeholder="Enter Email"
                    aria-label="Enter Email"
                    aria-describedby="basic-addon3"
                    {...register("email", {
                      required: "Email is required",
                    })}
                  />
                </div>
              </div>

              <div class="grid">
                <button
                  className="py-2 text-white border-transparent btn bg-violet-500 hover:bg-violet-600 text-[16px] rounded-md disabled:bg-slate-400"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Reset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="mb-5 text-gray-700 ">
          Remember It ?{" "}
          <Link to="/" class="fw-medium text-violet-500">
            Signin{" "}
          </Link>
        </p>
        <p class="text-gray-700 ">
          © {new Date().getFullYear()} Chatvia. Crafted by Nabil
        </p>
      </div>
    </AuthLayout>
  );
};

export default ForgotPassword;
