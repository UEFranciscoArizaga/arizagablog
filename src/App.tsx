import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Calendar from './pages/Calendar';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import Login from './pages/Login';
import Footer from './components/Footer';
import { Event } from './types';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      try {
        // Load events from JSON file
        const response = await fetch('/eventos.json');
        const jsonEvents = await response.json();
        
        // Load additional events from localStorage
        const storedEvents = localStorage.getItem('customEvents');
        const customEvents = storedEvents ? JSON.parse(storedEvents) : [];
        
        // Combine both sources
        const allEvents = [...jsonEvents, ...customEvents];
        setEvents(allEvents);
      } catch (error) {
        console.error('Error loading events:', error);
        // Fallback to localStorage only
        const storedEvents = localStorage.getItem('customEvents');
        const customEvents = storedEvents ? JSON.parse(storedEvents) : [];
        setEvents(customEvents);
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  const addEvent = (newEvent: Omit<Event, 'id'>) => {
    const eventWithId = {
      ...newEvent,
      id: Date.now().toString(),
    };
    
    const updatedEvents = [...events, eventWithId];
    setEvents(updatedEvents);
    
    // Save custom events to localStorage
    const customEvents = updatedEvents.filter(event => 
      !['1', '2', '3', '4', '5', '6'].includes(event.id)
    );
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  };

  const updateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    const updatedEvents = events.map(event =>
      event.id === eventId ? { ...event, ...updatedEvent } : event
    );
    setEvents(updatedEvents);
    
    // Update localStorage for custom events
    const customEvents = updatedEvents.filter(event => 
      !['1', '2', '3', '4', '5', '6'].includes(event.id)
    );
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  };

  const deleteEvent = (eventId: string) => {
    // Only allow deletion of custom events (not the original JSON events)
    if (['1', '2', '3', '4', '5', '6'].includes(eventId)) {
      alert('No se pueden eliminar los eventos predefinidos del colegio.');
      return;
    }
    
    const updatedEvents = events.filter(event => event.id !== eventId);
    setEvents(updatedEvents);
    
    // Update localStorage
    const customEvents = updatedEvents.filter(event => 
      !['1', '2', '3', '4', '5', '6'].includes(event.id)
    );
    localStorage.setItem('customEvents', JSON.stringify(customEvents));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex items-center justify-center transition-colors duration-300">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Cargando eventos...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-950 dark:to-gray-900 flex flex-col transition-colors duration-300">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/calendario" element={<Calendar events={events} />} />
            <Route path="/eventos" element={<Events events={events} />} />
            <Route path="/contacto" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Admin events={events} onAddEvent={addEvent} onUpdateEvent={updateEvent} onDeleteEvent={deleteEvent} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;