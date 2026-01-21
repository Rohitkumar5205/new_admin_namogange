import React, { useState } from "react";
// import logo from "../../assets/logo1.jpg";
// import { User, Lock, Phone } from "lucide-react";
import { FiUser, FiLock, FiPhone } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toastService";

const Login = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState("login"); // login → otp
  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", ""]);

  // Handle Input Change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // OTP Change
  const handleOtpChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.username) {
      showError("Username is required");
      return;
    }
    if (!form.password) {
      showError("Password is required");
      return;
    }

    // After validation → Go to OTP Screen
    showSuccess("Login Successful, Please Enter OTP");
    setStep("otp");
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();

    if (otp.join("").length !== 4) {
      showError("Please enter 4-digit OTP");
      return;
    }

    showSuccess("OTP Verified Successfully");
    navigate("/dashboard");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white shadow-md border border-gray-200 rounded-md px-8 pb-10 pt-6 w-[90%] max-w-sm">
        {/* Logo */}
        <div className="w-full flex justify-center mb-4">
          <img
            src="/namo_gange.png"
            alt="logo"
            className="w-full h-auto rounded object-cover"
          />
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-1 tracking-wider ">
          Namo Gange
        </h1>

        {step === "login" ? (
          <>
            <p className="text-sm text-gray-500 text-center mb-3">
              Please login to continue
            </p>

            {/* LOGIN FORM */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border px-3 rounded">
                  <FiUser className="text-gray-500 w-4 h-4 mr-2" />
                  <input
                    type="text"
                    name="username"
                    value={form.username}
                    onChange={handleChange}
                    placeholder="Enter username"
                    className="w-full py-2 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center border px-3 rounded">
                  <FiLock className="text-gray-500 w-4 h-4 mr-2" />
                  <input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="w-full py-2 text-sm outline-none"
                    required
                  />
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 text-sm 
                font-semibold rounded hover:bg-blue-700 transition"
              >
                Login
              </button>
            </form>
          </>
        ) : (
          <>
            {/* OTP Screen */}
            <p className="text-sm text-gray-600 text-center mb-4">
              Please enter 4-digit OTP sent to your registered number
            </p>

            <form onSubmit={handleOtpSubmit}>
              <div className="flex justify-center gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    className="w-12 h-12 border text-center text-lg rounded outline-none 
                    focus:border-blue-500 font-bold"
                  />
                ))}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 mt-6 text-sm 
                font-semibold rounded hover:bg-blue-700 transition"
              >
                Verify OTP
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
