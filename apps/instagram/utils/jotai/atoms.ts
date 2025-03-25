import { User } from "@next-inflearn/supabase";
import { atom } from "jotai";

export const searchState = atom({
  key: "searchState",
  default: "",
});

export const userAtom = atom<User | null>(null);

export const loginModalAtom = atom(false);
