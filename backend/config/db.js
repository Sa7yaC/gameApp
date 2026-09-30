import pg from 'pg';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;

// PostgreSQL Pool
export const pgPool = new Pool({
    host: process.env.PG_HOST || 'localhost',
    port: parseInt(process.env.PG_PORT || '5434', 10),
    user: process.env.PG_USER || 'gameuser',
    password: process.env.PG_PASSWORD || 'gamepass',
    database: process.env.PG_DATABASE || 'gameapp',
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
});

pgPool.on('error', (err) => {
    // Prevent unhandled error event from crashing the process when PostgreSQL is offline
    console.warn('⚠️ PostgreSQL Pool Warning (using in-memory fallback):', err.message);
});

// Redis Client
export const redisClient = new Redis({
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: parseInt(process.env.REDIS_PORT || '6380', 10),
    retryStrategy: (times) => {
        if (times > 5) {
            console.warn('⚠️ Redis connection retry limit reached. Continuing with in-memory fallback.');
            return null;
        }
        return Math.min(times * 500, 2000);
    },
    lazyConnect: true
});

export const initDatabases = async () => {
    // Initialize PostgreSQL Schema
    try {
        const client = await pgPool.connect();
        console.log('✅ PostgreSQL connected successfully on port', process.env.PG_PORT || 5434);
        
        await client.query(`
            CREATE TABLE IF NOT EXISTS rooms (
                room_id VARCHAR(32) PRIMARY KEY,
                host_id VARCHAR(64),
                host_name VARCHAR(64),
                settings JSONB DEFAULT '{}'::jsonb,
                status VARCHAR(32) DEFAULT 'lobby',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);
        console.log('✅ PostgreSQL schema verified (rooms table ready).');
        client.release();
    } catch (err) {
        console.error('❌ PostgreSQL Connection / Schema Error:', err.message);
    }

    // Initialize Redis
    try {
        await redisClient.connect();
        console.log('✅ Redis connected successfully on port', process.env.REDIS_PORT || 6380);
    } catch (err) {
        console.warn('⚠️ Redis Connection Warning (will use in-memory fallback if needed):', err.message);
    }
};

export default { pgPool, redisClient, initDatabases };