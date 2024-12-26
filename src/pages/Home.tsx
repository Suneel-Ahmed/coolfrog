// import { useState } from "react";
import UserTap from "../components/UserTap";
import { useUserStore } from "../store/user-store";
// import { Link } from "react-router-dom";
import { $http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
// import { Mission } from "@/types/MissionType";
// import levelConfig from "@/config/level-config";
import { uesStore } from "@/store";
export default function Home() {
  const user = useUserStore();
  const { missionTypes } = uesStore();
  const activeType : any = missionTypes?.[0];
  const missions : any  = useQuery({
    queryKey: ["/clicker/offical_tasks"],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/offical_tasks`),
    staleTime: 0,
    enabled: !!activeType?.id,
  });

  const completedTasks : any  = useQuery({
    queryKey: [`/clicker/offical_tasks/status/${user.id}`],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/offical_tasks/status/${user.id}`),
    staleTime: 0,
    enabled: !!activeType?.id,
  });

  return (
    <div
      className="flex-1 relative px-5 pb-20 bg-[url('/images/bg.png')]  bg-cover bg-postion "
     
    >
      <div className="absolute inset-0 bg-black/70"></div>
      <div className=" relative z-20 bg-model" >
      <header className="flex items-center justify-between mt-4">
        <div className="flex items-center gap-2 px-3 py-2 border-2 rounded-full bg-black/20 border-white/10">
          <img
            src="/images/logo/logo.png"
            alt="user-avatar"
            className="object-cover w-8 h-8 rounded-full"
          />
          <p className="text-sm font-medium uppercase">
            {user?.first_name} {user?.last_name}
          </p>
        </div>
      </header>
      <div className="flex mt-6 space-x-1.5 justify-center items-center select-none">
        <img
          src="/images/logo/2.png"
          alt="coins"
          className="object-contain w-12 h-12"
        />
        <span className="text-3xl font-bold text-gradient">
          {Math.floor(user.balance)?.toLocaleString()}
        </span>
      </div>
      <div className="">
        <div
        
          className="flex items-center justify-between gap-2"
        >
          <div className="flex items-center text-xs">
            <span>{"Season 1"}</span>
          </div>
          {
            missions &&
          missions?.data?.missions.length >= 0  
         &&
          <div className="flex items-center space-x-1">
            <span className="text-xs">Tasks</span>
            <span className="font-bold">
              {completedTasks?.data?.length} / {missions?.data?.missions.length}
            </span>
          </div>
          }
        </div>
        <div className="bg-[#FFDAA3]/10 border overflow-hidden border-[#FFDAA3]/10 rounded-full mt-2 h-4 w-full">
        
          <div
            className="bg-[linear-gradient(180deg,#FBEDE0_0%,#F7B87D_21%,#F3A155_52%,#E6824B_84%,#D36224_100%)] h-full"
            style={{
              width: `${(completedTasks?.data?.length / missions?.data?.missions.length) * 100}%`,
            }}
          ></div>
        </div>
      </div>
      <UserTap />
      </div>
    </div>
  );
}
