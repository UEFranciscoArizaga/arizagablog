import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Award, BookOpen, ArrowRight, Star } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: Calendar,
      title: 'Calendario de Eventos',
      description: 'Mantente al día con todas las actividades programadas en nuestra institución.',
      color: 'bg-blue-500',
    },
    {
      icon: Users,
      title: 'Comunidad Educativa',
      description: 'Conecta con estudiantes, padres de familia y docentes en nuestros eventos.',
      color: 'bg-green-500',
    },
    {
      icon: Award,
      title: 'Logros Académicos',
      description: 'Celebramos los éxitos y reconocimientos de nuestra comunidad estudiantil.',
      color: 'bg-purple-500',
    },
    {
      icon: BookOpen,
      title: 'Formación Integral',
      description: 'Eventos diseñados para el desarrollo académico, cultural y deportivo.',
      color: 'bg-orange-500',
    },
  ];

  const stats = [
    { number: '51+', label: 'Años de historia' },
    { number: '100+', label: 'Eventos anuales' },
  ];

  return (
    <div className="min-h-screen dark:bg-gray-950 transition-colors duration-300">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 dark:from-gray-900 dark:via-blue-900 dark:to-gray-900 text-white py-20 px-4 sm:px-6 lg:px-8 overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-blue-500 dark:bg-blue-600 rounded-full opacity-10 animate-pulse"></div>
          <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-orange-500 dark:bg-orange-600 rounded-full opacity-10 animate-pulse delay-1000"></div>
        </div>
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-sm font-medium mb-6 animate-fadeIn">
              <Star className="h-4 w-4 mr-2 animate-spin-slow" />
              Excelencia educativa desde 1973
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight animate-slideUp">
              Bienvenido a la Página de Eventos del
              <span className="block text-orange-400 dark:text-orange-300 animate-glow">Colegio Dr. Francisco Arízaga Luque</span>
            </h1>
            <p className="text-xl sm:text-2xl text-blue-100 dark:text-blue-200 mb-8 max-w-3xl mx-auto leading-relaxed animate-slideUp delay-200">
              Tu sitio favorito para estar al tanto de eventos dentro de la institución
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 animate-slideUp delay-300">
            <Link
              to="/calendario"
              className="group inline-flex items-center px-8 py-4 bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700 rounded-lg text-white font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg animate-bounce-subtle"
            >
              <Calendar className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform" />
              Ver Eventos
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link
              to="/contacto"
              className="inline-flex items-center px-8 py-4 border-2 border-white hover:bg-white hover:text-blue-800 dark:hover:text-blue-900 rounded-lg text-white font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-xl backdrop-blur-sm"
            >
              Contáctanos
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-8 max-w-2xl mx-auto animate-slideUp delay-400">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group cursor-pointer transform hover:scale-110 transition-all duration-300"
              >
                <div className="text-4xl sm:text-5xl font-bold text-orange-400 dark:text-orange-300 mb-2 animate-countUp group-hover:scale-125 transition-transform">
                  {stat.number}
                </div>
                <div className="text-base sm:text-lg text-blue-100 dark:text-blue-200 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-950 relative overflow-hidden transition-colors duration-300">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white opacity-10 rounded-full animate-float"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-orange-400 opacity-10 rounded-full animate-float delay-500"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-yellow-400 opacity-10 rounded-full animate-float delay-1000"></div>
        </div>
        <div className="max-w-4xl mx-auto text-center text-white relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 animate-slideUp">
            ¡No te pierdas ningún evento!
          </h2>
          <p className="text-xl mb-8 text-blue-100 dark:text-blue-200 animate-slideUp delay-200">
            Mantente informado sobre todas las actividades académicas, culturales y deportivas
            que enriquecen la experiencia educativa en nuestra institución.
          </p>
          <Link
            to="/eventos"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 dark:text-blue-800 hover:bg-gray-100 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-110 hover:shadow-2xl shadow-lg animate-slideUp delay-300 group"
          >
            Explorar Todos los Eventos
            <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-2 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;