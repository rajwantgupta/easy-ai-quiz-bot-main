-- Create the database
CREATE DATABASE IF NOT EXISTS training_db;
USE training_db;

-- Create User table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    emailVerified DATETIME,
    image VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create TrainingModule table
CREATE TABLE IF NOT EXISTS training_modules (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    duration INT NOT NULL,
    isPublic BOOLEAN DEFAULT FALSE,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Resource table
CREATE TABLE IF NOT EXISTS resources (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL,
    url TEXT NOT NULL,
    moduleId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moduleId) REFERENCES training_modules(id) ON DELETE CASCADE
);

-- Create Quiz table
CREATE TABLE IF NOT EXISTS quizzes (
    id VARCHAR(255) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    passingScore INT NOT NULL,
    attempts INT DEFAULT 0,
    bestScore INT DEFAULT 0,
    moduleId VARCHAR(255) UNIQUE NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (moduleId) REFERENCES training_modules(id) ON DELETE CASCADE
);

-- Create Question table
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(255) PRIMARY KEY,
    question TEXT NOT NULL,
    options JSON NOT NULL,
    correctAnswer INT NOT NULL,
    quizId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Create ModuleProgress table
CREATE TABLE IF NOT EXISTS module_progress (
    id VARCHAR(255) PRIMARY KEY,
    progress INT DEFAULT 0,
    status VARCHAR(50) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    moduleId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES training_modules(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_module (userId, moduleId)
);

-- Create QuizAttempt table
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(255) PRIMARY KEY,
    score INT NOT NULL,
    answers JSON NOT NULL,
    userId VARCHAR(255) NOT NULL,
    quizId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (quizId) REFERENCES quizzes(id) ON DELETE CASCADE
);

-- Create ShareToken table
CREATE TABLE IF NOT EXISTS share_tokens (
    id VARCHAR(255) PRIMARY KEY,
    token VARCHAR(255) UNIQUE NOT NULL,
    expiresAt DATETIME NOT NULL,
    moduleId VARCHAR(255) NOT NULL,
    createdById VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (moduleId) REFERENCES training_modules(id) ON DELETE CASCADE,
    FOREIGN KEY (createdById) REFERENCES users(id) ON DELETE CASCADE
);

-- Create ModuleAssignments table (for many-to-many relationship between users and modules)
CREATE TABLE IF NOT EXISTS module_assignments (
    userId VARCHAR(255) NOT NULL,
    moduleId VARCHAR(255) NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (userId, moduleId),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (moduleId) REFERENCES training_modules(id) ON DELETE CASCADE
); 