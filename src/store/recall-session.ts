"use client";

import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import type {
  MealType,
  MatchStatus,
  PortionSelection,
  RecallItem,
  RecallSession,
  SessionStatus,
} from "@/types/recall";

interface RecallSessionState {
  sessions: RecallSession[];
  activeSessionId?: string;
  setActiveSession: (sessionId: string) => void;
  createSession: (input: {
    date: string;
    context: "weekday" | "weekend";
  }) => void;
  setPass: (pass: 1 | 2 | 3 | 4 | 5 | 6) => void;
  addQuickItem: (mealType: MealType, quickText: string, occasionKey?: string) => void;
  setMatch: (itemId: string, foodId: string | undefined, status: MatchStatus) => void;
  setPortion: (itemId: string, portion: PortionSelection) => void;
  updateStatus: (status: SessionStatus) => void;
  submitActiveSession: () => boolean;
  removeItem: (itemId: string) => void;
}

const createDefaultSession = ({
  date,
  context,
}: {
  date: string;
  context: "weekday" | "weekend";
}): RecallSession => ({
  id: nanoid(),
  date,
  context,
  status: "draft",
  pass: 1,
  items: [],
});

const getActiveSession = (state: RecallSessionState) =>
  state.sessions.find((session) => session.id === state.activeSessionId);

export const useRecallSessionStore = create<RecallSessionState>((set, get) => ({
  sessions: [],
  activeSessionId: undefined,

  setActiveSession: (sessionId) => set({ activeSessionId: sessionId }),

  createSession: (input) =>
    set((state) => {
      const session = createDefaultSession(input);
      return {
        sessions: [session, ...state.sessions],
        activeSessionId: session.id,
      };
    }),

  setPass: (pass) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active) return state;

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id ? { ...session, pass } : session,
        ),
      };
    }),

  addQuickItem: (mealType, quickText, occasionKey) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active || !quickText.trim()) return state;

      const item: RecallItem = {
        id: nanoid(),
        mealType,
        occasionKey,
        quickText,
        matchStatus: "Custom",
      };

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id
            ? { ...session, items: [...session.items, item] }
            : session,
        ),
      };
    }),

  setMatch: (itemId, foodId, status) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active) return state;

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id
            ? {
                ...session,
                items: session.items.map((item) =>
                  item.id === itemId
                    ? {
                        ...item,
                        matchedFoodId: foodId,
                        matchStatus: status,
                      }
                    : item,
                ),
              }
            : session,
        ),
      };
    }),

  setPortion: (itemId, portion) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active) return state;

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id
            ? {
                ...session,
                items: session.items.map((item) =>
                  item.id === itemId ? { ...item, portion } : item,
                ),
              }
            : session,
        ),
      };
    }),

  updateStatus: (status) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active) return state;

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id ? { ...session, status } : session,
        ),
      };
    }),

  submitActiveSession: () => {
    const state = get();
    const active = getActiveSession(state);

    if (!active || active.items.length === 0) {
      return false;
    }

    set({
      sessions: state.sessions.map((session) =>
        session.id === active.id
          ? { ...session, status: "submitted", pass: 6 }
          : session,
      ),
    });

    return true;
  },

  removeItem: (itemId) =>
    set((state) => {
      const active = getActiveSession(state);
      if (!active) return state;

      return {
        sessions: state.sessions.map((session) =>
          session.id === active.id
            ? {
                ...session,
                items: session.items.filter((item) => item.id !== itemId),
              }
            : session,
        ),
      };
    }),
}));
