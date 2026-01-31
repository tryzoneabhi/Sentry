
import React, { useState, useEffect, useCallback } from 'react';
import { Search, GraduationCap, Youtube, Bookmark, LayoutGrid, Brain, Loader2, Play, X, Sparkles, Filter, ChevronRight, BookOpenCheck } from 'lucide-react';
import { TEACHERS, SUBJECT_TOPICS } from './constants';
import { Video, Teacher, Bookmark as BookmarkType, RevisionCard } from './types';
import { fetchVideos } from './services/youtubeService';
import VideoCard from './components/VideoCard';
import VideoModal from './components/VideoModal';
import RevisionCardList from './components/RevisionCardList';
import ChatBot from './components/ChatBot';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'explore' | 'bookmarks' | 'revision'>('explore');
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher>(TEACHERS[0]);
  const [selectedTopic, setSelectedTopic] = useState<string>('All Topics');
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [bookmarks, setBookmarks] = useState<BookmarkType[]>(() => {
    const saved = localStorage.getItem('board-hub-bookmarks');
    return saved ? JSON.parse(saved) : [];
  });

  const loadVideos = useCallback(async () => {
    setLoading(true);
    const effectiveQuery = (selectedTopic === 'All Topics' ? searchQuery : `${selectedTopic} ${searchQuery}`).trim();
    const results = await fetchVideos(selectedTeacher.channelId, effectiveQuery);
    setVideos(results);
    setLoading(false);
  }, [selectedTeacher, selectedTopic, searchQuery]);

  useEffect(() => {
    if (activeTab === 'explore') {
      loadVideos();
    }
  }, [loadVideos, activeTab]);

  useEffect(() => {
    setSelectedTopic('All Topics');
  }, [selectedTeacher]);

  const toggleBookmark = (video: Video) => {
    let newBookmarks;
    if (bookmarks.some(b => b.videoId === video.id)) {
      newBookmarks = bookmarks.filter(b => b.videoId !== video.id);
    } else {
      newBookmarks = [...bookmarks, { videoId: video.id, title: video.title, thumbnail: video.thumbnail }];
    }
    setBookmarks(newBookmarks);
    localStorage.setItem('board-hub-bookmarks', JSON.stringify(newBookmarks));
  };

  const handleAddRevisionCard = (title: string, content: string) => {
    const saved = localStorage.getItem('revision-cards');
    const existing: RevisionCard[] = saved ? JSON.parse(saved) : [];
    const newCard: RevisionCard = {
      id: Date.now().toString(),
      title,
      content,
      category: 'General'
    };
    const updated = [newCard, ...existing];
    localStorage.setItem('revision-cards', JSON.stringify(updated));
    alert('Key points saved to Revision Cards!');
  };

  const topics = SUBJECT_TOPICS[selectedTeacher.subject] || [];

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] selection:bg-blue-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 transform hover:scale-105 transition-all cursor-pointer">
              <GraduationCap className="text-white w-8 h-8" />
            </div>
            <div>
              <h1 className="font-black text-2xl text-slate-900 tracking-tight flex items-center gap-2">
                BoardHub <span className="text-blue-600">Pro</span>
                <span className="hidden sm:inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 text-[9px] rounded uppercase tracking-[0.2em] font-black ring-1 ring-blue-100">AI Powered</span>
              </h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] hidden md:block">Distraction-Free Excellence</p>
            </div>
          </div>

          <div className="flex-1 max-w-xl mx-12 hidden lg:block">
            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
              <input 
                type="text" 
                placeholder="Deep search lectures..."
                className="w-full bg-slate-100/60 border-2 border-transparent rounded-[1.25rem] py-3.5 pl-14 pr-6 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 focus:bg-white transition-all text-sm font-semibold"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <nav className="flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200 shadow-inner">
            {[
              { id: 'explore', icon: LayoutGrid, label: 'Vault' },
              { id: 'bookmarks', icon: Bookmark, label: 'Saved' },
              { id: 'revision', icon: Brain, label: 'FlashCards' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-2.5 rounded-xl flex items-center gap-2.5 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-white text-blue-600 shadow-md transform scale-105' : 'text-slate-500 hover:text-slate-800 hover:bg-white/50'}`}
              >
                <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Dynamic Sub-Bar for Topic Filtering */}
      {activeTab === 'explore' && (
        <div className="bg-white border-b border-slate-100 sticky top-20 z-30 shadow-sm overflow-hidden">
          {/* Teacher / Channel Track */}
          <div className="max-w-7xl mx-auto px-6 py-5 flex gap-4 overflow-x-auto no-scrollbar">
            {TEACHERS.map(teacher => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher)}
                className={`flex-shrink-0 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 border-2 flex items-center gap-3 ${
                  selectedTeacher.id === teacher.id 
                  ? `${teacher.color} text-white border-transparent shadow-2xl shadow-blue-100 transform scale-105` 
                  : 'bg-white text-slate-500 border-slate-50 hover:border-slate-200 hover:bg-slate-50 hover:shadow-lg'
                }`}
              >
                {teacher.name}
                <span className={`text-[8px] px-2 py-0.5 rounded-full font-black ${selectedTeacher.id === teacher.id ? 'bg-white/20' : 'bg-slate-100 text-slate-400'}`}>
                  {teacher.subject}
                </span>
              </button>
            ))}
          </div>

          {/* Topic Track with Reset Filter 'Back' behavior */}
          <div className="max-w-7xl mx-auto px-6 pb-5 flex items-center gap-5">
            <div className="flex items-center gap-3 text-slate-400 shrink-0">
              <Filter className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Syllabus Filter:</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              <button
                onClick={() => setSelectedTopic('All Topics')}
                className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap flex items-center gap-2 ${
                  selectedTopic === 'All Topics'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xl'
                  : 'bg-white text-slate-400 border-slate-50 hover:border-slate-300'
                }`}
              >
                {selectedTopic !== 'All Topics' && <ChevronRight className="w-3 h-3 rotate-180" />}
                Show All
              </button>
              {topics.map(topic => (
                <button
                  key={topic}
                  onClick={() => setSelectedTopic(topic)}
                  className={`px-5 py-2 rounded-2xl text-[9px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                    selectedTopic === topic
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100'
                    : 'bg-white text-slate-500 border-slate-50 hover:border-blue-300 hover:text-blue-600'
                  }`}
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Dashboard */}
      <main className="flex-1 max-w-7xl mx-auto px-6 w-full py-12">
        {activeTab === 'explore' && (
          <>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 gap-6">
              <div>
                <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
                   {selectedTopic === 'All Topics' ? 'Lecture' : selectedTopic} <span className="text-blue-600">Vault</span>
                </h2>
                <div className="flex items-center gap-4 bg-white px-5 py-2.5 rounded-2xl border border-slate-100 shadow-sm w-fit">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em]">
                    Synchronized with {selectedTeacher.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-6 bg-white p-4 rounded-[2rem] border border-slate-100 shadow-xl">
                <div className="flex -space-x-3">
                  {[1,2,3].map(i => <div key={i} className={`w-10 h-10 rounded-full border-4 border-white bg-blue-50 flex items-center justify-center text-[10px] font-black text-blue-600`}>{i}</div>)}
                </div>
                <div className="pr-4">
                  <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Expert Curated</p>
                  <p className="text-[11px] font-black text-slate-800 flex items-center gap-2">
                    <BookOpenCheck className="w-3 h-3 text-emerald-500" /> Syllabus 2024-25
                  </p>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-8">
                <div className="relative">
                  <div className="w-24 h-24 border-8 border-blue-100 border-t-blue-600 rounded-full animate-spin shadow-2xl"></div>
                  <div className="absolute inset-0 m-auto w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-xs animate-pulse mb-2">Analyzing Board Content...</p>
                  <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Retrieving high-bitrate educational streams</p>
                </div>
              </div>
            ) : videos.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
                {videos.map(video => (
                  <VideoCard 
                    key={video.id} 
                    video={video} 
                    onClick={() => setSelectedVideo(video)}
                    isBookmarked={bookmarks.some(b => b.videoId === video.id)}
                    onBookmark={(e) => {
                      e.stopPropagation();
                      toggleBookmark(video);
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-black text-slate-800 mb-2 uppercase tracking-tight">No Resources Found</h3>
                <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-8">Try adjusting your syllabus filter or search query.</p>
                <button 
                  onClick={() => { setSelectedTopic('All Topics'); setSearchQuery(''); }}
                  className="px-8 py-3 bg-blue-600 text-white font-black uppercase text-[10px] tracking-[0.3em] rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 hover:-translate-y-1 transition-all"
                >
                   Return to Dashboard
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'bookmarks' && (
          <div className="animate-in fade-in duration-500">
            <h2 className="text-4xl font-black text-slate-900 mb-12 tracking-tighter uppercase italic">Study <span className="text-blue-600">Vault</span></h2>
            {bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {bookmarks.map(bm => (
                  <div 
                    key={bm.videoId}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all cursor-pointer group hover:-translate-y-2"
                    onClick={() => setSelectedVideo({ id: bm.videoId, title: bm.title, thumbnail: bm.thumbnail, description: '', publishedAt: '', channelTitle: '' })}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={bm.thumbnail} alt={bm.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all backdrop-blur-[2px]">
                         <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-300">
                           <Play className="text-blue-600 fill-blue-600 w-6 h-6 ml-1" />
                         </div>
                      </div>
                    </div>
                    <div className="p-6 flex justify-between items-center bg-white border-t border-slate-50">
                      <h3 className="text-sm font-black text-slate-800 line-clamp-1 tracking-tight pr-4">{bm.title}</h3>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setBookmarks(bookmarks.filter(b => b.videoId !== bm.videoId)); }}
                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-40 bg-white rounded-[3rem] border border-slate-100 shadow-inner">
                <Bookmark className="w-20 h-20 mb-8 text-slate-100" />
                <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Your repository is currently empty.</p>
                <button 
                  onClick={() => setActiveTab('explore')}
                  className="mt-8 text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline underline-offset-8"
                >
                  Go Explore Lectures
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'revision' && <RevisionCardList />}
      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-100 py-16 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex flex-col items-center md:items-start gap-5">
            <div className="flex items-center gap-4">
              <Youtube className="w-7 h-7 text-red-600" />
              <div className="h-6 w-px bg-slate-200"></div>
              <span className="text-[11px] font-black uppercase text-slate-400 tracking-[0.3em]">Verified Academy Partners</span>
            </div>
            <p className="text-[10px] text-slate-400 max-w-sm text-center md:text-left font-bold uppercase tracking-widest leading-loose">
              Educational aggregate platform for Grade 10 students. Leveraging deep neural models for distraction-free content synthesis. 2025 Board Syllabus Compliant.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-10">
            <div className="text-center md:text-right hidden sm:block border-r border-slate-100 pr-10">
               <p className="text-[10px] font-black uppercase text-slate-300 tracking-[0.4em] mb-2">Developed for Excellence</p>
               <p className="text-xs font-black text-slate-900 tracking-tighter italic">ELITE BOARD PREP 2025</p>
            </div>
            <div className="flex items-center gap-4 px-6 py-3 bg-blue-50 text-blue-600 font-black italic tracking-tighter rounded-2xl border border-blue-100 shadow-sm transform hover:rotate-2 transition-transform">
               <Sparkles className="w-5 h-5" />
               INTELLIGENCE BY GEMINI
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & AI Floating Utilities */}
      {selectedVideo && (
        <VideoModal 
          video={selectedVideo} 
          onClose={() => setSelectedVideo(null)} 
          onAddRevisionCard={handleAddRevisionCard}
        />
      )}
      
      <ChatBot />
    </div>
  );
};

export default App;
