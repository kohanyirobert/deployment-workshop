CREATE TABLE car (
    id SERIAL PRIMARY KEY,
    manufacturer VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL
);

INSERT INTO car (manufacturer, model) VALUES
('Toyota', 'Corolla'),
('Lada', 'Samara'),
('Opel', 'Astra'),
('Skoda', 'Octavia'),
('Citroen', 'Berlingo');
