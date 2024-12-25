import { useState } from "react";
import { Button } from "./ui/button";
import Drawer, { DrawerProps } from "./ui/drawer";
import Price from "./Price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user-store";

export default function TaskDrawer({
  task,
  ...props
}: DrawerProps & {
  task: any | null;
}) {
  const [submited , setSubmited] = useState(true)
  const queryClient = useQueryClient();
  const user = useUserStore();
  const submitMutation = useMutation({
    mutationFn: () => 
      $http.post<{ message: string }>('/clicker/telegram-user-tasks/submit', {
        telegram_user_id: user.id,  // Pass the user ID
        task_id: task?.id,  // Pass the task ID
        code: task?.code ||  null,  // Optional, if task type is 'code'
      }),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Task submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      task!.is_submitted = true;
      setSubmited(false);
      task!.submitted_at = new Date().toISOString();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const claimMutation = useMutation({
    mutationFn: () =>
      $http.post<{ message: string }>(`/clicker/tasks/${task?.id}/claim`),
    onSuccess: (response) => {
      toast.success(response?.data?.message || "Reward claimed successfully");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      task!.is_rewarded = true;
      useUserStore.setState((state) => {
        state.balance += task!.reward_coins;  // Add reward coins to the user's balance
        return state;
      });
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  if (!task) return null;
  return (
    <Drawer {...props}>
      <img
        src={
          task.image ||
          (task.type === "video" ? "/images/youtube.png" : "/images/bounty.png")
        }
        alt={task.name}
        className="object-contain h-24 mx-auto"
      />
      <h2 className="text-2xl font-medium text-center mt-9">{task.name}</h2>
      <div className="px-5 py-2 mx-auto mt-4 border-2 border-dashed rounded-full border-primary w-fit">
        <Price
          amount={task.reward_coins.toLocaleString()}
          className="justify-center text-xl"
        />
      </div>
     
      <Button
        className="w-full rounded-[20px] mt-12"
        asChild
        onClick={() => submitMutation.mutate()}
      >
        <a href={task.link} target="_blank">
          {task.action_name}
        </a>
      </Button>

      {!task.is_rewarded && (
        <Button
          className="w-full rounded-[20px] mt-6"
        disabled = {submited}
          onClick={() => claimMutation.mutate()}
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
