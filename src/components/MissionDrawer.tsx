import { useState } from "react";
import Drawer, { DrawerProps } from "./ui/drawer";
import { toast } from "react-toastify";
import { uesStore } from "@/store";
import { NavLink , useNavigate } from "react-router-dom";
import axios from "axios";
// import { useUserStore } from "../store/user-store";
const token = localStorage.getItem("token");
export default function MissionDrawer({
  mission,
  setMissionChange,
  missionChange ,
  ...props
}: DrawerProps & {
  mission: any | null;
  setMissionChange: any;
  missionChange : boolean;
}) {
  // const user = useUserStore();
const navigate = useNavigate()
const [btn , setBtn] = useState(false)

  const submitCode = async () => {
    setBtn(false)
      try {

        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/clicker/offical_tasks/${mission.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
          }
        );
        if(res.data ){
         
          navigate('/offical');
          setMissionChange(!missionChange)
          uesStore.setState({
            officalTasks : !missionChange
          })
          toast.success("Task Completed", { autoClose: 1000 });
          (props.onOpenChange as (value: boolean) => void)(false);
        }
      } catch (error) {
        console.error("Failed to update mission:", error);
        toast.error("Failed to update mission", { autoClose: 1000 });
      }
    
  };
  

  if (!mission) return null;
  return (
    <Drawer {...props}  >
      <img
        src={`${import.meta.env.VITE_API_URL}/${mission?.image}`}
        alt={mission.name}
        className="object-contain h-28 mt-24  mx-auto"
      />
      <h2 className="mt-6 text-2xl font-medium text-center">{mission.name}</h2>
    <div className="w-full gap-5 mt-10 flex flex-col justify-center" >

      <NavLink
target="_blank"
onClick={()=>setBtn(true)}
              className="px-5 bg-gray-300 text-nowrap text-center text-black py-3 h-fit rounded-xl mt-4 "
              to={mission.link}
              >
     {mission.code}
    </NavLink>
      <button
      disabled  = {!btn}
      onClick={submitCode}
        className={`px-5 ${btn ? "bg-gray-300" : "bg-gray-600"}  text-black outline-none text-nowrap border-none py-3 h-fit rounded-xl mt-4 `}
        >
        { "Check"}
      </button>
        </div>
      
    </Drawer>
  );
}
