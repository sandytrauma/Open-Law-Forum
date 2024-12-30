"use client";

import React, { useState, useEffect } from "react";
//@ts-ignore
import remark from "remark";
import remarkHtml from "remark-html";
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";
import CustomSpinner from "@/components/CustomSpinner";

// Processor for Markdown-to-HTML conversion
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeFormat, { blanks: ['body', 'head'], indent: '\t' })
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
  "Parts": {
    [key: string]: {
      ID: string;
      Name: string;
      Sections: {
        [sectionKey: string]: {
          heading: string;
          paragraphs: {
            [paragraphKey: string]: string;
          };
        };
      };
    };
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
  paragraph?: string;
  text?: string;
  contains?: Paragraph[];
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
  const [showScrollTop, setShowScrollTop] = useState(false);
 

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  if (!chapters) {
    return <p>No chapters available for this act.</p>;
  }

  return (
    <div className="p-4 bg-gradient-to-tr from-violet-200 via-red-300 to-violet-300 ring-fuchsia-300 ring-4 rounded shadow-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Chapters</h2>
      <ul className="space-y-2">
        {Object.entries(chapters).map(([key, chapter]) => (
          <li key={key} className="p-2 rounded">
            <h3 className="font-medium">{chapter.Name}</h3>
            <p className="text-sm text-zinc-700">ID: {chapter.ID}</p>
            <ul className="space-y-2 mt-2">
              {chapter.Sections && Object.entries(chapter.Sections).map(([sectionKey, section]) => (
                <li key={sectionKey} className="p-2 rounded bg-red-200 bg-opacity-5 shadow">
                  <h4 className="font-medium prose">{section.heading}</h4>
                  <ul className="space-y-2 prose mt-2 font-mono text-justify">
                    {Object.entries(section.paragraphs??{}).map(([paragraphKey, paragraph]) => (
                      <li key={paragraphKey} className="p-2 rounded bg-zinc-600 shadow-md shadow-black whitespace-prewrap">
                        <div className="flex">
                          {paragraphKey && (
                            <p className="text-sm font-semibold text-lime-200 mr-4">*</p>
                          )}

                          <div
                            dangerouslySetInnerHTML={{
                              __html: processor.processSync(paragraph.text || paragraph).toString(),
                            }}
                            className="prose text-zinc-300 font-semibold"
                          />
                        </div>
                            

                        {/* Render contains if present */}
                        {paragraph.contains && paragraph.contains.length > 0 && (
                          <ul className="space-y-2 mt-2">
                            
                            {paragraph.contains.map((containsItem, index) => (
                              <li key={index} className="p-2 border rounded bg-white shadow">
                                {/* Check if the containsItem has text */}
                                {containsItem.text && (
                                  <p className="text-sm prose text-teal-900">
                                    {containsItem.text}
                                  </p>
                                )}
                                {/* If there are nested contains, recursively render them */}
                                {containsItem.contains && containsItem.contains.length > 0 && (
                                  <ul className="space-y-2 mt-2">
                                    {containsItem.contains.map((subContainsItem, subIndex) => (
                                      <li key={subIndex} className="p-2 border rounded bg-white shadow">
                                        {subContainsItem.text && (
                                          <p className="text-sm prose text-teal-900">
                                            {subContainsItem.text}
                                          </p>
                                        )}
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </li>
                            ))}
                          </ul>)}

                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600"
          aria-label="Scroll to top"
        >
          ↑
        </button>
      )}
    </div>
  );
};
const renderContains = (containsArray: Paragraph[])=>{
  return (
    <ul className="space-y-2 mt-2 prose">
      {containsArray.map((containsItem, index) => (
        <li key={index} className="p-2 border rounded bg-white shadow">
          {/* Render the text of the containsItem */}
          {containsItem.text && (
            <p className="text-sm prose text-teal-900">{containsItem.text}</p>
          )}
          {/* If there are nested contains, recursively render them */}
          {containsItem.contains && containsItem.contains.length > 0 && (
            <div className="ml-4">
              {renderContains(containsItem.contains)}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
};


// Main component
export default function Home() {
  const { data, isLoading, error } = useActData();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAct, setSelectedAct] = useState<Act | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);


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
    return <div className="text-center p-4"><CustomSpinner /></div>;
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
    <div className="w-full max-w-2xl mx-auto p-4 prose">
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
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-4 right-4 p-3 bg-teal-500 text-white rounded-full shadow-lg hover:bg-teal-600"
          aria-label="Scroll to top"
        >
          ↑
        </button>
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
