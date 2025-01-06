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
import ChatBar from "@/components/ChatBar";

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
  "Act Section": {
    "0": string;
    text: string;
  }
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
  contains?: Paragraph[];  // Recursive structure for nested paragraphs
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

// Extract act section text
const getActSectionText = (section: Act["Act Section"]): string => {
  if (Array.isArray(section)) {
    return (
      section.map((item) => (typeof item === "string" ? item : item.text)).join(", ") ||
      "No section available"
    );
  }
  if (typeof section === "object" && section !== null) {
    return section.text || JSON.stringify(section);
  }
  if (typeof section === "string") {
    return section;
  }
  return "No section available";
};

// Render contains (recursive rendering for nested content)
const renderContains = (containsArray: Paragraph[]) => {
  return (
    <ul className="space-y-2 mt-2 prose">
      {containsArray.map((containsItem, index) => (
        <li key={index} className="p-2 border rounded bg-white shadow">
          {containsItem.text && (
            <p className="text-sm prose text-teal-900">{containsItem.text}</p>
          )}
          {containsItem.contains && containsItem.contains.length > 0 && (
            <div className="ml-4">{renderContains(containsItem.contains)}</div>
          )}
        </li>
      ))}
    </ul>
  );
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

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-center p-4"><CustomSpinner /></div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 prose">
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
      {filteredData.length === 0 ? (
        <p className="text-center text-gray-500">No results found</p>
      ) : (
        <ul className="space-y-4">
          {filteredData.map((item) => (
            <li key={item["Act ID"]}>
              <div
                className="bg-cyan-700 p-4 rounded-md shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedAct(item)}
              >
                <h2 className="text-white text-lg font-medium text-center">{item["Act Title"]}</h2>
                <div className="mt-2 flex flex-wrap justify-between font-mono text-sm">
                  <p className="text-zinc-300">{item["Enactment Date"]}</p>
                  <span className="text-zinc-300">{item["Act ID"]}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
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
    </div>
  );
}
