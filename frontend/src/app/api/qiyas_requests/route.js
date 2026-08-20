import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const getFilePath = () => path.join(process.cwd(), 'data', 'qiyas_requests.json');

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    const filePath = getFilePath();
    let fileContents = '[]';
    try {
      fileContents = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      // file might not exist yet
      if (err.code !== 'ENOENT') throw err;
    }
    
    const requests = JSON.parse(fileContents);
    
    if (code) {
      const studentReq = requests.find(r => r.code === code);
      if (studentReq) {
        return NextResponse.json(studentReq);
      } else {
        return NextResponse.json({ error: 'لم يتم العثور على طلب بهذا الكود' }, { status: 404 });
      }
    }
    
    // Return all for admin
    return NextResponse.json({ requests });
  } catch (error) {
    return NextResponse.json({ error: 'فشل استرجاع البيانات' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    const filePath = getFilePath();
    let fileContents = '[]';
    try {
      fileContents = await fs.readFile(filePath, 'utf8');
    } catch (err) {
      if (err.code !== 'ENOENT') throw err;
    }
    
    const requests = JSON.parse(fileContents);
    
    // Generate a unique tracking code (e.g. QYS-XXXX)
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `QYS-${randomNum}`;
    
    const newRequest = {
      id: Date.now().toString(),
      code,
      name: body.name,
      phone: body.phone,
      grade: body.grade,
      courseId: body.courseId,
      courseName: body.courseName,
      status: 'قيد المراجعة',
      createdAt: new Date().toISOString()
    };
    
    requests.push(newRequest);
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2));
    
    return NextResponse.json({ success: true, code });
  } catch (error) {
    return NextResponse.json({ error: 'فشل تقديم الطلب' }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const { id, status } = await request.json();
    
    const filePath = getFilePath();
    const fileContents = await fs.readFile(filePath, 'utf8');
    const requests = JSON.parse(fileContents);
    
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) {
      return NextResponse.json({ error: 'الطلب غير موجود' }, { status: 404 });
    }
    
    requests[index].status = status;
    await fs.writeFile(filePath, JSON.stringify(requests, null, 2));
    
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'فشل تحديث الطلب' }, { status: 500 });
  }
}
