"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { getAllEvents, getEventsByAddress } from "@/firebase/functions";

// Create context
const EventsContext = createContext({
  allEvents: [],
  myEvents: [],
  loading: false,
  error: null,
  refreshEvents: () => {},
});

// Custom hook to use the events context
export const useEvents = () => {
  const context = useContext(EventsContext);
  if (!context) {
    throw new Error("useEvents must be used within an EventsProvider");
  }
  return context;
};

export const EventsProvider = ({ address, children }) => {
  const [allEvents, setAllEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch all events
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events in parallel
      const [allEventsResponse, myEventsResponse] = await Promise.all([
        getAllEvents(),
        address ? getEventsByAddress(address) : { data: [] }
      ]);

      if (!allEventsResponse.success) {
        throw new Error(allEventsResponse.error);
      }

      if (!myEventsResponse.success && address) {
        throw new Error(myEventsResponse.error);
      }

      setAllEvents(allEventsResponse.data || []);
      setMyEvents(myEventsResponse.data || []);
    } catch (err) {
      setError(err.message);
      console.error("Error fetching events:", err);
    } finally {
      setLoading(false);
    }
  }, [address]);

  // Initial fetch
  React.useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Manual refresh function
  const refreshEvents = useCallback(() => {
    return fetchEvents();
  }, [fetchEvents]);

  const value = {
    allEvents,
    myEvents,
    loading,
    error,
    refreshEvents,
  };

  return (
    <EventsContext.Provider value={value}>
      {children}
    </EventsContext.Provider>
  );
};