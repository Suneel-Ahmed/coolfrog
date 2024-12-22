/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
// import axios from "axios";
// import { useEffect } from "react";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import Tasks from "@/components/Tasks";


export default function Missions() {
  const user = useUserStore();
  const missions = useQuery({
    queryKey: ["/clicker/offical_tasks"],
    queryFn: () =>
      $http.$get(`/clicker/offical_tasks`),
    staleTime: 1000 * 60,
  });
console.log("Mission" , missions)
  return (
    <div className="flex min-h-fit flex-col justify-around ">
      
      <div className="flex flex-col flex-1 w-full h-screen px-6  modal-body">
        <div className="flex items-center justify-center mt-10 space-x-3 text-gradient">
          <img
            src="/images/logo/2.png"
            alt="coins"
            className="object-contain w-10 h-auto"
          />
          <span className="text-3xl font-bold">
            {Math.floor(user.balance)?.toLocaleString()}
          </span>
        </div>
        <Tasks missions = {missions} />
        <div className="h-fit mb-32  mt-10">
          <div className="flex gap-4">
              <h3
                className={"text-xs font-bold uppercase"}
               
              >
                Offical Partners
              </h3>
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              {
                missions.data &&
                missions.data?.missions?.map((mission, key) => (
                  <div
                    key={key}
                    className={cn(
                      "flex flex-col py-3 px-3 bg-[#D9D9D9]/10 rounded-xl cursor-pointer"
                    )}
               
                  >
                    <div className="flex flex-col items-center  space-x-3">
                      <img
                        src={"images/avatar.png"}
                        alt={mission.name}
                        className="object-contain w-28 h-auto"
                      />
                      <div className="flex flex-col">
                        <p className="text-[13px] font-bold">{mission.name}</p>
                      
                      
                      </div>
                    </div>
                  
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
