"use client";

import React, { useEffect, useState } from 'react';
import { ActSection, ActSections } from '@/constants/types';
import { FaCopy } from 'react-icons/fa';

// Debounce hook definition outside the component
const useDebounce = (value: string, delay: number): string => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Function to remove HTML tags
const stripHtmlTags = (text: string): string => {
  return text.replace(/<\/?[^>]+>/gi, ''); // Remove HTML tags
};

// Utility function to extract keywords from a query string
const extractKeywords = (query: string): string[] => {
  return query.toLowerCase().split(/\s+/).filter(word => word.length > 2);
};

// Function to highlight the keyword in the text
const highlightText = (text: string, query: string): string => {
  if (!text || !query) return text;
  const escapedQuery = query.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  const regex = new RegExp(`(${escapedQuery})`, 'gi');
  return text.replace(regex, `<mark class="bg-teal-500 text-white p-1 rounded-md">$1</mark>`);
};

// Define props for the component
type ConstitutionContentProps = {
  data: ActSections;
};

// Main component
const ConstitutionContent: React.FC<ConstitutionContentProps> = ({ data }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showScrollTop, setShowScrollTop] = useState<boolean>(false);
  const [copiedContent, setCopiedContent] = useState<string>('');
  const itemsPerPage = 30;

  // Debounce the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Filter and highlight data based on search query
  const filteredData = (data: ActSections, searchQuery: string): ActSections => {
    const lowerCaseQuery = searchQuery.toLowerCase();
    const keywords = extractKeywords(lowerCaseQuery);

    if (lowerCaseQuery.length === 0) {
      return data;
    }

    return data
      .filter(article => {
        const title = (article.title || "").toLowerCase();
        const description = (article.description || "").toLowerCase();
        return keywords.some(keyword =>
          title.includes(keyword) || description.includes(keyword)
        );
      })
      .map(article => {
        const title = article.title || "";
        const description = article.description || "";

        // Highlight keyword in the title and description
        const highlightedTitle = highlightText(title, searchQuery);
        const highlightedDescription = highlightText(description, searchQuery);

        // Return a new article with the highlighted text
        return {
          ...article,
          title: highlightedTitle,
          description: highlightedDescription
        };
      });
  };

  const handleScroll = () => {
    setShowScrollTop(window.scrollY > 300);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Paginate data
  const paginateData = (data: ActSections, currentPage: number, itemsPerPage: number): ActSections => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return data.slice(startIndex, endIndex);
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // Clean content for copying
  const cleanContentForCopy = (content: string): string => {
    const textWithoutHtml = stripHtmlTags(content); // Remove HTML tags
    // Optionally remove special characters here if needed
    return textWithoutHtml;
  };

  // Copy to clipboard with localStorage
  const copyToClipboard = (text: string) => {
    if (!text) return; // Prevent copying empty text
    const cleanedText = cleanContentForCopy(text);
    navigator.clipboard.writeText(cleanedText).then(
      () => {
        setCopiedContent(cleanedText); // Set the copied content for use in ToDo
        alert('Copied to clipboard!');
        // Store copied content in localStorage
        localStorage.setItem('copiedContent', cleanedText);
      },
      (err) => alert('Failed to copy: ' + err)
    );
  };

  const filteredAndPaginatedData = paginateData(filteredData(data, debouncedSearchQuery), currentPage, itemsPerPage);
  const totalPages = Math.ceil(filteredData(data, debouncedSearchQuery).length / itemsPerPage);

  return (
    <div className="p-4">
      {/* Search bar */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search articles..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border bg-teal text-zinc-900 rounded w-full focus:bg-teal-100"
          aria-label="Search articles"
        />
      </div>

      {/* Display filtered and paginated articles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAndPaginatedData.length > 0 ? (
          filteredAndPaginatedData.map((article, index) => (
            <div
              key={index}
              className="constitution-cards p-4 border border-gray-200 rounded text-justify shadow-md bg-[#F5FFFA] h-[400px] overflow-scroll relative"
            >
              <h2 className="text-xl text-slate-500 font-bold mb-2">
                <span className="gap-2">Article:</span>
                {article.article != null ? article.article : "No Article"}
              </h2>

              <h2 className="text-xl text-slate-500 font-bold mb-2"
                dangerouslySetInnerHTML={{ __html: article.title || "No Title" }}
              />
              <p className="text-base text-black m-0"
                dangerouslySetInnerHTML={{ __html: article.description || "No Description" }}
              />
              <button
                onClick={() => copyToClipboard(article.description || '')}
                className="absolute top-4 right-4  text-teal-600 px-4 py-2 rounded"
              >
                <FaCopy />
              </button>
            </div>
          ))
        ) : (
          <p>No sections available.</p>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-between items-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:bg-teal-300"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-teal-500 text-white rounded hover:bg-teal-600 disabled:bg-teal-300"
        >
          Next
        </button>
      </div>
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

export default ConstitutionContent;
