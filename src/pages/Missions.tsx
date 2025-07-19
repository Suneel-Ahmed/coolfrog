/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from "@/lib/http";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import {  useState , useEffect } from "react";
import Tasks from "@/components/Tasks";
// import { uesStore } from "../store/index";
// import { RxCross2 } from "react-icons/rx";
// import ComponentWithAdBanner from "@/components/ComponentWithAdBanner";

export default function Missions() {
  const user = useUserStore();
  // const {adsStore } = uesStore();
  const missions:any = useQuery({
    queryKey: ["/clicker/partners"],
    queryFn: () =>
      $http.$get(`/clicker/partners`),
    staleTime: 1000 * 60,
  });
 const [timmer, setTimmer] = useState<boolean>(false);


 useEffect(() => {
      if (!timmer) {
        const timerId = setTimeout(() => setTimmer(true), 10000);
        return () => clearTimeout(timerId);
      }
    }, [timmer]);



    return (
    <div className="flex min-h-fit h-screen bg-[url('/images/bg.png')]  bg-cover bg-center flex-col justify-around  ">
    
      <div className="flex flex-col flex-1 w-full h-screen px-6  modal-body">
        <div className="flex items-center justify-center mt-10 space-x-3 text-gradient">
          <img
            src="/images/logo/2.png"
            alt="coins"
            loading="lazy" width="500" height="500"
            className="object-contain w-10 h-auto"
          />
          <span className="text-3xl font-bold">
            {Math.floor(user.balance)?.toLocaleString()}
          </span>
        </div>
        <Tasks   />
        <div className="h-fit mb-32  mt-10">
          <div className="flex justify-center gap-4">
              <h3
                className={"text-md text-center font-medium uppercase"}
               
              >
              {missions?.data?.taskPartner?.length >= 100 ? "Top 100" : "Top Refers"}  
              </h3>
          </div>
          <div className="mt-6">
            <div className="mt-[30px]" >
                <ul className="w-full" >
                  {
                     missions?.data?.taskPartner  ?
                    missions?.data?.taskPartner?.slice(0, 100)?.map((val:any , index:any)=>(
                  <li key={index} className="w-full py-[15px] px-[30px] flex justify-between bg-white/15 rounded-xl" >
                    <h1>
  <span className="mx-2">{index + 1}</span>
  {val?.first_name?.length > 10
    ? `${val.first_name.slice(0, 10)}...`
    : val?.first_name}
</h1>
                    <h1>Referrals : {val?.referrals_count}</h1>
                  </li>
                  )) :
                  <li  className="w-full py-[15px] px-[30px] flex justify-center text-center border-white/50 border rounded-xl" >
                    <h1> No Offical Partner available </h1>
                  </li>

                }
                </ul>
            </div>
          </div>
        </div>
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