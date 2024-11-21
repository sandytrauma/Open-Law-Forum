"use client";
import React, { useState } from 'react';

type SearchBarProps = {
  onSearch: (keyword: string) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(keyword);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Search..."
        className="border p-2 rounded w-full"
      />
      <button type="submit" className="mt-2 p-2 bg-blue-500 text-white rounded">Search</button>
    </form>
  );
};

export default SearchBar;
