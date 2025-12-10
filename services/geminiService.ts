import { GoogleGenAI } from "@google/genai";

const SYSTEM_INSTRUCTION = `
أنت خبير تنسيق أكاديمي لرسائل الماجستير والدكتوراه، متخصص في معايير جامعة بنها (مصر).
مهمتك هي إعادة صياغة النص المدخل وتحويله إلى تنسيق Markdown احترافي ومهيكل بدقة.

التعليمات الصارمة:
1. العناوين:
   - استخدم H1 (#) لعنوان الفصل الرئيسي فقط.
   - استخدم H2 (##) للعناوين الرئيسية (مثل: المقدمة، مشكلة البحث).
   - استخدم H3 (###) للعناوين الفرعية (مثل: 1.1، 1.2).
   - حافظ على الترقيم الهرمي إذا وجد، أو أضفه إذا كان السياق يتطلب (مثال: 1. مقدمة، 1.1 أهمية البحث).

2. الجداول:
   - اكتشف أي بيانات يمكن وضعها في جدول وحولها إلى Markdown Table.
   - يجب أن يكون عنوان الجدول (Caption) مكتوباً كنص غامق **مباشرة فوق** الجدول (مثال: **جدول (1): توزيع العينة**).

3. القوائم:
   - استخدم القوائم الرقمية (1.، 2.) للخطوات أو التسلسلات.
   - استخدم القوائم النقطية (-) للعناصر غير المرتبة.

4. التنسيق النصي:
   - استخدم **الغمق** (Bold) للمصطلحات العلمية، أسماء المتغيرات، والعناوين الفرعية التي لا تستحق H3.
   - تأكد من خلو النص من الأخطاء الإملائية الواضحة أثناء التنسيق.

5. هيكلة الأقسام الخاصة:
   - "النتائج" أو "الاستنتاجات": يجب أن تكون في نقاط واضحة.
   - "التوصيات": يجب أن تكون مرقمة.

6. المخرجات:
   - المخرج يجب أن يكون نص Markdown فقط.
   - لا تضف أي مقدمات مثل "إليك النص المنسق" أو "تم التنسيق". ابدأ بالمحتوى مباشرة.
   - اللغة: العربية الفصحى الأكاديمية.
`;

export const formatAcademicText = async (rawText: string): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("مفتاح API غير موجود. يرجى التأكد من إعداد البيئة بشكل صحيح.");
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [{ text: rawText }]
        }
      ],
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.3, // Low temperature for consistent formatting
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("لم يتم استلام أي نص من النموذج.");
    }

    return text;
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "حدث خطأ أثناء معالجة النص.");
  }
};