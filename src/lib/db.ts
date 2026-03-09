import { Pool } from 'pg';
import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

// This is a hybrid database connection helper.
// It uses Neon DB (PostgreSQL) if DATABASE_URL is provided,
// otherwise it falls back to a local SQLite database for immediate preview.

let pgPool: Pool | null = null;
let sqliteDb: Database.Database | null = null;

export const isPostgres = !!process.env.DATABASE_URL;

export function initDb() {
  if (isPostgres) {
    pgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    // Initialize Postgres schema
    pgPool.query(`
      CREATE TABLE IF NOT EXISTS gift_boxes (
        id SERIAL PRIMARY KEY,
        gift_id VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        sender_name VARCHAR(255) NOT NULL,
        recipient_name VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        theme VARCHAR(50) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS gift_links (
        id SERIAL PRIMARY KEY,
        gift_box_id INTEGER REFERENCES gift_boxes(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL
      );
    `).catch(err => console.error("Failed to initialize Postgres schema:", err));
  } else {
    // Fallback to SQLite
    const dbPath = path.resolve(process.cwd(), 'database.sqlite');
    sqliteDb = new Database(dbPath);

    // Initialize SQLite schema
    sqliteDb.exec(`
      CREATE TABLE IF NOT EXISTS gift_boxes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gift_id TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        sender_name TEXT NOT NULL,
        recipient_name TEXT NOT NULL,
        message TEXT NOT NULL,
        theme TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS gift_links (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        gift_box_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        url TEXT NOT NULL,
        FOREIGN KEY (gift_box_id) REFERENCES gift_boxes(id) ON DELETE CASCADE
      );
    `);
  }
}

export async function query(text: string, params: any[] = []) {
  if (isPostgres && pgPool) {
    const result = await pgPool.query(text, params);
    return result.rows;
  } else if (sqliteDb) {
    // Convert Postgres $1, $2 syntax to SQLite ?, ? syntax
    let sqliteText = text;
    for (let i = 1; i <= params.length; i++) {
      sqliteText = sqliteText.replace(new RegExp(`\\$${i}`, 'g'), '?');
    }
    
    const isInsert = sqliteText.trim().toUpperCase().startsWith('INSERT');
    const hasReturning = sqliteText.toUpperCase().includes('RETURNING');
    
    if (isInsert && hasReturning) {
      const cleanText = sqliteText.replace(/RETURNING\s+\w+/i, '');
      const stmt = sqliteDb.prepare(cleanText);
      const info = stmt.run(...params);
      return [{ id: info.lastInsertRowid }];
    }

    const stmt = sqliteDb.prepare(sqliteText);
    
    if (sqliteText.trim().toUpperCase().startsWith('SELECT')) {
      return stmt.all(...params);
    } else {
      const info = stmt.run(...params);
      return { changes: info.changes, lastInsertRowid: info.lastInsertRowid };
    }
  }
  throw new Error("Database not initialized");
}
