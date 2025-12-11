import React, { useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from '../types';
import { CalendarDays, MapPin, Clock } from 'lucide-react';

interface CalendarProps {
  events: Event[];
}

const Calendar: React.FC<CalendarProps> = ({ events }) => {
  const calendarRef = useRef<FullCalendar>(null);

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    date: event.date,
    time: event.time,
    backgroundColor: getCategoryColor(event.category),
    borderColor: getCategoryColor(event.category),
    extendedProps: {
      description: event.description,
      location: event.location,
      category: event.category,
      image: event.image,
    },
  }));

  function getCategoryColor(category: string): string {
    const colors = {
      academico: '#3B82F6',
      cultural: '#8B5CF6',
      deportivo: '#10B981',
      social: '#F59E0B',
      ceremonial: '#EF4444',
    };
    return colors[category as keyof typeof colors] || '#6B7280';
  }

  const handleEventClick = (clickInfo: any) => {
    const event = clickInfo.event;
    const props = event.extendedProps;
    
    // Create modal content
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4';
    modal.onclick = (e) => {
      if (e.target === modal) {
        document.body.removeChild(modal);
      }
    };

    modal.innerHTML = `
      <div class="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div class="relative">
          ${props.image ? `<img src="${props.image}" alt="${event.title}" class="w-full h-48 object-cover rounded-t-lg" />` : ''}
          <button onclick="this.closest('.fixed').remove()" class="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-2xl font-bold text-gray-900">${event.title}</h2>
            <span class="px-3 py-1 rounded-full text-sm font-medium" style="background-color: ${event.backgroundColor}20; color: ${event.backgroundColor}">
              ${getCategoryLabel(props.category)}
            </span>
          </div>
          <div class="space-y-3 mb-4">
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              ${formatDate(event.start)}
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              ${event.time || 'Hora por confirmar'}
            </div>
            <div class="flex items-center text-gray-600">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${props.location}
            </div>
          </div>
          <p class="text-gray-700 leading-relaxed">${props.description}</p>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
  };

  function formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  function getCategoryLabel(category: string): string {
    const labels = {
      academico: 'Académico',
      cultural: 'Cultural',
      deportivo: 'Deportivo',
      social: 'Social',
      ceremonial: 'Ceremonial',
    };
    return labels[category as keyof typeof labels] || category;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <CalendarDays className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Calendario de Eventos
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explora nuestro calendario interactivo y descubre todas las actividades programadas. 
            Haz clic en cualquier evento para ver más detalles.
          </p>
        </div>

        {/* Legend */}
        <div className="mb-8 flex flex-wrap justify-center gap-4">
          {[
            { category: 'academico', label: 'Académico' },
            { category: 'cultural', label: 'Cultural' },
            { category: 'deportivo', label: 'Deportivo' },
            { category: 'social', label: 'Social' },
            { category: 'ceremonial', label: 'Ceremonial' },
          ].map(({ category, label }) => (
            <div key={category} className="flex items-center space-x-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: getCategoryColor(category) }}
              ></div>
              <span className="text-sm font-medium text-gray-700">{label}</span>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            events={calendarEvents}
            eventClick={handleEventClick}
            height="auto"
            locale="es"
            buttonText={{
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día'
            }}
            eventDisplay="block"
            dayMaxEvents={3}
            moreLinkText="más eventos"
            eventDidMount={(info) => {
              // Add hover effect
              info.el.style.cursor = 'pointer';
              info.el.title = `${info.event.title} - ${info.event.extendedProps.location}`;
            }}
          />
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            ¿Cómo usar el calendario?
          </h3>
          <ul className="text-blue-700 space-y-1">
            <li>• Haz clic en cualquier evento para ver información detallada</li>
            <li>• Usa los botones superiores para cambiar entre vista mensual, semanal y diaria</li>
            <li>• Los colores indican diferentes categorías de eventos</li>
            <li>• Navega entre meses usando las flechas izquierda y derecha</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Calendar;