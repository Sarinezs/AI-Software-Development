const db = require('./DB'); // นำเข้า connection pool ของคุณ

const tables = [
    `CREATE TABLE IF NOT EXISTS user (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role ENUM('user', 'admin')
    );`,

    `CREATE TABLE IF NOT EXISTS model (
        model_id INT AUTO_INCREMENT PRIMARY KEY,
        model_name VARCHAR(255),
        model_version VARCHAR(255),
        update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`,

    `CREATE TABLE IF NOT EXISTS mt5_account (
        mt5_id INT AUTO_INCREMENT PRIMARY KEY,
        mt5_accountid VARCHAR(255),
        user_id INT,
        name VARCHAR(255),
        balance INT,
        token VARCHAR(255),
        model_id INT,
        status VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES user(user_id),
        FOREIGN KEY (model_id) REFERENCES model(model_id)
    );`,

    `CREATE TABLE IF NOT EXISTS Bill (
        bill_id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        mt5_accountid VARCHAR(255),
        amount DECIMAL(10, 2) NOT NULL,
        status ENUM('unpaid', 'complete'),
        start_date DATETIME,
        end_date DATETIME,
        session_id VARCHAR(255),
        FOREIGN KEY (user_id) REFERENCES user(user_id)
    );`
];

async function createTables() {
    try {
        for (const sql of tables) {
            await db.query(sql);
        }
        console.log("✅ All tables created successfully.");
    } catch (error) {
        console.error("❌ Error creating tables:", error.message);
    }
}

module.exports = createTables;

