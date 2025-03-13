export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const response = await fetch(`http://localhost:8000/api/posts/${params.slug}`);
    const data = await response.json();
    
    if (!data) {
      return new Response(JSON.stringify({ error: 'Blog not found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
} 