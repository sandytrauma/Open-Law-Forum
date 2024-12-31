import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';

// Define types for state
interface ChatResponseData {
  answer: string;
}

const ChatBarWrapper = styled.div`
  position: fixed;
  padding:2px;
  bottom: 20px;
  right: 20px;
  width: 300px;
  max-height: 50vh;
  overflow-y: scroll;
  background: #ffffff;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  z-index: 1000;
  padding: 20px;
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
  background: #f5f5f5;
  padding: 15px;
  border-radius: 8px;
  margin-top: 10px;
  font-size: 14px;
  min-height: 100px;
`;

const ChatBar: React.FC = () => {
  const [query, setQuery] = useState<string>(''); // Type for query is string
  const [response, setResponse] = useState<string>(''); // Type for response is string
  const [loading, setLoading] = useState<boolean>(false); // Type for loading is boolean

  const handleSubmit = async () => {
    if (!query.trim()) return;

    // Clear previous response before fetching a new one
    setResponse('');
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

  return (
    <ChatBarWrapper>
      <ChatHeader>Legal Chat</ChatHeader>
      <ChatInput
        placeholder="Paste your legal query here..."
        value={query}
        onChange={(e) => setQuery(e.target.value)} // Ensure correct type for event
      />
      <SendButton onClick={handleSubmit} disabled={loading}>
        {loading ? 'Processing...' : 'Get Answer'}
      </SendButton>
      {response && <ChatResponse>{response}</ChatResponse>}
    </ChatBarWrapper>
  );
};

export default ChatBar;
