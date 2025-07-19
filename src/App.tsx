import { RouterProvider } from "react-router-dom";
import router from "./router";
import { useEffect, useState } from "react";
import SplashScreen from "./components/partials/SplashScreen";
import { $http, setBearerToken } from "./lib/http";
import { BoosterType, BoosterTypes, UserType } from "./types/UserType";
import { useUserStore } from "./store/user-store";
import { uesStore } from "./store";
import PlayOnYourMobile from "./pages/PlayOnYourMobile";

import useTelegramInitData from "./hooks/useTelegramInitData";

import { retrieveLaunchParams } from '@telegram-apps/sdk-react';


interface AdViewData {
  date: string;
  count: number;
  index: number;
}
interface AdViewData2 {
  date: string;
  count: number;
}

const webApp = window.Telegram.WebApp;
const isDisktop = import.meta.env.DEV
? false
: Telegram.WebApp.platform === "tdesktop";

function App() {
  
  const { user } = useTelegramInitData();
  
const [param , setParam] = useState(null)
const [adViewCount, setAdViewCount] = useState<number>(0);


    
  const [showSplashScreen, setShowSplashScreen] = useState(true);
  
  useEffect(() => {
    if (!user?.id) return;

    const storageKey = `adViews_${user.id}`;
    const today = new Date().toDateString();
    const savedAdViews = localStorage.getItem(storageKey);

    if (savedAdViews) {
      const parsedData: AdViewData = JSON.parse(savedAdViews);
      
      if (parsedData.date === today) {
        setAdViewCount(parsedData.count);
      } else {
        // Reset count if the date has changed
        const resetData: AdViewData2 = { date: today, count: 0 };
        localStorage.setItem(storageKey, JSON.stringify(resetData));
        setAdViewCount(0);
      }
    } else {
      // First time setting data
      const initialData: AdViewData2 = { date: today, count: 0 };
      localStorage.setItem(storageKey, JSON.stringify(initialData));
      setAdViewCount(0);
    }
  }, [user?.id]);



  const handleAdView = () => {
    if (!user?.id) return;

    setAdViewCount((prevCount) => {
      const newCount = prevCount + 1;
      const storageKey = `adViews_${user.id}`;

      localStorage.setItem(
        storageKey,
        JSON.stringify({ date: new Date().toDateString(), count: newCount })
      );

      // Assuming `uesStore` is a global state store, update its value
      uesStore.setState({
        adsStore: newCount,
      });

      return newCount;
    });
  };

  useEffect(() => {
    if (adViewCount <= 25) {
      handleAdView();
    }
  }, [adViewCount]);

  
 

  useEffect(() => {
    const query = retrieveLaunchParams();
    const startParam : any =  query?.startParam;
    setParam(startParam)
    webApp.setHeaderColor("#000");
    webApp.setBackgroundColor("#000");
    webApp.expand();
  }, []);
 
  

  useEffect(() => {
 
    const signIn = async () => {
      if (!user) return;
      if (localStorage.getItem("token") === null) {
      
        const { data  } : any = await $http.post<{
          token: string;
          first_login: boolean;
        }>("/auth/telegram-user", {
          telegram_id: user.id,
          first_name: user.first_name,
          last_name: user.last_name,
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          username: user.username,
          referred_by:  param || "",
        });
        setBearerToken(data.token);
        // setIsFirstLoad(data.first_login);
      }else if(localStorage.getItem("token") !== null){
         await $http.post("/auth/updateUser", {
          telegram_id: user?.id,
          first_name: user?.first_name,
          last_name: user?.last_name,
          username: user?.username,
        });
        
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
  }, [user?.id]);


 


  
  if (!user || isDisktop) return <PlayOnYourMobile />;

  if (showSplashScreen) return <SplashScreen />;

  // if (isFirstLoad)
  //   return <FirstTimeScreen startGame={() => setIsFirstLoad(false)} />;

  return <RouterProvider router={router} />;
}

export default App;
