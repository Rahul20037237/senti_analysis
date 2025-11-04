import React, { useState } from 'react';
import { Send, FileText, TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import './App.css';
import './index.css';
export default function TextAnalyzer() {
  const [text, setText] = useState('');
  const [analysisType, setAnalysisType] = useState('summary');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const WEBHOOK_URL = 'https://automation7237.app.n8n.cloud/webhook/text-analysis';

  const handleSubmit = async () => {
    if (!text.trim()) {
      setError('Please enter some text to analyze');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: text,
          analysisType: analysisType
        })
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text');
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err.message || 'An error occurred while analyzing the text');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setText('');
    setResult(null);
    setError(null);
  };

  const renderTableFromObject = (obj, depth = 0) => {
    if (!obj || typeof obj !== 'object') {
      return (
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-lg">
          <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{String(obj)}</p>
        </div>
      );
    }

    const entries = Object.entries(obj);
    
    return (
      <div className={depth > 0 ? 'ml-4 mt-2' : ''}>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-600 text-white">
              <th className="border border-indigo-700 px-4 py-3 text-left font-semibold">Property</th>
              <th className="border border-indigo-700 px-4 py-3 text-left font-semibold">Value</th>
            </tr>
          </thead>
          <tbody>
            {entries.map(([key, value], index) => (
              <tr key={key} className={index % 2 === 0 ? 'bg-white' : 'bg-indigo-50'}>
                <td className="border border-gray-300 px-4 py-3 font-medium text-gray-700 align-top">
                  {key}
                </td>
                <td className="border border-gray-300 px-4 py-3 text-gray-800">
                  {typeof value === 'object' && value !== null ? (
                    Array.isArray(value) ? (
                      <div className="space-y-1">
                        {value.map((item, i) => (
                          <div key={i} className="py-1">
                            {typeof item === 'object' ? (
                              renderTableFromObject(item, depth + 1)
                            ) : (
                              <span className="text-gray-800">{String(item)}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      renderTableFromObject(value, depth + 1)
                    )
                  ) : (
                    <span className="whitespace-pre-wrap break-words">{String(value)}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            AI Text Analyzer
          </h1>
          <p className="text-gray-600">
            Powered by n8n Automation & LLM API
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Analysis Type
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setAnalysisType('summary')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  analysisType === 'summary'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FileText className="inline-block w-5 h-5 mr-2" />
                Summary
              </button>
              <button
                type="button"
                onClick={() => setAnalysisType('sentiment')}
                className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                  analysisType === 'sentiment'
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <TrendingUp className="inline-block w-5 h-5 mr-2" />
                Sentiment
              </button>
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Enter Text
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type or paste your text here for analysis..."
              className="w-full h-40 p-4 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all resize-none"
              disabled={loading}
            />
            <div className="text-sm text-gray-500 mt-2">
              {text.length} characters
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading || !text.trim()}
              className="flex-1 bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Analyze Text
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={loading}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-all"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-800 mb-1">Error</h3>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {result && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              {analysisType === 'summary' ? (
                <>
                  <FileText className="w-6 h-6 text-indigo-600" />
                  Summary Results
                </>
              ) : (
                <>
                  <TrendingUp className="w-6 h-6 text-indigo-600" />
                  Sentiment Analysis Results
                </>
              )}
            </h2>
            
            <div className="overflow-x-auto">
              {renderTableFromObject(result)}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Analysis completed at {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        )}

        <div className="text-center mt-8 text-sm text-gray-500">
          <p>This application uses n8n automation workflow with LLM API integration</p>
        </div>
      </div>
    </div>
  );
}