import { useEffect, useState } from "react";
// import { TelegramWebApps } from "telegram-webapps-types";
/**
 * Hook to get the initial data from the Telegram Web Apps API already parsed.
 * @example
 * const { hash } = useTelegramInitData();
 * console.log({ hash });
 */


// const fakeData = {
//   user: {
//     id: 200,
//     first_name: "yaasdah",
//     last_name: "asd",
//     usernames: "johndoe",
//   },

//   start_param: "ref1",
// } as TelegramWebApps.WebAppInitData;

function useTelegramInitData() {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const firstLayerInitData = Object.fromEntries(
      new URLSearchParams(window.Telegram.WebApp.initData),
    );
     

    const initData :any = {};
    
    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }
    
    setData( initData    );
  }, []);

  return data;
}

export default useTelegramInitData;
