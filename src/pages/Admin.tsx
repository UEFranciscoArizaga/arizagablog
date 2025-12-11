import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Event } from '../types';
import { Plus, Edit2, Trash2, LogOut, Calendar, Zap, TrendingUp, Sparkles, Save, X, Mail, MessageSquare, User } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactMessage {
  id: string;
  nombre: string;
  email: string;
  asunto: string;
  mensaje: string;
  created_at: string;
  read: boolean;
}

interface AdminProps {
  events: Event[];
  onAddEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  onUpdateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  onDeleteEvent: (id: string) => Promise<void>;
}

const Admin: React.FC<AdminProps> = ({ events, onAddEvent, onUpdateEvent, onDeleteEvent }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [eventForm, setEventForm] = useState({
    title: '',
    date: '',
    time: '',
    description: '',
    category: 'academico' as Event['category'],
    location: '',
    image: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setIsAuthenticated(true);
      } else {
        navigate('/login');
      }
    };
    checkAuth();
  }, [navigate]);

  useEffect(() => {
    if (isAuthenticated) {
      loadContactMessages();
    }
  }, [isAuthenticated]);

  const loadContactMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setContactMessages(data || []);
    } catch (error) {
      console.error('Error loading contact messages:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEventForm({
      ...eventForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (editingEvent) {
        await onUpdateEvent(editingEvent.id, eventForm);
        setEditingEvent(null);
      } else {
        await onAddEvent(eventForm);
      }
      resetEventForm();
    } catch (error) {
      console.error('Error submitting event:', error);
      alert('Error al guardar el evento. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      date: '',
      time: '',
      description: '',
      category: 'academico',
      location: '',
      image: '',
    });
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleEditEvent = (event: Event) => {
    setEventForm({
      title: event.title,
      date: event.date,
      time: event.time,
      description: event.description,
      category: event.category,
      location: event.location,
      image: event.image || '',
    });
    setEditingEvent(event);
    setShowEventForm(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await onDeleteEvent(eventId);
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error al eliminar el evento. Por favor intenta de nuevo.');
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      try {
        const { error } = await supabase
          .from('contact_messages')
          .delete()
          .eq('id', messageId);

        if (error) throw error;

        setContactMessages(prev => prev.filter(msg => msg.id !== messageId));
        setSelectedMessage(null);
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Error al eliminar el mensaje. Por favor intenta de nuevo.');
      }
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const getCategoryStats = () => {
    const stats = {
      academico: 0,
      cultural: 0,
      deportivo: 0,
      social: 0,
      ceremonial: 0,
    };

    events.forEach(event => {
      stats[event.category]++;
    });

    return stats;
  };

  if (!isAuthenticated) {
    return null;
  }

  const categoryStats = getCategoryStats();
  const totalEvents = events.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950 dark:from-black dark:via-blue-950 dark:to-black py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl p-6 mb-8 border border-cyan-500/20 hover:border-cyan-500/40 transition-all duration-300">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent flex items-center gap-2">
                <Sparkles className="h-8 w-8 text-cyan-400 animate-pulse" />
                Panel de Administración
              </h1>
              <p className="text-gray-400 mt-1">Gestiona los eventos del colegio en tiempo real</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105 transform"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-cyan-500/20 hover:border-cyan-400/50 transition-all duration-300 group hover:scale-105 transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Total Eventos</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">{totalEvents}</p>
              </div>
              <Calendar className="h-8 w-8 text-cyan-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-blue-500/20 hover:border-blue-400/50 transition-all duration-300 group hover:scale-105 transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Académicos</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">{categoryStats.academico}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 group hover:scale-105 transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Culturales</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">{categoryStats.cultural}</p>
              </div>
              <Sparkles className="h-8 w-8 text-purple-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg p-6 border border-green-500/20 hover:border-green-400/50 transition-all duration-300 group hover:scale-105 transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-400">Deportivos</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">{categoryStats.deportivo}</p>
              </div>
              <Zap className="h-8 w-8 text-green-400 group-hover:scale-110 transition-transform" />
            </div>
          </div>
        </div>

        <div className="mb-6">
          <button
            onClick={() => setShowEventForm(true)}
            className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 font-semibold shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 hover:scale-105 transform"
          >
            <Plus className="h-5 w-5 mr-2" />
            Crear Nuevo Evento
          </button>
        </div>

        {showEventForm && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    {editingEvent ? 'Editar Evento' : 'Crear Nuevo Evento'}
                  </h2>
                  <button
                    onClick={resetEventForm}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmitEvent} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Título del Evento *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={eventForm.title}
                        onChange={handleEventFormChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                        placeholder="Nombre del evento"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Categoría *
                      </label>
                      <select
                        name="category"
                        value={eventForm.category}
                        onChange={handleEventFormChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      >
                        <option value="academico">Académico</option>
                        <option value="cultural">Cultural</option>
                        <option value="deportivo">Deportivo</option>
                        <option value="social">Social</option>
                        <option value="ceremonial">Ceremonial</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha *
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={eventForm.date}
                        onChange={handleEventFormChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hora *
                      </label>
                      <input
                        type="time"
                        name="time"
                        value={eventForm.time}
                        onChange={handleEventFormChange}
                        required
                        className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Ubicación *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={eventForm.location}
                      onChange={handleEventFormChange}
                      required
                      className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="Lugar donde se realizará el evento"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      URL de la Imagen
                    </label>
                    <input
                      type="url"
                      name="image"
                      value={eventForm.image}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Descripción *
                    </label>
                    <textarea
                      name="description"
                      value={eventForm.description}
                      onChange={handleEventFormChange}
                      required
                      rows={4}
                      className="w-full px-4 py-3 bg-slate-800/50 border border-cyan-500/30 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent text-white placeholder-gray-500"
                      placeholder="Descripción detallada del evento"
                    />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <button
                      type="button"
                      onClick={resetEventForm}
                      className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-slate-800 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-xl hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 shadow-lg shadow-cyan-500/50 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Guardando...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {editingEvent ? 'Actualizar' : 'Crear'} Evento
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20">
          <div className="px-6 py-4 border-b border-cyan-500/20">
            <h2 className="text-xl font-semibold text-white">Lista de Eventos</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-cyan-500/20">
              <thead className="bg-slate-800/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Evento
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Ubicación
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {events.map((event) => (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{event.title}</div>
                        <div className="text-sm text-gray-400 truncate max-w-xs">{event.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{event.date}</div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-cyan-900/50 text-cyan-300 border border-cyan-500/30">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {event.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-cyan-400 hover:text-cyan-300 p-2 hover:bg-cyan-900/20 rounded-lg transition-all duration-300"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Contact Messages Section */}
        <div className="mt-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-cyan-500/20">
          <div className="px-6 py-4 border-b border-cyan-500/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-6 w-6 text-cyan-400" />
                <h2 className="text-xl font-semibold text-white">Log de Contactos</h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1 rounded-lg">
                <span className="text-sm text-gray-400">Total de mensajes:</span>
                <span className="text-lg font-bold text-cyan-400">{contactMessages.length}</span>
              </div>
            </div>
            <p className="text-gray-400 mt-1 text-sm">Ver y gestionar todos los mensajes de contacto recibidos</p>
          </div>

          <div className="overflow-x-auto">
            {contactMessages.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">
                  No hay mensajes
                </h3>
                <p className="text-gray-500">
                  Los mensajes de contacto aparecerán aquí cuando alguien use el formulario.
                </p>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-cyan-500/20">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Remitente
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Asunto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Fecha
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-500/10">
                  {contactMessages.map((message) => (
                    <tr
                      key={message.id}
                      className="hover:bg-slate-800/30 transition-colors cursor-pointer"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-white">{message.nombre}</div>
                            <div className="text-sm text-gray-400">{message.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <MessageSquare className="h-4 w-4 text-cyan-400 mr-2 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-white capitalize">{message.asunto}</div>
                            <div className="text-sm text-gray-400 truncate max-w-xs">{message.mensaje}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-300">{formatMessageDate(message.created_at)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(message.id);
                          }}
                          className="text-red-400 hover:text-red-300 p-2 hover:bg-red-900/20 rounded-lg transition-all duration-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Message Detail Modal */}
        {selectedMessage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setSelectedMessage(null);
              }
            }}
          >
            <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30 shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">{selectedMessage.nombre}</h2>
                      <p className="text-cyan-400">{selectedMessage.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-2 hover:bg-slate-800 rounded-full transition-colors text-gray-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-gray-400">Asunto:</span>
                    </div>
                    <p className="text-white font-medium capitalize">{selectedMessage.asunto}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-gray-400">Fecha:</span>
                    </div>
                    <p className="text-white">{formatMessageDate(selectedMessage.created_at)}</p>
                  </div>

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-cyan-500/20">
                    <div className="flex items-center gap-2 mb-3">
                      <Mail className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-gray-400">Mensaje:</span>
                    </div>
                    <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedMessage.mensaje}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    Cerrar
                  </button>
                  <button
                    onClick={() => handleDeleteMessage(selectedMessage.id)}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all duration-300 shadow-lg shadow-red-500/50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Mensaje
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
