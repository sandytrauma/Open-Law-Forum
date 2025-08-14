"use client"
import React, { useState } from 'react'
import { FaClipboardList, FaFileSignature, FaScroll, FaTruckLoading, FaExclamationCircle } from 'react-icons/fa';

export default function DocAnalyzerPage() {
    const [documentText, setDocumentText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentText.trim()) {
            setError('Please paste a legal document to analyze.');
            return;
        }

        setIsLoading(true);
        setError('');
        setAnalysisResult(null);

        const prompt = `Analyze and summarize the following legal document. Provide a summary of the key clauses, acts, sections, sub sections and identify any potential risks or important considerations associated with sections implied, and explain the language in simple, non-legal terms. Structure the response clearly.
Document:
"${documentText}"`;

        try {
            const payload = {
                contents: [{
                    parts: [{ text: prompt }]
                }],
            };

            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`API call failed with status: ${response.status}`);
            }

            const result = await response.json();
            const text = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (text) {
                setAnalysisResult(text);
            } else {
                setError('Analysis failed: Could not get a response from the model.');
            }
        } catch (err) {
            console.error(err);
            setError('An error occurred while analyzing the document. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white font-sans antialiased">
            <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16">
                {/* Header */}
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tighter">
                        Legal Doc Analyzer <FaFileSignature className="inline-block h-10 w-10 text-indigo-400" />
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Powered by Gemini, to simplify complex legal texts.
                    </p>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8">
                    {/* Input Panel (Left Side) */}
                    <div className="w-full md:w-1/2 flex flex-col bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                            <FaClipboardList className="mr-2" /> Paste Your Document text
                        </h2>
                        <form onSubmit={handleAnalyze} className="flex-1 flex flex-col">
                            <textarea
                                value={documentText}
                                onChange={(e) => setDocumentText(e.target.value)}
                                className="flex-1 w-full p-4 text-sm bg-gray-900 text-gray-200 border border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-500"
                                placeholder="Paste your legal document text here..."
                                rows={15}
                            ></textarea>
                            <button
                                type="submit"
                                className="mt-6 w-full py-3 px-6 rounded-full text-lg font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 active:scale-95 duration-200 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={isLoading || !documentText.trim()}
                            >
                                {isLoading ? (
                                    <>
                                        <FaTruckLoading className="animate-spin mr-2" /> Analyzing...
                                    </>
                                ) : (
                                    <>
                                        <FaScroll className="mr-2" /> Analyze Document
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Output Panel (Right Side) */}
                    <div className="w-full md:w-1/2 flex flex-col bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                            <FaScroll className="mr-2" /> Analysis Results
                        </h2>
                        <div className="flex-1 w-full bg-gray-900 p-4 rounded-xl overflow-y-auto border border-gray-700 custom-scrollbar">
                            {isLoading && (
                                <div className="flex flex-col items-center justify-center h-full text-indigo-400">
                                    <FaTruckLoading className="animate-spin h-10 w-10 mb-4" />
                                    <p className="text-lg">Analyzing document...</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex flex-col items-center justify-center h-full text-red-400 p-4">
                                    <FaExclamationCircle className="h-10 w-10 mb-4" />
                                    <p className="text-lg text-center">{error}</p>
                                </div>
                            )}

                            {analysisResult && !isLoading && (
                                <div className="prose prose-invert max-w-none text-gray-300">
                                    <p className="whitespace-pre-wrap">{analysisResult}</p>
                                </div>
                            )}

                            {!analysisResult && !isLoading && !error && (
                                <div className="flex items-center justify-center h-full text-gray-500">
                                    <p>Your analysis will appear here after submission.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}