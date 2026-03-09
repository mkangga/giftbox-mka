import { neon } from '@neondatabase/serverless';

// Menggunakan Web Crypto API bawaan Cloudflare untuk hashing yang lebih ringan
async function hashPassword(password: string) {
  const msgBuffer = new TextEncoder().encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function onRequestPost(context: any) {
  try {
    const sql = neon(context.env.DATABASE_URL);
    const body = await context.request.json();
    const { gift_id, password, sender_name, recipient_name, message, theme, links } = body;

    if (!gift_id || !password || !sender_name || !recipient_name || !message || !theme) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    const existing = await sql`SELECT id FROM gift_boxes WHERE gift_id = ${gift_id}`;
    if (existing.length > 0) {
      return new Response(JSON.stringify({ error: 'Gift ID already exists' }), { status: 409 });
    }

    const password_hash = await hashPassword(password);

    const result = await sql`
      INSERT INTO gift_boxes (gift_id, password_hash, sender_name, recipient_name, message, theme)
      VALUES (${gift_id}, ${password_hash}, ${sender_name}, ${recipient_name}, ${message}, ${theme})
      RETURNING id
    `;
    const giftBoxId = result[0].id;

    if (links && links.length > 0) {
      for (const link of links) {
        if (link.title && link.url) {
          await sql`
            INSERT INTO gift_links (gift_box_id, title, url)
            VALUES (${giftBoxId}, ${link.title}, ${link.url})
          `;
        }
      }
    }

    return new Response(JSON.stringify({ success: true, gift_id }), { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
