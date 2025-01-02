import { ReferralTaskType } from "@/types/TaskType";
import { useMemo, useState } from "react";
import TaskDrawer from "@/components/TaskDrawer";
import ListItem from "@/components/ListItem";
import Price from "@/components/Price";
import DailyDrawer from "@/components/DailyDrawer";
import CheckIcon from "@/components/icons/CheckIcon";
import CodeDrawer from "@/components/CodeDrawer";
import { useQuery } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/store/user-store";

import ReferralTaskDrawer from "@/components/ReferralTaskDrawer";

export default function Earn() {
  
  const user = useUserStore();
  const [activeTask, setActiveTask] = useState<any>(null);
  const [activeCodeTask, setActiveCodeTask] = useState<any>(null);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  // const [isCodeDrawerOpen, setIsCodeDrawerOpen] = useState(false);
  const [isDailyDrawerOpen, setIsDailyDrawerOpen] = useState(false);
  const [isReferralTaskDrawerOpen, setIsReferralTaskDrawerOpen] =
    useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

const handleOpenModal = () => setIsModalOpen(true);
const handleCloseModal = () => setIsModalOpen(false);


  const [activeReferralTask, setActiveReferralTask] =
    useState<ReferralTaskType | null>(null);

  const  data  = useQuery({
    queryKey: ["tasks"],
    queryFn: () => $http.$get<any>(`/clicker/tasks/${user.id}`),
  });


  const referralTasks : any = useQuery({
    queryKey: ["referral-tasks"],
    queryFn: () => $http.$get<any>("/clicker/referral-tasks"),
  });

  const videoTasks : any = useMemo(
    () => data?.data && data?.data?.data?.filter((task : any) => task.type === "video") || [],
    [data]
  );

  const otherTasks : any = useMemo(
    () => data?.data && data?.data?.data?.filter((task : any ) => task.type === "other") || [],
    [data]
  );
  const verifyTasks : any = useMemo(
    () => data?.data && data?.data?.data?.filter((task : any ) => task.type === "verify_code") || [],
    [data]
  );

 
  // if (isLoading) return <LoadingPage />;

  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <img
          src="/images/bounty.png"
          alt="coins-3"
          className="object-contain w-32 h-32 mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold text-center uppercase">
          EARN MORE COINS
        </h1>
        {verifyTasks.length > 0 && (
  <>
    <p className="mt-8 font-medium text-center">All Tasks</p>
    <div className="mt-2 space-y-2">
      {verifyTasks
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map((item: any) => (
          <ListItem
            key={item.id}
            title={item.name}
            subtitle={
              <Price amount={`+${item.reward_coins.toLocaleString()}`} />
            }
            image={item?.image ? `${import.meta.env.VITE_API_URL}/${item?.image}` : "/images/bounty.png"}
            className={cn(
              "disabled:opacity-50 disabled:mix-blend-luminosity"
            )}
            disabled={item.is_rewarded}
            action={
              item.is_rewarded ? (
                <CheckIcon className="w-6 h-6 text-[#27D46C]" />
              ) : undefined
            }
            onClick={() => {
              setActiveCodeTask(item);
              handleOpenModal();
            }}
          />
        ))}
    </div>
  </>
)}
 {otherTasks.length > 0 && (
          <>
           
            <div className="mt-2 space-y-2">
              {otherTasks.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
              .map((item : any) => (
                <ListItem
                  key={item.id}
                  title={item.name}
                  subtitle={
                    <Price amount={`+${item.reward_coins.toLocaleString()}`} />
                  }
                  image={ item?.image ? `${import.meta.env.VITE_API_URL}/${item?.image}` : "/images/bounty.png"}
                  className={cn(
                    "disabled:opacity-50 disabled:mix-blend-luminosity"
                  )}
                  disabled={item.is_rewarded}
                  action={
                    item.is_rewarded ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  onClick={() => {
                    setActiveTask(item);
                    setIsTaskDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}
        {videoTasks.length > 0 && (
          <>
            <div className="mt-2 space-y-2">
              {videoTasks.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).map((item : any) => (
                <ListItem
                  key={item.id}
                  title={item.name}
                  subtitle={
                    <Price amount={`+${item.reward_coins.toLocaleString()}`} />
                  }
                  image={ item?.image ? `${import.meta.env.VITE_API_URL}/${item?.image}` : "/images/youtube.png"}
                  onClick={() => {
                    setActiveTask(item);
                    setIsTaskDrawerOpen(true);
                  }}
                  action={
                    item.is_rewarded ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  disabled={item.is_rewarded}
                />
              ))}
            </div>
          </>
        )}

        
        <p className="mt-8 font-medium text-center">Daily Tasks</p>
        <div className="mt-4 space-y-2">
          <ListItem
            title={"Daily reward"}
            image="/images/daily-task.png"
            onClick={() => setIsDailyDrawerOpen(true)}
          />
        </div>

 

       
  

        {referralTasks.data && referralTasks.data?.length > 0 && (
          <>
            <p className="mt-8 font-medium text-center">Referral Tasks</p>
            <div className="mt-4 space-y-2">
              {referralTasks.data.map((item : any)  => (
                <ListItem
                  key={item.id}
                  title={item.title}
                  subtitle={
                    <Price amount={`+${item.reward.toLocaleString()}`} />
                  }
                  image={"/images/bounty.png"}
                  className={cn(
                    "disabled:opacity-50 disabled:mix-blend-luminosity"
                  )}
                  disabled={!!item.is_completed}
                  action={
                    item.is_completed ? (
                      <CheckIcon className="w-6 h-6 text-[#27D46C]" />
                    ) : undefined
                  }
                  onClick={() => {
                    setActiveReferralTask(item);
                    setIsReferralTaskDrawerOpen(true);
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <DailyDrawer
        open={isDailyDrawerOpen}
        onOpenChange={setIsDailyDrawerOpen}
      />
      <TaskDrawer
        task={activeTask}
        open={isTaskDrawerOpen}
        onOpenChange={setIsTaskDrawerOpen}
      />
      {
        isModalOpen && 
      <CodeDrawer
      task={activeCodeTask} 
      onClose={handleCloseModal} 
      isModalOpen = {isModalOpen} 
      
      />
    }
      <ReferralTaskDrawer
        task={activeReferralTask}
        open={isReferralTaskDrawerOpen}
        onOpenChange={setIsReferralTaskDrawerOpen}
      />
    </div>
  );
}
