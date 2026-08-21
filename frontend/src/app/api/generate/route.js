import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import path from 'path';

export async function POST(request) {
  try {
    const { title, promptType } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    // Read settings to get API key
    const { data: settingsRow } = await supabase.from('app_settings').select('data').eq('id', 'main').single();
    
    const settings = settingsRow?.data || {};
    
    const aiSettings = settings.aiSettings;
    if (!aiSettings || !aiSettings.apiKey) {
      return NextResponse.json({ error: 'Please configure AI API Key in settings first' }, { status: 400 });
    }

    const provider = aiSettings.provider || 'gemini';
    const apiKey = aiSettings.apiKey;
    
    let prompt = '';
    if (promptType === 'test') {
      prompt = 'Say the word "SUCCESS" if you receive this message.';
    } else if (promptType === 'news') {
      prompt = 'You are a professional content writer for a Saudi school named "Daleel AlTaaleem". Write a detailed and professional news article in Arabic about: "' + title + '". Use basic HTML tags only (h3, p, ul, li, strong). Do NOT use markdown. Start with a short excerpt wrapped in <excerpt></excerpt> tags.';
    } else {
      prompt = title; // fallback
    }

    let generatedText = '';

    if (provider === 'gemini') {
      // Call Google Gemini API
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'AI Provider Error');
      
      generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
    } else if (provider === 'deepseek') {
      // Call DeepSeek API
      const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'AI Provider Error');
      
      generatedText = data.choices?.[0]?.message?.content || '';

    } else if (provider === 'openai') {
      // Call OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }]
        })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error.message || 'AI Provider Error');
      
      generatedText = data.choices?.[0]?.message?.content || '';
    } else {
      throw new Error('Unsupported AI Provider');
    }

    if (promptType === 'test') {
      return NextResponse.json({ success: true, message: 'API key is valid and working', raw: generatedText });
    }

    // Extract excerpt
    let excerpt = '';
    let content = generatedText;
    
    const excerptMatch = generatedText.match(/<excerpt>([\s\S]*?)<\/excerpt>/);
    if (excerptMatch) {
      excerpt = excerptMatch[1].trim();
      content = generatedText.replace(/<excerpt>[\s\S]*?<\/excerpt>/, '').trim();
    } else {
      // Fallback excerpt
      excerpt = content.replace(/<[^>]*>?/gm, '').split(' ').slice(0, 20).join(' ') + '...';
    }

    return NextResponse.json({ content, excerpt });

  } catch (error) {
    console.error('AI Generation Error:', error);
    return NextResponse.json({ error: error.message || 'Error generating content' }, { status: 500 });
  }
}
