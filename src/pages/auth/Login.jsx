// import React, { useState, useEffect, useRef } from "react";
// import { FiUser, FiLock, FiEye, FiEyeOff, FiLogIn } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { showSuccess, showError } from "../../utils/toastService";
// import {
//   loginWithPasswordThunk,
//   resendOtpThunk,
//   verifyOtpThunk,
// } from "../../redux/slices/auth/authSlice";

// const Login = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { loading, otpStep, userIdForOtp } = useSelector((state) => state.auth);

//   const [form, setForm] = useState({
//     username: "",
//     password: "",
//   });

//   const [otp, setOtp] = useState("");
//   const otpInputRef = useRef(null);
//   const [timer, setTimer] = useState(30);
//   const [canResend, setCanResend] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // Timer logic for OTP countdown.
//   // This effect runs when the OTP step becomes active, or when the user requests to resend the OTP.
//   useEffect(() => {
//     // Don't run if not on OTP step or if we can already resend.
//     if (!otpStep || canResend) return;

//     setTimer(30); // Reset timer to 30 seconds.

//     const interval = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(interval);
//           setCanResend(true);
//           return 0;
//         }
//         return prev - 1;
//       });
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [otpStep, canResend]);

//   const handleOtpChange = (e) => {
//     const value = e.target.value;
//     if (/^[0-9]{0,6}$/.test(value)) {
//       setOtp(value);
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!form.username) {
//       showError("Username is required");
//       return;
//     }
//     if (!form.password) {
//       showError("Password is required");
//       return;
//     }

//     dispatch(
//       loginWithPasswordThunk({
//         username: form.username,
//         password: form.password,
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         showSuccess("OTP sent successfully");
//       })
//       .catch((err) => {
//         showError(err);
//       });
//   };

//   const handleOtpSubmit = (e) => {
//     e.preventDefault();

//     const enteredOtp = otp;

//     if (enteredOtp.length !== 6) {
//       showError("Please enter 6-digit OTP");
//       return;
//     }

//     dispatch(
//       verifyOtpThunk({
//         user_id: userIdForOtp,
//         otp: enteredOtp,
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         showSuccess("OTP Verified Successfully");
//         navigate("/dashboard");
//       })
//       .catch((err) => {
//         showError(err);
//         setOtp(""); // ✅ clear OTP on error
//       });
//   };

//   const handleResendOtp = () => {
//     if (!canResend) return;

//     dispatch(
//       resendOtpThunk({
//         user_id: userIdForOtp,
//       }),
//     )
//       .unwrap()
//       .then(() => {
//         showSuccess("OTP resent successfully");
//         setCanResend(false); // This will re-trigger the timer useEffect
//       })
//       .catch((err) => {
//         showError(err);
//       });
//   };

//   // ======================
//   // UI
//   // ======================
//   return (
//     <div
//       className="w-full h-screen flex items-center justify-center
// bg-gradient-to-r from-orange-200 via-cyan-200 to-blue-300"
//     >
//       <div className="flex flex-row bg-white shadow-xl rounded-xl overflow-hidden w-full max-w-4xl h-[70vh]">
//         {/* Image Section */}
//         <div className="hidden md:block md:w-1/2">
//           <img
//             src="/login.png"
//             alt="Ganges River"
//             className="w-full h-full object-cover"
//           />
//         </div>
//         <div className="w-full md:w-1/2 p-6 sm:p-8 flex flex-col justify-center">
//           {/* Logo */}
//           <div className="w-full flex justify-center mb-4">
//             <img
//               src="/namo_gange.png"
//               alt="logo"
//               className="w-full h-auto rounded object-cover"
//             />
//           </div>

//           <h1 className="text-2xl font-semibold text-gray-800 text-center mb-1 tracking-wider">
//             Namo Gange
//           </h1>

//           {/* ======================
//             LOGIN SCREEN
//         ====================== */}
//           {!otpStep ? (
//             <>
//               <p className="text-sm text-gray-500 text-center mb-3">
//                 Please login to continue
//               </p>

//               <form onSubmit={handleSubmit} className="space-y-4">
//                 {/* Username */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Username <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex items-center border px-3 rounded">
//                     <FiUser className="text-gray-500 w-4 h-4 mr-2" />
//                     <input
//                       type="text"
//                       name="username"
//                       value={form.username}
//                       onChange={handleChange}
//                       placeholder="Enter username"
//                       className="w-full py-2 text-sm outline-none"
//                     />
//                   </div>
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-1">
//                     Password <span className="text-red-500">*</span>
//                   </label>
//                   <div className="flex items-center border px-3 rounded">
//                     <FiLock className="text-gray-500 w-4 h-4 mr-2" />

//                     <input
//                       type={showPassword ? "text" : "password"}
//                       name="password"
//                       value={form.password}
//                       onChange={handleChange}
//                       placeholder="Enter password"
//                       className="w-full py-2 text-sm outline-none"
//                     />

//                     <button
//                       type="button"
//                       onClick={() => setShowPassword(!showPassword)}
//                       className="ml-2 text-gray-500 hover:text-gray-700"
//                     >
//                       {showPassword ? <FiEyeOff /> : <FiEye />}
//                     </button>
//                   </div>
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 text-white py-2 text-sm
//                 font-semibold rounded hover:bg-blue-700 transition"
//                 >
//                   {loading ? "Please wait..." : "Login"}
//                 </button>
//               </form>
//             </>
//           ) : (
//             /* ======================
//               OTP SCREEN
//           ====================== */
//             <>
//               <p className="text-sm text-gray-600 text-center mb-4">
//                 Please enter 6-digit OTP sent to your registered number
//               </p>

//               <form onSubmit={handleOtpSubmit}>
//                 <div
//                   className="relative flex justify-center gap-2 sm:gap-3 cursor-text"
//                   onClick={() => otpInputRef.current?.focus()}
//                 >
//                   {[...Array(6)].map((_, index) => {
//                     const isActive = index === otp.length;
//                     return (
//                       <div
//                         key={index}
//                         className={`w-10 h-12 sm:w-12 sm:h-14 border-b-2 flex items-center justify-center text-xl sm:text-2xl font-bold text-gray-700 transition-all duration-200 ${
//                           isActive ? "border-blue-500" : "border-gray-300"
//                         }`}
//                       >
//                         {otp[index] || ""}
//                       </div>
//                     );
//                   })}
//                   <input
//                     ref={otpInputRef}
//                     type="text"
//                     inputMode="numeric"
//                     value={otp}
//                     onChange={handleOtpChange}
//                     maxLength={6}
//                     className="absolute top-0 left-0 w-full h-full bg-transparent opacity-0"
//                     autoFocus
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   disabled={loading}
//                   className="w-full bg-blue-600 text-white py-2 mt-6 text-sm
//                 font-semibold rounded hover:bg-blue-700 transition"
//                 >
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </button>

//                 <div className="text-center mt-4 text-sm text-gray-600">
//                   {canResend ? (
//                     <button
//                       type="button"
//                       onClick={handleResendOtp}
//                       className="text-blue-600 font-semibold hover:underline"
//                     >
//                       Resend OTP
//                     </button>
//                   ) : (
//                     <span>
//                       Resend OTP in{" "}
//                       <span className="font-semibold">{timer}s</span>
//                     </span>
//                   )}
//                 </div>
//               </form>
//             </>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../../utils/toastService";
import {
  loginWithPasswordThunk,
  resendOtpThunk,
  verifyOtpThunk,
} from "../../redux/slices/auth/authSlice";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, otpStep, userIdForOtp } = useSelector((state) => state.auth);

  const [form, setForm] = useState({ username: "", password: "" });
  const [otp, setOtp] = useState("");
  const otpInputRef = useRef(null);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  useEffect(() => {
    if (!otpStep || canResend) return;
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [otpStep, canResend]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });
  const handleOtpChange = (e) => {
    if (/^[0-9]{0,6}$/.test(e.target.value)) setOtp(e.target.value);
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
    dispatch(
      loginWithPasswordThunk({
        username: form.username,
        password: form.password,
      }),
    )
      .unwrap()
      .then(() => showSuccess("OTP sent successfully"))
      .catch((err) => showError(err));
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      showError("Please enter 6-digit OTP");
      return;
    }
    dispatch(verifyOtpThunk({ user_id: userIdForOtp, otp }))
      .unwrap()
      .then(() => {
        showSuccess("OTP Verified Successfully");
        navigate("/dashboard");
      })
      .catch((err) => {
        showError(err);
        setOtp("");
      });
  };

  const handleResendOtp = () => {
    if (!canResend) return;
    dispatch(resendOtpThunk({ user_id: userIdForOtp }))
      .unwrap()
      .then(() => {
        showSuccess("OTP resent successfully");
        setCanResend(false);
      })
      .catch((err) => showError(err));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Merriweather:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lg-root {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Nunito', sans-serif;
          position: relative;
          overflow: hidden;

          /* VIVID GRADIENT BACKGROUND */
          background:
            linear-gradient(135deg,
              #1a56db 0%,
              #1e429f 20%,
              #5850ec 45%,
              #7e3af2 65%,
              #9333ea 80%,
              #c026d3 100%
            );
        }

        /* Moving mesh blobs */
        .blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(60px);
          pointer-events: none;
          mix-blend-mode: screen;
        }
        .blob-1 {
          width: 500px; height: 500px;
          background: rgba(99, 200, 255, 0.35);
          top: -150px; left: -100px;
          animation: blobMove1 14s ease-in-out infinite alternate;
        }
        .blob-2 {
          width: 450px; height: 450px;
          background: rgba(255, 140, 50, 0.3);
          bottom: -100px; right: -80px;
          animation: blobMove2 18s ease-in-out infinite alternate;
        }
        .blob-3 {
          width: 350px; height: 350px;
          background: rgba(60, 255, 180, 0.25);
          top: 30%; left: 30%;
          animation: blobMove3 12s ease-in-out infinite alternate;
        }
        .blob-4 {
          width: 300px; height: 300px;
          background: rgba(255, 80, 120, 0.2);
          top: 10%; right: 15%;
          animation: blobMove4 16s ease-in-out infinite alternate;
        }
        @keyframes blobMove1 { from{transform:translate(0,0) scale(1);} to{transform:translate(80px,60px) scale(1.2);} }
        @keyframes blobMove2 { from{transform:translate(0,0) scale(1.1);} to{transform:translate(-70px,-50px) scale(0.9);} }
        @keyframes blobMove3 { from{transform:translate(0,0) scale(1);} to{transform:translate(50px,-80px) scale(1.15);} }
        @keyframes blobMove4 { from{transform:translate(0,0);} to{transform:translate(-60px,70px) scale(1.1);} }

        /* Dot pattern */
        .dot-pattern {
          position: absolute; inset: 0; pointer-events: none;
          background-image: radial-gradient(rgba(255,255,255,0.12) 1.5px, transparent 1.5px);
          background-size: 28px 28px;
        }

        /* Glass card */
        .lg-card {
          position: relative; z-index: 10;
          display: flex;
          width: min(900px, 95vw);
          min-height: 540px;
          border-radius: 24px;
          overflow: hidden;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255,255,255,0.2);
          box-shadow:
            0 32px 80px rgba(0,0,0,0.35),
            0 0 0 1px rgba(255,255,255,0.1),
            inset 0 1px 0 rgba(255,255,255,0.25);
          opacity: 0;
          transform: translateY(24px) scale(0.97);
          transition: opacity 0.6s ease, transform 0.6s ease;
        }
        .lg-card.show { opacity:1; transform:translateY(0) scale(1); }

        /* ── LEFT PANEL ── */
        .lg-left {
          display: none;
          width: 44%;
          position: relative;
          overflow: hidden;
        }
        @media(min-width:768px){ .lg-left { display: flex; flex-direction: column; justify-content: flex-end; } }

        .lg-left img.hero {
          position: absolute; inset: 0;
          width: 100%; height: 100%;
          object-fit: cover;
          opacity: 0.6;
          transform: scale(1.06);
          transition: transform 10s ease, opacity 0.5s;
        }
        .lg-left:hover img.hero { transform: scale(1); opacity: 0.72; }

        .lg-left-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to top,
            rgba(15,23,80,0.96) 0%,
            rgba(15,23,80,0.5) 45%,
            rgba(15,23,80,0.05) 100%);
        }

        .lg-left-content { position: relative; z-index:2; padding: 28px; }

        .badge {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.22);
          color: #a5f3d4;
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; padding: 5px 13px; border-radius: 30px;
          margin-bottom: 14px;
        }
        .badge-dot {
          width: 6px; height: 6px; background: #34d399;
          border-radius: 50%;
          animation: blink 2s infinite;
        }
        @keyframes blink { 0%,100%{opacity:1;} 50%{opacity:0.2;} }

        .lg-title {
          font-family: 'Merriweather', serif;
          font-size: 24px; font-weight: 700;
          color: #fff; line-height: 1.4; margin-bottom: 10px;
        }
        .lg-sub { font-size: 12.5px; color: rgba(255,255,255,0.5); line-height: 1.75; }

        /* ── RIGHT PANEL ── */
        .lg-right {
          flex: 1;
          display: flex; flex-direction: column;
          align-items: center; justify-content: center;
          padding: 40px 36px;
          background: rgba(255,255,255,0.92);
          position: relative;
        }
        @media(max-width:480px){ .lg-right { padding: 32px 20px; } }

        /* subtle top stripe */
        .lg-right::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, #1a56db, #7e3af2, #c026d3);
        }

        .logo-box { width: 100%; max-width: 160px; margin-bottom: 20px; }
        .logo-box img { width: 100%; height: auto; }

        /* Steps */
        .steps { display:flex; align-items:center; gap:8px; margin-bottom:18px; }
        .sdot {
          width: 9px; height: 9px; border-radius: 50%;
          background: #d1d5db; transition: all 0.3s;
        }
        .sdot.active { background: #4f46e5; transform: scale(1.4); box-shadow: 0 0 8px rgba(79,70,229,0.5); }
        .sdot.done  { background: #10b981; }
        .sline { width: 32px; height: 1.5px; background: #e5e7eb; }

        .form-title {
          font-family: 'Merriweather', serif;
          font-size: 20px; font-weight: 700;
          color: #111827; text-align: center; margin-bottom: 4px;
        }
        .form-sub { font-size: 13px; color: #9ca3af; text-align: center; margin-bottom: 24px; }

        .form-box { width: 100%; max-width: 300px; }

        /* Field */
        .flabel {
          display: block; font-size: 11px; font-weight: 700;
          color: #6b7280; letter-spacing: 0.8px;
          text-transform: uppercase; margin-bottom: 6px;
        }
        .req { color: #ef4444; margin-left: 2px; }

        .finput-wrap {
          display: flex; align-items: center;
          background: #f9fafb;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px; padding: 0 14px;
          transition: all 0.22s;
        }
        .finput-wrap:focus-within {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.12);
        }
        .ficon { color: #d1d5db; width: 15px; height: 15px; flex-shrink: 0; transition: color 0.2s; }
        .finput-wrap:focus-within .ficon { color: #4f46e5; }
        .finput-wrap input {
          flex: 1; background: transparent; border: none; outline: none;
          color: #111827; font-size: 13.5px;
          font-family: 'Nunito', sans-serif; padding: 12px 10px;
        }
        .finput-wrap input::placeholder { color: #c4cad6; }
        .eye-btn {
          background: none; border: none; cursor: pointer;
          color: #c4cad6; padding: 4px; transition: color 0.2s;
        }
        .eye-btn:hover { color: #4f46e5; }

        .fgroup { margin-bottom: 15px; }

        /* Submit */
        .btn-submit {
          width: 100%;
          background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
          color: #fff; border: none; cursor: pointer;
          border-radius: 10px; padding: 13px;
          font-size: 14px; font-weight: 700;
          font-family: 'Nunito', sans-serif;
          transition: all 0.22s;
          box-shadow: 0 4px 20px rgba(79,70,229,0.4);
          margin-top: 6px;
          letter-spacing: 0.2px;
        }
        .btn-submit:hover:not(:disabled) {
          background: linear-gradient(135deg, #4338ca 0%, #6d28d9 100%);
          box-shadow: 0 8px 28px rgba(79,70,229,0.5);
          transform: translateY(-1px);
        }
        .btn-submit:active:not(:disabled) { transform: translateY(0); }
        .btn-submit:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

        /* OTP */
        .otp-hint { font-size: 13px; color: #9ca3af; text-align: center; margin-bottom: 22px; line-height: 1.6; }
        .otp-row {
          position: relative; display: flex;
          justify-content: center; gap: 9px;
          cursor: text; margin-bottom: 4px;
        }
        .ocell {
          width: 42px; height: 52px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px; background: #f9fafb;
          display: flex; align-items: center; justify-content: center;
          font-size: 22px; font-weight: 800; color: #111827;
          transition: all 0.18s;
        }
        .ocell.active {
          border-color: #4f46e5;
          background: #fff;
          box-shadow: 0 0 0 3px rgba(79,70,229,0.15);
        }
        .ocell.filled { transform: scale(1.07); border-color: #7c3aed; background: #faf5ff; color: #4f46e5; }
        .otp-ghost {
          position: absolute; inset: 0; opacity: 0; cursor: text;
          width: 100%; height: 100%;
        }

        .resend-area { text-align: center; margin-top: 14px; font-size: 13px; color: #9ca3af; }
        .resend-btn {
          background: none; border: none; cursor: pointer;
          color: #4f46e5; font-weight: 700;
          font-family: 'Nunito', sans-serif; font-size: 13px; padding: 0;
          transition: color 0.2s;
        }
        .resend-btn:hover { color: #7c3aed; text-decoration: underline; }
        .tnum { font-weight: 800; color: #374151; }

        @keyframes spin { to{transform:rotate(360deg);} }
        .spinner {
          display: inline-block; width: 13px; height: 13px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff; border-radius: 50%;
          animation: spin 0.7s linear infinite;
          margin-right: 8px; vertical-align: middle;
        }

        .slide-in { animation: sIn 0.4s cubic-bezier(0.34,1.4,0.64,1) both; }
        @keyframes sIn {
          from { opacity:0; transform: translateX(20px); }
          to   { opacity:1; transform: translateX(0); }
        }
      `}</style>

      <div className="lg-root">
        {/* Vivid animated blobs */}
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
        <div className="dot-pattern" />

        <div className={`lg-card ${mounted ? "show" : ""}`}>
          {/* LEFT — image + text */}
          <div className="lg-left">
            <img className="hero" src="/login.png" alt="Namo Gange" />
            <div className="lg-left-overlay" />
            <div className="lg-left-content">
              <div className="badge">
                <span className="badge-dot" />
                Namo Gange Trust
              </div>
              <div className="lg-title">
                Protecting the
                <br />
                Sacred Ganga
              </div>
              <div className="lg-sub">
                Integrated Health &amp; Wellness Expo
                <br />
                CRM Management Portal
              </div>
            </div>
          </div>

          {/* RIGHT — white form panel */}
          <div className="lg-right">
            <div className="logo-box">
              <img src="/namo_gange.png" alt="Logo" />
            </div>

            {/* Step dots */}
            <div className="steps">
              <div className={`sdot ${!otpStep ? "active" : "done"}`} />
              <div className="sline" />
              <div className={`sdot ${otpStep ? "active" : ""}`} />
            </div>

            {!otpStep ? (
              <div className="form-box slide-in" key="lf">
                <div className="form-title">Welcome Back</div>
                <div className="form-sub">Sign in to your account</div>

                <form onSubmit={handleSubmit}>
                  <div className="fgroup">
                    <label className="flabel">
                      Username <span className="req">*</span>
                    </label>
                    <div className="finput-wrap">
                      <FiUser className="ficon" />
                      <input
                        type="text"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                        placeholder="Enter your username"
                        autoComplete="username"
                      />
                    </div>
                  </div>

                  <div className="fgroup">
                    <label className="flabel">
                      Password <span className="req">*</span>
                    </label>
                    <div className="finput-wrap">
                      <FiLock className="ficon" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="eye-btn"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FiEyeOff size={15} />
                        ) : (
                          <FiEye size={15} />
                        )}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Sending OTP...
                      </>
                    ) : (
                      "Continue →"
                    )}
                  </button>
                </form>
              </div>
            ) : (
              <div className="form-box slide-in" key="of">
                <div className="form-title">Verify OTP</div>
                <div className="otp-hint">
                  Enter the 6-digit code sent to
                  <br />
                  your registered mobile number
                </div>

                <form onSubmit={handleOtpSubmit}>
                  <div
                    className="otp-row"
                    onClick={() => otpInputRef.current?.focus()}
                  >
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className={`ocell ${i === otp.length && otp.length < 6 ? "active" : ""} ${i < otp.length ? "filled" : ""}`}
                      >
                        {otp[i] || ""}
                      </div>
                    ))}
                    <input
                      ref={otpInputRef}
                      type="text"
                      inputMode="numeric"
                      value={otp}
                      onChange={handleOtpChange}
                      maxLength={6}
                      className="otp-ghost"
                      autoFocus
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={loading}
                    style={{ marginTop: "20px" }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Login"
                    )}
                  </button>

                  <div className="resend-area">
                    {canResend ? (
                      <button
                        type="button"
                        className="resend-btn"
                        onClick={handleResendOtp}
                      >
                        Resend OTP
                      </button>
                    ) : (
                      <span>
                        Resend in <span className="tnum">{timer}s</span>
                      </span>
                    )}
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
