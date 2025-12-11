export interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  description: string;
  category: 'academico' | 'cultural' | 'deportivo' | 'social' | 'ceremonial';
  location: string;
  image?: string;
}