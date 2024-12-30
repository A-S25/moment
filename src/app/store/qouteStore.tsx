import { Category } from "@prisma/client";
import { create } from "zustand";

interface QuoteState {
  quote: string | null; // محتوى الاقتباس
  category: Category | null;
  setQuote: (quote: string, category: Category) => void;
  clearQuote: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
  quote: null,
  category: null,
  setQuote: (quote, category) => set({ quote, category }),
  clearQuote: () => set({ quote: null, category: null }),
}));
