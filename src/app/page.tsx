"use client";
import React, { useState, useEffect } from "react";
//@ts-ignore
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Processor for Markdown-to-HTML conversion
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);

// Act interface
interface Act {
  "Act Title": string;
  "Act ID": string;
  "Enactment Date": string;
  "Act Definition": {
    "0": string;
    text: string;
  };
  "Chapters": {
    [key: string]: Chapter;
  };
}

interface Chapter {
  "ID": string;
  "Name": string;
  "Sections": {
    [sectionTitle: string]: Section;
  };
}

interface Section {
  "heading": string;
  "paragraphs": {
    [key: string]: Paragraph;
  };
}

type Paragraph = {
  text: string;
  contains?: Paragraph[];
};

type Paragraphs = {
  [key: string]: Paragraph[];
};

// Custom hook for fetching act data
const useActData = () => {
  const [data, setData] = useState<Act[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = async (files: string[]): Promise<Act[]> => {
    const responses = await Promise.all(
      files.map(async (file) => {
        try {
          const res = await fetch(`/data/annotatedcentralacts_data/${file}`);
          if (!res.ok) {
            throw new Error(`Failed to fetch ${file}: ${res.status}`);
          }
          return await res.json();
        } catch (error) {
          console.error(`Error fetching ${file}:`, error);
          return null;
        }
      })
    );

    return responses.filter((item): item is Act => item !== null);
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/files");
        if (!response.ok) {
          throw new Error("Failed to fetch file list");
        }
        const files = await response.json();
        const allData = await fetchAllData(files);
        setData(allData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  return { data, isLoading, error };
};

// Extract act definition text
const getActDefinitionText = (definition: Act["Act Definition"]): string => {
  if (Array.isArray(definition)) {
    return (
      definition.map((item) => (typeof item === "string" ? item : item.text)).join(", ") ||
      "No definition available"
    );
  }
  if (typeof definition === "object" && definition !== null) {
    return definition.text || JSON.stringify(definition);
  }
  if (typeof definition === "string") {
    return definition;
  }
  return "No definition available";
};

// Component to render an individual act
const ActDetails = ({ act, onBack }: { act: Act; onBack: () => void }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <button
        onClick={onBack}
        className="mb-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
      >
        Back to Acts
      </button>
      <h1 className="text-center text-2xl font-semibold mb-6">{act["Act Title"]}</h1>
      <p className="text-gray-700 mb-4">
        <strong>Enactment Date:</strong> {act["Enactment Date"]}
      </p>
      <div
        dangerouslySetInnerHTML={{
          __html: processor.processSync(getActDefinitionText(act["Act Definition"])).toString(),
        }}
        className="prose"
      />
    </div>
  );
};

const usePagination = <T,>(items: T[], itemsPerPage: number) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return {
    currentPage,
    totalPages,
    currentItems,
    handleNextPage,
    handlePreviousPage,
  };
};

// Component to render the chapters of an act
const ChapterList = ({ chapters }: { chapters: Act["Chapters"] }) => {
  if (!chapters) {
    return <p>No chapters available for this act.</p>;
  }

  return (
    <div className="p-4 bg-gray-100 rounded">
      <h2 className="text-lg font-semibold mb-4">Chapters</h2>
      <ul className="space-y-2">
        {Object.entries(chapters).map(([key, chapter]) => (
          <li key={key} className="p-2 border rounded bg-white shadow">
            <h3 className="font-medium">{chapter.Name}</h3>
            <p className="text-sm text-gray-500">ID: {chapter.ID}</p>
            <ul className="space-y-2 mt-2">
              {Object.entries(chapter.Sections).map(([sectionKey, section]) => (
                <li key={sectionKey} className="p-2 border rounded bg-white shadow">
                  <h4 className="font-medium">{section.heading}</h4>
                  <ul className="space-y-2 mt-2">
                    {Object.entries(section.paragraphs).map(([paragraphKey, paragraph]) => (
                      <li key={paragraphKey} className="p-2 border rounded bg-white shadow">
                        {paragraph.text && <p className="text-sm text-gray-500">{paragraph.text}</p>}
                        {paragraph.contains && (
                          <ul className="space-y-2 mt-2">
                            {Object.entries(paragraph.contains).map(([containsKey, contains]) => (
                              <li key={containsKey} className="p-2 border rounded bg-white shadow">
                               {React.createElement('p', { className: 'text-sm text-gray-500' }, contains.text)}
                              </li>
                            ))}
                          </ul>
                        )}import React from 'react';
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

// Main component
export default function Home() {
  const { data, isLoading, error } = useActData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);

  const filteredData = data.filter((item) =>
    item["Act Title"].toLowerCase().includes(searchTerm.toLowerCase())
  );

  const {
    currentItems,
    currentPage,
    totalPages,
    handleNextPage,
    handlePreviousPage,
  } = usePagination(filteredData, 10);

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading...</div>;
  }
  if (selectedAct) {
    return (
      <div className="w-full max-w-2xl mx-auto p-4">
        <button
          onClick={() => setSelectedAct(null)}
          className="mb-4 px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 transition-colors"
        >
          Back to Acts
        </button>
        <h1 className="text-center text-2xl font-semibold mb-6">
          {selectedAct["Act Title"]}
        </h1>
        <ChapterList chapters={selectedAct.Chapters} />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      {selectedAct ? (
        <ActDetails act={selectedAct} onBack={() => setSelectedAct(null)} />
      ) : (
        <>
          <h1 className="text-center text-2xl font-semibold mb-6">Search for Central Acts</h1>
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search titles/keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-2 border bg-teal-100 text-zinc-900 rounded w-full focus:bg-teal-200 focus:outline-none focus:ring-2 focus:ring-teal-400"
              aria-label="Search acts"
            />
          </div>
          {currentItems.length === 0 ? (
            <p className="text-center text-gray-500">No results found</p>
          ) : (
            <ul className="space-y-4">
              {currentItems.map((item) => (
                <li key={item["Act ID"]}>
                  <div
                    className="bg-cyan-700 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedAct(item)}
                  >
                    <h2 className="text-white text-lg font-medium text-center">
                      {item["Act Title"]}
                    </h2>
                    <div className="mt-2 flex flex-wrap justify-between font-mono text-sm">
                      <p className="text-zinc-300">{item["Enactment Date"]}</p>
                      <span className="text-zinc-300">{item["Act ID"]}</span>                   
                    </div>
                  </div>
                </li>
                
                
              ))}
              
            </ul>
          )}
        </>
      )}
      
      <div className="mt-6 flex justify-between items-center">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors"
        >
          Previous
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:bg-teal-300 disabled:cursor-not-allowed transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
