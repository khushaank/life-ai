import React, { useState, useEffect, useRef } from 'react';
import { Send, StopCircle, Loader2, Wand2, Plus, FileText } from 'lucide-react';
import { Message } from '../types';
import { getNextInterviewQuestion, improviseUserResponse } from '../services/geminiService';

interface ChatSessionProps {
  onFinish: (history: Message[]) => void;
}

const ChatSession: React.FC<ChatSessionProps> = ({ onFinish }) => {
  const [history, setHistory] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [improvising, setImprovising] = useState(false);
  const [maxQuestions, setMaxQuestions] = useState(30);
  const [limitReached, setLimitReached] = useState(false);
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Computed question count
  const questionCount = history.filter(m => m.role === 'model').length;

  // Initialize chat
  useEffect(() => {
    const initChat = async () => {
      setLoading(true);
      const firstQ = await getNextInterviewQuestion([]);
      setHistory([{ role: 'model', content: firstQ }]);
      setLoading(false);
    };
    initChat();
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    // Auto-focus input after model speaks, if not limited
    if (!loading && !limitReached && history.length > 0 && history[history.length - 1].role === 'model') {
       setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [history, loading, limitReached]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newHistory: Message[] = [...history, { role: 'user', content: input }];
    setHistory(newHistory);
    setInput('');
    setLoading(true);

    // Check if we hit the limit based on the question user just answered
    const currentQCount = newHistory.filter(m => m.role === 'model').length;
    
    if (currentQCount >= maxQuestions) {
      setLoading(false);
      setLimitReached(true);
      return;
    }

    try {
      const nextQ = await getNextInterviewQuestion(newHistory);
      setHistory(prev => [...prev, { role: 'model', content: nextQ }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleImprovise = async () => {
    if (!input.trim() || improvising) return;
    setImprovising(true);
    try {
      const refined = await improviseUserResponse(input);
      setInput(refined);
      inputRef.current?.focus();
    } catch (e) {
      console.error(e);
    } finally {
      setImprovising(false);
    }
  };

  const handleContinue = async () => {
    setLimitReached(false);
    setLoading(true);
    setMaxQuestions(prev => prev + 5);
    try {
      // Fetch the next question we delayed
      const nextQ = await getNextInterviewQuestion(history);
      setHistory(prev => [...prev, { role: 'model', content: nextQ }]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="flex flex-col h-screen bg-elite-black max-w-4xl mx-auto border-x border-white/5 shadow-2xl relative">
      {/* Header */}
      <div className="p-4 border-b border-white/10 flex justify-between items-center bg-elite-black/80 backdrop-blur sticky top-0 z-10">
        <div>
          <h2 className="text-white font-mono font-bold tracking-wider">ASSESSMENT PHASE</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs text-gray-400">
              Question <span className="text-elite-accent font-bold">{questionCount}</span> of {maxQuestions}
            </span>
            <div className="h-1 w-24 bg-gray-800 rounded-full overflow-hidden">
               <div 
                  className="h-full bg-elite-accent transition-all duration-500" 
                  style={{ width: `${Math.min((questionCount / maxQuestions) * 100, 100)}%` }}
               />
            </div>
          </div>
        </div>
        <button
          onClick={() => onFinish(history)}
          className="text-xs flex items-center gap-2 bg-elite-danger/10 text-elite-danger px-3 py-1.5 rounded hover:bg-elite-danger/20 transition-colors border border-elite-danger/20"
        >
          <StopCircle size={14} />
          GENERATE DASHBOARD
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6" ref={scrollRef}>
        {history.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] md:max-w-[70%] p-4 rounded-2xl text-sm md:text-base leading-relaxed animate-fade-in ${
                msg.role === 'user'
                  ? 'bg-white/10 text-white rounded-tr-none border border-white/5'
                  : 'bg-elite-accent/10 text-blue-100 rounded-tl-none border border-elite-accent/20'
              }`}
            >
               {msg.role === 'model' && (
                  <span className="text-xs font-mono text-elite-accent block mb-2 opacity-70">
                    LIFE_ARCHITECT_AI // Q{Math.floor(idx/2) + 1}
                  </span>
               )}
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-elite-accent/5 text-blue-100 p-4 rounded-2xl rounded-tl-none border border-elite-accent/10 flex items-center gap-2">
              <Loader2 className="animate-spin text-elite-accent" size={16} />
              <span className="text-xs font-mono animate-pulse">ANALYZING RESPONSE...</span>
            </div>
          </div>
        )}
        
        {/* Limit Reached Dialog inside the chat flow */}
        {limitReached && (
           <div className="flex flex-col items-center justify-center p-6 bg-elite-gray/50 border border-white/10 rounded-2xl m-4 animate-fade-in text-center">
              <FileText className="text-elite-accent mb-3" size={32} />
              <h3 className="text-xl font-bold text-white mb-2">Assessment Complete</h3>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                We have reached the standard 30-question depth. I have enough data to build your strategic profile. 
                Would you like to generate the dashboard now, or go deeper with 5 more targeted questions?
              </p>
              <div className="flex gap-4">
                 <button 
                    onClick={() => onFinish(history)}
                    className="flex items-center gap-2 px-6 py-3 bg-elite-success text-black font-bold rounded-lg hover:bg-emerald-400 transition-colors"
                 >
                    <StopCircle size={18} />
                    Generate Dashboard
                 </button>
                 <button 
                    onClick={handleContinue}
                    className="flex items-center gap-2 px-6 py-3 bg-elite-gray border border-white/20 text-white font-bold rounded-lg hover:bg-white/10 transition-colors"
                 >
                    <Plus size={18} />
                    Ask 5 More
                 </button>
              </div>
           </div>
        )}
      </div>

      {/* Input */}
      {!limitReached && (
        <div className="p-4 border-t border-white/10 bg-elite-black/90 pb-8 md:pb-4">
          <div className="relative flex items-center gap-2">
            <div className="relative flex-grow">
               <input
                 ref={inputRef}
                 type="text"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyDown={handleKeyDown}
                 placeholder="Type your answer..."
                 disabled={loading}
                 className="w-full bg-elite-gray border border-white/10 text-white p-4 pr-12 rounded-xl focus:outline-none focus:ring-1 focus:ring-elite-accent/50 placeholder-gray-600 font-light"
               />
               <button
                 onClick={handleSend}
                 disabled={!input.trim() || loading}
                 className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-elite-accent text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-600 transition-colors"
               >
                 <Send size={18} />
               </button>
            </div>
            
            {/* Improvise Button */}
            {input.trim().length > 3 && (
               <button
                 onClick={handleImprovise}
                 disabled={improvising}
                 className="flex items-center gap-2 px-4 py-4 bg-purple-500/10 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-500/20 transition-all text-sm font-medium whitespace-nowrap"
                 title="AI Improve: Refine your thoughts"
               >
                 {improvising ? <Loader2 className="animate-spin" size={18} /> : <Wand2 size={18} />}
                 <span className="hidden md:inline">Refine</span>
               </button>
            )}
          </div>
          <p className="text-[10px] text-center text-gray-600 mt-2 font-mono flex justify-center gap-4">
             <span>PRESS ENTER TO SEND</span>
             <span>•</span>
             <span>USE 'REFINE' TO CLARIFY THOUGHTS</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatSession;