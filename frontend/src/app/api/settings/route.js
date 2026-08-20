import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// تحديد مسار ملف الإعدادات
const getSettingsPath = () => path.join(process.cwd(), 'data', 'settings.json');

export async function GET() {
  try {
    const filePath = getSettingsPath();
    if (!fs.existsSync(filePath)) {
      // إرجاع خطأ أو إعدادات فارغة إذا لم يوجد الملف
      return NextResponse.json({ error: 'Settings file not found' }, { status: 404 });
    }
    const data = fs.readFileSync(filePath, 'utf8');
    return NextResponse.json(JSON.parse(data));
  } catch (error) {
    console.error('Error reading settings:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newData = await request.json();
    const filePath = getSettingsPath();
    
    // التأكد من وجود المجلد
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, JSON.stringify(newData, null, 2), 'utf8');
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error writing settings:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
