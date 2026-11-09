import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

  app.use(express.json());

  // Initialize Google GenAI with recommended telemetry header
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // Server-side API endpoint for Gemini Multi-Turn Milling Assistant
  app.post('/api/gemini/chat', async (req, res) => {
    try {
      const { messages, millContext, systemInstruction } = req.body;

      if (!process.env.GEMINI_API_KEY) {
        return res.status(500).json({
          error: 'مفتاح GEMINI_API_KEY غير متوفر في بيئة التشغيل. يرجى ضبطه في Secrets.',
        });
      }

      const defaultInstruction = `أنت "خبير أودو الذكي لتسيير المطاحن والحبوب الجزائرية" (Odoo Milling AI Consultant).
مهمتك مساعدة مدراء ومسؤولي المطاحن، عمال القبان، المخبريين، والمحاسبين في تسيير أعمالهم اليومية.
أنت تفهم تماماً:
1. التنظيم الجزائري للديوان الوطني المهني للحبوب OAIC وقوانين وزارة التجارة والفلاحة.
2. معايير جودة الحبوب (الرطوبة max 14.5%، الشوائب max 2.0%، الوزن النوعي min 76 kg/hl، الغلوتين 24%، ومؤشر هاغبرغ).
3. جدول الحسومات (Barème des réfactions) عند وجود رطوبة أو شوائب زائدة.
4. حساب نسب ومردودية الاستخراج (Taux d'extraction): فرينة الخبز المدعمة 55 (78-81%)، فرينة الحلويات 45، السميد الممتاز والعادي، ونخالة القمح (Son de blé).
5. نظام الحصص للمخابز المعتمدة (Quotas des boulangers subventionnés) والسعر المقنن 2000 دج/قنطار.
6. حساب الميزان المادي الشهري (Bilan Matière OAIC) والفواقد الطبيعية.
7. صيانة أسطوانات الطحن Bühler وتسنيم الأسطوانات (Cannelures) ومناخل البلانشيكتر (Plansichters).

بيانات المطحنة الحالية المسجلة:
${millContext || 'مطاحن الهضاب الكبرى للحبوب - سطيف'}

تحدث بأسلوب مهني وواضح، باللغة العربية مع ذكر المصطلحات الفنية والفرنسية الشائعة في المطاحن الجزائرية عند الضرورة. قدم إجابات مباشرة وعملية بأرقام دقيقة وحسابات صناعية.`;

      const chat = ai.chats.create({
        model: 'gemini-3.8-flash',
        config: {
          systemInstruction: systemInstruction || defaultInstruction,
        },
      });

      // Replay previous conversation turns if any
      if (Array.isArray(messages) && messages.length > 1) {
        for (let i = 0; i < messages.length - 1; i++) {
          const msg = messages[i];
          if (msg.role === 'user') {
            await chat.sendMessage({ message: msg.content });
          }
        }
      }

      const lastUserMsg = messages && messages.length > 0 
        ? messages[messages.length - 1]?.content 
        : 'مرحبا';

      const response = await chat.sendMessage({
        message: lastUserMsg,
      });

      const replyText = response.text || 'لم يتم استلام رد من النموذج.';
      return res.json({ reply: replyText });
    } catch (error: any) {
      console.error('Gemini Chat API Error:', error);
      return res.status(500).json({
        error: error.message || 'حدث خطأ في معالجة طلب الذكاء الاصطناعي.',
      });
    }
  });

  // Mount Vite middleware in development or serve static in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
