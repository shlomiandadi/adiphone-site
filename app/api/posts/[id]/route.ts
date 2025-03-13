import { NextResponse } from 'next/server';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
    }

    const res = await fetch(`http://localhost:8000/api/posts/${params.id}`, {
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'שגיאה בטעינת הפוסט');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בטעינת הפוסט' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
    }

    const body = await request.json();
    const res = await fetch(`http://localhost:8000/api/posts/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: token
      },
      body: JSON.stringify(body)
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'שגיאה בעדכון הפוסט');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה בעדכון הפוסט' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('Authorization');
    if (!token) {
      return NextResponse.json({ error: 'אין הרשאה' }, { status: 401 });
    }

    const res = await fetch(`http://localhost:8000/api/posts/${params.id}`, {
      method: 'DELETE',
      headers: {
        Authorization: token
      }
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || 'שגיאה במחיקת הפוסט');
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'שגיאה במחיקת הפוסט' }, { status: 500 });
  }
} 