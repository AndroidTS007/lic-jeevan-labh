import React, { useState } from "react";
import { 
  X, Mail, Lock, User as UserIcon, Phone, Eye, EyeOff, LogIn, UserPlus, 
  AlertCircle, CheckCircle2, ShieldCheck 
} from "lucide-react";
import { supabase } from "../supabaseClient";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialMode?: "signin" | "signup";
}

export default function AuthModal({ isOpen, onClose, onSuccess, initialMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const resetState = () => {
    setEmail("");
    setPassword("");
    setFullName("");
    setPhoneNumber("");
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(false);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const syncLoginDetails = async (
    userId: string,
    userEmail: string,
    name: string,
    phone: string,
    emailVerified: boolean,
    phoneVerified: boolean
  ) => {
    try {
      await supabase.from("login_details").upsert(
        {
          user_id: userId,
          email: userEmail,
          full_name: name,
          phone_number: phone,
          is_email_verified: emailVerified,
          is_phone_verified: phoneVerified,
          is_active: true,
          status: "active",
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );
    } catch (e) {
      console.warn("Direct login_details table sync note:", e);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user) {
          await syncLoginDetails(
            data.user.id,
            data.user.email || email,
            data.user.user_metadata?.full_name || "",
            data.user.phone || data.user.user_metadata?.phone_number || "",
            !!data.user.email_confirmed_at,
            !!data.user.phone_confirmed_at
          );
        }

        setSuccessMsg("Signed in successfully!");
        setTimeout(() => {
          handleClose();
          if (onSuccess) onSuccess();
        }, 800);
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone_number: phoneNumber,
            },
          },
        });

        if (error) throw error;

        if (data.user) {
          await syncLoginDetails(
            data.user.id,
            email,
            fullName,
            phoneNumber,
            !!data.user.email_confirmed_at,
            !!data.user.phone_confirmed_at
          );
        }

        if (data.session) {
          setSuccessMsg("Account created and signed in successfully!");
          setTimeout(() => {
            handleClose();
            if (onSuccess) onSuccess();
          }, 1000);
        } else {
          setSuccessMsg("Sign up successful! Please check your email to verify your account.");
        }
      }
    } catch (err: any) {
      console.error("Auth error:", err);
      setErrorMsg(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
        
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center space-x-3 mb-5">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-wide text-white">LIC Mithra Portal</h2>
              <p className="text-xs text-slate-400">Supabase Authentication</p>
            </div>
          </div>

          <div className="grid grid-cols-2 p-1 bg-slate-800/80 border border-slate-700/50 rounded-xl mb-6 text-xs font-medium">
            <button
              type="button"
              onClick={() => { setMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-all ${
                mode === "signin"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </button>
            <button
              type="button"
              onClick={() => { setMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
              className={`flex items-center justify-center space-x-2 py-2 rounded-lg transition-all ${
                mode === "signup"
                  ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </button>
          </div>

          {errorMsg && (
            <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-start space-x-2 text-red-200 text-xs sm:text-sm">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-start space-x-2 text-emerald-200 text-xs sm:text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === "signup" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rajesh Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+919876543210"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 bg-slate-950/80 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              ) : mode === "signin" ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Register Account</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-5 p-2.5 bg-slate-950/60 border border-slate-800 rounded-xl text-[11px] text-slate-400 text-center">
            <span className="font-semibold text-slate-300">Protected by 256-bit Encryption &amp; Row-Level Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
