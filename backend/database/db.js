const { Pool } = require('pg');
require('dotenv').config();

// Create connection pool
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'web_toko_pakaian',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Test connection
pool.on('connect', () => {
  console.log('✓ Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

// Initialize database connection
const initializeDatabase = async () => {
  try {
    const client = await pool.connect();
    console.log('✓ Database initialized successfully');
    client.release();
  } catch (err) {
    console.error('Error connecting to database:', err.message);
    throw err;
  }
};

// Helper functions untuk database operations
const dbHelpers = {
  // Execute raw query
  query: async (text, params) => {
    try {
      const result = await pool.query(text, params);
      return result.rows;
    } catch (err) {
      console.error('Query error:', err.message);
      throw err;
    }
  },

  // Get all data
  getAll: async (table) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table} ORDER BY id ASC`);
      return result.rows;
    } catch (err) {
      console.error('Error getting all data:', err.message);
      throw err;
    }
  },

  // Get single record
  getOne: async (table, id) => {
    try {
      const result = await pool.query(`SELECT * FROM ${table} WHERE id = $1`, [id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error getting one record:', err.message);
      throw err;
    }
  },

  // Get by email (untuk users)
  getByEmail: async (email) => {
    try {
      const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error getting user by email:', err.message);
      throw err;
    }
  },

  // Insert data
  insert: async (table, data) => {
    try {
      const columns = Object.keys(data).join(', ');
      const placeholders = Object.keys(data).map((_, i) => `$${i + 1}`).join(', ');
      const values = Object.values(data);

      const result = await pool.query(
        `INSERT INTO ${table} (${columns}) VALUES (${placeholders}) RETURNING *`,
        values
      );
      return result.rows[0];
    } catch (err) {
      console.error('Error inserting data:', err.message);
      throw err;
    }
  },

  // Update data
  update: async (table, id, data) => {
    try {
      const updates = Object.keys(data)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');
      const values = [...Object.values(data), id];

      const result = await pool.query(
        `UPDATE ${table} SET ${updates}, updated_at = NOW() WHERE id = $${Object.keys(data).length + 1} RETURNING *`,
        values
      );
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error updating data:', err.message);
      throw err;
    }
  },

  // Delete data
  delete: async (table, id) => {
    try {
      const result = await pool.query(`DELETE FROM ${table} WHERE id = $1 RETURNING *`, [id]);
      return result.rows[0] || null;
    } catch (err) {
      console.error('Error deleting data:', err.message);
      throw err;
    }
  },

  // Delete all
  deleteAll: async (table) => {
    try {
      await pool.query(`DELETE FROM ${table}`);
      return true;
    } catch (err) {
      console.error('Error deleting all data:', err.message);
      throw err;
    }
  }
};

module.exports = {
  pool,
  dbHelpers,
  initializeDatabase
};
