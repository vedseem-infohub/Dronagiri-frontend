"use client";

import { useState, useContext, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Building,
  ArrowRight,
  Shield,
  Leaf,
  CheckCircle,
  SkipForward
} from "lucide-react";
import { toast } from "sonner";
import { userDataContext } from "@/context/UserContext";
import axios from "axios";

function AddressForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { serverUrl, userData, setuserData } = useContext(userDataContext);

  // Form State
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [landmark, setLandmark] = useState("");
  const [pincode, setPincode] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  // Target URL to redirect to after saving or skipping
  const redirectTo = searchParams.get("redirect") || "/";

  // Pre-fill fields if user already has partial details
  useEffect(() => {
    if (userData) {
      if (userData.phone) setPhone(userData.phone);
      if (userData.address) setAddress(userData.address);
      if (userData.landmark) setLandmark(userData.landmark);
      if (userData.pincode) setPincode(userData.pincode);
    }
  }, [userData]);

  const validate = () => {
    const newErrors = {};
    
    // Phone Validation
    const cleanPhone = phone.trim().replace(/\D/g, "");
    if (!cleanPhone) {
      newErrors.phone = "Phone number is required.";
    } else if (!/^\d{10}$/.test(cleanPhone)) {
      newErrors.phone = "Enter a valid 10-digit phone number.";
    }

    // Address Validation
    if (!address.trim()) {
      newErrors.address = "Delivery address is required.";
    } else if (address.trim().length < 10) {
      newErrors.address = "Please enter a detailed delivery address.";
    }

    // Pincode Validation
    const cleanPincode = pincode.trim().replace(/\D/g, "");
    if (!cleanPincode) {
      newErrors.pincode = "Pincode is required.";
    } else if (!/^\d{6}$/.test(cleanPincode)) {
      newErrors.pincode = "Enter a valid 6-digit pincode.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please correct the errors in the form.");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await axios.put(
        `${serverUrl}/api/user/address`,
        {
          phone: phone.trim(),
          address: address.trim(),
          landmark: landmark.trim(),
          pincode: pincode.trim(),
        },
        { withCredentials: true }
      );

      setuserData(result.data);
      toast.success("Delivery address saved! 🌾", {
        description: "Your address details have been updated successfully.",
      });
      router.replace(redirectTo);
    } catch (err) {
      const msg = err?.response?.data?.message || "Could not save your address.";
      toast.error("Failed to save address", { description: msg });
      setErrors({ general: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    toast.info("Address skipped", {
      description: "You can add your address later at checkout.",
    });
    router.replace(redirectTo);
  };

  return (
    <div className="min-h-screen flex bg-[#fdfbf7] relative overflow-hidden">
      {/* Background decoration */}
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

      {/* Left panel - Visual identity (hidden on mobile) */}
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
                Farm-to-Door Delivery
              </span>
            </div>
            <h1
              className="font-[family-name:var(--font-playfair)] text-white font-bold leading-tight mb-4"
              style={{ fontSize: "clamp(2rem, 3vw, 2.75rem)" }}
            >
              Delivery details
              <br />
              <span className="text-amber-400">for fresh goods.</span>
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-md">
              Please enter your delivery details so we can bring our organic grains,
              ghee, and harvests straight to your doorstep without delays.
            </p>
          </div>

          <ul className="flex flex-col gap-3">
            {[
              "Direct doorstep delivery from our farm",
              "Real-time order tracking & updates",
              "Secure, contactless delivery options",
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
          © {new Date().getFullYear()} Dronagiri Farm. All rights reserved.
        </p>
      </div>

      {/* Right panel - Address Form */}
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
          <div className="mb-6">
            <h2 className="font-[family-name:var(--font-playfair)] text-gray-900 font-bold text-3xl sm:text-4xl mb-2">
              Delivery Address
            </h2>
            <p className="text-gray-400 text-sm">
              Add your delivery details to complete your profile.
            </p>
          </div>

          <div className="mb-5 flex items-center gap-2.5 bg-amber-50 border border-amber-200/70 rounded-2xl px-4 py-3">
            <Shield className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <p className="text-amber-700 text-xs font-medium leading-relaxed">
              We need a valid delivery address to calculate shipping and coordinate deliveries.
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 text-red-600 text-sm font-medium">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSave} className="flex flex-col gap-4" noValidate>
            {/* Phone */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Mobile Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200 ${
                    errors.phone ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.phone && (
                <span className="text-xs font-medium text-red-500 mt-0.5">{errors.phone}</span>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Street Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House/Flat No, Apartment, Street, Locality"
                  rows="3"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200 resize-none leading-relaxed ${
                    errors.address ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.address && (
                <span className="text-xs font-medium text-red-500 mt-0.5">{errors.address}</span>
              )}
            </div>

            {/* Landmark */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nearby Landmark
              </label>
              <div className="relative">
                <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={landmark}
                  onChange={(e) => setLandmark(e.target.value)}
                  placeholder="e.g. Opposite Central Park"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-gray-200 hover:border-gray-300 text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200"
                />
              </div>
            </div>

            {/* Pincode */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Pincode <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-gray-300 pointer-events-none" />
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 6-digit pincode"
                  maxLength="6"
                  className={`w-full pl-11 pr-4 py-3 rounded-2xl border text-sm text-gray-700 placeholder:text-gray-300 bg-white focus:outline-none focus:ring-2 focus:ring-green-400/50 transition-all duration-200 ${
                    errors.pincode ? "border-red-400" : "border-gray-200 hover:border-gray-300"
                  }`}
                />
              </div>
              {errors.pincode && (
                <span className="text-xs font-medium text-red-500 mt-0.5">{errors.pincode}</span>
              )}
            </div>

            {/* Save Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 flex items-center justify-center gap-2.5 bg-gradient-to-r from-green-600 to-lime-600 hover:from-green-700 hover:to-lime-700 disabled:from-gray-300 disabled:to-gray-300 text-white font-bold py-3.5 rounded-2xl shadow-md hover:shadow-green-200 transition-all duration-300 hover:-translate-y-0.5 cursor-pointer select-none"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving address...
                </>
              ) : (
                <>
                  Save &amp; Continue
                  <ArrowRight className="h-4.5 w-4.5" />
                </>
              )}
            </button>
          </form>

          {/* Skip section */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-gray-300 text-xs font-semibold">OR</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          <button
            onClick={handleSkip}
            className="w-full flex items-center justify-center gap-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-600 font-bold py-3.5 rounded-2xl transition-all duration-200 cursor-pointer select-none"
          >
            <SkipForward className="h-4.5 w-4.5" />
            Skip for Now
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#fdfbf7]">
          <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AddressForm />
    </Suspense>
  );
}