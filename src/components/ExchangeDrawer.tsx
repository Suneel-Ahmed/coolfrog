import { useState } from "react";
import Drawer, { DrawerProps } from "./ui/drawer";
// import { toast } from "react-toastify";
import { Mission } from "@/types/MissionType";
// import { NavLink , useNavigate } from "react-router-dom";
// import axios from "axios";
// const token = localStorage.getItem("token");



export default function ExchangeDrawer({
  mission,
  ...props
}: DrawerProps & {
  mission: Mission | null;
}) {

    console.log(mission)

  const [code , setcode] = useState("")
 
  if(mission === null) return null

  return (
    <Drawer {...props}   >
      <img
        src={mission?.logo}
        alt={mission?.title}
        className="object-contain h-32 mx-auto"
      />
      <h2 className="mt-6 text-2xl font-medium text-center">{mission?.title}</h2>
      <div className="flex flex-col mx-auto  mt-4 w-fit">
        <p className="text-xs text-center">Add Your Account Number</p>
      </div>

      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setcode(e.target.value)} value={code} type="text" placeholder="enter code" className="w-[300px] mx-auto px-3 py-2 rounded-[20px] bg-transparent text-white border " />
      </div>
      
      
      <div className="w-full gap-5 flex justify-center" >
      <button
        className="px-10 bg-green-800 outline-none border-none py-3 rounded mt-4 "
        >
        {"Submit Code"}
      </button>
        </div>
      
    </Drawer>
  );
}
