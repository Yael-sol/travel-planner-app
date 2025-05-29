const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const PORT = 3001;
const app = express();
app.use(cors());
app.use(express.json());
require('dotenv').config({ path: '../.env' });

async function main() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });
    await createTriggers(db);
}

async function createTriggers(connection) {
    //posts
    await connection.query(
        `CREATE TRIGGER deactivate_comments_on_post_deactivation
        AFTER UPDATE ON posts
        FOR EACH ROW
        BEGIN
            IF OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
                UPDATE comments SET is_active = FALSE WHERE post_id = NEW.id;
            END IF;
        END; `
    );
    //users
    await connection.query(`
        CREATE TRIGGER deactivate_user_dependencies
        AFTER UPDATE ON users
        FOR EACH ROW
        BEGIN
            IF OLD.is_active = TRUE AND NEW.is_active = FALSE THEN
                UPDATE todos
                SET is_active = FALSE
                WHERE user_id = NEW.id;
    
                UPDATE passwords
                SET is_active = FALSE
                WHERE user_id = NEW.id;
            END IF;
        END;
    `);    
}

app.listen(PORT, () => {
    console.log(`creating trigers on port: ${PORT} `);
    main();
});

