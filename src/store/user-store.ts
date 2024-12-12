import { create } from "zustand";



export const useUserStore = create(() => ({
  telegram_id: 0 ,
  max_energy: 0,
  balance: 0,
  earn_per_tap: 0,
  available_energy: 0,
  energy_limit_level: 0,
  first_name: "",
  id: 0,
  last_login_date: "",
  last_name: "",
  level_id: 0,
  login_streak: 0,
  multi_tap_level: 0,
  production_per_hour: 0,
  updated_at: "",
  username: "",
}));
