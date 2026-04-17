-- Database for cultural heritage spaces
CREATE DATABASE IF NOT EXISTS db_heritage 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE db_heritage;

CREATE TABLE cultural_spaces (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    max_capacity INT NOT NULL CHECK (max_capacity > 0),
    conservation_status ENUM('operational', 'maintenance', 'closed_renovation') NOT NULL DEFAULT 'operational',
    administrative_unit VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_conservation_status (conservation_status),
    INDEX idx_capacity (max_capacity),
    INDEX idx_admin_unit (administrative_unit)
) ENGINE=InnoDB;

-- Seed data
INSERT INTO cultural_spaces (name, address, max_capacity, conservation_status, administrative_unit, description) VALUES
('Municipal Theater', 'Calle 123 #45-67', 500, 'operational', 'Secretary of Culture', 'Main city theater'),
('Northern Cultural Center', 'Carrera 7 #89-10', 200, 'operational', 'IDARTES', 'Community cultural center'),
('Southern Public Library', 'Avenida 68 #12-34', 150, 'maintenance', 'BibloRed', 'Public library branch'),
('Contemporary Art Museum', 'Calle 26 #5-45', 300, 'operational', 'Secretary of Culture', 'Modern art exhibitions');