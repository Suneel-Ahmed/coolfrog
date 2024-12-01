import { useState } from "react";
import Drawer, { DrawerProps } from "./ui/drawer";
import { toast } from "react-toastify";
import { Mission } from "@/types/MissionType";
import { NavLink , useNavigate } from "react-router-dom";
import axios from "axios";
const token = localStorage.getItem("token");
export default function MissionDrawer({
  mission,
  ...props
}: DrawerProps & {
  mission: Mission | null;
}) {

  const [code , setcode] = useState("")
const navigate = useNavigate()
  const submitCode = async () => {
    if (code === mission.code) {

  
      try {

        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/clicker/missions/${mission.id}`,
          { pass: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
          }
        );
        setcode("")
        setPopup(false)
        navigate('/offical')
        toast.success("Task Completed");
      } catch (error) {
        console.error("Failed to update mission:", error);
        toast.error("Failed to update mission");
      }
    } else {
      setcode("");
      toast.error("Invalid Code");
    }
  };
  

  if (!mission || mission.pass !== 0) return null;
  return (
    <Drawer {...props}   >
      <img
        src={mission.image}
        alt={mission.name}
        className="object-contain h-32 mx-auto"
      />
      <h2 className="mt-6 text-2xl font-medium text-center">{mission.name}</h2>
      <div className="flex flex-col mx-auto  mt-4 w-fit">
        <p className="text-xs text-center">Watch video and write the given code below</p>
      </div>

      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setcode(e.target.value)} value={code} type="text" placeholder="enter code" className="w-[300px] mx-auto px-3 py-2 rounded-[20px] bg-transparent text-white border " />
      </div>
      
      
      <div className="w-full gap-5 flex justify-center" >

      <NavLink
target="_blank"
              className="px-10 bg-gray-300 text-black py-3 rounded mt-4 "
              to={mission.link}
              >
     Go ahead
    </NavLink>
      <button
      onClick={submitCode}
        className="px-10 bg-green-800 outline-none border-none py-3 rounded mt-4 "
        >
        {"Submit Code"}
      </button>
        </div>
      
    </Drawer>
  );
}
