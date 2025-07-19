import { useEffect, useState } from "react";

declare global {
  interface Window {
    onclickaMini?: {
      isInit?: boolean;
      goId: (id: string) => void;
    };
  }
}

export default function ComponentWithAdBanner({adId} :any) {
    // const [id] = useState("6056294");
    const [id]  = useState(adId)

    useEffect(() => {
        const handlerGo = () => {
          window.onclickaMini?.goId(id);
        }
        
        if (window.onclickaMini?.isInit) {
            handlerGo();
        } else {
            document.addEventListener("onclickaMini", handlerGo);
            return () => document.removeEventListener("onclickaMini", handlerGo);
        }
    }, [id]);

    return <div  data-banner-id={id}></div>;
}
