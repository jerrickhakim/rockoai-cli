import { atom } from "nanostores";

import { User } from "firebase/auth";

export type UserDetails = {
  firstName: string;
  lastName: string;
  phone: string;
  [key: string]: any;
};

export const $userStore = atom<User | null>(null);
export const $loading = atom<boolean>(true);
export const $userDetails = atom<UserDetails | null>(null);

export const setUser = (user: User | null) => {
  $userStore.set(user);
};
