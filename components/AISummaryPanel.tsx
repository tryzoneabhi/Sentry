
import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, BookOpen, Calculator, HelpCircle, Loader2, Volume2, Lightbulb, CheckCircle2, PlusCircle, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { Video, AISummary } from '../types';
import { generateVideoSummary, generateTTS } from '../services/geminiService';

interface AISummaryPanelProps {
  video: Video;
  onAddRevisionCard: (title: string, content: string) => void;
}

// Audio utility helpers
function decode(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const AISummaryPanel: React.FC<AISummaryPanelProps> = ({ video, onAddRevisionCard }) => {
  const [activeTab, setActiveTab] = useState<'summary' | 'formulas' | 'questions'>('summary');
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AISummary | null>(null);
  const [explainSimply, setExplainSimply] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const summaryData = await generateVideoSummary(video.title, video.description, explainSimply);
      setSummary(summaryData);
      setLoading(false);
      setCurrentQuizIdx(0);
      setQuizAnswers({});
    };
    fetchData();
  }, [video, explainSimply]);

  const speakSummary = async () => {
    if (!summary || isReading) return;
    setIsReading(true);
    
    const audioData = await generateTTS(summary.summary);
    if (audioData) {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      const ctx = audioContextRef.current;
      const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);
      source.onended = () => setIsReading(false);
      source.start();
    } else {
      setIsReading(false);
    }
  };

  const handleQuizNext = () => {
    if (summary && currentQuizIdx < summary.practiceQuestions.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    }
  };

  const handleQuizPrev = () => {
    if (currentQuizIdx > 0) {
      setCurrentQuizIdx(prev => prev - 1);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header Info */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-black text-slate-800 tracking-tight text-sm uppercase">AI Board Tutor</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Powered by Gemini AI</p>
          </div>
        </div>
      </div>

      {/* Mode Toggle & Fast AI Response Indicator */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${explainSimply ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'} transition-all`}>
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-black text-slate-800 uppercase tracking-wider block">Explain Simply</span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.1em]">Fast Lite Mode</span>
          </div>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input 
            type="checkbox" 
            className="sr-only peer" 
            checked={explainSimply}
            onChange={() => setExplainSimply(!explainSimply)}
          />
          <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-white shadow-sm z-10">
        {[
          { id: 'summary', icon: BookOpen, label: 'Analysis' },
          { id: 'formulas', icon: Calculator, label: 'Formulas' },
          { id: 'questions', icon: HelpCircle, label: 'Quick Quiz' },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 py-4 text-[10px] font-black uppercase tracking-wider flex flex-col items-center gap-1.5 transition-all relative ${activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
          >
            <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? 'stroke-[2.5px]' : ''}`} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 w-10 h-1 bg-blue-600 rounded-t-full"></div>}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar bg-white">
        {loading ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
            <div className="relative">
              <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
              <Sparkles className="absolute inset-0 m-auto w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Synthesizing High-Performance Insights...</p>
          </div>
        ) : summary ? (
          <div className="animate-in fade-in duration-300">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                    <BookOpen className="w-3 h-3 text-blue-500" /> Executive Summary
                  </h4>
                  <button 
                    onClick={speakSummary}
                    disabled={isReading}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest transition-all ${isReading ? 'bg-blue-100 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200'}`}
                  >
                    <Volume2 className={`w-3 h-3 ${isReading ? 'animate-pulse' : ''}`} />
                    {isReading ? 'Speaking...' : 'Listen to AI'}
                  </button>
                </div>
                
                <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-5 rounded-2xl border border-slate-100 italic shadow-inner">
                  "{summary.summary}"
                </p>

                <div>
                  <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Exam Must-Knows
                  </h4>
                  <div className="space-y-3">
                    {summary.keyPoints.map((pt, i) => (
                      <div key={i} className="flex gap-4 p-3 bg-white border border-slate-50 rounded-xl hover:border-blue-100 transition-colors">
                        <div className="w-5 h-5 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shrink-0">{i+1}</div>
                        <p className="text-sm text-slate-600 font-medium leading-snug">{pt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <button 
                  onClick={() => onAddRevisionCard(`${video.title} - Key Points`, summary.keyPoints.join('\n'))}
                  className="w-full flex items-center justify-center gap-3 py-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-100 font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 hover:-translate-y-0.5 transition-all"
                >
                  <PlusCircle className="w-4 h-4" /> Export to Flash Cards
                </button>
              </div>
            )}

            {activeTab === 'formulas' && (
              <div className="space-y-4">
                <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest flex items-center gap-2">
                  <Calculator className="w-3 h-3 text-blue-500" /> Definitions & Equations
                </h4>
                {summary.formulas.length > 0 ? (
                  summary.formulas.map((f, i) => (
                    <div key={i} className="p-5 bg-white rounded-2xl border-2 border-slate-50 shadow-sm text-sm font-bold text-blue-700 flex items-center gap-4 group hover:border-blue-100 transition-all">
                      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center text-[10px] shrink-0 font-black text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        {i+1}
                      </div>
                      <span className="tracking-tight">{f}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-16 text-center">
                    <Calculator className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                    <p className="text-sm text-slate-400 font-bold uppercase tracking-widest italic">No specific formulas detected in this video content.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'questions' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-800 text-[10px] uppercase tracking-widest">Interactive Assessment</h4>
                  <span className="text-[10px] font-black text-slate-400 tracking-widest bg-slate-100 px-2 py-1 rounded">
                    {currentQuizIdx + 1} / {summary.practiceQuestions.length}
                  </span>
                </div>

                {summary.practiceQuestions.length > 0 ? (
                  <div className="animate-in slide-in-from-right-4 duration-300">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6">
                      <p className="text-sm font-black text-slate-800 leading-snug mb-6">
                        {summary.practiceQuestions[currentQuizIdx].question}
                      </p>
                      <div className="grid grid-cols-1 gap-3">
                        {summary.practiceQuestions[currentQuizIdx].options.map((opt, oi) => {
                          const isSelected = quizAnswers[currentQuizIdx] === oi;
                          return (
                            <button 
                              key={oi} 
                              onClick={() => setQuizAnswers({ ...quizAnswers, [currentQuizIdx]: oi })}
                              className={`text-left text-xs p-4 rounded-2xl border-2 transition-all font-bold flex items-center gap-4 group ${
                                isSelected 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'bg-white border-slate-100 text-slate-600 hover:border-blue-400 hover:bg-blue-50'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-full border shrink-0 flex items-center justify-center text-[10px] font-black ${
                                isSelected ? 'bg-white text-blue-600 border-white' : 'border-slate-200 text-slate-400 group-hover:border-blue-400'
                              }`}>
                                {String.fromCharCode(65 + oi)}
                              </div>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      {/* Integrated Back Option for Quiz Navigation */}
                      <button 
                        onClick={handleQuizPrev}
                        disabled={currentQuizIdx === 0}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-800 hover:border-slate-800 transition-all disabled:opacity-30 disabled:hover:border-slate-200"
                      >
                        <ChevronLeft className="w-4 h-4" /> Back
                      </button>
                      
                      {currentQuizIdx === summary.practiceQuestions.length - 1 ? (
                        <button 
                          onClick={() => {
                            setCurrentQuizIdx(0);
                            setQuizAnswers({});
                          }}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-black transition-all"
                        >
                          <RotateCcw className="w-4 h-4" /> Reset Quiz
                        </button>
                      ) : (
                        <button 
                          onClick={handleQuizNext}
                          disabled={quizAnswers[currentQuizIdx] === undefined}
                          className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all disabled:opacity-50"
                        >
                          Next <ChevronRight className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-center text-slate-400 py-12 italic">No quiz questions generated for this lecture.</p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
            <Sparkles className="w-8 h-8 mb-4 opacity-20" />
            <p className="text-sm">Analysis module is initializing...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AISummaryPanel;
