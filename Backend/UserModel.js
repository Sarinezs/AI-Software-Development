const { connectMySQL, conn } = require('./DB');

const getUsers = async () => {
    try {
        if (!conn) {
            console.error('❌ Database connection is not available. Call connectMySQL() first.');
            return [];
        }

        const [rows] = await conn.query('SELECT * FROM users');
        return rows;
    } catch (err) {
        console.error('❌ Error fetching users:', err);
        return [];
    }
};

// เรียก `connectMySQL()` เมื่อแอปเริ่มต้น
connectMySQL().then(() => {
    console.log('Database is ready to use.');
    console.log(conn)
});

module.exports = { getUsers };
