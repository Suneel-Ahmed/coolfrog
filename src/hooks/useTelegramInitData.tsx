import { useEffect, useState } from "react";
import { TelegramWebApps } from "telegram-webapps-types";
/**
 * Hook to get the initial data from the Telegram Web Apps API already parsed.
 * @example
 * const { hash } = useTelegramInitData();
 * console.log({ hash });
 */
const fakeData = {
  user: {
    id: 8022084831,
    first_name: "ahaha",
    last_name: "ahaha",
    usernames: "",
  },
  start_param: "ref",
} as TelegramWebApps.WebAppInitData;

function useTelegramInitData() {
  const [data, setData] = useState<any>({});
  useEffect(() => {
    const firstLayerInitData = Object.fromEntries(
      new URLSearchParams(window.Telegram.WebApp.initData)
    );

    const initData :any = {};

    for (const key in firstLayerInitData) {
      try {
        initData[key] = JSON.parse(firstLayerInitData[key]);
      } catch {
        initData[key] = firstLayerInitData[key];
      }
    }

    setData( initData ?  fakeData : initData   );
  }, []);

  return data;
}

export default useTelegramInitData;
