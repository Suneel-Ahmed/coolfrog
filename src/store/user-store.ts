import { create } from "zustand";



export const useUserStore = create(() => ({
  telegram_id: 0 ,
  balance: 0,
  first_name: "",
  id: 0,
  last_login_date: "",
  last_name: "",
  login_streak: 0,
  updated_at: "",
  username: "",
}));
