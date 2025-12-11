/*
  # Crear tabla de mensajes de contacto

  1. Nueva Tabla
    - `contact_messages`
      - `id` (uuid, clave primaria, generada automáticamente)
      - `nombre` (text, nombre completo del remitente)
      - `email` (text, correo electrónico del remitente)
      - `asunto` (text, asunto del mensaje)
      - `mensaje` (text, contenido del mensaje)
      - `created_at` (timestamptz, fecha de creación con valor por defecto)
      - `read` (boolean, indica si el mensaje fue leído, por defecto false)
  
  2. Seguridad
    - Habilitar RLS en la tabla `contact_messages`
    - Agregar política para que usuarios autenticados puedan leer todos los mensajes
    - Agregar política para que usuarios autenticados puedan actualizar mensajes (marcar como leídos)
    - Agregar política para que usuarios autenticados puedan eliminar mensajes
    - Agregar política para que cualquiera pueda insertar mensajes (para el formulario público)
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  email text NOT NULL,
  asunto text NOT NULL,
  mensaje text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios autenticados puedan leer todos los mensajes
CREATE POLICY "Authenticated users can read all contact messages"
  ON contact_messages
  FOR SELECT
  TO authenticated
  USING (true);

-- Política para que usuarios autenticados puedan actualizar mensajes
CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Política para que usuarios autenticados puedan eliminar mensajes
CREATE POLICY "Authenticated users can delete contact messages"
  ON contact_messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Política para que cualquiera pueda insertar mensajes (formulario público)
CREATE POLICY "Anyone can insert contact messages"
  ON contact_messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);