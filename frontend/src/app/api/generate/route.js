import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request) {
  try {
    const { title, promptType } = await request.json();

    if (!title) {
      return NextResponse.json({ error: 'العنوان مطلوب' }, { status: 400 });
    }

    // Read settings to get API key
    const filePath = path.join(process.cwd(), 'data', 'settings.json');
    const fileContents = await fs.readFile(filePath, 'utf8');
    const settings = JSON.parse(fileContents);
    
    const aiSettings = settings.aiSettings;
    if (!aiSettings || !aiSettings.apiKey) {
      return NextResponse.json({ error: 'يرجى إعداد مفتاح الـ API للذكاء الاصطناعي في صفحة الإعدادات أولاً' }, { status: 400 });
    }

    const provider = aiSettings.provider || 'gemini';
    const apiKey = aiSettings.apiKey;
    
    let prompt = '';
    if (promptType === 'test') {
      prompt = 'Say the word "SUCCESS" if you receive this message.';
    } else if (promptType === 'news') {
      prompt = `
      أنت كاتب محتوى محترف وتعمل لدى مدرسة أهلية راقية في السعودية اسمها "مدارس دليل التعلم الأهلية".
      مهمتك هي كتابة مقال أو خبر احترافي وعميق جداً بناءً على العنوان التالي: "${title}".
      
      المتطلبات:
      1. أن يكون المحتوى ذو قيمة وعميق وليس سطحياً أو قصيراً.
      2. استخدم لغة عربية فصحى جذابة ومناسبة للبيئة التعليمية والتربوية.
      3. قم بتنسيق المحتوى باستخدام وسوم HTML الأساسية فقط (مثل <h3>, <p>, <ul>, <li>, <strong>) ليكون جاهزاً للعرض في الموقع.
      4. لا تستخدم Markdown، استخدم HTML فقط.
      5. لا تضف أي مقدمات أو خاتمات للرد مثل "بالتأكيد، إليك المقال"، فقط أرجع كود HTML.
      6. قم بكتابة (مقتطف) قصير لا يتجاوز سطرين في بداية الرد محاطاً بوسم <excerpt>المقتطف هنا</excerpt> ليتم استخراجه برمجياً.
      7. المقال يجب أن يعكس اهتمام المدرسة بالتطوير والتكنولوجيا وتربية النشء.
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
      if (data.error) throw new Error(data.error.message || 'خطأ من مزود الذكاء الاصطناعي');
      
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
      if (data.error) throw new Error(data.error.message || 'خطأ من مزود الذكاء الاصطناعي');
      
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
      if (data.error) throw new Error(data.error.message || 'خطأ من مزود الذكاء الاصطناعي');
      
      generatedText = data.choices?.[0]?.message?.content || '';
    } else {
      throw new Error('مزود الذكاء الاصطناعي غير مدعوم');
    }

    if (promptType === 'test') {
      return NextResponse.json({ success: true, message: 'المفتاح صالح ومستعد للعمل', raw: generatedText });
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
    return NextResponse.json({ error: error.message || 'حدث خطأ أثناء التوليد' }, { status: 500 });
  }
}
