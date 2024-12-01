/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useUserStore } from "@/store/user-store";
import { Mission } from "@/types/MissionType";
import { useState } from "react";
import {WalletData} from '@/data/data'
import ExchangeDrawer from "./ExchangeDrawer";
export default function Exchange() {
  // const user = useUserStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
 
console.log(selectedMission)
  return (
    <>
    
    
    <div className="mt-10">
         
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4">
              {
                WalletData.data &&
                WalletData.data.slice(0, 4).map((mission, key) => (
                  <div
                    key={key}
                    className={
                      "flex flex-col  py-3 px-3  bg-[#D9D9D9]/10 rounded-xl cursor-pointer"}
                    onClick={() => {
                      setSelectedMission(mission);
                      setOpenDrawer(true);
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
