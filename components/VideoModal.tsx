
import React, { useState } from 'react';
import { Video } from '../types';
import { X, ExternalLink, SearchCode, Loader2, ChevronLeft, Sparkles, Brain } from 'lucide-react';
import { analyzeVideoDeeply } from '../services/geminiService';
import AISummaryPanel from './AISummaryPanel';

interface VideoModalProps {
  video: Video;
  onClose: () => void;
  onAddRevisionCard: (title: string, content: string) => void;
}

const VideoModal: React.FC<VideoModalProps> = ({ video, onClose, onAddRevisionCard }) => {
  const [showDeepAnalysis, setShowDeepAnalysis] = useState(false);
  const [deepInsights, setDeepInsights] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const toggleDeepAnalysis = async () => {
    if (!deepInsights && !isAnalyzing) {
      setIsAnalyzing(true);
      const insights = await analyzeVideoDeeply(video.title, video.description);
      setDeepInsights(insights);
      setIsAnalyzing(false);
    }
    setShowDeepAnalysis(!showDeepAnalysis);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-0 sm:p-4 md:p-8 overflow-hidden animate-in fade-in duration-300">
      {/* Back to Dashboard Button (Satisfying user request for prominent back option) */}
      <button 
        onClick={onClose}
        className="fixed top-6 left-6 z-[60] flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full font-black text-[11px] uppercase tracking-[0.2em] border border-white/20 transition-all hover:scale-105 active:scale-95"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Dashboard
      </button>

      <div className="bg-white w-full max-w-7xl h-full max-h-full sm:max-h-[92vh] rounded-none sm:rounded-[2.5rem] overflow-hidden flex flex-col md:flex-row shadow-2xl ring-1 ring-white/20 relative">
        
        {/* Left Side: Video Player & Focus Area */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          <div className="relative aspect-video shadow-2xl z-10">
            <iframe
              src={`https://www.youtube.com/embed/${video.id}?autoplay=1&modestbranding=1&rel=0&showinfo=0&hd=1`}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          
          <div className="p-10 overflow-y-auto flex-1 text-white bg-gradient-to-b from-slate-900 via-slate-950 to-black no-scrollbar">
            <div className="flex items-center gap-4 mb-6">
              <span className="px-3 py-1 bg-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-blue-500/20">Focus Mode Active</span>
              <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold uppercase tracking-widest border-l border-white/10 pl-4">
                <Brain className="w-3 h-3 text-indigo-400" /> 
                AI Guided Session
              </div>
            </div>
            
            <h2 className="text-3xl font-black mb-6 leading-tight tracking-tight max-w-3xl italic">{video.title}</h2>
            
            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 pb-8 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center font-black text-sm">
                  {video.channelTitle.charAt(0)}
                </div>
                <span className="text-blue-400 font-black tracking-wide text-lg">{video.channelTitle}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button 
                  onClick={toggleDeepAnalysis}
                  className={`flex items-center gap-3 text-[11px] font-black uppercase tracking-widest px-6 py-3 rounded-2xl border transition-all ${showDeepAnalysis ? 'bg-indigo-600 border-indigo-500 text-white shadow-xl shadow-indigo-500/30' : 'bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10'}`}
                >
                  {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <SearchCode className="w-4 h-4" />}
                  {isAnalyzing ? 'Processing Intelligence...' : showDeepAnalysis ? 'Hide Deep Analysis' : 'Deep Analysis Pro'}
                </button>
                
                <a 
                  href={`https://www.youtube.com/watch?v=${video.id}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group flex items-center text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-white transition-all bg-white/5 px-6 py-3 rounded-2xl border border-white/10"
                >
                  YouTube <ExternalLink className="w-3 h-3 ml-2 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>

            {showDeepAnalysis && !isAnalyzing ? (
              <div className="animate-in slide-in-from-top-6 duration-500 bg-indigo-950/40 p-8 rounded-[2rem] border-2 border-indigo-500/20 mb-10 backdrop-blur-md">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-[11px] uppercase tracking-[0.3em] text-indigo-400 flex items-center gap-3">
                    <Sparkles className="w-4 h-4" /> Gemini 3 Pro Insight Engine
                  </h3>
                  <span className="text-[9px] font-black text-indigo-300/50 uppercase tracking-widest px-2 py-1 bg-indigo-500/10 rounded">Deep Semantic Analysis</span>
                </div>
                <div className="prose prose-invert prose-indigo prose-sm max-w-none font-medium leading-relaxed whitespace-pre-line opacity-90 text-slate-200">
                  {deepInsights}
                </div>
              </div>
            ) : null}

            <div className="prose prose-invert prose-sm max-w-none opacity-40 leading-relaxed font-medium mb-12">
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-4">Original Lecture Data</h4>
              <p className="whitespace-pre-line">{video.description}</p>
            </div>
          </div>
        </div>

        {/* Right Side: AI Panel (Integrated AISummaryPanel) */}
        <div className="w-full md:w-[480px] h-full relative border-l border-slate-100 flex flex-col">
          {/* Close Icon (Secondary option for back) */}
          <button 
            onClick={onClose} 
            className="absolute top-6 right-6 z-20 p-3 hover:bg-slate-100 rounded-2xl transition-all group bg-white/50 backdrop-blur-xl border border-slate-100 hidden sm:block"
          >
            <X className="w-6 h-6 text-slate-400 group-hover:rotate-90 transition-transform" />
          </button>
          
          <div className="flex-1 overflow-hidden">
            <AISummaryPanel 
              video={video} 
              onAddRevisionCard={onAddRevisionCard} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
