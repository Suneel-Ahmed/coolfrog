/* eslint-disable @typescript-eslint/no-explicit-any */
import MissionDrawer from "@/components/MissionDrawer";
import { $http } from "@/lib/http";
import { uesStore } from "@/store";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import { useState ,  useEffect } from "react";

export default function Tasks() {
  const user = useUserStore();

  const { missionTypes  } : any = uesStore();
  const activeType : any = missionTypes?.[0];
    const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedMission, setSelectedMission] = useState(null);
  const [visibleCount, setVisibleCount] = useState(4);
  const [missionChange , setMissionChange] = useState(false)

  const { data: missions, refetch: refetchMissions }:any = useQuery({
    queryKey: ["/clicker/offical_tasks"],
    queryFn: () =>
      $http.$get(`/clicker/offical_tasks`),
    staleTime: 1000 * 60,
  });

  
  const { data: completedTasks, refetch: refetchCompletedTasks } : any  = useQuery({
    queryKey: [`/clicker/offical_tasks/status/${user.id}`],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/offical_tasks/status/${user.id}`),
    staleTime: 0,
    enabled: !!activeType?.id,
  });


const handleShowMore = ()=>{
  setVisibleCount(visibleCount + 1)
}

useEffect(() => {
  if (missionChange) {
    // Refetch both queries
    Promise.all([refetchMissions(), refetchCompletedTasks()]).then(() => {
      // Reset missionChange after both refetches complete
      setMissionChange(false);
      uesStore.setState({
        officalTasks : false
      })
   
    });
  }
}, [missionChange, refetchMissions, refetchCompletedTasks]);

  return (
    <>
    
    
    <div className="mt-10">
          <div className="flex justify-center">
            
          {missions?.missions &&
  missions?.missions?.some(
    (mission: any) =>
      !completedTasks?.some(
        (item: any) => item.task_id === mission.id && item.user_id === user.id
      )
  ) && (
    <h3 className="text-md text-center font-medium uppercase ">
      Must Complete
    </h3>
  )}
            
          </div>
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-3">
              {
                missions?.missions &&
                missions?.missions?.filter((mission: any) => 
                  !completedTasks?.some(
                    (item: any) => item.task_id === mission.id && item.user_id === user.id
                  )
                )
                ?.map((mission : any, key : number) => (
                  <div
                    key={key}
                    className={
                      "flex flex-col  py-3 px-3  bg-[#D9D9D9]/10 rounded-xl cursor-pointer"}
                      onClick={() => {
                        setSelectedMission(mission);
                        if (
                          completedTasks?.data?.some(
                            (item: any) =>
                              item.task_id === mission.id && item.user_id === user.id
                          )
                        ) {
                          setOpenDrawer(false);
                        } else {
                          setOpenDrawer(true);
                        }
                      }}
                  >
                    <div className="flex items-center justify-between ">
                      <div className="flex items-center flex-1 space-x-5" >

                      <img
                        src={`${import.meta.env.VITE_API_URL}/${mission?.image}`}
                        alt={mission?.name}
                        className="object-contain   w-16 h-16"
                        />
                      <div className="flex justify-center h-full flex-col">
                        <p className="text-[14px] font-bold"> {mission?.name}</p>
                        
                      
                      </div>
                        </div>
               
                    </div>
                   
                  </div>
                ))
              }
            </div>
            {missions?.missions &&
  visibleCount < missions?.missions?.some(
    (mission: any) =>
      !completedTasks?.some(
        (item: any) => item.task_id === mission.id && item.user_id === user.id
      )
  ).length  && ( // Show button if more items are available
            <div className="text-center mt-4">
              <button
                onClick={handleShowMore}
                className="px-4 py-2 border rounded-xl hover:text-orange-500 hover:border-orange-500  text-white"
              >
                Show More
              </button>
            </div>
          )}
          </div>
        </div>
        <MissionDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        setMissionChange = {setMissionChange}
        missionChange = {missionChange}
        mission={selectedMission}
      />
    </>
  );
}
