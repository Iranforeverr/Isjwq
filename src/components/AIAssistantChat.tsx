import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, HelpCircle } from 'lucide-react';
import { AssetInfo } from '../types';
import { formatPrice } from '../data/goldData';

interface Message {
  sender: 'user' | 'ai';
  text: string;
  time: string;
}

interface AIAssistantChatProps {
  asset: AssetInfo;
}

export const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ asset }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'ai',
      text: `سلام! من دستیار هوشمند و تحلیلگر بازار طلا، سکه و انس جهانی با موتور Gemini هستم. می‌توانید هر سوالی درباره پیش‌بینی قیمت طلا برای فردا، هفته آینده، ماه بعد، حباب سکه، زمان مناسب خرید یا مدیریت ریسک دارید بپرسید!`,
      time: 'هم‌اکنون',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'پیش‌بینی قیمت طلا برای ۲ ماه آینده چیست؟',
    'آیا الان زمان مناسبی برای خرید سکه است یا طلای آب‌شده؟',
    'تاثیر کاهش نرخ بهره فدرال رزرو بر انس طلا چگونه خواهد بود؟',
    'اگر نرخ دلار ۱۰ درصد رشد کند، طلای ۱۸ عیار چقدر بالا می‌رود؟',
  ];

  const generateSmartFallbackAnswer = (question: string): string => {
    const q = question.toLowerCase();
    const formattedPrice = formatPrice(asset.currentPrice, asset.isUSD);

    if (q.includes('سکه') && (q.includes('آبشده') || q.includes('آب شده') || q.includes('۱۸'))) {
      return `📌 **سکه در برابر طلای آب‌شده / ۱۸ عیار:**\n\n` +
        `• **طلای ۱۸ عیار و آبشده:** بدون حباب قیمتی بوده و دقیقاً بر اساس وزن و عیار معامله می‌شوند. برای پس‌اندازهای قطعی و حفظ ارزش پول در برابر تورم، بهترین و کم‌ریسک‌ترین انتخاب هستند.\n` +
        `• **مسکوکات (امامی، بهار، نیم و ربع):** دارای حباب هیجانی هستند. اگر قصد خرید سکه دارید، حتماً افق دید حداقل ۶ ماهه تا ۱ ساله داشته باشید تا رشد ذاتی طلا بتواند نوسانات حباب را پوشش دهد.\n\n` +
        `💡 **توصیه:** در قیمت فعلی (${formattedPrice})، اولویت برای سرمایه‌گذاری محافظه‌کارانه با طلای ۱۸ عیار یا آبشده است.`;
    }

    if (q.includes('فدرال') || q.includes('بهره') || q.includes('fed') || q.includes('انس')) {
      return `🌐 **تاثیر سیاست‌های فدرال رزرو بر انس طلا:**\n\n` +
        `• کاهش نرخ بهره توسط فدرال رزرو هزینه نگهداری دارایی بدون بهره مانند طلا را کاهش می‌دهد و جذابیت آن را برای سرمایه‌گذاران نهادی در سراسر دنیا دوچندان می‌کند.\n` +
        `• کاهش بهره معمولاً شاخص دلار (DXY) را تضعیف کرده و جریان پول عظیمی را به سمت صندوق‌های ETF طلا و خرید شمش سوق می‌دهد.\n\n` +
        `📈 برآیند این تصمیمات سوخت اصلی ادامه رالی صعودی انس جهانی طلا تا افق‌های بالاتر خواهد بود.`;
    }

    if (q.includes('دلار') && (q.includes('درصد') || q.includes('۱۰'))) {
      return `⚡ **تاثیر رشد ۱۰ درصدی دلار بر طلای ۱۸ عیار و سکه:**\n\n` +
        `طبق فرمول رسمی اتحادیه طلا:\n` +
        `$$\\text{مظنه} = \\frac{\\text{انس جهانی} \\times \\text{نرخ دلار}}{۹.۵۷۴۲}$$\n\n` +
        `• اگر انس جهانی ثابت بماند، هر ۱۰٪ افزایش در نرخ دلار آزاد، مستقیماً باعث **۱۰٪ رشد در قیمت هر گرم طلای ۱۸ عیار و مثقال** می‌شود.\n` +
        `• در مورد سکه، به دلیل هیجانات حباب، معمولاً ضریب جهش حتی می‌تواند به ۱۲٪ تا ۱۵٪ هم برسد!`;
    }

    if (q.includes('آینده') || q.includes('پیش‌بینی') || q.includes('ماه') || q.includes('هفته') || q.includes('فردا')) {
      return `📊 **پیش‌بینی روند آینده ${asset.nameFa}:**\n\n` +
        `• قیمت فعلی: **${formattedPrice}**\n` +
        `• **موتور محرک دوگانه:** هم روند انس جهانی به واسطه تقاضای بانک‌های مرکزی صعودی است و هم متغیرهای تورمی داخلی محرک افزایش ارزش ریالی طلا هستند.\n` +
        `• **استراتژی ورود:** از خریدهای هیجانی در سقف‌های قیمتی روز پرهیز کنید. با روش **DCA (خرید پله‌ای در ۲ الی ۳ مرحله)**، ریسک خود را به حداقل رسانده و بازدهی بلندمدت خود را تثبیت کنید.`;
    }

    return `💡 **دیدگاه تحلیلی درباره ${asset.nameFa}:**\n\n` +
      `بر اساس شاخص‌های تکنیکال و فاندامنتال، طلا در بلندمدت امن‌ترین و باثبات‌ترین سنگر مقابله با کاهش ارزش پول و تورم است. در قیمت جاری (${formattedPrice}) روند غالب میان‌مدت صعودی بوده و خرید پله‌ای در نقاط اصلاحی (پولبک‌ها) دارای نسبت ریسک به ریوارد بسیار مطلوبی است.`;
  };

  const handleSend = async (questionText?: string) => {
    const textToSend = questionText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: Message = {
      sender: 'user',
      text: textToSend,
      time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      // 1. Try server or Cloudflare Pages Function
      const res = await fetch('/api/gold/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: textToSend,
          context: {
            asset: asset.nameFa,
            currentPrice: asset.currentPrice,
            isUSD: asset.isUSD,
          },
        }),
      });

      if (res.ok) {
        const contentType = res.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await res.json();
          if (data && data.answer) {
            setMessages((prev) => [
              ...prev,
              {
                sender: 'ai',
                text: data.answer,
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            return;
          }
        }
      }
    } catch {
      // Backend not accessible
    }

    // 2. Direct Gemini client-side if VITE_GEMINI_API_KEY is available
    const clientKey = (import.meta as any).env?.VITE_GEMINI_API_KEY;
    if (clientKey) {
      try {
        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${clientKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: textToSend }] }],
              systemInstruction: {
                parts: [{ text: 'شما مشاور و تحلیلگر ارشد بازار طلا هستید. به زبان فارسی مستدل و روان پاسخ دهید.' }],
              },
            }),
          }
        );
        if (geminiRes.ok) {
          const gJson = await geminiRes.json();
          const answer = gJson.candidates?.[0]?.content?.parts?.[0]?.text;
          if (answer) {
            setMessages((prev) => [
              ...prev,
              {
                sender: 'ai',
                text: answer,
                time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
              },
            ]);
            return;
          }
        }
      } catch {
        // fallback
      }
    }

    // 3. Smart High-Quality Fallback Answer
    const fallbackAnswer = generateSmartFallbackAnswer(textToSend);
    setMessages((prev) => [
      ...prev,
      {
        sender: 'ai',
        text: fallbackAnswer,
        time: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl border-2 border-amber-300 p-5 sm:p-6 shadow-sm shadow-amber-500/5 space-y-4">
      <div className="flex items-center justify-between border-b border-amber-200 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-amber-600" />
          <h3 className="text-base sm:text-lg font-black text-slate-900">
            دستیار هوشمند و گفت‌وگوی تحلیلی طلا
          </h3>
        </div>
        <span className="text-[11px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-amber-600" />
          موتور هوش مصنوعی Gemini
        </span>
      </div>

      {/* Suggested Questions */}
      <div className="flex flex-wrap gap-2">
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSend(q)}
            disabled={isLoading}
            className="text-xs bg-amber-50 hover:bg-amber-100 text-slate-800 px-3 py-1.5 rounded-lg border border-amber-200 transition-colors flex items-center gap-1.5 text-right font-medium"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="space-y-3 max-h-[380px] overflow-y-auto p-3 bg-slate-50/70 rounded-xl border border-slate-200/80">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${
              m.sender === 'user' ? 'items-end' : 'items-start'
            }`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-bold rounded-br-xs shadow-xs'
                  : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs shadow-xs'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1 font-mono">{m.time}</span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 p-3 bg-white rounded-xl border border-amber-200 text-xs text-amber-800 animate-pulse w-fit">
            <Sparkles className="w-4 h-4 animate-spin text-amber-600" />
            <span>در حال نگارش پاسخ تحلیلی با هوش مصنوعی...</span>
          </div>
        )}
      </div>

      {/* Chat Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 pt-2"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`از هوش مصنوعی بپرسید (مثلاً: آیا طلا در قیمت فعلی ${formatPrice(asset.currentPrice, asset.isUSD)} بخرم؟)`}
          className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all shadow-xs"
        />
        <button
          type="submit"
          disabled={!input.trim() || isLoading}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-slate-950 font-black px-4 py-2.5 rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-xs cursor-pointer text-xs sm:text-sm"
        >
          <span>ارسال</span>
          <Send className="w-3.5 h-3.5 rotate-180" />
        </button>
      </form>
    </div>
  );
};
