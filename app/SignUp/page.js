"use client";

import { Suspense, useContext, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  Inbox,
  Leaf,
  Lock,
  Shield,
  User,
} from "lucide-react";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";
import axios from "axios";

function SignUp() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetRedirect = searchParams.get("redirect") || "/";
  const redirectTo = `/address?redirect=${encodeURIComponent(targetRedirect)}`;
  const { serverUrl, setuserData } = useContext(userDataContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !password) {
      setError("Please enter your name, email, and password.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { name: name.trim(), email: email.trim(), password },
        { withCredentials: true }
      );
      setuserData(result.data);
      toast.success("Account created!", {
        description: "Welcome to Dronagiri Farm.",
      });
      router.replace(redirectTo);
    } catch (err) {
      const message =
        err?.response?.data?.message || "Could not create your account.";
      setuserData(null);
      setError(message);
      toast.error("Sign up failed", { description: message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] relative overflow-hidden">
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

      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1a2e0d] flex-col justify-between p-12">
        <div
          aria-hidden
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(15,30,8,0.9) 0%, rgba(40,70,15,0.75) 100%)",
          }}
        />

        <div className="relative z-10">
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
              Create your account to explore our organic harvests, place
              orders, and bring farm-fresh essentials to your doorstep.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {[
              "100% natural, no preservatives",
              "Free shipping on orders above Rs. 1,000",
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

        <p className="relative z-10 text-white/30 text-xs">
          (c) {new Date().getFullYear()} Dronagiri Farm. All rights reserved.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
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
          <div className="mb-8">
            <h2 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-3xl sm:text-4xl mb-2">
              Create Account
            </h2>
            <p className="text-gray-400 text-sm">
              Sign up for your Dronagiri Farm account to continue.
            </p>
          </div>

          {redirectTo !== "/" && (
            <div className="mb-5 flex items-center gap-2.5 bg-amber-50 border border-amber-200/70 rounded-2xl px-4 py-3">
              <Shield className="h-4 w-4 text-amber-500 flex-shrink-0" />
              <p className="text-amber-700 text-xs font-medium leading-relaxed">
                Create an account to add items to your cart and place orders.
              </p>
            </div>
          )}

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form
            id="signup-form"
            onSubmit={handleSignUp}
            className="flex flex-col gap-5"
            noValidate
          >
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-name"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Name <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  id="signup-name"
                  type="text"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-email"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Inbox className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  required
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="signup-password"
                className="text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="new-password"
                  className="w-full pl-11 pr-12 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
                />
                <button
                  type="button"
                  id="toggle-signup-password-visibility"
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
            </div>

            <button
              id="signup-submit-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-green-200 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  Sign Up
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-300 text-xs font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <div className="text-center">
            <Link href="/login">
              <p className="text-gray-800 text-[18px] cursor-pointer">
                Already have an account?{" "}
                <span className="text-blue-400">Login</span>
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignUp />
    </Suspense>
  );
}
