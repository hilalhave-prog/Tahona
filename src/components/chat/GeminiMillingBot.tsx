import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  User, 
  RefreshCw, 
  AlertCircle, 
  ChevronDown, 
  MessageSquare,
  Maximize2,
  Minimize2,
  Copy,
  Check,
  Zap,
  TrendingUp,
  Database,
  Store
} from 'lucide-react';
import { MillSettings, Silo, WarehouseItem, BakeryClient, ProductionBatch } from '../../types';
import { Language } from '../../utils/translations';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface GeminiMillingBotProps {
  settings: MillSettings;
  silos?: Silo[];
  warehouse?: WarehouseItem[];
  bakeries?: BakeryClient[];
  batches?: ProductionBatch[];
  lang: Language;
}

export const GeminiMillingBot: React.FC<GeminiMillingBotProps> = ({
  settings,
  silos = [],
  warehouse = [],
  bakeries = [],
  batches = [],
  lang
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const totalGrainStockQx = silos.reduce((acc, curr) => acc + curr.currentStockQx, 0);
  const totalBagsCount = warehouse.reduce((acc, curr) => acc + curr.stockBags, 0);
  const alertBakeriesCount = bakeries.filter(b => (b.consumedQuotaQx / b.monthlyQuotaQx) > 0.85).length;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `مرحباً بك في المنظومة الذكية لمطاحن الجزائر (Odoo Milling AI Assistant)! 🌾
أنا مستشارك الفني والصناعي المتصل مباشرة ببيانات "${settings.millNameAr}".
• رصيد الحبوب الحالي بالصوامع: ${totalGrainStockQx.toLocaleString()} قنطار.
• مخزون الأكياس التامة: ${totalBagsCount.toLocaleString()} كيس.
• المخابز المعتمدة: ${bakeries.length} مخبزة (${alertBakeriesCount} قاربت نفاذ الحصة).

يمكنك سؤالي عن قرارات القبان، نسب الاستخراج الفعلي (Taux d'extraction)، جداول حسومات OAIC، أو طلب تحليل تشغيلي فوري.`,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    '📊 قدم لي تقريراً تحليلياً لحالة المطحنة والمخزون الحالي',
    '🌾 هل مخزون القمح اللين كافٍ لوردية الليل 1,000 قنطار؟',
    '⚠️ ما هي المخابز التي قاربت نفاذ حصتها المدعمة؟',
    '⚖️ كيف يتم تطبيق جدول حسم الرطوبة الزائدة لدى OAIC؟',
    '⚙️ كيف نحافظ على استقرار تسنيم أسطوانات التكسير B1-B2؟'
  ];

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Build ultra-rich live industrial context for Gemini
      const silosBreakdown = silos.map(s => `${s.code} (${s.nameAr}): ${s.currentStockQx}/${s.capacityQx} قنطار (حرارة: ${s.temperatureC}°C، رطوبة: ${s.moisturePercent}%)`).join(' \n');
      const warehouseBreakdown = warehouse.map(w => `${w.nameAr} (${w.packaging}): متوفر ${w.stockBags} كيس (${w.totalWeightQx} ق)`).join(' \n');
      const bakeriesAlertBreakdown = bakeries.filter(b => (b.consumedQuotaQx / b.monthlyQuotaQx) > 0.85).map(b => `${b.nameAr}: مستهلك ${b.consumedQuotaQx}/${b.monthlyQuotaQx} ق`).join(', ') || 'لا توجد مخابز متجاوزة حالياً';

      const millContext = `اسم المطحنة: ${settings.millNameAr} (${settings.millNameFr})
الولاية: ${settings.wilayaAr}
الطاقة اليومية القصوى: ${settings.dailyCapacityQx} قنطار/24 سا
رقم اعتماد OAIC: ${settings.oaicAgreementNumber}
إجمالي الحبوب بالصوامع الآن: ${totalGrainStockQx} قنطار
تفصيل الصوامع:
${silosBreakdown}

تفصيل مخزون الأكياس الجاهزة:
${warehouseBreakdown}

حالة حصص المخابز الحرجة (>85%):
${bakeriesAlertBreakdown}`;

      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          millContext
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || 'تعذر استلام الرد من الذكاء الاصطناعي');
      }

      const data = await res.json();
      const assistantMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply || 'تمت معالجة الاستشارة بنجاح.',
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, assistantMsg]);
    } catch (err: any) {
      console.error('Chatbot error:', err);
      const fallbackMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: `⚠️ تعذر استلام الرد: ${err.message}. يرجى التحقق من توفر مفتاح GEMINI_API_KEY.`,
        timestamp: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([...newMessages, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 end-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#714B67] hover:bg-[#5b3c53] text-white rounded-full shadow-2xl transition-all duration-300 transform hover:scale-105 group border-2 border-white/20"
          aria-label="Open AI Milling Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-amber-300" />
            <Sparkles className="w-3 h-3 text-white absolute -top-1 -end-1 animate-pulse" />
          </div>
          <div className="text-start">
            <span className="text-xs font-bold font-sans block leading-none">
              {lang === 'ar' ? 'مساعد أودو الذكي' : 'Odoo AI Assistant'}
            </span>
            <span className="text-[10px] text-white/70 block mt-0.5">خبير مطاحن الحبوب OAIC</span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden transition-all duration-300 ${
            isExpanded
              ? 'inset-4 sm:inset-10 max-w-none max-h-none'
              : 'bottom-6 end-6 w-full max-w-md h-[580px] max-h-[85vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-[#714B67] p-3.5 text-white flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5 text-amber-300" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold leading-tight flex items-center gap-1.5">
                  <span>مساعد أودو لمطاحن الحبوب</span>
                  <span className="text-[10px] bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded font-mono font-bold">Gemini 3.8</span>
                </h3>
                <p className="text-[10px] text-white/80 line-clamp-1">{settings.millNameAr}</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                title={isExpanded ? 'تصغير' : 'تكبير'}
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setMessages([messages[0]])}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
                title="تحديث المحادثة"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:text-white hover:bg-white/10 rounded transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Real-Time Metric Pills inside Chat Header */}
          <div className="bg-slate-100 dark:bg-slate-800/80 px-3 py-1.5 border-b border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-3 font-mono">
              <span>🌾 الصوامع: <strong>{totalGrainStockQx.toLocaleString()} ق</strong></span>
              <span>📦 الأكياس: <strong>{totalBagsCount.toLocaleString()}</strong></span>
            </div>
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              متصل بالذكاء الاصطناعي
            </span>
          </div>

          {/* Messages Thread (Scrollable) */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50 dark:bg-slate-950/70 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-full bg-[#714B67] text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5 shadow-xs">
                    AI
                  </div>
                )}

                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl shadow-xs whitespace-pre-wrap leading-relaxed relative group ${
                    msg.role === 'user'
                      ? 'bg-[#714B67] text-white rounded-br-none'
                      : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700/80'
                  }`}
                >
                  <p>{msg.content}</p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-black/5 dark:border-white/5 text-[10px]">
                    <span className={msg.role === 'user' ? 'text-white/60' : 'text-slate-400 font-mono'}>
                      {msg.timestamp}
                    </span>

                    {msg.role === 'assistant' && (
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 transition-colors"
                        title="نسخ الإجابة"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2.5 text-slate-500 text-xs p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-[#714B67] dark:text-amber-400" />
                <span>جاري استشارة قوانين الحبوب والحساب الصناعي...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Carousel */}
          <div className="p-2.5 bg-slate-100 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="px-3 py-1 text-[11px] font-medium text-[#714B67] dark:text-amber-400 bg-white dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full border border-slate-200 dark:border-slate-700 whitespace-nowrap shrink-0 transition-colors shadow-2xs"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="اطرح استشارة حول الطحن، نسب الاستخراج، صوامع OAIC، الحصص..."
              className="flex-1 px-3 py-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-[#714B67]"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2.5 bg-[#714B67] hover:bg-[#5b3c53] disabled:opacity-50 text-white rounded-xl transition-colors shrink-0 shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
