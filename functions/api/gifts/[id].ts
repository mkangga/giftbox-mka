import { neon } from '@neondatabase/serverless';

export async function onRequestGet(context: any) {
  try {
    const sql = neon(context.env.DATABASE_URL);
    const id = context.params.id;

    const boxes = await sql`SELECT * FROM gift_boxes WHERE gift_id = ${id}`;
    if (boxes.length === 0) {
      return new Response(JSON.stringify({ error: 'Gift not found' }), { status: 404 });
    }

    const box = boxes[0];
    delete box.password_hash; // Hapus data sensitif sebelum dikirim ke frontend

    const links = await sql`SELECT * FROM gift_links WHERE gift_box_id = ${box.id}`;
    
    return new Response(JSON.stringify({ ...box, links }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
