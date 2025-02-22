"use client"
import React, { createContext, useContext, useEffect, useState } from 'react';

interface SearchContextType {
  events: any[]; // Replace `any[]` with your event type
  setEvents: React.Dispatch<React.SetStateAction<any[]>>;
  allEvents: any[]; // Store all events separately
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [events, setEvents] = useState<any[]>([]);
  const [allEvents, setAllEvents] = useState<any[]>([]); // Store all events initially

  // Fetch all events on initial load
  useEffect(() => {
    fetch('http://localhost:8000/api/event')
      .then((res) => res.json())
      .then((data) => {
        if (data.result) {
          setEvents(data.result); // Set both initial and all events
          setAllEvents(data.result);
        }
      })
      .catch((error) => console.error('Error fetching events:', error));
  }, []);

  return (
    <SearchContext.Provider value={{ events, setEvents, allEvents }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};
