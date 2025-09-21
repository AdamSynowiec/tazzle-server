CREATE DATABASE tazzle CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE tazzle;

-- Tabela ról użytkowników
CREATE TABLE Roles (
    role_id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(50) NOT NULL UNIQUE,
    role_description TEXT
);

-- Tabela użytkowników
CREATE TABLE Users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    role_id INT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

-- Tabela projektów
CREATE TABLE Projects (
    project_id INT AUTO_INCREMENT PRIMARY KEY,
    owner_id INT NOT NULL,
    project_key VARCHAR(100) NOT NULL UNIQUE,
    project_name VARCHAR(100) NOT NULL,
    project_description TEXT,
    created_by INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES Users(user_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id)
);

-- Tabela statusów ticketów
CREATE TABLE TicketStatus (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela priorytetów ticketów
CREATE TABLE TicketPriority (
    priority_id INT AUTO_INCREMENT PRIMARY KEY,
    priority_name VARCHAR(50) NOT NULL UNIQUE
);

-- Tabela ticketów
CREATE TABLE Tickets (
    ticket_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_number INT NOT NULL,
    ticket_title VARCHAR(200) NOT NULL,
    ticket_description TEXT,
    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    project_id INT NOT NULL,
    assignee_id INT NULL,
    created_by INT NOT NULL,
    due_date DATE NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (status_id) REFERENCES TicketStatus(status_id),
    FOREIGN KEY (priority_id) REFERENCES TicketPriority(priority_id),
    FOREIGN KEY (project_id) REFERENCES Projects(project_id),
    FOREIGN KEY (assignee_id) REFERENCES Users(user_id),
    FOREIGN KEY (created_by) REFERENCES Users(user_id),
    UNIQUE(ticket_number, project_id) -- unikalny numer w ramach projektu
);

-- Tabela komentarzy
CREATE TABLE Comments (
    comment_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    user_id INT NOT NULL,
    comment_type VARCHAR(50) DEFAULT 'comment',
    comment_text TEXT NOT NULL,
    is_deleted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
    FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

-- Tabela historii zmian ticketów
CREATE TABLE ChangeHistory (
    change_id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_id INT NOT NULL,
    changed_by INT NOT NULL,
    field_changed VARCHAR(100) NOT NULL,
    old_value TEXT,
    new_value TEXT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticket_id) REFERENCES Tickets(ticket_id),
    FOREIGN KEY (changed_by) REFERENCES Users(user_id)
);

-- Indeksy dla wydajności
CREATE INDEX idx_tickets_project ON Tickets(project_id);
CREATE INDEX idx_comments_ticket ON Comments(ticket_id);
