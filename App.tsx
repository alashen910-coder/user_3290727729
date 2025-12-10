import React, { useState, useRef } from 'react';
import { BookOpen, FileText, CheckCircle, AlertCircle, Copy, Download, RefreshCw, Wand2, ArrowLeft, ArrowRight, FileDown } from 'lucide-react';
import { formatAcademicText } from './services/geminiService';
import { Button } from './components/Button';
import { MarkdownPreview } from './components/MarkdownPreview';
import { ViewMode, ProcessingState } from './types';

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);
  const [state, setState] = useState<ProcessingState>({
    isLoading: false,
    error: null,
    isSuccess: false,
  });

  const outputRef = useRef<HTMLTextAreaElement>(null);

  const handleFormat = async () => {
    if (!inputText.trim()) return;

    setState({ isLoading: true, error: null, isSuccess: false });
    try {
      const formatted = await formatAcademicText(inputText);
      setOutputText(formatted);
      setState({ isLoading: false, error: null, isSuccess: true });
    } catch (err: any) {
      setState({ isLoading: false, error: err.message, isSuccess: false });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputText);
    alert('تم نسخ النص المنسق إلى الحافظة');
  };

  const handleDownloadMarkdown = () => {
    const blob = new Blob([outputText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'benha_thesis_chapter.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWord = () => {
    if (!outputText) return;

    // Use marked (loaded globally via script in index.html) to parse markdown
    const htmlContent = (window as any).marked.parse(outputText);

    const fullHtml = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40' dir='rtl'>
      <head>
        <meta charset='utf-8'>
        <title>Thesis Chapter</title>
        <style>
          body {
            font-family: 'Simplified Arabic', 'Amiri', serif;
            font-size: 12pt;
            line-height: 1.5;
            text-align: justify;
            direction: rtl;
          }
          h1 { font-family: 'Simplified Arabic', 'Amiri', serif; font-size: 18pt; font-weight: bold; text-align: center; margin-bottom: 24px; }
          h2 { font-family: 'Simplified Arabic', 'Amiri', serif; font-size: 16pt; font-weight: bold; margin-top: 20px; margin-bottom: 16px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
          h3 { font-family: 'Simplified Arabic', 'Amiri', serif; font-size: 14pt; font-weight: bold; margin-top: 16px; margin-bottom: 12px; }
          p { margin-bottom: 12px; }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 12pt;
          }
          th, td {
            border: 1px solid #000;
            padding: 8px 12px;
            text-align: center;
            font-family: 'Simplified Arabic', 'Amiri', serif;
          }
          th { background-color: #f3f4f6; font-weight: bold; }
          ul, ol { margin-right: 24px; margin-bottom: 12px; }
          li { margin-bottom: 6px; }
          strong { font-weight: bold; }
        </style>
      </head>
      <body>
        ${htmlContent}
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', fullHtml], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'benha_thesis_chapter.doc';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">منسق الرسائل الجامعية</h1>
              <p className="text-xs text-gray-500 font-medium">معايير جامعة بنها - مدعوم بالذكاء الاصطناعي</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!state.isSuccess && (
               <Button 
                onClick={handleFormat} 
                disabled={!inputText.trim() || state.isLoading}
                isLoading={state.isLoading}
                icon={<Wand2 className="h-4 w-4" />}
               >
                 تنسيق الفصل
               </Button>
            )}
            {state.isSuccess && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setState({ ...state, isSuccess: false });
                  setOutputText('');
                }}
                icon={<RefreshCw className="h-4 w-4" />}
              >
                فصل جديد
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        
        {state.error && (
          <div className="bg-red-50 border-r-4 border-red-500 p-4 rounded-md flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700 font-medium">{state.error}</p>
          </div>
        )}

        {!state.isSuccess ? (
          /* Input View */
          <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex justify-between items-center">
              <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                <FileText className="h-4 w-4" />
                النص الأصلي (غير المنسق)
              </h2>
              <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded border">اللغة العربية</span>
            </div>
            <textarea
              className="flex-1 w-full p-6 text-lg leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500/50 min-h-[400px]"
              placeholder="قم بلصق محتوى الفصل هنا... (مثال: المقدمة، مشكلة البحث، الجداول كنص خام...)"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              dir="rtl"
            />
            <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 text-sm text-gray-500 flex justify-between items-center">
              <span>{inputText.length} حرف</span>
              <span className="text-xs">سيتم تنسيق العناوين والجداول تلقائياً</span>
            </div>
          </div>
        ) : (
          /* Output View */
          <div className="flex-1 flex flex-col gap-4">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
              <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode(ViewMode.EDIT)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.EDIT ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  Markdown
                </button>
                <button
                  onClick={() => setViewMode(ViewMode.SPLIT)}
                  className={`hidden md:block px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.SPLIT ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  عرض مزدوج
                </button>
                <button
                  onClick={() => setViewMode(ViewMode.PREVIEW)}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === ViewMode.PREVIEW ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  معاينة الطباعة
                </button>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={handleCopy} icon={<Copy className="h-4 w-4" />}>
                  نسخ
                </Button>
                <Button variant="outline" onClick={handleDownloadMarkdown} icon={<Download className="h-4 w-4" />}>
                  ملف MD
                </Button>
                <Button variant="secondary" onClick={handleDownloadWord} icon={<FileDown className="h-4 w-4" />}>
                  تحميل Word
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[600px]">
              
              {/* Markdown Source */}
              {(viewMode === ViewMode.EDIT || viewMode === ViewMode.SPLIT) && (
                <div className="flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden h-full">
                  <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 flex justify-between items-center">
                     <span className="text-xs font-mono text-gray-500">Markdown Source</span>
                  </div>
                  <textarea
                    ref={outputRef}
                    className="flex-1 w-full p-6 font-mono text-sm leading-relaxed resize-none focus:outline-none bg-slate-50 text-slate-800"
                    value={outputText}
                    onChange={(e) => setOutputText(e.target.value)}
                    dir="rtl"
                  />
                </div>
              )}

              {/* Preview */}
              {(viewMode === ViewMode.PREVIEW || viewMode === ViewMode.SPLIT) && (
                <div className={`flex flex-col h-full ${viewMode === ViewMode.PREVIEW ? 'md:col-span-2' : ''}`}>
                   {viewMode === ViewMode.PREVIEW && (
                      <div className="mb-2 text-center text-sm text-gray-500 bg-yellow-50 p-2 rounded border border-yellow-200">
                        هذه معاينة تقريبية. للحصول على التنسيق النهائي الدقيق، قم بتحميل ملف Word.
                      </div>
                   )}
                   <MarkdownPreview content={outputText} />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-gray-500 text-sm">
            تم التطوير للمساعدة في البحث العلمي - جامعة بنها
          </p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
             <span>Markdown Compatible</span>
             <span>•</span>
             <span>UTF-8 Support</span>
             <span>•</span>
             <span>Academic Standard</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;