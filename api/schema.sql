CREATE TABLE IF NOT EXISTS inscripciones (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  origen_tipo VARCHAR(50) NOT NULL,
  institucion VARCHAR(255) NOT NULL,
  nivel_programacion VARCHAR(100) NOT NULL,
  intereses TEXT,
  interes_otro VARCHAR(255),
  motivacion TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
