"use client"
import React, { useState, useEffect } from 'react';
import { FaClipboardList, FaScroll, FaTruckLoading, FaExclamationCircle, FaBookOpen, FaCommentDots } from 'react-icons/fa';

// Define a structured type for the analysis result
type AnalysisResult = {
    summary: string;
    principles: string;
    risks: string;
};

// Define types for questions
type QnA = {
    id: number;
    question: string;
    answer: string | null;
};

export default function DocAnalyzerPage() {
    const [documentText, setDocumentText] = useState('');
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [questions, setQuestions] = useState<QnA[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState('');

    // Load data from localStorage on component mount
    useEffect(() => {
        try {
            const savedAnalysis = localStorage.getItem('analysisResult');
            if (savedAnalysis) {
                setAnalysisResult(JSON.parse(savedAnalysis));
            }
            const savedQuestions = localStorage.getItem('questions');
            if (savedQuestions) {
                setQuestions(JSON.parse(savedQuestions));
            }
        } catch (e) {
            console.error("Failed to load from local storage", e);
        }
    }, []);

    // Save data to localStorage whenever analysisResult or questions change
    useEffect(() => {
        if (analysisResult) {
            localStorage.setItem('analysisResult', JSON.stringify(analysisResult));
        }
    }, [analysisResult]);

    useEffect(() => {
        if (questions.length > 0) {
            localStorage.setItem('questions', JSON.stringify(questions));
        }
    }, [questions]);

    // Clear local storage when the component unmounts (e.g., when the user leaves the page)
    useEffect(() => {
        return () => {
            localStorage.removeItem('analysisResult');
            localStorage.removeItem('questions');
        };
    }, []);

    const handleAnalyze = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!documentText.trim()) {
            setError('Please paste a legal document to analyze.');
            return;
        }

        setIsLoading(true);
        setError('');

        const prompt = `Analyze the following legal document and provide a structured response for a law student.
1.  **Summary of Key Clauses:** Summarize the main points of each significant clause, using simple, non-legal terms.
2.  **Legal Principles & Jargon:** Identify and explain key legal terms and principles in simple language. Provide a brief, relevant example for each.
3.  **Potential Risks & Considerations:** Identify any potential risks, ambiguities, or important considerations a lawyer should be aware of.

Document:
"${documentText}"`;

        try {
            const payload = {
                contents: [{
                    parts: [{ text: prompt }],
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
                const sections = text.split(/### \d\./);

                if (sections.length > 3) {
                    const parsedAnalysis = {
                        summary: sections[1]?.trim() || '',
                        principles: sections[2]?.trim() || '',
                        risks: sections[3]?.trim() || '',
                    };
                    setAnalysisResult(parsedAnalysis);
                    setQuestions([]); // Clear previous questions
                    setDocumentText(''); // Clear input after analysis
                } else {
                    setAnalysisResult({
                        summary: text,
                        principles: '',
                        risks: '',
                    });
                    setError('Could not parse the document into the expected sections. Displaying raw output.');
                }
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

    const handleAskQuestion = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentQuestion.trim() || !analysisResult) {
            return;
        }

        setIsLoading(true);
        const fullContext = `Based on the following legal document and its analysis, answer the question below.
        Analysis:
        - Summary: ${analysisResult.summary}
        - Principles: ${analysisResult.principles}
        - Risks: ${analysisResult.risks}
        
        Question: "${currentQuestion}"`;

        try {
            const payload = {
                contents: [{
                    parts: [{ text: fullContext }],
                }],
            };

            const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            const answerText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

            setQuestions(prevQuestions => {
                const newQuestions = [
                    ...prevQuestions,
                    { id: Date.now(), question: currentQuestion, answer: answerText || 'Could not find an answer.' }
                ];
                return newQuestions;
            });
            setCurrentQuestion('');
        } catch (err) {
            console.error(err);
            setQuestions(prevQuestions => {
                const newQuestions = [
                    ...prevQuestions,
                    { id: Date.now(), question: currentQuestion, answer: 'An error occurred while fetching the answer.' }
                ];
                return newQuestions;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-white font-sans antialiased overflow-hidden">
            <div className="flex-1 flex flex-col p-8 md:p-12 lg:p-16">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-2 tracking-tighter">
                        Legal Study Assistant <FaBookOpen className="inline-block h-10 w-10 text-indigo-400" />
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl">
                        Analyze, take notes, and ask questions with Gemini.
                    </p>
                </div>
                <div className="flex-1 flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 h-full">
                    {/* Left Panel: Paste Document and Q&A */}
                    <div className="w-full md:w-1/2 flex flex-col space-y-8">
                        <div className="flex flex-col bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 h-1/2 min-h-[300px]">
                            <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                                <FaClipboardList className="mr-2" /> Paste Your Document
                            </h2>
                            <form onSubmit={handleAnalyze} className="flex-1 flex flex-col">
                                <textarea
                                    value={documentText}
                                    onChange={(e) => setDocumentText(e.target.value)}
                                    className="flex-1 w-full p-4 text-sm bg-gray-900 text-gray-200 border border-gray-700 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all duration-300 placeholder-gray-500"
                                    placeholder="Paste your legal document text here..."
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

                        {analysisResult && (
                            <div className="flex flex-col bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700 h-1/2 min-h-[300px]">
                                <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                                    <FaCommentDots className="mr-2" /> Ask a Question
                                </h2>
                                <form onSubmit={handleAskQuestion} className="flex flex-col space-y-4">
                                    <input
                                        type="text"
                                        value={currentQuestion}
                                        onChange={(e) => setCurrentQuestion(e.target.value)}
                                        placeholder="e.g., What does 'indemnify' mean?"
                                        className="p-3 text-sm bg-gray-900 text-gray-200 border border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    />
                                    <button
                                        type="submit"
                                        className="py-3 px-6 rounded-xl text-lg font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-transform transform hover:scale-105 active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={!currentQuestion.trim() || isLoading}
                                    >
                                        Ask
                                    </button>
                                </form>
                                <div className="mt-4 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                                    {questions.map(q => (
                                        <div key={q.id} className="p-4 bg-gray-700 rounded-xl">
                                            <p className="font-bold text-indigo-300">Q: {q.question}</p>
                                            <p className="mt-2 text-gray-200">A: {q.answer}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Panel: Analysis Result */}
                    <div className="w-full md:w-1/2 flex flex-col bg-gray-800 p-6 rounded-3xl shadow-2xl border border-gray-700">
                        <h2 className="text-2xl font-bold mb-4 flex items-center text-gray-200">
                            <FaScroll className="mr-2" /> Analysis Result
                        </h2>
                        <div className="flex-1 w-full bg-gray-900 p-4 rounded-xl overflow-y-auto border border-gray-700 custom-scrollbar max-h-[calc(100vh-20rem)]">
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
                                    <h3 className="text-2xl font-bold mt-4 mb-2">Summary of Key Clauses</h3>
                                    <div dangerouslySetInnerHTML={{ __html: analysisResult.summary.replace(/\n/g, '<br />') }} />
                                    <hr className="my-4 border-gray-700" />
                                    <h3 className="text-2xl font-bold mt-4 mb-2">Legal Principles & Jargon</h3>
                                    <div dangerouslySetInnerHTML={{ __html: analysisResult.principles.replace(/\n/g, '<br />') }} />
                                    <hr className="my-4 border-gray-700" />
                                    <h3 className="text-2xl font-bold mt-4 mb-2">Potential Risks & Considerations</h3>
                                    <div dangerouslySetInnerHTML={{ __html: analysisResult.risks.replace(/\n/g, '<br />') }} />
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