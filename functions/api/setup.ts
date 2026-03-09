import { neon } from '@neondatabase/serverless';

export async function onRequest(context: any) {
  try {
    const sql = neon(context.env.DATABASE_URL);
    
    await sql`
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
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS gift_links (
        id SERIAL PRIMARY KEY,
        gift_box_id INTEGER REFERENCES gift_boxes(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        url TEXT NOT NULL
      );
    `;

    return new Response(JSON.stringify({ success: true, message: "Database tables created successfully!" }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
