
import React, { useState } from 'react';
import { RevisionCard } from '../types';
import { Plus, X, BrainCircuit, Sparkles, Loader2, Wand2, Search, Trash2, CheckCircle2 } from 'lucide-react';
import { polishContent, generateRevisionCard } from '../services/geminiService';

const RevisionCardList: React.FC = () => {
  const [cards, setCards] = useState<RevisionCard[]>(() => {
    const saved = localStorage.getItem('revision-cards');
    return saved ? JSON.parse(saved) : [
      { id: '1', title: 'Ohm\'s Law', content: 'V = IR (Voltage = Current x Resistance) at constant temperature.', category: 'Science' },
      { id: '2', title: 'Quadratic Formula', content: 'x = [-b ± sqrt(b² - 4ac)] / 2a', category: 'Math' }
    ];
  });

  const [isAdding, setIsAdding] = useState(false);
  const [isPolishing, setIsPolishing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [newCard, setNewCard] = useState({ title: '', content: '', category: 'General' });

  const saveCards = (newCards: RevisionCard[]) => {
    setCards(newCards);
    localStorage.setItem('revision-cards', JSON.stringify(newCards));
  };

  const handleAIImprove = async () => {
    if (!newCard.content || isPolishing) return;
    setIsPolishing(true);
    const improved = await polishContent(newCard.content);
    if (improved) setNewCard(prev => ({ ...prev, content: improved }));
    setIsPolishing(false);
  };

  const handleMagicGenerate = async () => {
    if (!newCard.title || isGenerating) return;
    setIsGenerating(true);
    const generated = await generateRevisionCard(newCard.title);
    if (generated) {
      setNewCard({
        title: generated.title,
        content: generated.content,
        category: generated.category
      });
    }
    setIsGenerating(false);
  };

  const addCard = () => {
    if (!newCard.title || !newCard.content) return;
    const card: RevisionCard = {
      id: Date.now().toString(),
      title: newCard.title,
      content: newCard.content,
      category: newCard.category as any
    };
    saveCards([card, ...cards]);
    setNewCard({ title: '', content: '', category: 'General' });
    setIsAdding(false);
  };

  const deleteCard = (id: string) => {
    saveCards(cards.filter(c => c.id !== id));
  };

  const filteredCards = cards.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Math': return 'border-blue-500 text-blue-600 bg-blue-50';
      case 'Science': return 'border-emerald-500 text-emerald-600 bg-emerald-50';
      case 'Social': return 'border-amber-500 text-amber-600 bg-amber-50';
      case 'English': return 'border-purple-500 text-purple-600 bg-purple-50';
      default: return 'border-slate-300 text-slate-600 bg-slate-50';
    }
  };

  return (
    <div className="py-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-600 rounded-[1.25rem] shadow-xl shadow-blue-100">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic">Revision <span className="text-blue-600">Vault</span></h2>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em]">Manage your syllabus flashcards</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input 
              type="text" 
              placeholder="Search cards..."
              className="bg-white border-2 border-slate-100 rounded-2xl py-2.5 pl-12 pr-4 outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all text-xs font-bold w-full md:w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button 
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-3 bg-slate-900 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-xl hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4" /> Create Card
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] border-2 border-slate-100 mb-16 shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50/50 rounded-bl-full -z-10"></div>
          
          <div className="flex justify-between items-center mb-10">
            <div>
              <h3 className="font-black text-xl text-slate-900 uppercase tracking-tight">New Study Resource</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Manual entry or AI generation</p>
            </div>
            <button 
              onClick={() => setIsAdding(false)} 
              className="p-3 hover:bg-slate-100 rounded-2xl transition-all"
            >
              <X className="w-6 h-6 text-slate-300" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-10">
            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Topic or Concept Name</label>
                <div className="relative group">
                  <input 
                    type="text" 
                    placeholder="e.g., French Revolution"
                    className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:ring-0 focus:border-blue-600 outline-none font-black text-slate-800 transition-all"
                    value={newCard.title}
                    onChange={e => setNewCard({...newCard, title: e.target.value})}
                  />
                  <button 
                    onClick={handleMagicGenerate}
                    disabled={!newCard.title || isGenerating}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 disabled:opacity-30 transition-all shadow-lg"
                  >
                    {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Wand2 className="w-3 h-3" />}
                    Magic Gen
                  </button>
                </div>
              </div>
              
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Subject Category</label>
                <div className="flex flex-wrap gap-2">
                  {['Math', 'Science', 'Social', 'English', 'General'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setNewCard({...newCard, category: cat})}
                      className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 ${
                        newCard.category === cat 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg' 
                        : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative">
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2.5 block tracking-widest">Content & Details</label>
              <textarea 
                placeholder="Structure your notes here... Use bullet points for readability."
                className="w-full p-6 bg-slate-50 border-2 border-transparent rounded-3xl h-56 focus:ring-0 focus:border-blue-600 outline-none font-medium text-slate-600 leading-relaxed transition-all resize-none"
                value={newCard.content}
                onChange={e => setNewCard({...newCard, content: e.target.value})}
              />
              <button 
                onClick={handleAIImprove}
                disabled={!newCard.content || isPolishing}
                className="absolute bottom-4 right-4 bg-white/90 backdrop-blur border-2 border-blue-50 text-blue-600 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-white hover:border-blue-100 transition-all shadow-md"
              >
                {isPolishing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                AI Polish
              </button>
            </div>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={addCard}
              className="flex-1 bg-blue-600 text-white py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-700 transition-all shadow-2xl shadow-blue-100 hover:-translate-y-1"
            >
              Commit to Repository
            </button>
            <button 
              onClick={() => setIsAdding(false)}
              className="px-10 bg-slate-100 text-slate-500 py-5 rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:bg-slate-200 transition-all"
            >
              Discard
            </button>
          </div>
        </div>
      )}

      {filteredCards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredCards.map(card => {
            const colors = getCategoryColor(card.category);
            return (
              <div 
                key={card.id} 
                className="bg-white p-8 rounded-[2rem] border-2 border-slate-50 shadow-sm hover:shadow-2xl transition-all relative group hover:-translate-y-2 flex flex-col h-full"
              >
                <div className="flex justify-between items-start mb-6">
                  <span className={`text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border-2 ${colors}`}>
                    {card.category}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                    <button 
                      onClick={() => deleteCard(card.id)}
                      className="p-2.5 bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <h3 className="font-black text-slate-900 text-xl mb-4 tracking-tight leading-tight group-hover:text-blue-600 transition-colors">
                  {card.title}
                </h3>
                
                <div className="text-sm text-slate-500 leading-relaxed font-medium mb-8 whitespace-pre-wrap flex-1">
                  {card.content}
                </div>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Lesson</span>
                  </div>
                  <CheckCircle2 className="w-5 h-5 text-slate-100 group-hover:text-emerald-500 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 shadow-inner">
          <BrainCircuit className="w-20 h-20 text-slate-100 mx-auto mb-8" />
          <h4 className="text-xl font-black text-slate-400 uppercase tracking-widest">No FlashCards Found</h4>
          <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest mt-2">Start by creating your first study resource above</p>
        </div>
      )}
    </div>
  );
};

export default RevisionCardList;
