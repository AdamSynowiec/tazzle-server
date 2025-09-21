CREATE DATABASE tazzle CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;

USE tazzle;

-- Tabela użytkowników
CREATE TABLE Users (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(50) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    userEamil VARCHAR(100) NOT NULL UNIQUE,
    userRole VARCHAR(100) NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela projektów
CREATE TABLE Projects (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    projectKey VARCHAR(100) NOT NULL,
    projectName VARCHAR(100) NOT NULL,
    projectDescription TEXT,
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES Users(w_id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(w_id)
);

-- Tabela ticketów
CREATE TABLE Tickets (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    ticketNumber INT NOT NULL,
    ticketTitle VARCHAR(200) NOT NULL,
    ticketDescription TEXT,
    ticketStatus VARCHAR(100) NOT NULL,
    ticketPriority VARCHAR(100) NOT NULL,
    projectID INT NOT NULL,
    assigneeID INT,
    CreatedBy INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (projectID) REFERENCES Projects(w_id),
    FOREIGN KEY (assigneeID) REFERENCES Users(w_id),
    FOREIGN KEY (CreatedBy) REFERENCES Users(w_id)
);

-- Tabela komentarzy
CREATE TABLE Comments (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    ticketID INT NOT NULL,
    userID INT NOT NULL,
    ticketComments TEXT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticketID) REFERENCES Tickets(w_id),
    FOREIGN KEY (userID) REFERENCES Users(w_id)
);

-- Tabela historii zmian
CREATE TABLE ChangeHistory (
    w_id INT AUTO_INCREMENT PRIMARY KEY,
    ticketID INT NOT NULL,
    changedBy INT NOT NULL,
    changeDescription TEXT NOT NULL,
    changeDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ticketID) REFERENCES Tickets(w_id),
    FOREIGN KEY (changedBy) REFERENCES Users(w_id)
);