import React, { useState, useEffect, useRef } from "react";
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  RotateCcw, Sliders, GraduationCap, Award, HelpCircle, 
  Layers, ShieldCheck, Heart, UserCheck, Compass, Users2, 
  FileCheck, PhoneCall, Gift, CheckCircle2, AlertCircle, ChevronRight,
  Coins, Building, Plus
} from "lucide-react";
import { Scene } from "../types";
import { INITIAL_SCENES } from "../data";
import { LIC_PLANS } from "../plansData";
import { motion, AnimatePresence } from "motion/react";

interface VideoPlayerProps {
  onSceneChange?: (sceneId: number) => void;
  selectedSceneId?: number;
  scenes: Scene[];
  portfolioSelectedIds: string[];
}

export default function VideoPlayer({ onSceneChange, selectedSceneId, scenes, portfolioSelectedIds }: VideoPlayerProps) {
  const [currentSceneIndex, setCurrentSceneIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0); // 0 to 100 within current scene
  const [speed, setSpeed] = useState<number>(1); // 1x, 1.25x, 1.5x
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSubtitles, setShowSubtitles] = useState<boolean>(true);
  const [voiceoverEnabled, setVoiceoverEnabled] = useState<boolean>(true);
  const [audioVolume, setAudioVolume] = useState<number>(0.85);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Sync index if outer selection shifts
  useEffect(() => {
    if (selectedSceneId !== undefined) {
      const idx = scenes.findIndex(s => s.id === selectedSceneId);
      if (idx !== -1 && idx !== currentSceneIndex) {
        goToScene(idx);
      }
    }
  }, [selectedSceneId]);

  const activeScene = scenes[currentSceneIndex];

  // Web Speech API Voiceover Engine
  const speakSceneNarration = () => {
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel(); // Stop current speech
      if (!voiceoverEnabled || isMuted) return;

      const speechText = activeScene.narratorText;
      const utterance = new SpeechSynthesisUtterance(speechText);
      
      // Determine voice (try to find a warm friendly English/Hindi or default)
      const voices = window.speechSynthesis.getVoices();
      const idealLanguageVoice = voices.find(
        (v) => v.lang.startsWith("hi-IN") || v.lang.startsWith("en-IN")
      ) || voices.find((v) => v.lang.startsWith("en"));
      
      if (idealLanguageVoice) {
        utterance.voice = idealLanguageVoice;
      }

      utterance.rate = speed;
      utterance.volume = audioVolume;
      speechUtteranceRef.current = utterance;

      window.speechSynthesis.speak(utterance);
    }
  };

  // Trigger speech when scene shifts or speech state changes
  useEffect(() => {
    if (isPlaying) {
      speakSceneNarration();
    } else {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
    }
  }, [currentSceneIndex, isPlaying, voiceoverEnabled, isMuted, speed, audioVolume]);

  // Clean-up speech synthesis on unmount
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Frame timer for active scene playback simulation
  useEffect(() => {
    if (isPlaying) {
      const stepMs = 100; // Tick every 100ms
      const totalMs = activeScene.duration * 1000;
      const increment = (stepMs / totalMs) * 100 * speed;

      timerRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            handleSceneComplete();
            return 0;
          }
          return prev + increment;
        });
      }, stepMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, currentSceneIndex, speed, activeScene.duration]);

  const handleSceneComplete = () => {
    if (currentSceneIndex < scenes.length - 1) {
      const nextIdx = currentSceneIndex + 1;
      setCurrentSceneIndex(nextIdx);
      setProgress(0);
      if (onSceneChange) onSceneChange(scenes[nextIdx].id);
    } else {
      // Loop or stop
      setIsPlaying(false);
      setProgress(100);
    }
  };

  const goToScene = (index: number) => {
    setCurrentSceneIndex(index);
    setProgress(0);
    if (onSceneChange) onSceneChange(scenes[index].id);
    
    // Quick delay to ensure state updates before synthesizing
    if (isPlaying) {
      setTimeout(() => {
        speakSceneNarration();
      }, 50);
    }
  };

  const togglePlay = () => {
    const nextIsPlaying = !isPlaying;
    setIsPlaying(nextIsPlaying);

    if (typeof window !== "undefined" && window.speechSynthesis) {
      if (!nextIsPlaying) {
        window.speechSynthesis.pause();
      } else {
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        } else {
          speakSceneNarration();
        }
      }
    }
  };

  const handleNext = () => {
    if (currentSceneIndex < scenes.length - 1) {
      goToScene(currentSceneIndex + 1);
    }
  };

  const handlePrev = () => {
    if (currentSceneIndex > 0) {
      goToScene(currentSceneIndex - 1);
    }
  };

  const handleReset = () => {
    setProgress(0);
    goToScene(0);
  };

  const getPlanIcon = (id: string) => {
    switch (id) {
      case "labh":
        return <Award className="w-5 h-5 text-amber-500" />;
      case "anand":
        return <Heart className="w-5 h-5 text-red-500" />;
      case "umang":
        return <Coins className="w-5 h-5 text-emerald-500" />;
      case "lakshya":
        return <GraduationCap className="w-5 h-5 text-blue-500" />;
      case "bima_bachat":
        return <Layers className="w-5 h-5 text-orange-500" />;
      case "jeevan_amar":
        return <ShieldCheck className="w-5 h-5 text-indigo-500" />;
      case "jeevan_akshay":
        return <Building className="w-5 h-5 text-[#003087]" />;
      case "bhagya_lakshmi":
        return <Users2 className="w-5 h-5 text-pink-500" />;
      default:
        return <FileCheck className="w-5 h-5 text-slate-400" />;
    }
  };

  const getPlanDetails = (id: string) => {
    switch (id) {
      case "labh": return { name: "LIC Jeevan Labh", plan: 736 };
      case "anand": return { name: "LIC New Jeevan Anand", plan: 915 };
      case "umang": return { name: "LIC Jeevan Umang", plan: 945 };
      case "lakshya": return { name: "LIC Jeevan Lakshya", plan: 933 };
      case "bima_bachat": return { name: "LIC New Bima Bachat", plan: 948 };
      case "jeevan_amar": return { name: "LIC Jeevan Amar", plan: 855 };
      case "jeevan_akshay": return { name: "LIC Jeevan Akshay-VII", plan: 857 };
      case "bhagya_lakshmi": return { name: "LIC Bhagya Lakshmi", plan: 839 };
      default: {
        const p = LIC_PLANS.find(plan => plan.id === id);
        return p ? { name: p.name, plan: p.planNumber } : { name: id, plan: "" };
      }
    }
  };

  // Helper renderer for dynamic scene infographics
  const renderInteractiveGraphic = () => {
    // Catch dynamic intro scenes
    if (activeScene.id >= 10 && activeScene.id < 99) {
      const planId = (activeScene as any).associatedPlanId || "labh";
      const planDetails = getPlanDetails(planId);
      
      return (
        <div className="relative w-full h-full flex flex-col items-center justify-center bg-radial from-blue-950 to-slate-950 p-6 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(30,58,138,0.2)_0%,transparent_70%)] pointer-events-none" />
          
          <motion.div 
            initial={{ rotateY: 45, opacity: 0, scale: 0.95 }}
            animate={{ rotateY: 0, opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="bg-amber-50 rounded-lg p-5 shadow-2xl border-4 border-amber-400 max-w-sm w-full text-slate-800 relative"
          >
            <div className="absolute right-4 top-4 bg-orange-600 text-white font-bold text-[9px] px-2 py-0.5 rounded shadow animate-pulse uppercase">
              Plan {planDetails.plan || "736"}
            </div>
            
            <h4 className="font-serif text-sm border-b-2 border-amber-300 pb-2 text-center text-[#003087] font-extrabold tracking-wide">
              {planDetails.name}
            </h4>
            
            <div className="flex justify-center my-4">
              <div className="bg-blue-50 p-3 rounded-full border border-blue-200 shadow-inner flex items-center justify-center text-blue-900 bg-gradient-to-tr from-blue-100 to-indigo-100">
                {getPlanIcon(planId)}
              </div>
            </div>
            
            <div className="space-y-2.5 text-[11px] font-sans">
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Government-Backed Guarantee</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Tax Savings under Section 80C</span>
              </div>
              <div className="flex items-center gap-2 font-semibold text-slate-700">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Guaranteed Capital &amp; Profits Protection</span>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-amber-200 flex justify-between items-center text-[9px] text-slate-500 font-mono">
              <span>Sovereign Product Catalog</span>
              <span className="text-[#003087] font-bold">100% SECURE</span>
            </div>
          </motion.div>
        </div>
      );
    }

    switch (activeScene.id) {
      case 1: // Hook
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-radial from-slate-900 to-slate-950 p-6">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-yellow-500/10 to-transparent pointer-events-none" />
            
            {/* Animated Background Rays */}
            <div className="absolute w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl animate-pulse" />

            {/* Rising Golden Sun */}
            <motion.div 
              initial={{ y: 150, opacity: 0 }}
              animate={{ y: 20, opacity: 0.15 }}
              transition={{ duration: 3 }}
              className="absolute bottom-0 w-80 h-80 rounded-full bg-amber-400 blur-xl"
            />

            {/* Floating Milestones */}
            <div className="flex gap-8 mb-8 z-10">
              <motion.div 
                animate={{ y: [0, -10, 0] }} 
                transition={{ duration: 4, repeat: Infinity, delay: 0 }}
                className="p-4 bg-blue-900/40 border border-blue-500/20 rounded-xl flex flex-col items-center shadow-lg"
              >
                <GraduationCap className="w-10 h-10 text-yellow-400 mb-1" />
                <span className="text-[10px] font-mono text-blue-300">Padhai</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -12, 0] }} 
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
                className="p-4 bg-yellow-950/40 border border-yellow-500/20 rounded-xl flex flex-col items-center shadow-lg"
              >
                <Heart className="w-10 h-10 text-red-400 mb-1" />
                <span className="text-[10px] font-mono text-yellow-200">Shaadi</span>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }} 
                transition={{ duration: 4, repeat: Infinity, delay: 2 }}
                className="p-4 bg-emerald-950/40 border border-emerald-500/20 rounded-xl flex flex-col items-center shadow-lg"
              >
                <Award className="w-10 h-10 text-emerald-400 mb-1" />
                <span className="text-[10px] font-mono text-emerald-300">Retirement</span>
              </motion.div>
            </div>

            {/* Animated Silhouette Family */}
            <motion.div 
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex items-end gap-2 relative z-10 mt-2"
            >
              {/* Parent 1 */}
              <div className="w-8 h-20 bg-gradient-to-t from-blue-700 to-blue-400 rounded-t-full shadow-lg" />
              {/* Child 1 */}
              <div className="w-6 h-12 bg-gradient-to-t from-yellow-500 to-yellow-300 rounded-t-full shadow-lg" />
              {/* Child 2 */}
              <div className="w-5 h-10 bg-gradient-to-t from-rose-500 to-rose-300 rounded-t-full shadow-lg" />
              {/* Parent 2 */}
              <div className="w-8 h-18 bg-gradient-to-t from-blue-800 to-blue-500 rounded-t-full shadow-lg" />
            </motion.div>

            {/* Sparkle effects */}
            <div className="absolute inset-0 pointer-events-none">
              <span className="absolute top-1/4 left-1/4 w-1.5 h-1.5 bg-yellow-400 rounded-full animate-ping" />
              <span className="absolute top-1/3 right-1/4 w-2 h-2 bg-yellow-300 rounded-full animate-bounce" />
            </div>
          </div>
        );

      case 2: // Policy Intro Scroll
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-radial from-blue-950 to-slate-950 p-6 overflow-hidden">
            <motion.div 
              initial={{ rotateX: 60, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              transition={{ duration: 1 }}
              className="bg-amber-50 rounded-lg p-5 shadow-2xl border-4 border-amber-400 max-w-sm w-full text-slate-800 relative"
            >
              <div className="absolute right-4 top-4 bg-orange-600 text-white font-bold text-xs px-2 py-1 rounded shadow animate-pulse">
                PLAN 736
              </div>
              <h4 className="font-serif text-lg border-b-2 border-amber-300 pb-2 text-center text-blue-900 font-extrabold tracking-wide">
                LIC OF INDIA
              </h4>
              <p className="text-center font-mono text-[9px] uppercase tracking-wider text-slate-500 my-1">
                Government Backed Guarantee
              </p>
              
              <div className="space-y-2 mt-4 text-xs font-sans">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Limited Premium Paying Plan</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>With-Profit Sharing Dividends</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Non-Linked (No Stock Market Risks)</span>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-amber-200 flex justify-between items-center text-[10px] text-slate-500 font-mono">
                <span>Update: Oct 2024</span>
                <span className="text-blue-900 font-bold">100% SECURE</span>
              </div>
            </motion.div>
          </div>
        );

      case 3: // Comparisons Table
        return (
          <div className="w-full h-full flex flex-col justify-center bg-slate-900 p-4">
            <h4 className="text-xs font-mono text-yellow-400 mb-2 uppercase tracking-wide text-center">
              Market Comparison: Why Jeevan Labh Wins
            </h4>
            <div className="grid grid-cols-2 gap-4 text-center">
              {/* Other standard policies */}
              <motion.div 
                initial={{ x: -30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-slate-950/60 p-3 rounded-lg border border-red-500/20"
              >
                <h5 className="text-[11px] font-bold text-red-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 flex justify-center items-center gap-1">
                  ✕ Traditional Plans
                </h5>
                <ul className="text-[10px] text-slate-400 space-y-2.5 mt-3 text-left list-disc list-inside">
                  <li>Pay premiums for ALL policy years</li>
                  <li>No profit / bonus share guarantee</li>
                  <li>Very limited or zero loan liquidity</li>
                  <li>Rigid withdrawal structures</li>
                </ul>
              </motion.div>

              {/* LIC Jeevan Labh */}
              <motion.div 
                initial={{ x: 30, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-[#003087]/30 p-3 rounded-lg border-2 border-yellow-400 shadow-xl"
              >
                <h5 className="text-[11px] font-bold text-yellow-400 uppercase tracking-widest border-b border-blue-900/60 pb-1.5 flex justify-center items-center gap-1">
                  ✓ LIC Jeevan Labh
                </h5>
                <ul className="text-[10px] text-yellow-100 space-y-2.5 mt-3 text-left list-disc list-inside font-medium">
                  <li className="text-white font-bold">Pay premium of ONLY 10, 15, or 16 Years!</li>
                  <li>Generous 5.5% annual bonus rate!</li>
                  <li>Avail bank loans after 2 years!</li>
                  <li className="text-yellow-300">100% sovereign asset guarantee</li>
                </ul>
              </motion.div>
            </div>
          </div>
        );

      case 4: // Age Eligibility & Rules Timeline
        return (
          <div className="w-full h-full flex flex-col justify-center items-center bg-radial from-slate-950 to-indigo-950 p-6">
            <h4 className="text-xs font-sans text-yellow-400 uppercase tracking-widest font-semibold mb-4 text-center">
              LIC Jeevan Labh Lifespan Matrix
            </h4>
            
            {/* Age Bar Animation */}
            <div className="w-full max-w-sm bg-slate-850 p-4 rounded-xl border border-blue-500/10 space-y-4">
              <div className="relative h-4 bg-slate-900/80 rounded-full overflow-hidden border border-slate-700">
                {/* Eligible Range Highlight */}
                <div 
                  className="absolute left-[11%] right-[21%] h-full bg-gradient-to-r from-emerald-500 to-amber-400"
                  style={{ width: "68%" }} 
                />
                
                {/* Pointer Indicator */}
                <motion.div 
                  animate={{ left: ["10%", "90%", "10%"] }}
                  transition={{ duration: 6, repeat: Infinity }}
                  className="absolute top-0 w-1 h-full bg-white shadow-lg shadow-white"
                />
              </div>

              {/* Timeline Age Labels */}
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span className="text-red-400">Age 0 (Ineligible)</span>
                <span className="text-emerald-400 font-bold">Age 8 (Min Entry)</span>
                <span className="text-yellow-300">Age 59 (Max)</span>
                <span className="text-blue-300">Age 75 (Maturity)</span>
              </div>

              {/* Grid rules info */}
              <div className="grid grid-cols-2 gap-2 text-[10px] font-sans pt-1">
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                  <span className="block text-slate-400 font-mono text-[9px] uppercase">Min Assurance</span>
                  <span className="text-white font-bold text-xs font-serif">₹2,00,000</span>
                </div>
                <div className="p-2 bg-slate-900/60 rounded border border-slate-800">
                  <span className="block text-slate-400 font-mono text-[9px] uppercase">Max Assurance</span>
                  <span className="text-yellow-400 font-bold text-xs">No Limit</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Three Combinations Cards
        return (
          <div className="w-full h-full flex flex-col justify-center items-center bg-slate-900 p-4">
            <h4 className="text-xs font-mono text-center text-yellow-400 uppercase tracking-widest mb-3">
              Maturity Term Matrix (Limited Commitments)
            </h4>
            <div className="grid grid-cols-3 gap-3 w-full">
              {/* Combination 1 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-blue-950/60 p-3 rounded-lg border border-blue-500/20 text-center flex flex-col justify-between"
              >
                <div>
                  <GraduationCap className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <h5 className="text-[10px] font-bold text-white uppercase font-sans">Term: 16 Yrs</h5>
                  <p className="text-[9px] text-yellow-200 font-semibold mt-1">Pay: 10 Yrs only</p>
                </div>
                <span className="text-[9px] bg-blue-900 text-blue-200 py-0.5 px-1 rounded block mt-3 text-center">
                  🎓 Kid Education
                </span>
              </motion.div>

              {/* Combination 2 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-emerald-950/60 p-3 rounded-lg border border-emerald-500/20 text-center flex flex-col justify-between"
              >
                <div>
                  <Heart className="w-6 h-6 text-rose-400 mx-auto mb-1" />
                  <h5 className="text-[10px] font-bold text-white uppercase font-sans">Term: 21 Yrs</h5>
                  <p className="text-[9px] text-emerald-300 font-semibold mt-1">Pay: 15 Yrs only</p>
                </div>
                <span className="text-[9px] bg-emerald-900 text-emerald-200 py-0.5 px-1 rounded block mt-3 text-center">
                  💍 Child Wedding
                </span>
              </motion.div>

              {/* Combination 3 */}
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-purple-950/60 p-3 rounded-lg border border-purple-500/20 text-center flex flex-col justify-between"
              >
                <div>
                  <Award className="w-6 h-6 text-yellow-400 mx-auto mb-1" />
                  <h5 className="text-[10px] font-bold text-white uppercase font-sans">Term: 25 Yrs</h5>
                  <p className="text-[9px] text-purple-200 font-semibold mt-1">Pay: 16 Yrs only</p>
                </div>
                <span className="text-[9px] bg-purple-900 text-purple-200 py-0.5 px-1 rounded block mt-3 text-center">
                  👴 Ideal Wealth
                </span>
              </motion.div>
            </div>
          </div>
        );

      case 6: // Benefits Breakdown (Treasure Chest & Umbrella)
        return (
          <div className="w-full h-full grid grid-cols-2 bg-slate-900 p-4 items-center gap-4">
            {/* Maturity Benefit */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-yellow-500/20 text-center h-full flex flex-col justify-center items-center relative overflow-hidden">
              <motion.div 
                animate={{ y: [0, -4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-yellow-500/10 p-2.5 rounded-full mb-2"
              >
                <Gift className="w-8 h-8 text-yellow-400" />
              </motion.div>
              <h5 className="text-[11px] font-bold text-yellow-400 uppercase tracking-wider">Maturity Benefit</h5>
              <p className="text-[9px] text-slate-300 font-sans mt-2">
                Basic sum assured + Reversionary accumulator bonus + Final loyalty bonus. No taxes on payout!
              </p>
            </div>

            {/* Death safety */}
            <div className="bg-slate-950/80 p-3 rounded-lg border border-blue-500/20 text-center h-full flex flex-col justify-center items-center relative overflow-hidden">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="bg-blue-500/10 p-2.5 rounded-full mb-2"
              >
                <ShieldCheck className="w-8 h-8 text-blue-400" />
              </motion.div>
              <h5 className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Death Security</h5>
              <p className="text-[9px] text-slate-300 font-sans mt-2">
                Higher of 7x premiums or absolute Sum Assured + bonuses. Free of charge umbrella shielding.
              </p>
            </div>
          </div>
        );

      case 7: // Real Life Rahul Timeline
        return (
          <div className="w-full h-full flex flex-col justify-center bg-slate-950 p-4 font-sans text-white">
            <div className="flex justify-between items-center bg-blue-900/30 p-2 rounded border border-blue-500/20 mb-3">
              <span className="text-[10px] font-mono text-yellow-300">Case Study</span>
              <span className="text-xs font-bold font-sans">Rahul (Age 30)</span>
              <span className="text-[10px] bg-green-500/20 text-green-400 font-mono px-1 rounded">SA: ₹5 Lakh</span>
            </div>

            {/* Timeline graphics bar */}
            <div className="space-y-4">
              <div className="relative h-6 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex text-[8px] font-mono select-none">
                {/* Year 1-16: Pays Premium */}
                <div className="w-[64%] h-full bg-gradient-to-r from-blue-700 to-blue-500 flex items-center justify-center font-bold text-blue-100">
                  Pays ₹23,500/Yr (16 Yrs)
                </div>
                {/* Year 17-25: Free coverage shielding */}
                <motion.div 
                  className="w-[36%] h-full bg-emerald-600/40 border-l border-dashed border-emerald-500 flex items-center justify-center font-bold text-emerald-300 relative"
                  animate={{ opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  9 Yrs of FREE Shield
                </motion.div>
              </div>

              {/* Progress Labels */}
              <div className="flex justify-between text-[10px]">
                <div className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block" />
                  <span className="text-slate-300">Total Premium Paid: ~₹3.76 Lakhs</span>
                </div>
                <div className="flex items-center gap-1 text-yellow-400 font-bold">
                  <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full inline-block animate-ping" />
                  <span>On Maturity: ₹9.5 Lakhs+</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 8: // State Sales Intelligence Map
        return (
          <div className="w-full h-full flex flex-col justify-center items-center bg-slate-900 p-4">
            <h4 className="text-[11px] font-mono text-yellow-400 uppercase tracking-widest mb-2 text-center">
              Territorial Popularity Mapping (Top LIC States)
            </h4>
            
            {/* Visual Schematic India grid map */}
            <div className="grid grid-cols-4 gap-2 w-full text-center">
              <div className="p-1 px-1.5 bg-[#003087]/70 rounded border border-blue-400 text-white shadow">
                <span className="block text-[8px] text-yellow-300 font-mono">Uttar Pradesh</span>
                <span className="text-[11px] font-bold">🔥 5 / 5</span>
                <span className="block text-[8px] text-slate-300">Education Focused</span>
              </div>
              <div className="p-1 px-1.5 bg-[#003087]/70 rounded border border-blue-400 text-white shadow">
                <span className="block text-[8px] text-yellow-300 font-mono">Maharashtra</span>
                <span className="text-[11px] font-bold">🔥 5 / 5</span>
                <span className="block text-[8px] text-slate-300">Urban Corporates</span>
              </div>
              <div className="p-1 px-1.5 bg-slate-950/80 rounded border border-slate-800 text-white">
                <span className="block text-[8px] text-blue-300 font-mono">Tamil Nadu</span>
                <span className="text-[11px] font-bold">🔥 4 / 5</span>
                <span className="block text-[8px] text-slate-400">Traditional Savers</span>
              </div>
              <div className="p-1 px-1.5 bg-slate-950/80 rounded border border-slate-800 text-white">
                <span className="block text-[8px] text-blue-300 font-mono">West Bengal</span>
                <span className="text-[11px] font-bold">🔥 4 / 5</span>
                <span className="block text-[8px] text-slate-400">Loyal Middle-Class</span>
              </div>
            </div>

            {/* Small glowing text indicator */}
            <p className="text-[10px] font-sans text-slate-300 text-center mt-3 bg-slate-950/50 py-1.5 px-3 rounded-full border border-yellow-500/10">
              📍 <span className="text-yellow-400 font-bold">UP + Maharashtra</span> represent over 45% of total annual volumes.
            </p>
          </div>
        );

      case 9: // Ideal Buyer Carousel
        return (
          <div className="w-full h-full flex flex-col justify-center bg-slate-950 p-4 text-white">
            <h4 className="text-[10px] font-mono text-yellow-400 uppercase tracking-widest mb-3 text-center">
              Ideal Target Customer Profiles
            </h4>
            <div className="grid grid-cols-2 gap-2 text-left text-[10px]">
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="font-bold text-yellow-400 block">👨‍👩‍👧 Parents (Age 25-45)</span>
                <p className="text-slate-300 text-[9px] mt-1">Goal: Guarantee child's education and wedding funding.</p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="font-bold text-yellow-400 block">💼 Salaried Professionals</span>
                <p className="text-slate-300 text-[9px] mt-1">Goal: Enjoy Section 80C exemptions + market insulated assets.</p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="font-bold text-yellow-400 block">🌾 Rural Savers</span>
                <p className="text-slate-300 text-[9px] mt-1">Goal: Safe non-volatile cash building + local loan capability.</p>
              </div>
              <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                <span className="font-bold text-yellow-400 block">👴 Pre-retirement (45-55)</span>
                <p className="text-slate-300 text-[9px] mt-1">Goal: Deploy a safe 10-yr short accumulation premium series.</p>
              </div>
            </div>
          </div>
        );

      case 10: // Takeaways Summary
        return (
          <div className="w-full h-full flex flex-col justify-center items-center bg-[#003087] p-5 border-2 border-yellow-400 rounded-lg">
            <h3 className="text-sm font-serif font-black tracking-wide text-yellow-400 border-b border-blue-900 pb-2 w-full text-center">
              LIC Jeevan Labh Summary Chest
            </h3>
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full mt-4 text-[11px] text-white font-sans">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Plan No. 736 (Oct '24)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Pay Only 10, 15, or 16 Yrs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>₹55 / ₹1000 Bonus Rate</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-yellow-400 shrink-0" />
                <span>Section 80C Tax Savings</span>
              </div>
            </div>
          </div>
        );

      case 11: // Call to Action (Zindagi Ke Saath bhi...)
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-center bg-radial from-[#003087] to-slate-950 p-6 text-center border-t-4 border-yellow-400">
            <div className="absolute top-4 right-4 text-blue-300 font-mono text-[9px] border border-blue-500/20 px-2 py-0.5 rounded">
              Active plan
            </div>
            {/* Pulsing LIC logo mockup */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-full bg-yellow-400 flex items-center justify-center font-bold text-blue-910 outline-4 outline-yellow-400/20 mb-4 cursor-pointer"
            >
              <div className="text-center font-serif leading-none">
                <p className="text-[12px] font-black tracking-tighter text-[#003087]">LIC</p>
                <p className="text-[7px] text-slate-800">Trust Since 1956</p>
              </div>
            </motion.div>

            <h4 className="font-serif text-lg text-yellow-400 font-black italic tracking-wide">
              "Zindagi Ke Saath Bhi, Zindagi Ke Baad Bhi"
            </h4>
            
            <p className="text-[10.5px] text-zinc-300 mt-2 font-sans max-w-sm">
              Secure your children's higher study milestones, marriages, and your own cozy pension corpus. Contact your trusted LIC agent today!
            </p>
          </div>
        );

      case 99: // Custom Portfolio Combo Scene
        return (
          <div className="w-full h-full flex flex-col justify-center items-center bg-radial from-slate-900 to-blue-950 p-6 text-white overflow-hidden">
            <h4 className="text-xs font-mono text-[#ffd700] uppercase tracking-widest mb-4 text-center font-bold">
              Your Customized Sovereign Portfolio Combo
            </h4>
            
            {/* Horizontal timeline of selected plans */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-md">
              {/* Show up to 3 selected plans in the graphic */}
              {portfolioSelectedIds.slice(0, 3).map((planId, idx) => {
                const planDetails = getPlanDetails(planId);
                return (
                  <motion.div 
                    key={planId}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: idx * 0.2 }}
                    className="bg-slate-950/80 p-3 rounded-lg border-2 border-blue-500/35 text-center flex flex-col justify-between shadow-xl"
                  >
                    <div>
                      <div className="bg-slate-905 p-2 rounded-md inline-block mb-1 bg-slate-800 border border-slate-700 shadow-sm">
                        {getPlanIcon(planId)}
                      </div>
                      <h5 className="text-[10px] font-bold text-white truncate max-w-[100px] mx-auto mt-1">{planDetails.name}</h5>
                      <span className="text-[9px] text-[#ffd700] block font-mono font-bold">Plan {planDetails.plan}</span>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* If more than 3, show a "+X more" card */}
              {portfolioSelectedIds.length > 3 && (
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-slate-950/70 p-3 rounded-lg border border-dashed border-slate-600 text-center flex flex-col justify-center items-center shadow-lg"
                >
                  <Plus className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[10px] font-bold text-slate-400">+{portfolioSelectedIds.length - 3} More</span>
                </motion.div>
              )}
            </div>

            {/* Display allocation message */}
            <p className="text-[10.5px] text-slate-300 text-center mt-5 bg-slate-950/70 py-1.5 px-4 rounded-full border border-blue-500/20 shadow-sm max-w-sm">
              📊 Multi-policy safety locks: <span className="text-[#ffd700] font-bold">{portfolioSelectedIds.length} plans</span> active simultaneously.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="video-workspace">
      {/* LEFT: Video Player and Controls (Col span 8) */}
      <div className="lg:col-span-8 flex flex-col bg-white rounded border border-slate-200 overflow-hidden shadow-sm">
        
        {/* Top bar with active title */}
        <div className="bg-slate-50 px-4 py-2.5 border-b border-slate-200 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
            <span className="text-[10px] font-sans text-slate-500 tracking-wider uppercase font-extrabold">
              NoteLLM Storyboard Sim System
            </span>
          </div>
          <span className="text-xs font-semibold text-[#003087] font-sans">
            Scene {activeScene.id} of {scenes.length}
          </span>
        </div>

        {/* Cinematic Aspect Screen Area (16:9) */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {renderInteractiveGraphic()}

          {/* Subtitles Overlay */}
          {showSubtitles && (
            <div className="absolute bottom-4 inset-x-6 z-20 pointer-events-none">
              <div className="bg-slate-900/90 text-white font-sans text-xs px-4 py-2.5 rounded border border-[#ffd700]/30 text-center shadow-lg max-w-lg mx-auto">
                <span className="block text-[9px] font-sans text-[#ffd700] uppercase mb-1 font-bold">Narrator (Hinglish):</span>
                "{activeScene.narratorText}"
              </div>
            </div>
          )}

          {/* Watermark badge on player */}
          <div className="absolute top-4 left-4 z-10 select-none bg-slate-950/60 px-2.5 py-1 rounded backdrop-blur text-[10px] text-white border border-slate-800 font-sans font-semibold">
            🎬 {activeScene.title}
          </div>
        </div>

        {/* Subtitles & Volume Config strip */}
        <div className="bg-slate-50 border-t border-slate-200 py-2 px-4 flex flex-wrap justify-between items-center gap-3">
          {/* Quick Subtitle Controls */}
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={showSubtitles} 
                onChange={() => setShowSubtitles(!showSubtitles)}
                className="rounded border-slate-300 text-[#003087] focus:ring-[#ffd700] h-3.5 w-3.5"
              />
              <span>Captions On</span>
            </label>
            
            <label className="flex items-center gap-1.5 text-[11px] font-sans font-semibold text-slate-700 cursor-pointer select-none">
              <input 
                type="checkbox" 
                checked={voiceoverEnabled} 
                onChange={() => setVoiceoverEnabled(!voiceoverEnabled)}
                className="rounded border-slate-300 text-[#003087] focus:ring-[#ffd700] h-3.5 w-3.5"
              />
              <span>Voiceover Sprechen</span>
            </label>
          </div>

          {/* Speed Selector */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-sans text-slate-500 font-semibold">Tempo:</span>
            {[1, 1.25, 1.5].map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className={`px-2.5 py-0.5 text-[10px] font-sans rounded font-bold transition-all ${
                  speed === s 
                    ? "bg-[#ffd700] text-[#003087] shadow-sm border border-[#e1be00]" 
                    : "bg-white text-slate-700 hover:bg-slate-150 border border-slate-200"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Progress scrub bar */}
        <div className="relative w-full h-1.5 bg-slate-200 overflow-hidden cursor-pointer">
          <div 
            className="h-full bg-gradient-to-r from-[#003087] to-blue-600 transition-all duration-100 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Playback Controls Footer */}
        <div className="bg-slate-50 px-4 py-3 flex items-center justify-between gap-4 border-t border-slate-200">
          <div className="flex items-center gap-2.5">
            <button 
              onClick={handlePrev}
              disabled={currentSceneIndex === 0}
              title="Previous Scene"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button 
              onClick={togglePlay}
              className="p-3 bg-[#ffd700] hover:bg-[#ffe240] text-[#003087] rounded-full shadow hover:shadow-md transition-all transform active:scale-95 border border-[#ccae00]"
              title={isPlaying ? "Pause Scene" : "Play Scene"}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-[#003087]" /> : <Play className="w-5 h-5 fill-[#003087] ml-0.5" />}
            </button>

            <button 
              onClick={handleNext}
              disabled={currentSceneIndex === scenes.length - 1}
              title="Next Scene"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded disabled:opacity-30 disabled:pointer-events-none transition-all"
            >
              <SkipForward className="w-5 h-5" />
            </button>

            <button
              onClick={handleReset}
              title="Reset Video"
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200 rounded transition-all ml-1"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>

          {/* Time Indicator */}
          <div className="hidden sm:block text-slate-700 font-sans text-[11px] bg-slate-100 px-2.5 py-1 rounded border border-slate-200 font-semibold shadow-sm">
            Scene {currentSceneIndex + 1} Elapsed: {Math.round((progress / 100) * activeScene.duration)}s / {activeScene.duration}s
          </div>

          {/* Sound bar slider */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="text-slate-500 hover:text-slate-800 transition-colors"
              title={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <input 
              type="range" 
              min={0} 
              max={1} 
              step={0.1}
              value={audioVolume}
              onChange={(e) => {
                setAudioVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-16 h-1 bg-slate-350 rounded-lg appearance-none cursor-pointer accent-[#003087]"
            />
          </div>
        </div>

        {/* Current scene text details */}
        <div className="p-4 bg-white border-t border-slate-200">
          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 px-2 bg-blue-50 border border-blue-100 rounded text-[#003087] font-sans text-[10px] uppercase font-bold shadow-sm">
              Visual Board Instructions
            </span>
          </div>
          <p className="text-xs font-sans text-slate-700 leading-relaxed font-medium">
            {activeScene.visualDescription}
          </p>

          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="block text-[10px] font-sans text-slate-400 uppercase tracking-widest mb-1 font-bold">
                Visual Text Overlays:
              </span>
              <ul className="space-y-1">
                {activeScene.textOnScreen.map((text, i) => (
                  <li key={i} className="text-xs text-slate-600 font-sans flex items-center gap-1.5 leading-tight font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#003087] inline-block shrink-0 animate-ping" />
                    <span>{text}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
              <span className="block text-[10px] font-sans text-[#003087] uppercase tracking-wider mb-1 font-bold">
                Director Audio / Music Tag:
              </span>
              <p className="text-xs text-slate-600 font-sans italic font-medium">
                🎶 Indian Sitar Acoustical Fusion (Soft Upbeat Sync, 112 BPM)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Scene Guides Sidebar / Chapter Index (Col span 4) */}
      <div className="lg:col-span-4 flex flex-col gap-4">
        <div className="bg-white rounded border border-slate-200 overflow-hidden shadow-sm p-4">
          <h3 className="text-[10px] font-sans text-slate-500 uppercase tracking-widest border-b border-slate-100 pb-2 mb-3 font-bold flex items-center gap-1.5">
            <Sliders className="w-3.5 h-3.5 text-[#003087]" />
            Scene / Script Chapters
          </h3>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {scenes.map((scene, index) => {
              const isCurrent = index === currentSceneIndex;
              return (
                <button
                  key={scene.id}
                  onClick={() => goToScene(index)}
                  className={`w-full text-left p-2.5 rounded border transition-all flex items-start gap-2.5 ${
                    isCurrent
                      ? "bg-[#003087] border-[#003087] text-white shadow-sm"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span className={`h-6 w-6 rounded shrink-0 flex items-center justify-center font-sans text-xs font-bold ${
                    isCurrent
                      ? "bg-[#ffd700] text-[#003087]"
                      : "bg-slate-100 text-slate-500"
                  }`}>
                    {scene.id}
                  </span>
                  
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className={`text-xs font-bold truncate ${isCurrent ? "text-white" : "text-slate-800"}`}>
                        {scene.title}
                      </h4>
                    </div>
                    <span className={`block text-[10px] font-sans mt-0.5 ${isCurrent ? "text-blue-100" : "text-slate-500 font-medium"}`}>
                      Duration: {scene.duration}s | Plan Term: {scene.category}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interactive Quick Tips */}
        <div className="bg-white rounded border border-slate-200 p-4 space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#003087]" />
            <h4 className="text-xs font-sans font-bold text-[#003087] uppercase">
              How to operate NoteLLM Player
            </h4>
          </div>
          <p className="text-slate-600 text-[11px] leading-relaxed font-medium">
            Toggle <strong>Captions</strong> to hear Hinglish speech narration synced perfectly with each animated step. Adjust the speed multiplier to slide quickly through terms, and see live overlays updating in real time.
          </p>
        </div>
      </div>
    </div>
  );
}
