import React from 'react';

interface MarkdownPreviewProps {
  content: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => {
  // A very basic renderer for preview purposes since we can't use complex libraries
  // This handles Headers, Lists, Bold, and basic Tables visually
  
  const renderLine = (line: string, index: number) => {
    // Headers
    if (line.startsWith('# ')) return <h1 key={index} className="text-2xl font-bold text-center mb-6 text-gray-900 border-b-2 border-gray-200 pb-4">{line.replace('# ', '')}</h1>;
    if (line.startsWith('## ')) return <h2 key={index} className="text-xl font-bold mt-8 mb-4 text-gray-800 border-r-4 border-blue-600 pr-3">{line.replace('## ', '')}</h2>;
    if (line.startsWith('### ')) return <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-gray-800">{line.replace('### ', '')}</h3>;
    
    // Lists
    if (line.trim().startsWith('- ')) return <li key={index} className="mr-6 mb-2 list-disc text-base">{renderInline(line.replace('- ', ''))}</li>;
    if (/^\d+\./.test(line.trim())) return <li key={index} className="mr-6 mb-2 list-decimal text-base">{renderInline(line.replace(/^\d+\.\s*/, ''))}</li>;

    // Tables (Basic detection)
    if (line.includes('|')) return <div key={index} className="font-mono text-sm bg-gray-50 p-1 my-1 overflow-x-auto whitespace-pre">{line}</div>;

    // Empty lines
    if (!line.trim()) return <div key={index} className="h-4"></div>;

    // Paragraphs
    return <p key={index} className="mb-4 leading-relaxed text-gray-700 text-base text-justify">{renderInline(line)}</p>;
  };

  const renderInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="academic-preview bg-white p-8 shadow-sm min-h-[500px] border border-gray-200 rounded-lg">
      {content.split('\n').map((line, idx) => renderLine(line, idx))}
    </div>
  );
};