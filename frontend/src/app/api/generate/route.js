import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';
import path from 'path';

export async function POST(request) {
  try {
    const { title, promptType } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'ط§ظ„ط¹ظ†ظˆط§ظ† ظ…ط·ظ„ظˆط¨' }, { status: 400 });
    }

    // Read settings to get API key
    const { data: settingsRow } = await supabase.from('app_settings').select('data').eq('id', 'main').single();
    
    const settings = settingsRow?.data || {};
    
    const aiSettings = settings.aiSettings;
    if (!aiSettings || !aiSettings.apiKey) {
      return NextResponse.json({ error: 'ظٹط±ط¬ظ‰ ط¥ط¹ط¯ط§ط¯ ظ…ظپطھط§ط­ ط§ظ„ظ€ API ظ„ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ ظپظٹ طµظپط­ط© ط§ظ„ط¥ط¹ط¯ط§ط¯ط§طھ ط£ظˆظ„ط§ظ‹' }, { status: 400 });
    }

    const provider = aiSettings.provider || 'gemini';
    const apiKey = aiSettings.apiKey;
    
    let prompt = '';
    if (promptType === 'test') {
      prompt = 'Say the word "SUCCESS" if you receive this message.';
    } else if (promptType === 'news') {
      prompt = `
      ط£ظ†طھ ظƒط§طھط¨ ظ…ط­طھظˆظ‰ ظ…ط­طھط±ظپ ظˆطھط¹ظ…ظ„ ظ„ط¯ظ‰ ظ…ط¯ط±ط³ط© ط£ظ‡ظ„ظٹط© ط±ط§ظ‚ظٹط© ظپظٹ ط§ظ„ط³ط¹ظˆط¯ظٹط© ط§ط³ظ…ظ‡ط§ "ظ…ط¯ط§ط±ط³ ط¯ظ„ظٹظ„ ط§ظ„طھط¹ظ„ظ… ط§ظ„ط£ظ‡ظ„ظٹط©".
      ظ…ظ‡ظ…طھظƒ ظ‡ظٹ ظƒطھط§ط¨ط© ظ…ظ‚ط§ظ„ ط£ظˆ ط®ط¨ط± ط§ط­طھط±ط§ظپظٹ ظˆط¹ظ…ظٹظ‚ ط¬ط¯ط§ظ‹ ط¨ظ†ط§ط،ظ‹ ط¹ظ„ظ‰ ط§ظ„ط¹ظ†ظˆط§ظ† ط§ظ„طھط§ظ„ظٹ: "${title}".
      
      ط§ظ„ظ…طھط·ظ„ط¨ط§طھ:
      1. ط£ظ† ظٹظƒظˆظ† ط§ظ„ظ…ط­طھظˆظ‰ ط°ظˆ ظ‚ظٹظ…ط© ظˆط¹ظ…ظٹظ‚ ظˆظ„ظٹط³ ط³ط·ط­ظٹط§ظ‹ ط£ظˆ ظ‚طµظٹط±ط§ظ‹.
      2. ط§ط³طھط®ط¯ظ… ظ„ط؛ط© ط¹ط±ط¨ظٹط© ظپطµط­ظ‰ ط¬ط°ط§ط¨ط© ظˆظ…ظ†ط§ط³ط¨ط© ظ„ظ„ط¨ظٹط¦ط© ط§ظ„طھط¹ظ„ظٹظ…ظٹط© ظˆط§ظ„طھط±ط¨ظˆظٹط©.
      3. ظ‚ظ… ط¨طھظ†ط³ظٹظ‚ ط§ظ„ظ…ط­طھظˆظ‰ ط¨ط§ط³طھط®ط¯ط§ظ… ظˆط³ظˆظ… HTML ط§ظ„ط£ط³ط§ط³ظٹط© ظپظ‚ط· (ظ…ط«ظ„ <h3>, <p>, <ul>, <li>, <strong>) ظ„ظٹظƒظˆظ† ط¬ط§ظ‡ط²ط§ظ‹ ظ„ظ„ط¹ط±ط¶ ظپظٹ ط§ظ„ظ…ظˆظ‚ط¹.
      4. ظ„ط§ طھط³طھط®ط¯ظ… MarkdownطŒ ط§ط³طھط®ط¯ظ… HTML ظپظ‚ط·.
      5. ظ„ط§ طھط¶ظپ ط£ظٹ ظ…ظ‚ط¯ظ…ط§طھ ط£ظˆ ط®ط§طھظ…ط§طھ ظ„ظ„ط±ط¯ ظ…ط«ظ„ "ط¨ط§ظ„طھط£ظƒظٹط¯طŒ ط¥ظ„ظٹظƒ ط§ظ„ظ…ظ‚ط§ظ„"طŒ ظپظ‚ط· ط£ط±ط¬ط¹ ظƒظˆط¯ HTML.
      6. ظ‚ظ… ط¨ظƒطھط§ط¨ط© (ظ…ظ‚طھط·ظپ) ظ‚طµظٹط± ظ„ط§ ظٹطھط¬ط§ظˆط² ط³ط·ط±ظٹظ† ظپظٹ ط¨ط¯ط§ظٹط© ط§ظ„ط±ط¯ ظ…ط­ط§ط·ط§ظ‹ ط¨ظˆط³ظ… <excerpt>ط§ظ„ظ…ظ‚طھط·ظپ ظ‡ظ†ط§</excerpt> ظ„ظٹطھظ… ط§ط³طھط®ط±ط§ط¬ظ‡ ط¨ط±ظ…ط¬ظٹط§ظ‹.
      7. ط§ظ„ظ…ظ‚ط§ظ„ ظٹط¬ط¨ ط£ظ† ظٹط¹ظƒط³ ط§ظ‡طھظ…ط§ظ… ط§ظ„ظ…ط¯ط±ط³ط© ط¨ط§ظ„طھط·ظˆظٹط± ظˆط§ظ„طھظƒظ†ظˆظ„ظˆط¬ظٹط§ ظˆطھط±ط¨ظٹط© ط§ظ„ظ†ط´ط،.
      `;
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
      if (data.error) throw new Error(data.error.message || 'ط®ط·ط£ ظ…ظ† ظ…ط²ظˆط¯ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ');
      
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
      if (data.error) throw new Error(data.error.message || 'ط®ط·ط£ ظ…ظ† ظ…ط²ظˆط¯ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ');
      
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
      if (data.error) throw new Error(data.error.message || 'ط®ط·ط£ ظ…ظ† ظ…ط²ظˆط¯ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ');
      
      generatedText = data.choices?.[0]?.message?.content || '';
    } else {
      throw new Error('ظ…ط²ظˆط¯ ط§ظ„ط°ظƒط§ط، ط§ظ„ط§طµط·ظ†ط§ط¹ظٹ ط؛ظٹط± ظ…ط¯ط¹ظˆظ…');
    }

    if (promptType === 'test') {
      return NextResponse.json({ success: true, message: 'ط§ظ„ظ…ظپطھط§ط­ طµط§ظ„ط­ ظˆظ…ط³طھط¹ط¯ ظ„ظ„ط¹ظ…ظ„', raw: generatedText });
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
    return NextResponse.json({ error: error.message || 'ط­ط¯ط« ط®ط·ط£ ط£ط«ظ†ط§ط، ط§ظ„طھظˆظ„ظٹط¯' }, { status: 500 });
  }
}
