import React from 'react';
import { DashboardData, Message } from '../types';
import {
  User, Briefcase, GraduationCap, Cpu, AlertTriangle, Map, Calendar, Download, Shield, TrendingUp, Target, FileText, Globe, Sparkles, BookOpen, Lightbulb
} from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface DashboardProps {
  data: DashboardData;
  history: Message[];
}

const Dashboard: React.FC<DashboardProps> = ({ data, history }) => {

  const handleExportPDF = async () => {
    const input = document.getElementById('dashboard-content');
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, backgroundColor: '#050505' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    
    const imgHeightPdf = (imgHeight * pdfWidth) / imgWidth;

    if (imgHeightPdf > pdfHeight) {
       let heightLeft = imgHeightPdf;
       let position = 0;
       
       pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightPdf);
       heightLeft -= pdfHeight;

       while (heightLeft >= 0) {
         position = heightLeft - imgHeightPdf;
         pdf.addPage();
         pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeightPdf);
         heightLeft -= pdfHeight;
       }
    } else {
       pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeightPdf);
    }
    
    pdf.save('Life_Architect_Master_Report.pdf');
  };

  const handleExportJSON = () => {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(data, null, 2)
    )}`;
    const link = document.createElement("a");
    link.href = jsonString;
    link.download = "life_strategy.json";
    link.click();
  };

  const handleExportChat = () => {
    const chatContent = history.map(msg => 
      `[${msg.role.toUpperCase()}]\n${msg.content}\n`
    ).join('\n----------------------------------------\n\n');

    const blob = new Blob([chatContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'interview_transcript.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-elite-black text-white p-4 md:p-8 font-sans">
      {/* Sticky Header */}
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-8 sticky top-0 bg-elite-black/95 z-50 backdrop-blur-md py-4 border-b border-white/10">
        <h1 className="text-2xl font-bold font-mono tracking-tighter flex items-center gap-2">
          <span className="text-elite-accent">///</span> ELITE STRATEGY REPORT
        </h1>
        <div className="flex gap-4 mt-4 md:mt-0">
           <button onClick={handleExportChat} className="flex items-center gap-2 text-xs font-mono text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded transition-colors">
             <FileText size={14} /> TRANSCRIPT
          </button>
          <button onClick={handleExportJSON} className="text-xs font-mono text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded transition-colors">
             JSON
          </button>
          <button onClick={handleExportPDF} className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded font-bold hover:bg-gray-200 transition-colors text-sm shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            <Download size={16} />
            REPORT PDF
          </button>
        </div>
      </div>

      <div id="dashboard-content" className="max-w-7xl mx-auto space-y-12 bg-elite-black p-4 md:p-8">

        {/* 1. Core Profile & Praise */}
        <section className="bg-gradient-to-b from-elite-gray to-black border border-white/10 p-8 rounded-3xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <User size={200} />
             </div>
             
             {/* Motivation Section */}
             <div className="mb-8 border-b border-white/10 pb-8">
                <div className="flex items-center gap-2 text-elite-accent mb-4">
                  <Sparkles size={24} className="animate-pulse" />
                  <h2 className="text-xl font-bold tracking-widest uppercase">Psychological Profile</h2>
                </div>
                <p className="text-xl md:text-2xl font-light leading-relaxed text-gray-200 italic">
                  "{data.coreProfile.psychologicalPraise}"
                </p>
             </div>

             <div className="grid md:grid-cols-2 gap-12">
                <div>
                   <div className="mb-6">
                      <h3 className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">Archetype</h3>
                      <p className="text-4xl font-black text-white">{data.coreProfile.archetype}</p>
                   </div>
                   <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-2">Decision Matrix</h3>
                      <p className="text-lg text-gray-300 font-mono">{data.coreProfile.decisionStyle}</p>
                   </div>
                </div>
                
                <div className="space-y-6">
                   <div>
                      <h3 className="text-xs text-gray-500 uppercase tracking-[0.2em] mb-3">Latent Potential</h3>
                      <div className="bg-elite-success/10 border-l-2 border-elite-success p-4">
                        <p className="text-elite-success font-medium">{data.coreProfile.hiddenPotential}</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                         <h4 className="text-[10px] text-gray-600 uppercase font-bold mb-2">Dominant Drivers</h4>
                         <ul className="text-sm text-gray-300 space-y-1">
                            {data.coreProfile.strengthDrivers.map((s, i) => <li key={i}>• {s}</li>)}
                         </ul>
                      </div>
                      <div>
                         <h4 className="text-[10px] text-gray-600 uppercase font-bold mb-2">Critical Flaws</h4>
                         <ul className="text-sm text-elite-danger/80 space-y-1">
                            {data.coreProfile.weaknessPatterns.map((w, i) => <li key={i}>• {w}</li>)}
                         </ul>
                      </div>
                   </div>
                </div>
             </div>
        </section>

        {/* 2. DUAL CAREER PATHS */}
        <section>
          <div className="flex items-center gap-2 mb-6">
             <Briefcase size={24} className="text-elite-accent" />
             <h2 className="text-2xl font-bold text-white">STRATEGIC CAREER TRAJECTORIES</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Sync Path */}
            <div className="bg-elite-gray/50 border border-white/5 p-6 rounded-2xl">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-blue-400">PATH A: SYNCHRONIZATION</h3>
                  <span className="text-xs bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full border border-blue-500/20">OPTIMIZED CURRENT</span>
               </div>
               <div className="space-y-4">
                  {data.careerPaths.syncPath.map((role, idx) => (
                    <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-blue-500/30 transition-colors">
                       <h4 className="font-bold text-white text-lg mb-1">{role.roleName}</h4>
                       <p className="text-sm text-gray-400 mb-3">{role.fitReason}</p>
                       <div className="flex flex-wrap gap-2 text-[10px] uppercase font-mono tracking-wide">
                          <span className="text-emerald-400">{role.incomePotential} INCOME</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-elite-warning">{role.riskLevel}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-purple-400">{role.aiImpact} AI</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>

            {/* Pivot Path */}
            <div className="bg-elite-gray/50 border border-elite-accent/20 p-6 rounded-2xl relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-elite-accent/5 rounded-full blur-3xl"></div>
               <div className="flex items-center justify-between mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-elite-accent">PATH B: THE PIVOT</h3>
                  <span className="text-xs bg-elite-accent/10 text-elite-accent px-3 py-1 rounded-full border border-elite-accent/20">TRUE CALLING</span>
               </div>
               <div className="space-y-4 relative z-10">
                  {data.careerPaths.pivotPath.map((role, idx) => (
                    <div key={idx} className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-elite-accent/30 transition-colors">
                       <h4 className="font-bold text-white text-lg mb-1">{role.roleName}</h4>
                       <p className="text-sm text-gray-400 mb-3">{role.fitReason}</p>
                       <div className="flex flex-wrap gap-2 text-[10px] uppercase font-mono tracking-wide">
                          <span className="text-emerald-400">{role.incomePotential} INCOME</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-elite-warning">{role.riskLevel}</span>
                          <span className="text-gray-500">•</span>
                          <span className="text-purple-400">{role.aiImpact} AI</span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        </section>

        {/* 3. Global Knowledge & Education */}
        <div className="grid md:grid-cols-12 gap-6">
           {/* Knowledge Awareness (New Section) */}
           <div className="md:col-span-5 bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/20 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-purple-400 mb-6 flex items-center gap-2">
                 <Lightbulb size={20}/> KNOWLEDGE AWARENESS
              </h2>
              <div className="space-y-6">
                 {data.knowledgeAwareness.map((k, i) => (
                    <div key={i} className="group">
                       <h4 className="text-white font-bold mb-1 group-hover:text-purple-300 transition-colors">{k.topic}</h4>
                       <p className="text-sm text-gray-400 leading-relaxed">{k.insight}</p>
                    </div>
                 ))}
              </div>
           </div>

           {/* Education Strategy (Foreign/Avant-Garde) */}
           <div className="md:col-span-7 bg-elite-gray border border-white/5 p-6 rounded-2xl">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                 <Globe size={20} className="text-cyan-400"/> GLOBAL & AVANT-GARDE LEARNING
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                 <div>
                    <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-3">Global / Foreign Focus</h4>
                    <ul className="space-y-3">
                       {data.educationStrategy.globalOptions.map((o,i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-200 bg-black/30 p-2 rounded">
                             <Globe size={14} className="mt-1 text-gray-500 flex-shrink-0"/> {o}
                          </li>
                       ))}
                    </ul>
                 </div>
                 <div>
                    <h4 className="text-xs text-cyan-400 uppercase tracking-wider mb-3">Modern Alternatives</h4>
                    <ul className="space-y-3">
                       {data.educationStrategy.avantGardeAlternatives.map((o,i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-200 bg-black/30 p-2 rounded">
                             <BookOpen size={14} className="mt-1 text-gray-500 flex-shrink-0"/> {o}
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>

              <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/5">
                 <h4 className="text-xs text-gray-500 uppercase mb-2">ROI Reality Check</h4>
                 <p className="text-sm italic text-gray-300">{data.educationStrategy.roiRealityCheck}</p>
              </div>
           </div>
        </div>

        {/* 4. AI Integration */}
        <section className="bg-gradient-to-r from-black to-blue-900/10 border border-blue-500/10 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-blue-400 mb-6 flex items-center gap-2">
                 <Cpu size={24}/> AI WORKFLOW MULTIPLIER
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                 <div>
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Multiplier Strategy</h4>
                    <p className="text-lg text-white font-light leading-relaxed mb-6">{data.aiIntegration.multiplierStrategy}</p>
                    
                    <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-2">Example Workflow</h4>
                    <div className="bg-black/60 p-4 rounded-lg border-l-2 border-blue-500">
                       <p className="text-sm text-gray-300 font-mono">{data.aiIntegration.workflowExample}</p>
                    </div>
                 </div>
                 <div className="space-y-6">
                    <div>
                       <h5 className="text-xs text-blue-300 mb-2 font-bold">ESSENTIAL TOOL STACK</h5>
                       <div className="flex flex-wrap gap-2">
                          {data.aiIntegration.toolsToUse.map(t => <span key={t} className="text-sm bg-blue-500/10 text-blue-200 border border-blue-500/20 px-3 py-1 rounded-full">{t}</span>)}
                       </div>
                    </div>
                    <div>
                       <h5 className="text-xs text-blue-300 mb-2 font-bold">REQUIRED SKILLS</h5>
                       <div className="flex flex-wrap gap-2">
                          {data.aiIntegration.skillsToLearn.map(s => <span key={s} className="text-sm bg-white/5 text-gray-300 border border-white/10 px-3 py-1 rounded-full">{s}</span>)}
                       </div>
                    </div>
                 </div>
              </div>
        </section>

        {/* 5. Brutal Improvements */}
        <section className="bg-elite-danger/5 border border-elite-danger/20 p-8 rounded-2xl">
           <h2 className="text-2xl font-bold text-elite-danger mb-8 flex items-center gap-2">
              <AlertTriangle size={24} /> THE KILL SWITCHES
           </h2>
           <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-elite-black/50 p-6 rounded-xl border border-elite-danger/10">
                 <h4 className="text-sm text-elite-danger uppercase font-bold mb-4 tracking-wider">Skill Gaps</h4>
                 <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                    {data.improvements.skillGaps.map((x,i) => <li key={i}>{x}</li>)}
                 </ul>
              </div>
              <div className="bg-elite-black/50 p-6 rounded-xl border border-elite-danger/10">
                 <h4 className="text-sm text-elite-danger uppercase font-bold mb-4 tracking-wider">Mindset Flaws</h4>
                 <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                    {data.improvements.mindsetFlaws.map((x,i) => <li key={i}>{x}</li>)}
                 </ul>
              </div>
              <div className="bg-elite-black/50 p-6 rounded-xl border border-elite-danger/10">
                 <h4 className="text-sm text-elite-danger uppercase font-bold mb-4 tracking-wider">Consequence of Inaction</h4>
                 <p className="text-sm text-gray-300 italic leading-relaxed">"{data.improvements.consequenceOfInaction}"</p>
              </div>
           </div>
        </section>

        {/* 6. Life Direction Paths */}
        <section>
           <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Map size={24} className="text-emerald-400" /> FUTURE ARCHITECTURES
           </h2>
           <div className="grid md:grid-cols-3 gap-6">
              {[
                { type: 'Safe / Stable', icon: Shield, data: data.lifePaths.safe, color: 'text-blue-400', border: 'border-blue-500/20' },
                { type: 'High Growth', icon: TrendingUp, data: data.lifePaths.growth, color: 'text-emerald-400', border: 'border-emerald-500/20' },
                { type: 'Purpose Driven', icon: Target, data: data.lifePaths.purpose, color: 'text-purple-400', border: 'border-purple-500/20' }
              ].map((path, i) => (
                 <div key={i} className={`bg-elite-gray p-6 rounded-2xl border ${path.border} flex flex-col hover:bg-white/5 transition-colors`}>
                    <div className={`flex items-center gap-2 mb-4 ${path.color}`}>
                       <path.icon size={20} />
                       <span className="font-bold text-sm uppercase tracking-widest">{path.type}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">{path.data.name}</h3>
                    <p className="text-sm text-gray-400 mb-6 flex-grow leading-relaxed">{path.data.description}</p>
                    
                    <div className="grid grid-cols-2 gap-3 text-[10px] text-gray-500 uppercase font-mono mt-auto">
                       <div className="bg-black/40 p-2 rounded text-center">
                          <div className="mb-1">Stress</div>
                          <div className="text-white font-bold">{path.data.stressLevel}</div>
                       </div>
                       <div className="bg-black/40 p-2 rounded text-center">
                          <div className="mb-1">Satisfaction</div>
                          <div className="text-white font-bold">{path.data.longTermSatisfaction}</div>
                       </div>
                    </div>
                 </div>
              ))}
           </div>
        </section>

        {/* 7. Action Plan */}
        <section className="bg-white/5 rounded-3xl p-8 border border-white/10">
           <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Calendar size={24} className="text-white" /> 12-MONTH EXECUTION PROTOCOL
           </h2>
           <div className="grid md:grid-cols-4 gap-6">
              {[
                 { title: 'First 30 Days', items: data.actionPlan.first30Days, bg: 'bg-elite-accent/10 border-elite-accent/30' },
                 { title: 'Next 90 Days', items: data.actionPlan.next90Days, bg: 'bg-black/40 border-white/10' },
                 { title: '6 Months', items: data.actionPlan.sixMonths, bg: 'bg-black/40 border-white/10' },
                 { title: '12 Months', items: data.actionPlan.twelveMonths, bg: 'bg-black/40 border-white/10' },
              ].map((phase, i) => (
                 <div key={i} className={`p-6 rounded-2xl border ${phase.bg} h-full`}>
                    <h3 className="text-sm font-black uppercase tracking-widest mb-4 text-white">{phase.title}</h3>
                    <ul className="space-y-3">
                       {phase.items.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3 text-sm text-gray-300 leading-snug">
                             <span className="mt-1.5 w-1.5 h-1.5 bg-white rounded-full flex-shrink-0 opacity-50" />
                             {item}
                          </li>
                       ))}
                    </ul>
                 </div>
              ))}
           </div>
        </section>

        {/* 8. Final Verdict */}
        <section className="text-center py-16 px-4 bg-gradient-to-t from-elite-black to-transparent border-t border-white/5">
           <div className="inline-block p-4 rounded-full bg-white/5 mb-6">
              <Sparkles size={32} className="text-white" />
           </div>
           <h2 className="text-3xl font-black text-white mb-4 tracking-tighter">FINAL VERDICT</h2>
           <p className="text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">{data.finalVerdict.trajectory}</p>
           
           <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
              <div className="bg-elite-danger/10 border border-elite-danger/20 p-6 rounded-2xl">
                 <h4 className="text-xs font-bold text-elite-danger uppercase mb-2 tracking-widest">Hard Truth</h4>
                 <p className="text-base text-gray-200 font-medium">{data.finalVerdict.hardTruth}</p>
              </div>
              <div className="bg-elite-success/10 border border-elite-success/20 p-6 rounded-2xl">
                 <h4 className="text-xs font-bold text-elite-success uppercase mb-2 tracking-widest">Core Advantage</h4>
                 <p className="text-base text-gray-200 font-medium">{data.finalVerdict.coreAdvantage}</p>
              </div>
              <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
                 <h4 className="text-xs font-bold text-white uppercase mb-2 tracking-widest">Non-Negotiable</h4>
                 <p className="text-base text-gray-200 font-medium">{data.finalVerdict.nonNegotiableAction}</p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
};

export default Dashboard;