import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('data')
      .eq('id', 'main')
      .single();

    if (error) {
      if (error.code === '42P01') {
        console.warn('Table app_settings does not exist. Mocking success.');
        return NextResponse.json({});
      }
      throw error;
    }

    if (!data) {
      return NextResponse.json({});
    }

    return NextResponse.json(data.data || {});
  } catch (error) {
    console.error('Error reading settings from Supabase:', error);
    return NextResponse.json({ error: 'Failed to read settings' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const newData = await request.json();
    
    const { error } = await supabase
      .from('app_settings')
      .upsert({ id: 'main', data: newData });

    if (error) {
      if (error.code === '42P01') {
        console.warn('Table app_settings does not exist. Mocking save success.');
        return NextResponse.json({ success: true, message: 'Settings simulated save (table missing)' });
      }
      throw error;
    }
    
    return NextResponse.json({ success: true, message: 'Settings saved successfully' });
  } catch (error) {
    console.error('Error writing settings to Supabase:', error);
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
