import Exchange from "@/components/Exchange";
// import { uesStore } from "../store/index";
import {useState , useEffect} from "react";
// import { RxCross2 } from "react-icons/rx";
// import ComponentWithAdBanner from "@/components/ComponentWithAdBanner";



export default function Payout() {

  // const {adsStore } = uesStore();
  const [timmer, setTimmer] = useState<boolean>(false);


useEffect(() => {
      if (!timmer) {
        const timerId = setTimeout(() => setTimmer(true), 10000);
        return () => clearTimeout(timerId);
      }
    }, [timmer]);

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <img
          src="/images/logo/nav1.png"
          alt="coins-3"
          loading="lazy" width="500" height="500"
          className="object-contain w-32 h-32 mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold text-center uppercase">
        Exchange COINS
        </h1>
     
   <Exchange/>    
       
      </div>
   
    </div>
  );
}
// {adsStore < 25 && !timmer && (
//   <div className="absolute w-full flex flex-col h-fit bg-white rounded-xl justify-center items-center top-1/2 inset-0">
//     <button
//       onClick={() => setTimmer(true)}
//       className="w-[30px] z-[9999999] h-[30px] me-4 border-white bg-black text-white mt-2 rounded-full flex items-center justify-center text-[26px] relative ms-auto"
//     >
//       <RxCross2 /> 
//     </button>
//     {/* <ComponentWithAdBanner adId="6056294" /> */}
//   </div>
// )}