import React, { useState, useEffect } from "react";
import { 
  Sliders, FileText, Copy, Check, Download, Edit3, Save, 
  Settings, Play, RefreshCw, Layers, Sparkles, Plus, Trash2, Tag
} from "lucide-react";
import { Scene } from "../types";
import { INITIAL_SCENES, DEFAULT_PROMPT_METADATA } from "../data";

interface StudioEditorProps {
  onUpdateScenes: (scenes: Scene[]) => void;
  onSelectScene: (sceneId: number) => void;
}

export default function StudioEditor({ onUpdateScenes, onSelectScene }: StudioEditorProps) {
  const [scenes, setScenes] = useState<Scene[]>(INITIAL_SCENES);
  const [copied, setCopied] = useState<boolean>(false);
  const [selectedSceneIndex, setSelectedSceneIndex] = useState<number>(0);
  
  // Custom video properties
  const [aspectRatio, setAspectRatio] = useState<string>("16:9");
  const [fps, setFps] = useState<string>("60 FPS");
  const [musicGenre, setMusicGenre] = useState<string>("Upbeat Corporate Sitar and Acoustical Fusion");
  const [narratorVoice, setNarratorVoice] = useState<string>("Warm Hinglish Male/Female Professional Duo");
  const [overallVibe, setOverallVibe] = useState<string>("Aesthetic flat infographics, bold vector assets, brand blue and gold accent tones");

  const activeScene = scenes[selectedSceneIndex];

  // Trigger parent updates
  useEffect(() => {
    onUpdateScenes(scenes);
  }, [scenes]);

  const handleFieldChange = (index: number, field: keyof Scene, value: any) => {
    const updated = [...scenes];
    updated[index] = { ...updated[index], [field]: value };
    setScenes(updated);
  };

  const handleTextOnScreenChange = (sceneIdx: number, textIdx: number, value: string) => {
    const updated = [...scenes];
    const screenTexts = [...updated[sceneIdx].textOnScreen];
    screenTexts[textIdx] = value;
    updated[sceneIdx] = { ...updated[sceneIdx], textOnScreen: screenTexts };
    setScenes(updated);
  };

  const handleAddOverlayText = (sceneIdx: number) => {
    const updated = [...scenes];
    const screenTexts = [...updated[sceneIdx].textOnScreen, "New screen text overlay..."];
    updated[sceneIdx] = { ...updated[sceneIdx], textOnScreen: screenTexts };
    setScenes(updated);
  };

  const handleRemoveOverlayText = (sceneIdx: number, textIdx: number) => {
    const updated = [...scenes];
    const screenTexts = [...updated[sceneIdx].textOnScreen];
    screenTexts.splice(textIdx, 1);
    updated[sceneIdx] = { ...updated[sceneIdx], textOnScreen: screenTexts };
    setScenes(updated);
  };

  // Compile prompt to standard Markdown exactly as formatted in the user's requirements
  const compiledMarkdownPrompt = () => {
    let markdown = `# 🎬 NoteLLM Generated Video Prompt: LIC Jeevan Labh\n\n`;
    markdown += `## 🎯 CUSTOM METADATA SETTINGS\n`;
    markdown += `- **Aspect Ratio:** ${aspectRatio}\n`;
    markdown += `- **Rendering Frame Rate:** ${fps}\n`;
    markdown += `- **Sound Mix:** ${musicGenre}\n`;
    markdown += `- **Voice Synthesis Duo:** ${narratorVoice}\n`;
    markdown += `- **Aesthetic Vibe Mood:** ${overallVibe}\n\n`;
    
    markdown += `## 📋 SCENE-BY-SCENE COMPILATION\n\n`;
    
    scenes.forEach((scene) => {
      markdown += `### 🎬 SCENE ${scene.id} — ${scene.title} (${scene.duration} Seconds)\n`;
      markdown += `**Visual Description:** ${scene.visualDescription}\n`;
      markdown += `**Text on screen (animated):**\n`;
      scene.textOnScreen.forEach((text) => {
        markdown += `> *"${text}"*\n`;
      });
      markdown += `\n**Voiceover Script (Hinglish):**\n`;
      markdown += `*"${scene.narratorText}"*\n\n`;
      markdown += `---\n\n`;
    });

    markdown += `\n*Metadata generated via LIC Jeevan Labh NoteLLM Studio (June 2026)*`;
    return markdown;
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(compiledMarkdownPrompt());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadJSON = () => {
    const bundle = {
      project: "LIC Jeevan Labh NoteLLM Video",
      created: "2026-06-19",
      settings: {
        aspectRatio,
        fps,
        musicGenre,
        narratorVoice,
        overallVibe
      },
      scenes: scenes
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "lic_jeevan_labh_notellm_bundle.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden p-6" id="script-studio">
      
      {/* Title */}
      <div className="border-b border-slate-800 pb-5 mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="bg-[#003087] text-yellow-400 p-2.5 rounded-xl border border-yellow-400/20">
            <Edit3 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-blue-400">
              NoteLLM Prompt Customizer & Markdown Studio
            </span>
            <h2 className="text-xl font-serif font-black text-white tracking-tight">
              Interactive Storyboard Script Editor
            </h2>
          </div>
        </div>

        {/* Copy / Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyPrompt}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-500 text-slate-950 rounded-lg text-xs font-mono font-bold transition-all shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? "Copied Prompt!" : "Copy Full Prompt"}</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-mono transition-all border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON Bundle</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Scene Editor details (Col span 7) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-slate-950/60 rounded-xl p-5 border border-slate-800 space-y-4">
            
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-yellow-400 uppercase">
                Active Chapter Editor
              </span>
              <div className="flex gap-1.5">
                {scenes.map((s, i) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      setSelectedSceneIndex(i);
                      onSelectScene(s.id);
                    }}
                    className={`h-6 w-6 rounded font-mono text-[10px] font-bold border transition-colors ${
                      i === selectedSceneIndex
                        ? "bg-yellow-400 text-slate-950 border-yellow-400"
                        : "bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    {s.id}
                  </button>
                ))}
              </div>
            </div>

            {activeScene ? (
              <div className="space-y-4 pt-2 border-t border-slate-900 font-sans">
                
                {/* Title & Duration */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="md:col-span-2 space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block">Scene Title:</label>
                    <input 
                      type="text"
                      value={activeScene.title}
                      onChange={(e) => handleFieldChange(selectedSceneIndex, "title", e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block">Duration (Secs):</label>
                    <input 
                      type="number"
                      min={3}
                      max={60}
                      value={activeScene.duration}
                      onChange={(e) => handleFieldChange(selectedSceneIndex, "duration", parseInt(e.target.value) || 10)}
                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                    />
                  </div>
                </div>

                {/* Narrator text input */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-400 uppercase flex justify-between items-center">
                    <span>Hinglish Voiceover Scripture:</span>
                    <span className="text-zinc-600 font-normal">Web Speech Sync Active</span>
                  </label>
                  <textarea
                    rows={3}
                    value={activeScene.narratorText}
                    onChange={(e) => handleFieldChange(selectedSceneIndex, "narratorText", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-xs text-white leading-relaxed focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* Visual Description */}
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase block">Director Visual Animation Instructions:</label>
                  <textarea
                    rows={2}
                    value={activeScene.visualDescription}
                    onChange={(e) => handleFieldChange(selectedSceneIndex, "visualDescription", e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded p-3 text-xs text-slate-300 leading-relaxed focus:outline-none focus:border-yellow-400"
                  />
                </div>

                {/* On-screen text overlays */}
                <div className="space-y-2 pt-2 border-t border-slate-900">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase block">Overlay Subtitles (On-Screen):</label>
                    <button
                      type="button"
                      onClick={() => handleAddOverlayText(selectedSceneIndex)}
                      className="text-[9px] font-mono text-yellow-400 flex items-center gap-1 hover:underline"
                    >
                      <Plus className="w-3 h-3" /> Add Overlay
                    </button>
                  </div>
                  
                  <div className="space-y-1.5">
                    {activeScene.textOnScreen.map((text, tidx) => (
                      <div key={tidx} className="flex gap-2">
                        <input 
                          type="text"
                          value={text}
                          onChange={(e) => handleTextOnScreenChange(selectedSceneIndex, tidx, e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-350 focus:outline-none focus:border-yellow-400"
                        />
                        <button
                          type="button"
                          onClick={() => handleRemoveOverlayText(selectedSceneIndex, tidx)}
                          disabled={activeScene.textOnScreen.length <= 1}
                          className="p-1 px-1.5 bg-slate-900 border border-slate-800 hover:bg-red-950 hover:text-red-400 text-zinc-500 rounded disabled:opacity-30 disabled:pointer-events-none"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <p className="text-xs text-zinc-400">Select a scene bubble above or on the outline to edit.</p>
            )}

          </div>
        </div>

        {/* RIGHT Studio Global Configurations (Col span 5) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          
          {/* Global Video parameters */}
          <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-5 space-y-4">
            <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-yellow-400" />
              NoteLLM Output Variables
            </h3>

            {/* Aspect ratio */}
            <div className="space-y-1 text-xs">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">Aspect Ratio Format:</span>
              <div className="grid grid-cols-3 gap-2 mt-1">
                {["16:9", "9:16", "1:1"].map((aspect) => (
                  <button
                    key={aspect}
                    onClick={() => setAspectRatio(aspect)}
                    className={`py-1 text-[10.5px] font-mono rounded border transition-colors ${
                      aspectRatio === aspect
                        ? "border-yellow-400 text-yellow-400 bg-yellow-400/5 font-bold"
                        : "border-slate-800 text-zinc-400 hover:bg-slate-900"
                    }`}
                  >
                    {aspect === "16:9" ? "16:9 Lands" : aspect === "9:16" ? "9:16 Shorts" : "1:1 Square"}
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Selector */}
            <div className="space-y-1 text-xs pt-1.5">
              <span className="block text-[10px] font-mono text-zinc-500 uppercase">Frame Rate Speed:</span>
              <div className="grid grid-cols-2 gap-2 mt-1">
                {["60 FPS", "30 FPS"].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFps(f)}
                    className={`py-1 text-[10.5px] font-mono rounded border transition-colors ${
                      fps === f
                        ? "border-yellow-400 text-yellow-400 bg-yellow-400/5 font-bold"
                        : "border-slate-800 text-zinc-400 hover:bg-slate-900"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Sound tracking label */}
            <div className="space-y-1 pt-1.5">
              <label className="text-[10px] font-mono text-zinc-500 uppercase block">Musical Fusion Track:</label>
              <input 
                type="text"
                value={musicGenre}
                onChange={(e) => setMusicGenre(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
              />
            </div>

            {/* Voice synth preferences text */}
            <div className="space-y-1 pt-1.5">
              <label className="text-[10px] font-mono text-zinc-500 uppercase block">Voice narrator setup:</label>
              <input 
                type="text"
                value={narratorVoice}
                onChange={(e) => setNarratorVoice(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-zinc-300 focus:outline-none"
              />
            </div>
          </div>

          {/* Quick Real-Time Render check box */}
          <div className="bg-yellow-400/5 border border-yellow-400/20 p-4 rounded-xl flex gap-3 text-xs leading-relaxed text-yellow-250">
            <Sparkles className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-yellow-300 block">Prompt Live Sync Engaged</span>
              Any edits to narrator words or scene metadata instantly compiles down into output code arrays which can be viewed or copied above. You can paste the compiled prompt directly into NoteLLM generating systems!
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
