import { User } from "@next-inflearn/supabase";
import { atom } from "jotai";

export const searchState = atom<string>("");

export const selectedUserIdState = atom<string | null>(null);

export const userAtom = atom<User | null>(null);

export const selectedUserIndexState = atom<string | null>(null);

interface PresenceUser {
  onlineAt: string;
  [key: string]: any;
}

export interface PresenceState {
  [userId: string]: PresenceUser[];
}

export const presenceState = atom<PresenceState | null>(null);
