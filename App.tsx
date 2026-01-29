import React, { useState } from 'react';
import Welcome from './components/Welcome';
import ChatSession from './components/ChatSession';
import Dashboard from './components/Dashboard';
import { generateDashboardAnalysis } from './services/geminiService';
import { Message, DashboardData } from './types';
import { Loader2, AlertCircle } from 'lucide-react';

enum AppState {
  WELCOME,
  CHAT,
  ANALYZING,
  DASHBOARD,
  ERROR
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.WELCOME);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [chatHistory, setChatHistory] = useState<Message[]>([]);

  const startAssessment = () => {
    setAppState(AppState.CHAT);
  };

  const finishAssessment = async (history: Message[]) => {
    setChatHistory(history);
    setAppState(AppState.ANALYZING);
    // Ensure we have enough data (at least user messages)
    if (history.length < 2) {
       // Just a safeguard, in reality we might want to prompt user
       console.warn("Short history");
    }
    
    const data = await generateDashboardAnalysis(history);
    
    if (data) {
      setDashboardData(data);
      setAppState(AppState.DASHBOARD);
    } else {
      setAppState(AppState.ERROR);
    }
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.WELCOME:
        return <Welcome onStart={startAssessment} />;
      
      case AppState.CHAT:
        return <ChatSession onFinish={finishAssessment} />;
      
      case AppState.ANALYZING:
        return (
          <div className="min-h-screen bg-elite-black flex flex-col items-center justify-center text-white space-y-4 p-4 text-center">
            <Loader2 size={48} className="animate-spin text-elite-accent" />
            <h2 className="text-2xl font-bold font-mono">CONSTRUCTING LIFE STRATEGY...</h2>
            <p className="text-gray-500 max-w-md">
              Analyzing cognitive patterns, calculating career trajectories, and identifying critical weaknesses.
            </p>
          </div>
        );
      
      case AppState.DASHBOARD:
        return dashboardData ? <Dashboard data={dashboardData} history={chatHistory} /> : null;
      
      case AppState.ERROR:
        return (
          <div className="min-h-screen bg-elite-black flex flex-col items-center justify-center text-white space-y-4">
             <AlertCircle size={48} className="text-elite-danger" />
             <h2 className="text-2xl font-bold">Analysis Failed</h2>
             <p className="text-gray-500">The AI could not generate the dashboard. Please try again.</p>
             <button 
               onClick={() => setAppState(AppState.WELCOME)}
               className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200"
             >
               Restart
             </button>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="antialiased selection:bg-elite-accent selection:text-white">
      {renderContent()}
    </div>
  );
};

export default App;