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
import { supabase } from './lib/supabase';

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setLoading(false);
    }
  };

  const addEvent = async (newEvent: Omit<Event, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([newEvent])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setEvents([...events, data]);
      }
    } catch (error) {
      console.error('Error adding event:', error);
      throw error;
    }
  };

  const updateEvent = async (eventId: string, updatedEvent: Partial<Event>) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updatedEvent)
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.map(event =>
        event.id === eventId ? { ...event, ...updatedEvent } : event
      ));
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) throw error;

      setEvents(events.filter(event => event.id !== eventId));
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
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
    <Router basename="/arizagablog">
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