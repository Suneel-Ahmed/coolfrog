/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserStore } from "@/store/user-store";
// import { Mission } from "@/types/MissionType";
import { useState } from "react";
import {WalletData} from '@/data/data'
import { toast } from "react-toastify";
import ExchangeDrawer from "./ExchangeDrawer";
import { $http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
const token = localStorage.getItem("token");
export default function Exchange() {
  const user : any = useUserStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
 

  const paymentStatus : any  = useQuery({
    queryKey: ["/clicker/payment-method/lock_status"],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/payment-method/lock_status`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token here
        },
      }),
    staleTime: 0,

  });


  return (
    <>
    
    
    <div className="mt-10">
         
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {
                WalletData?.data &&
                WalletData?.data?.slice(0, 4).map((mission, key) => (
                  <>
                  {
  paymentStatus?.data && paymentStatus?.data[0]?.locked === 0 ? (
    mission?.title === 'easypaisa' || mission?.title === 'Jazzcash' ? null : (
                 
                  <div
                    key={key}
                    className={
                      "flex flex-col  py-3 px-3  bg-[#D9D9D9]/10 rounded-xl cursor-pointer"}
                    onClick={() => {
                      setSelectedMission(mission);
                    if(user?.payment_verified === 1){
                      setOpenDrawer(false);
                      toast.success('Payment Method Integrated')

                    }else{

                      setOpenDrawer(true);
                    }
                    }}
                  >
                    <div className="flex items-center justify-between ">
                   
                      <div className="flex items-center flex-1 space-x-5" >
<div className="w-[25%]" >
                      <img
                        src={mission.logo}
                        alt={mission.title}
                        className="object-contain   w-auto h-16"
                        />
                        </div>
                      <div className="flex w-[90%]    mx-auto  h-full ">
                        <p className="text-[14px] font-bold"> {mission.title}</p>
                        
                      
                      </div>
                        </div>
                      
                    </div>
                   
                  </div>
                     )
                    ) : null
                  }
                  </>
                ))
              }
            </div>

          </div>
        </div>
        <ExchangeDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        mission={selectedMission}
      />
    </>
  );
}
