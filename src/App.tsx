import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect, useState } from "react";
import SplashScreen from "./components/partials/SplashScreen";
// import FirstTimeScreen from "./components/partials/FirstTimeScreen";
import { $http, setBearerToken } from "./lib/http";
import { BoosterType, BoosterTypes, UserType } from "./types/UserType";
import { useUserStore } from "./store/user-store";
import { uesStore } from "./store";
import PlayOnYourMobile from "./pages/PlayOnYourMobile";

import useTelegramInitData from "./hooks/useTelegramInitData";

// import { retrieveLaunchParams } from '@telegram-apps/sdk-react';

const webApp = window.Telegram.WebApp;
const isDisktop = import.meta.env.DEV
? false
: Telegram.WebApp.platform === "tdesktop";

function App() {
  
  const { user } = useTelegramInitData();
  
// const [param , setParam] = useState(null)
    
    
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  
  

 

  useEffect(() => {
    // const query = retrieveLaunchParams();
    // const startParam =  query.startParam;
    // setParam(startParam)
    webApp.setHeaderColor("#000");
    webApp.setBackgroundColor("#000");
    webApp.expand();
  }, []);

  

  useEffect(() => {
    if (!user) return;
   
    const signIn = async () => {
      if (localStorage.getItem("token") === null) {
        const { data } = await $http.post<{
          token: string;
          first_login: boolean;
        }>("/auth/telegram-user", {
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          username: user.username,
          referred_by:  "",
        });
        setBearerToken(data.token);
        // setIsFirstLoad(data.first_login);
      }
      const data = await $http.$get<
        {
          user: UserType;
          boosters: Record<BoosterTypes, BoosterType>;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } & Record<string, any>
      >("/clicker/sync");
      useUserStore.setState({
        ...data.user,
      });

      uesStore.setState({
        totalDailyRewards: data.total_daily_rewards,
        boosters: data.boosters,
        dailyResetEnergy: data.daily_booster,
        maxLevel: data.max_level,
        levels: data.levels,
        levelUp: data.level_up,
        referral: data.referral,
        missionTypes: data.mission_types,
        totalReferals: data.total_referals,
      });
    };

    signIn().then(() => setShowSplashScreen(false));
  }, [user]);




  
  if (!user || isDisktop) return <PlayOnYourMobile />;

  if (showSplashScreen) return <SplashScreen />;

  // if (isFirstLoad)
  //   return <FirstTimeScreen startGame={() => setIsFirstLoad(false)} />;

  return <RouterProvider router={router} />;
}

export default App;
