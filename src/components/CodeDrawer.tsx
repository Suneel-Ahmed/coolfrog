import { useState } from "react";
import { Button } from "./ui/button";
import Price from "./Price";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import { Loader2Icon } from "lucide-react";
import { useUserStore } from "@/store/user-store";
import { RxCross2 } from "react-icons/rx";
export default function CodeDrawer({
  task,
  ...props
}: {
  task: any | null;
  onClose: () => void;
  isModalOpen : any
}) {
  const [code, setCode] = useState("");
  const [active , setActive] = useState(false)
  const queryClient = useQueryClient();
  const user = useUserStore();

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
      setCode("");
      props.onClose(); // Close the modal after success
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred", { autoClose: 1000 });
      setCode("");
      props.onClose();
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
      claimMutation.mutate();
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || "An error occurred", { autoClose: 1000 });
    },
  });

   
   

  if (!task) return null;

  return (
    <div className="fixed inset-0 z-[999999] flex backdrop-blur-md  justify-center bg-[#272a2f]/[60%]">
  <div
    className="  flex  flex-col rounded-lg p-8 max-w-md w-full overflow-y-auto max-h-[85vh]"
  >
    {/* Close Button */}
    <div className="flex justify-end mb-10">
      <button onClick={props.onClose} className="text-slate-300 hover:text-white">
        <RxCross2 />
      </button>
    </div>

    {/* Modal Content */}
    <img
      src={
        task?.image
          ? `${import.meta.env.VITE_API_URL}/${task?.image}`
          : task.type === "video"
          ? "/images/youtube.png"
          : "/images/bounty.png"
      }
      alt={task.name}
      className="object-contain h-24 mx-auto"
    />
    <h2 className="text-2xl font-medium text-center mt-6">{task.name}</h2>
    <div className="px-5 py-2 mx-auto mt-4 border-2 border-dashed rounded-full border-primary w-fit">
      <Price
        amount={task.reward_coins.toLocaleString()}
        className="justify-center text-xl"
      />
    </div>
    <div className="mt-6">
      <input
        onChange={(e) => setCode(e.target.value)}
        value={code}
        type="text"
        disabled = {!active}
        placeholder="Enter Your Code"
        className="border bg-transparent w-full py-3 rounded-xl px-4"
        required
      />
    </div>
    <Button onClick={()=>{
      setTimeout(()=>{setActive(true)},4000)
    }} className="w-full rounded-xl mt-6" asChild>
      <a href={task.link} target="_blank">
        {task.action_name}
      </a>
    </Button>
    <Button
      className="w-full rounded-xl mt-6"
      onClick={() => {
        if (task && task.type === "verify_code" && code !== task.code) {
          toast.error("Invalid Code", { autoClose: 1000 });
          return;
        }
        submitMutation.mutate();
      }}
    disabled={code === "" || !active}
    >
      {claimMutation.isPending && (
        <Loader2Icon className="w-6 h-6 mr-2 animate-spin" />
      )}
      Claim Reward
    </Button>
  </div>
</div>

  
  );
}
