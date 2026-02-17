
import React, { useState, useRef } from 'react';
import { User, AnalysisResult } from '../types';
import { processFileAndExtractText, analyzeSentence } from '../services/geminiService';

interface AnalyzerProps {
  user: User;
  onAction: (action: () => void) => void;
  onWhatsApp: () => void;
}

const Analyzer: React.FC<AnalyzerProps> = ({ user, onAction, onWhatsApp }) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [sentences, setSentences] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);
  const [isLoadingSentence, setIsLoadingSentence] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setSentences([]);
      setSelectedAnalysis(null);
      if (selectedFile.type.startsWith('image/')) {
        setFilePreview(URL.createObjectURL(selectedFile));
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    try {
      const base64Data = await fileToBase64(file);
      const result = await processFileAndExtractText(base64Data, file.type);
      setSentences(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      alert("There was an issue processing your file. Please try a different format.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSentenceClick = async (sentence: string) => {
    setIsLoadingSentence(true);
    try {
      const result = await analyzeSentence(sentence);
      setSelectedAnalysis(result);
    } catch (error) {
      console.error("Sentence analysis failed:", error);
    } finally {
      setIsLoadingSentence(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-12 px-6">
      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Upload Column */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-3xl border border-aura-sage shadow-sm">
            <h2 className="text-2xl font-heading text-aura-green mb-6">Start Safe Check</h2>
            
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`relative border-2 border-dashed rounded-3xl p-10 transition-all cursor-pointer flex flex-col items-center justify-center text-center ${
                file ? 'border-aura-green bg-aura-sage/10' : 'border-aura-sage hover:border-aura-green/50 hover:bg-aura-sage/5'
              }`}
            >
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden" 
                accept=".txt,.pdf,.png,.jpg,.jpeg,.mp4"
              />
              
              {!file ? (
                <>
                  <div className="w-16 h-16 bg-aura-sage rounded-full flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-medium">Upload File for Scanning</p>
                  <p className="text-xs text-gray-400 mt-2">Screenshots, PDFs, or Text Logs</p>
                </>
              ) : (
                <div className="w-full">
                  {filePreview ? (
                    <img src={filePreview} alt="Preview" className="max-h-40 mx-auto rounded-xl mb-4 object-cover border border-aura-sage shadow-sm" />
                  ) : (
                    <div className="w-16 h-16 bg-aura-green/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-aura-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  )}
                  <p className="text-aura-green font-semibold truncate px-4 text-sm">{file.name}</p>
                  <button 
                    onClick={(e) => { e.stopPropagation(); setFile(null); setFilePreview(null); setSentences([]); }}
                    className="text-[10px] text-red-400 mt-2 font-bold uppercase tracking-wider hover:underline"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={handleUpload}
              disabled={isAnalyzing || !file}
              className="w-full mt-6 bg-aura-green text-white py-4 rounded-2xl font-medium hover:opacity-95 disabled:opacity-30 transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {isAnalyzing ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Analyzing...</>
              ) : 'Extract Message Flow'}
            </button>
          </div>

          {sentences.length > 0 && (
            <div className="space-y-4 fade-in">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Messages Identified:</h3>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {sentences.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSentenceClick(s)}
                    className={`w-full text-left p-5 rounded-2xl border transition-all text-sm leading-relaxed ${selectedAnalysis?.sentence === s ? 'border-aura-green bg-aura-sage/30 ring-1 ring-aura-green shadow-sm text-aura-green' : 'border-aura-sage bg-white text-gray-700 hover:bg-aura-sage/5'}`}
                  >
                    "{s}"
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Column */}
        <div className="relative">
          {isLoadingSentence ? (
            <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-aura-sage">
              <div className="w-12 h-12 border-4 border-aura-sage border-t-aura-green rounded-full animate-spin mb-4" />
              <p className="text-gray-400 font-light italic">Consulting CentraDial Intelligence...</p>
            </div>
          ) : selectedAnalysis ? (
            <div className="bg-white p-8 rounded-3xl border border-aura-sage shadow-sm sticky top-24 fade-in">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-heading text-aura-green">Security Evaluation</h3>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-[0.2em] font-bold">{selectedAnalysis.scamType}</p>
                </div>
                <div className={`px-4 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase border ${
                  selectedAnalysis.pressureLevel === 'High' ? 'bg-red-50 text-red-600 border-red-100' : 
                  selectedAnalysis.pressureLevel === 'Medium' ? 'bg-orange-50 text-orange-600 border-orange-100' : 'bg-green-50 text-green-600 border-green-100'
                }`}>
                  {selectedAnalysis.pressureLevel} Pressure
                </div>
              </div>

              <div className="space-y-8">
                <div className="p-6 bg-[#F9F7F2] rounded-2xl border border-aura-sage/40">
                  <span className="text-[10px] font-bold text-aura-green/40 uppercase tracking-widest block mb-2">Pattern Detected</span>
                  <p className="text-gray-800 font-medium leading-relaxed">{selectedAnalysis.manipulationPattern}</p>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Gentle Insights</h4>
                  <p className="text-gray-600 leading-relaxed italic text-sm">
                    "{selectedAnalysis.riskExplanation}"
                  </p>
                </div>

                <div className="pt-8 border-t border-aura-sage space-y-4">
                   <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Safety Steps</h4>
                   <div className="grid grid-cols-1 gap-3">
                     <button 
                        onClick={() => onAction(() => alert('Protection Logged: Action Paused.'))}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-aura-sage hover:bg-aura-sage/20 transition-all hover:shadow-sm bg-white group"
                      >
                       <div className="w-10 h-10 rounded-xl bg-aura-green/10 flex items-center justify-center text-aura-green group-hover:bg-aura-green group-hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                       </div>
                       <div className="text-left">
                         <div className="font-semibold text-gray-800 text-sm">Mindful Pause</div>
                         <div className="text-[10px] text-gray-400">Wait 5s to clear your mind</div>
                       </div>
                     </button>

                     <button 
                        onClick={onWhatsApp}
                        className="flex items-center gap-4 p-4 rounded-2xl border border-aura-sage hover:bg-aura-sage/20 transition-all hover:shadow-sm bg-white group"
                      >
                       <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-all">
                         <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                       </div>
                       <div className="text-left">
                         <div className="font-semibold text-gray-800 text-sm">Trusted Advice</div>
                         <div className="text-[10px] text-gray-400">Discuss with someone on WhatsApp</div>
                       </div>
                     </button>
                   </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full min-h-[450px] flex flex-col items-center justify-center text-center p-12 bg-white rounded-3xl border border-dashed border-aura-sage">
              <div className="w-16 h-16 bg-aura-sage/30 rounded-full flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-aura-green/20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h3 className="text-xl font-heading text-aura-green mb-2">Analysis Hub</h3>
              <p className="text-gray-400 max-w-[240px] text-xs leading-relaxed font-light">
                Select a message after extraction to view emotional risks and recommended protection.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
