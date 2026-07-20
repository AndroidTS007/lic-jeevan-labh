import React, { useState } from "react";
import { 
  ShieldCheck, Sparkles, Award, Lock, ArrowRight, Play, Calculator as CalcIcon, 
  Compass, Bot, CheckCircle2, Mail, User as UserIcon, Phone, Eye, EyeOff, LogIn, UserPlus, AlertCircle 
} from "lucide-react";
import { supabase } from "../supabaseClient";

interface LandingPageProps {
  onLoginSuccess: () => void;
}

export default function LandingPage({ onLoginSuccess }: LandingPageProps) {
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (authMode === "signin") {
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

        setSuccessMsg("Signed in successfully! Launching dashboard...");
        setTimeout(() => {
          onLoginSuccess();
        }, 600);
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
          setSuccessMsg("Account created successfully! Launching dashboard...");
          setTimeout(() => {
            onLoginSuccess();
          }, 800);
        } else {
          setSuccessMsg("Registration successful! Account details saved. Please sign in with your credentials.");
          setAuthMode("signin");
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      
      {/* HEADER NAVIGATION BAR */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 md:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-xl flex items-center justify-center font-black text-slate-950 shadow-lg shadow-amber-500/20">
              <span className="text-base font-extrabold tracking-tighter">LIC</span>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] bg-amber-400/10 border border-amber-400/30 text-amber-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Plan 736 Intelligence
                </span>
                <span className="text-[10px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Sec 37 Protected
                </span>
              </div>
              <h1 className="text-base font-bold text-white tracking-tight">
                NoteLLM <span className="text-amber-400">Prompt Orchestrator</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                const formEl = document.getElementById("hero-auth-form");
                if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all active:scale-95 flex items-center space-x-1.5"
            >
              <LogIn className="w-4 h-4" />
              <span>Get Started</span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION WITH INTEGRATED AUTH CARD */}
      <section className="relative overflow-hidden py-12 md:py-20 px-4 md:px-8 border-b border-slate-800/60 bg-gradient-to-b from-slate-950 via-slate-900/60 to-slate-950">
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full text-amber-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>LIC Jeevan Labh &amp; Sovereign Portfolio Simulator</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              India's Premier <br />
              <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
                Sovereign Insurance &amp; NoteLLM
              </span> Studio
            </h2>

            <p className="text-slate-350 text-sm md:text-base leading-relaxed max-w-xl">
              Unlock interactive financial planning models for LIC Jeevan Labh (Plan 736), calculate sovereign guaranteed returns, simulate market-insulated child education portfolios, and chat with AI grounded in real-time LIC circulars.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Capital Sovereign Guarantee</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Tax Savings under Sec 80C &amp; 10(10D)</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dynamic NoteLLM Video Storyboards</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Gemini 3.5 AI Advisor with Search Grounding</span>
              </div>
            </div>

            <div className="p-4 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center space-x-4 max-w-md shadow-xl">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white uppercase tracking-wider">Parliament Security Act 1956</h4>
                <p className="text-slate-400 mt-0.5">Section 37 explicitly guarantees sum assured and bonus payouts by the Central Government of India.</p>
              </div>
            </div>
          </div>

          <div id="hero-auth-form" className="lg:col-span-5">
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400" />
              
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">Access Portal</h3>
                  <p className="text-xs text-slate-400">Sign in or create your account to unlock dashboard</p>
                </div>
                <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
                  <Lock className="w-5 h-5" />
                </div>
              </div>

              <div className="grid grid-cols-2 p-1 bg-slate-950/80 border border-slate-800 rounded-xl mb-6 text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => { setAuthMode("signin"); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg transition-all ${
                    authMode === "signin"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </button>
                <button
                  type="button"
                  onClick={() => { setAuthMode("signup"); setErrorMsg(null); setSuccessMsg(null); }}
                  className={`flex items-center justify-center space-x-2 py-2.5 rounded-lg transition-all ${
                    authMode === "signup"
                      ? "bg-amber-500 text-slate-950 font-bold shadow-md"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 bg-red-950/60 border border-red-800/60 rounded-xl flex items-start space-x-2 text-red-200 text-xs">
                  <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="mb-4 p-3 bg-emerald-950/60 border border-emerald-800/60 rounded-xl flex items-start space-x-2 text-emerald-200 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {authMode === "signup" && (
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
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
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
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
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
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
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
                      className="w-full pl-10 pr-10 py-2.5 bg-slate-950/90 border border-slate-700/80 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 text-sm"
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
                  className="w-full py-3 px-4 mt-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-bold rounded-xl shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-yellow-400 active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  ) : authMode === "signin" ? (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register &amp; Launch App</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center text-[11px] text-slate-500">
                Secured by Supabase Authentication &amp; Row-Level Security
              </div>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 px-4 md:px-8 bg-slate-950">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-extrabold uppercase tracking-widest text-amber-400">Integrated Intelligence</span>
            <h3 className="text-2xl sm:text-3xl font-bold text-white">5 Powerful Tools in One Unified Platform</h3>
            <p className="text-xs sm:text-sm text-slate-400">Everything you need to design, simulate, and present sovereign LIC financial portfolios.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all group">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 w-fit group-hover:scale-110 transition-transform">
                <Play className="w-6 h-6 fill-current" />
              </div>
              <h4 className="text-base font-bold text-white">Animated Storyboard Player</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Step-by-step scene simulator displaying visual descriptions, Hindi/English narration scripts, and screen callouts.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all group">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 w-fit group-hover:scale-110 transition-transform">
                <CalcIcon className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Premium Planner (Plan 736)</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Calculate precise 16, 21, and 25-year maturity benefits, PPT ratios, and rider combos with interactive sliders.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all group">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 w-fit group-hover:scale-110 transition-transform">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Sales Intelligence Heatmap</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Demographic map analytics detailing regional policy demand across North, West, South, and Central zones.
              </p>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-2xl space-y-4 hover:border-amber-500/50 transition-all group">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400 w-fit group-hover:scale-110 transition-transform">
                <Bot className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-white">Mithra AI Search Chat</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Gemini 3.5 AI Senior Financial Planner backed by real-time Google search grounding for up-to-date policy circulars.
              </p>
            </div>
          </div>

        </div>
      </section>

      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950 py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>LIC Mithra NoteLLM Studio &copy; 2026. All Sovereign Rights Reserved.</span>
          </div>
          <div className="flex items-center space-x-4 text-[11px]">
            <span>Section 37 Government Guarantee</span>
            <span>Section 80C &amp; 10(10D) Tax Benefits</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
