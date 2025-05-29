const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config({ path: require('path').resolve(__dirname, '../../nodeJs-sql/.env') });

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    await createTables(db);
}

async function createTables(connection) {
    // users
    await connection.query(`
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            address VARCHAR(255),
            isActive BOOLEAN DEFAULT TRUE
        )
    `);

    // user_types
    await connection.query(`
        CREATE TABLE IF NOT EXISTS user_types (
            id INT AUTO_INCREMENT PRIMARY KEY,
            type VARCHAR(50) NOT NULL,
            user_id INT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // passwords
    await connection.query(`
        CREATE TABLE IF NOT EXISTS passwords (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            isActive BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (user_id) REFERENCES users(id)
        )
    `);

    // places
    await connection.query(`
        CREATE TABLE IF NOT EXISTS places (
            id INT AUTO_INCREMENT PRIMARY KEY,
            googlePlaceId VARCHAR(100),
            name VARCHAR(100) NOT NULL,
            location JSON NOT NULL,
            types JSON,
            suitableFor JSON,
            description TEXT,
            imageUrl VARCHAR(255),
            isIndoor BOOLEAN,
            source VARCHAR(50),
            isFinanced BOOLEAN DEFAULT FALSE,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            lastUpdated DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            isActive BOOLEAN DEFAULT TRUE
        )
    `);

    // reviews
    await connection.query(`
        CREATE TABLE IF NOT EXISTS reviews (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            placeId INT NOT NULL,
            rating TINYINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
            text TEXT,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            isActive BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (placeId) REFERENCES places(id)
        )
    `);

    // visit_history
    await connection.query(`
        CREATE TABLE IF NOT EXISTS visit_history (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            placeId INT NOT NULL,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (placeId) REFERENCES places(id)
        )
    `);

    // favorite_places
    await connection.query(`
        CREATE TABLE IF NOT EXISTS favorite_places (
            id INT AUTO_INCREMENT PRIMARY KEY,
            userId INT NOT NULL,
            placeId INT NOT NULL,
            isActive BOOLEAN DEFAULT TRUE,
            FOREIGN KEY (userId) REFERENCES users(id),
            FOREIGN KEY (placeId) REFERENCES places(id)
        )
    `);
}


main();
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} `);
});

