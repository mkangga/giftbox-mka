import { neon } from '@neondatabase/serverless';

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
    const { gift_id, password } = body;

    if (!gift_id || !password) {
      return new Response(JSON.stringify({ error: 'Missing gift_id or password' }), { status: 400 });
    }

    const boxes = await sql`SELECT * FROM gift_boxes WHERE gift_id = ${gift_id}`;
    if (boxes.length === 0) {
      return new Response(JSON.stringify({ error: 'Gift not found' }), { status: 404 });
    }

    const box = boxes[0];
    const inputHash = await hashPassword(password);

    if (inputHash !== box.password_hash) {
      return new Response(JSON.stringify({ error: 'Incorrect password' }), { status: 401 });
    }

    return new Response(JSON.stringify({ success: true, gift_id }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
