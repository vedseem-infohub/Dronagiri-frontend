"use client";

import { useContext, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff, Inbox, Lock, ArrowRight, Leaf, Shield, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useContext(userDataContext);
  const [email, setemail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // The page to redirect to after login (default: home)
  const redirectTo = searchParams.get("redirect") || "/";

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // Redirect if already logged in
  // useEffect(() => {
  //   if (isAuthLoaded && isLoggedIn) {
  //     router.replace(redirectTo);
  //   }
  // }, [isAuthLoaded, isLoggedIn, router, redirectTo]);

  // const validate = () => {
  //   const newErrors = {};
  //   const cleanPhone = phone.trim().replace(/\D/g, "");
  //   if (!cleanPhone) newErrors.phone = "Mobile number is required.";
  //   else if (!/^\d{10}$/.test(cleanPhone))
  //     newErrors.phone = "Enter a valid 10-digit mobile number.";
  //   if (!password) newErrors.password = "Password is required.";
  //   else if (password.length < 4)
  //     newErrors.password = "Password must be at least 4 characters.";
  //   setErrors(newErrors);
  //   return Object.keys(newErrors).length === 0;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      setErrors({ general: "Please enter your email and password." });
      return;
    }

    setIsSubmitting(true);
    setErrors({});

    try {
      const user = await login(email.trim(), password);
      toast.success("Welcome back! 🌿", {
        description: "You are now logged in to Dronagiri Farm.",
      });
      if (!user.address || !user.pincode || !user.phone) {
        router.replace(`/address?redirect=${encodeURIComponent(redirectTo)}`);
      } else {
        router.replace(redirectTo);
      }
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        "Please check your credentials and try again.";
      toast.error("Login failed", { description: message });
      setErrors({ general: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (!mounted || (isAuthLoaded && isLoggedIn)) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
  //       <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] relative overflow-hidden">
      {/* ── Decorative background blobs ── */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(134,194,80,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 w-[400px] h-[400px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(196,163,80,0.14) 0%, transparent 70%)",
        }}
      />

      {/* ── Left panel (hero) — hidden on mobile ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a2e0d] flex-col justify-between p-12">
        {/* Dot pattern overlay */}
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        {/* Gradient overlay */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,30,8,0.9) 0%, rgba(40,70,15,0.75) 100%)",
          }}
        />

        {/* Content */}
        <div className="relative z-10">
          {/* Logo */}
          <Link href="/" className="inline-block">
            <Image
              src="/logo2.png"
              alt="Dronagiri Farm"
              width={180}
              height={60}
              className="brightness-0 invert h-auto w-[160px]"
              priority
            />
          </Link>
        </div>

        <div className="relative z-10 flex flex-col gap-8">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 mb-5">
              <Leaf className="h-4 w-4 text-green-400" />
              <span className="text-white/90 text-xs font-semibold tracking-widest uppercase">
                Farm Fresh Since 2020
              </span>
            </div>
            <h1
              className="font-[family-name:var(--font-playfair)] text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)" }}
            >
              Pure. Natural.
              <br />
              <span className="text-amber-400">Farm-to-Table.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Sign in to explore our organic harvests — dals, grains, spices,
              ghee, and oils sourced directly from our farm to your doorstep.
            </p>
          </div>

          {/* Feature list */}
          <ul className="flex flex-col gap-3">
            {[
              "100% natural, no preservatives",
              "Free shipping on orders above ₹1,000",
              "Exclusive member discounts & promo codes",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle className="h-3.5 w-3.5 text-green-400" />
                </span>
                <span className="text-white/75 text-sm">{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Bottom brand note */}
        <p className="relative z-10 text-white/30 text-xs">
          © {new Date().getFullYear()} Dronagiri Farm. All rights reserved.
        </p>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        {/* Mobile logo */}
        <Link href="/" className="lg:hidden mb-8 inline-block">
          <Image
            src="/logo2.png"
            alt="Dronagiri Farm"
            width={160}
            height={54}
            className="h-auto w-[140px]"
            priority
          />
        </Link>

        <div
          className="w-full max-w-md"
          style={{ animation: "fadeInUp 0.55s ease both" }}
        >
          {/* Heading */}
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-3xl sm:text-4xl mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-400 text-sm">
              Sign in to your Dronagiri Farm account to continue.
            </p>
          </div>

          {/* Redirect notice */}
          {redirectTo !== "/" && (
            <div className="mb-5 flex items-center gap-2.5 bg-amber-50 border border-amber-200/70 rounded-2xl px-4 py-3">
              <Shield className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 text-xs font-medium leading-relaxed">
                Please sign in to add items to your cart and place orders.
              </p>
            </div>
          )}

          {/* General error */}
          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
              {errors.general}
            </div>
          )}

          {/* Form */}
          <form
            id="login-form"
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-email"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Inbox className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  required

                  onChange={(e) => {
                    setemail(e.target.value);
                  }}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="login-password"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors((p) => ({ ...p, password: "" }));
                  }}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className={`w-full pl-11 pr-12 py-3 rounded-2xl border text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200 ${
                    errors.password
                      ? "border-red-400 focus:ring-red-400/40"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                />
                <button
                  type="button"
                  id="toggle-password-visibility"
                  tabIndex={-1}
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <span className="text-[11px] font-semibold text-red-500">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Demo hint */}
            {/* <div className="bg-green-50 border border-green-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
              <Leaf className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
              <p className="text-green-700 text-xs leading-relaxed">
                <span className="font-bold">Demo mode:</span> Enter any valid
                10-digit mobile number and any password (min 4 chars) to sign
                in.
              </p>
            </div> */}

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-green-200 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-300 text-xs font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Back home link */}
          <div className="text-center">
            <Link href={"/SignUp"} ><p className='text-gray-800 text-[18px] cursor-pointer'>Want to create a new account ? <span className='text-blue-400'>Sign Up</span></p></Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
