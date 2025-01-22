
// import { useEffect , useState } from "react";
import {  useNavigate} from "react-router-dom";
// import { cn } from "../lib/utils";
import { $http } from "@/lib/http";
// import { toast } from "react-toastify";
import { useUserStore } from "@/store/user-store";
// import { uesStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";


export default function UserTap() {
const user = useUserStore();
const navigate = useNavigate()

  const {data}  :any = useQuery({
    queryKey: [`/clicker/offical/check/${user.id}`],
    queryFn: () =>
      $http.$get(`/clicker/offical/check/${user.id}`),
    staleTime: 1000 * 60,
  });


  const handleClick = ()=>{
      if(data?.allTasksCompleted){
        navigate('/earn')
      }else{
        navigate('/offical')
      }
  }

 
  return (
    <div className="w-full resposive_usertab    flex items-center">
      <div className="ms-10 w-full  ">
        <div
          className="flex  items-center  w-full  justify-center  h-fit "
        >
          <img
          onClick={handleClick}
            src={"/images/logo/logo.png"}
            alt="level image"
            className="object-contain  max-w-full me-10 w-[100vw] h-auto "
          />
        </div>
      </div>

      
      
    </div>
  );
}
