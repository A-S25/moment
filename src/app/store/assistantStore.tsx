import { create } from "zustand";

interface AssistantState {
  isOpen: boolean; // حالة المساعد (مفتوح/مغلق)
  currentQuestion: string; // السؤال الحالي
  questions: string[]; // قائمة الأسئلة
  toggleAssistant: () => void; // فتح/إغلاق المساعد
  getNewQuestion: () => void; // اقتراح سؤال جديد
}

const useAssistantStore = create<AssistantState>((set) => ({
  isOpen: false,
  currentQuestion: "ما الذي جعلك تبتسم اليوم؟",
  questions: [
    "ما الذي جعلك تبتسم اليوم؟",
    "ما الشيء الذي شعرت بالامتنان له؟",
    "ما هو أفضل شيء حدث لك اليوم؟",
    "ما الذي تعلمته اليوم؟",
    "ما الذي تريد أن تفعله غدًا؟",
  ],
  toggleAssistant: () => set((state) => ({ isOpen: !state.isOpen })),
  getNewQuestion: () =>
    set((state) => ({
      currentQuestion:
        state.questions[Math.floor(Math.random() * state.questions.length)],
    })),
}));

export default useAssistantStore;
