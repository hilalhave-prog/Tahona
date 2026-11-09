import React, { useState } from 'react';
import { MessageSquare, FileText, Calendar, Send, Clock, User, CheckCircle2 } from 'lucide-react';
import { ChatterMessage } from '../../types';
import { Language, translations } from '../../utils/translations';

interface OdooChatterProps {
  documentId: string;
  documentType: string;
  lang: Language;
}

export const OdooChatter: React.FC<OdooChatterProps> = ({
  documentId,
  documentType,
  lang
}) => {
  const t = translations[lang];

  const [activeChatterTab, setActiveChatterTab] = useState<'message' | 'log' | 'activity'>('log');
  const [inputText, setInputText] = useState('');

  const [messages, setMessages] = useState<ChatterMessage[]>([
    {
      id: 'msg-1',
      author: 'الشيخ عبد الرزاق بن علي',
      date: 'اليوم',
      time: '08:45',
      type: 'system',
      content: 'تم إنشاء المستند والتثبيت الآلي بالسجلات.'
    },
    {
      id: 'msg-2',
      author: 'م. فتيحة بوزيد (المخبر)',
      date: 'اليوم',
      time: '09:12',
      type: 'comment',
      content: 'تم التأكد من مطابقة المعايير الفيزيوكيميائية ونسبة الرطوبة 12.8%.'
    }
  ]);

  const handlePostMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg: ChatterMessage = {
      id: `msg-${Date.now()}`,
      author: 'المدير الصناعي (أنت)',
      date: 'الآن',
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      type: activeChatterTab === 'log' ? 'comment' : 'system',
      content: inputText
    };

    setMessages([newMsg, ...messages]);
    setInputText('');
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 space-y-4">
      {/* Chatter Action Buttons */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <button
          type="button"
          onClick={() => setActiveChatterTab('message')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeChatterTab === 'message'
              ? 'bg-[#714B67] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{t.chatterSendMessage}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChatterTab('log')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeChatterTab === 'log'
              ? 'bg-[#714B67] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{t.chatterLogNote}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveChatterTab('activity')}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
            activeChatterTab === 'activity'
              ? 'bg-[#714B67] text-white'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>{t.chatterScheduleActivity}</span>
        </button>
      </div>

      {/* Input box */}
      <form onSubmit={handlePostMessage} className="space-y-2">
        <textarea
          rows={2}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={
            activeChatterTab === 'log'
              ? 'تسجيل ملاحظة داخلية خاصة بالفريق الصناعي...'
              : 'إرسال رسالة أو إشعار لعمال الوردية...'
          }
          className="w-full p-2.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
        />
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-[#714B67] hover:bg-[#5b3c53] rounded-md transition-colors"
          >
            <Send className="w-3 h-3" />
            <span>نشر الملاحظة</span>
          </button>
        </div>
      </form>

      {/* Message Feed */}
      <div className="space-y-3 pt-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className="flex items-start gap-3 text-xs bg-white dark:bg-slate-800/80 p-3 rounded-lg border border-slate-200 dark:border-slate-700/80"
          >
            <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0">
              {msg.author.slice(0, 2)}
            </div>
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between text-slate-500 text-[11px]">
                <span className="font-bold text-slate-900 dark:text-white">{msg.author}</span>
                <span className="font-mono">{msg.date} - {msg.time}</span>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                {msg.content}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
