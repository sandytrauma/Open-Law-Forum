"use client"
import { useState, useEffect } from "react";
//@ts-ignore
import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

// Improved type definition with more specific types
interface Act {
  "Act Title": string;
  "Act Definition": {
    text?: string;
    [key: string]: any;
  } | string[] | string;
  "Act ID": string;
  "Enactment Date": string;
  Sections?: Record<
    string,
    {
      heading: string;
      paragraphs: Record<string, string>;
    }
  >;
}

// Processor for Markdown-to-HTML conversion
const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeFormat)
  .use(rehypeStringify);

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
    //@ts-ignore
    return definition.map((item) => (typeof item === "string" ? item : item.text)).join(", ") || "No definition available";
  }
  if (typeof definition === "object" && definition !== null) {
    return definition.text || JSON.stringify(definition);
  }
  if (typeof definition === "string") {
    return definition;
  }
  return "No definition available";
};

// Custom hook for pagination
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

// Main component with improved error handling and rehype integration
export default function Home() {
  const { data, isLoading, error } = useActData();
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
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
              <div className="bg-cyan-700 p-4  rounded-md shadow-md hover:shadow-lg transition-shadow">
                <h2 className="text-white text-lg font-medium text-center">
                  {item["Act Title"]}
                </h2>
                <div className="mt-2 flex flex-wrap justify-between font-mono text-sm">
                  <p className="text-zinc-300">{item["Enactment Date"]}</p>
                  <span className="text-zinc-300">{item["Act ID"]}</span>
                </div>
                <div className="text-white prose text-sm mt-4">
                  <div
                    dangerouslySetInnerHTML={{
                      __html: processor.processSync(
                        getActDefinitionText(item["Act Definition"])
                      ).toString(),
                    }}
                  />
                </div>
              </div>
            </li>
          ))}
        </ul>
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
