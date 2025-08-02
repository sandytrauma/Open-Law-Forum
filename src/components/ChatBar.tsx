import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import CustomSpinner from './CustomSpinnerChatBar';

import rehypeFormat from "rehype-format";
import rehypeStringify from "rehype-stringify";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";


const processor = unified()
  .use(remarkParse)
  .use(remarkRehype)
  .use(rehypeFormat, { blanks: ["body", "head"], indent: "\t" })
  .use(rehypeStringify);

// Define types for state
interface ChatResponseData {
  answer: string;
}

const ChatBarWrapper = styled.div<{ $isCollapsed: boolean }>`
  position: fixed;
  bottom: 20px;
  right: 10px;
  width: ${({ $isCollapsed }) => ($isCollapsed ? '50px' : '300px')};
  max-height: ${({ $isCollapsed }) => ($isCollapsed ? '50px' : '80vh')};
  overflow-y: scroll;
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
  transition: all 0.3s ease;
  padding: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '20px')};
  display: flex;
  flex-direction: column;
  align-items: ${({ $isCollapsed }) => ($isCollapsed ? 'center' : 'flex-start')};
`;

const ChatHeader = styled.div`
  font-weight: bold;
  margin-bottom: 10px;
`;

const ChatInput = styled.textarea`
  width: 100%;
  height: 80px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
  margin-bottom: 10px;
`;

const SendButton = styled.button`
  padding: 10px 15px;
  background: #0070f3;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
`;

const ChatResponse = styled.div`
  background: #f3cfcfff;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-size:14px;
  color:zinc;
`;

const ToggleButton = styled.button`
  background-color: #e88074;
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 20px;
  cursor: pointer;
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050; /* Ensure it's above other elements */
`;



const handleExternalLinkClick = () => {
  window.location.href = 'https://ai-chat4u.netlify.app/';
};

const ChatBar: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // Type for query is string
  const [response, setResponse] = useState<string>(''); // Type for response is string
  const [loading, setLoading] = useState<boolean>(false); // Type for loading is boolean
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true); // Track if 
  // chat is collapsed

    const [htmlResponse, setHtmlResponse] = useState<string>('');

  useEffect(() => {
    const processMarkdown = async () => {
      if (response) {
        try {
          const vfile = await processor.process(response);
          // Set the state with the converted HTML string.
          setHtmlResponse(String(vfile));
        } catch (error) {
          console.error("Failed to process markdown:", error);
          setHtmlResponse(`<p>Error rendering response.</p>`);
        }
      }
    };
    processMarkdown();
  }, [response]);

  const handleSubmit = async () => {
    if (!query.trim()) return;

    // Clear previous response before fetching a new one
    setResponse('');
    setHtmlResponse('');
    setLoading(true);

    try {
      const result = await axios.post<ChatResponseData>('/api/askai', { query });
      setResponse(result.data.answer); // Ensure result is typed correctly
    } catch (error) {
      setResponse('There was an error processing your request.');
    } finally {
      setLoading(false);
    }
  };

  const toggleChat = () => {
    setIsCollapsed(!isCollapsed); // Toggle the collapse/expand state
  };

  return (
    <>
      <ChatBarWrapper $isCollapsed={isCollapsed} className="mr-2 mb-11">
        {!isCollapsed && (
          <>
            <ChatHeader>Legal Gup-Shup with <strong className="text-gradient">legalTai</strong></ChatHeader>
            <ChatInput
              placeholder="Paste your legal query here..."
              value={query}
              onChange={(e) => setQuery(e.target.value)} // Ensure correct type 
              className="min-h-20"
            />
            <SendButton onClick={handleSubmit} disabled={loading}>
              {loading ? <CustomSpinner/> : 'Get Answer'}
            </SendButton>
            {htmlResponse && (
              <ChatResponse
                className='prose text-justify'
                dangerouslySetInnerHTML={{ __html: htmlResponse }}
              />
            )}
          </>
        )}
      </ChatBarWrapper>

      <ToggleButton className='mr-9 hover:bg-red-600' onClick={toggleChat}>
        {isCollapsed ? '+' : '–'}
      </ToggleButton>
    </>
  );
};

export default ChatBar;
