/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { uesStore } from "@/store";
import { useUserStore } from "@/store/user-store";
import { Mission } from "@/types/MissionType";
import { useQuery } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useState } from "react";
import Tasks from "@/components/Tasks";


export default function Missions() {
  const user = useUserStore();
  const { missionTypes, totalReferals } = uesStore();
  const [activeType, setActiveType] = useState(missionTypes?.[0]);
  const missions = useQuery({
    queryKey: ["/clicker/missions", activeType?.id],
    queryFn: () =>
      $http.$get<Mission[]>(`/clicker/missions`, {
        params: { type: activeType?.id },
      }),
    staleTime: 1000 * 60,
    enabled: !!activeType?.id,
  });

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
        <Tasks/>
        <div className="h-fit mb-32  mt-10">
          <div className="flex gap-4">
            {missionTypes.map((type, key) => (
              <h3
                key={key}
                className={"text-xs font-bold uppercase"}
               
              >
                Offical Partners
              </h3>
            ))}
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-2 gap-3">
              {missions.isLoading ? (
                <div className="flex items-center justify-center h-full col-span-2 mt-6">
                  <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : (
                missions.data &&
                missions.data.slice(0, 4).map((mission, key) => (
                  <div
                    key={key}
                    className={cn(
                      "flex flex-col py-3 px-3 bg-[#D9D9D9]/10 rounded-xl cursor-pointer",
                      {
                        "opacity-40 cursor-not-allowed":
                          (mission?.required_user_level &&
                            mission.required_user_level > user.level!.level) ||
                          (mission.required_friends_invitation &&
                            mission.required_friends_invitation >
                              totalReferals),
                      }
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
              )}
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
