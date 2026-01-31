
import React from 'react';
import { Video } from '../types';
import { Clock, BookMarked, Play } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: () => void;
  isBookmarked: boolean;
  onBookmark: (e: React.MouseEvent) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({ video, onClick, isBookmarked, onBookmark }) => {
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-blue-200 transition-all duration-500 cursor-pointer hover:shadow-[0_20px_50px_-12px_rgba(59,130,246,0.15)] flex flex-col h-full"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-video overflow-hidden">
        <img 
          src={video.thumbnail} 
          alt={video.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Subtle Play Overlay with Backdrop Blur */}
        <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-[2px] flex items-center justify-center">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform translate-y-4 group-hover:translate-y-0 scale-75 group-hover:scale-100 transition-all duration-500 ease-out">
            <Play className="w-7 h-7 text-blue-600 fill-blue-600 ml-1" />
          </div>
        </div>

        {/* Video Duration Badge */}
        {video.duration && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-lg font-black uppercase tracking-widest border border-white/10 z-10">
            {video.duration}
          </div>
        )}
        
        {/* Floating Label */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1.5 bg-white/90 backdrop-blur-sm text-[8px] font-black uppercase tracking-[0.2em] text-slate-800 rounded-xl border border-slate-100 shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0">
            Watch Now
          </span>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-5">
          <h3 className="text-sm font-black text-slate-800 line-clamp-2 leading-relaxed tracking-tight group-hover:text-blue-600 transition-colors">
            {video.title}
          </h3>
          <button 
            onClick={onBookmark}
            className={`p-3 rounded-2xl transition-all duration-300 transform hover:scale-110 shrink-0 ${
              isBookmarked 
              ? 'bg-blue-50 text-blue-600 ring-2 ring-blue-100' 
              : 'bg-slate-50 text-slate-400 hover:text-blue-500 hover:bg-blue-50'
            }`}
            aria-label={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
          >
            <BookMarked className={`w-4 h-4 ${isBookmarked ? 'fill-blue-600' : ''}`} />
          </button>
        </div>
        
        <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-blue-50 to-indigo-50 flex items-center justify-center text-[10px] font-black text-blue-600 border border-blue-100/50">
              {video.channelTitle.charAt(0)}
            </div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] truncate max-w-[140px]">
              {video.channelTitle}
            </span>
          </div>
          
          <div className="flex items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
            <Clock className="w-3.5 h-3.5 mr-1.5" />
            {new Date(video.publishedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
