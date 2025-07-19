
import { Button } from "./ui/button";
import Drawer, { DrawerProps } from "./ui/drawer";
import Price from "./Price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { useState } from "react";
export default function TaskDrawer({
  task,
  ...props
}: DrawerProps & {
  task: any | null;
}) {
 
  const queryClient = useQueryClient();
  const user = useUserStore();
const [active , setActive] = useState(false)


  const claimMutation = useMutation({
    mutationFn: () => {
  
      return $http.post<{ message: string }>(`/clicker/tasks/${task?.id}/claim/${user?.id}`);
    },
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      if (task) {
        task.is_rewarded = true;
      }
      useUserStore.setState((state) => {
        state.balance += task!.reward_coins; // Add reward coins to the user's balance
        return state;
      });
      toast.success(response?.data?.message || "Reward claimed successfully", { autoClose: 1000 });
      props.onOpenChange?.(false);
    
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred", { autoClose: 1000 });
    
    },
  });


  const submitMutation = useMutation({
    mutationFn: () => {
      return $http.post<{ message: string }>("/clicker/telegram-user-tasks/submit", {
        telegram_user_id: user.id, // Pass the user ID
        task_id: task?.id, // Pass the task ID
        code: task?.code || null, // Optional, if task type is 'code'
      });
    },
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Task submitted successfully", { autoClose: 1000 });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      task!.is_submitted = true;
     
      task!.submitted_at = new Date().toISOString();
      claimMutation.mutate()
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred", { autoClose: 1000 });
     
    },
  });

 

  if (!task) return null;

  return (
    <Drawer {...props}>
      <img
        src={
          task?.image ? `${import.meta.env.VITE_API_URL}/${task?.image}` :
          (task.type === "video" ? "/images/youtube.png" : "/images/bounty.png")
        }
         loading="lazy" width="500" height="500"
        alt={task.name}
        className="object-contain h-24 mx-auto"
      />
      <h2 className="text-2xl font-medium text-center mt-9">{task.name}</h2>
      <div className="px-5 py-2 mx-auto mt-4 border-2 border-dashed rounded-full border-primary w-fit">
        <Price amount={task.reward_coins.toLocaleString()} className="justify-center text-xl" />
      </div>
  
        <Button asChild className="w-full rounded-xl mt-10" onClick={()=>{
      setTimeout(()=>{setActive(true)},10000)
    }}>
          <a href={task.link} rel="noopener noreferrer" target="_blank">
            {task.action_name}
          </a>
        </Button>
      
      {!task.is_rewarded  && (
        <Button
          className="w-full rounded-xl mt-6"
          disabled={!active}
          onClick={() => submitMutation.mutate()}
        >
          {claimMutation.isPending && (
            <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
          )}
          Check
        </Button>
      )}
    </Drawer>
  );
}
