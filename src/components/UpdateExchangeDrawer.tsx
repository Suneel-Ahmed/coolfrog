import { useState } from "react";
import Drawer, { DrawerProps } from "./ui/drawer";
import { toast } from "react-toastify";
import { Mission } from "@/types/MissionType";
// import { NavLink , useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import axios from "axios";
const token = localStorage.getItem("token");



export default function ExchangeDrawer({
  mission,
  changeDATA,
  setChangeDATA,
  ...props
}: DrawerProps & {
  mission: Mission | null;
  changeDATA :any ;
  setChangeDATA : any
}) {

  const [accountHolder , setAccountHolder] = useState("")
  const [accountNumber , setAccountNumber] = useState("")
 
  if(mission === null) return null
  

  const handleSubmit = async ()=>{
    try {
      if(accountHolder && accountNumber){
        const res = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/clicker/payment-methods/${mission.id}`,
          { 
            account_holder_name : accountHolder,
            account_number : accountNumber
           },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token in the Authorization header
            },
          }
        );
if(res.data){
  toast.success('Payment Method Updated', { autoClose: 1000 })
  setAccountNumber("");
  setAccountHolder("");
  setChangeDATA(!changeDATA);
  (props.onOpenChange as (value: boolean) => void)(false);
}
      }else{
        toast.error('please fill the fields', { autoClose: 1000 })
        setAccountNumber("");
        setAccountHolder("");
        setChangeDATA(!changeDATA);
        (props.onOpenChange as (value: boolean) => void)(false);
      }
      
    } catch (error) {
      console.log(error)
      setAccountNumber("");
      setAccountHolder("");
      setChangeDATA(!changeDATA);
    }
  }



  return (
    <Drawer {...props}   >
      <img
        src={mission?.logo}
        alt={mission?.title}
        className="object-contain h-32 mx-auto"
      />
      <h2 className="mt-6 text-2xl font-medium text-center">{mission?.title}</h2>
      <div className="flex flex-col mx-auto  mt-4 w-fit">
        <p className="text-xs text-center">Update Your Account</p>
      </div>


      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setAccountHolder(e.target.value)} value={accountHolder} type="text" placeholder="User Name" className="w-[300px] mx-auto px-3 py-2 rounded-xl bg-transparent text-white border " />
      </div>
      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setAccountNumber(e.target.value)} value={accountNumber} type="text" placeholder="User Id" className="w-[300px] mx-auto px-3 py-2 rounded-xl bg-transparent text-white border " />
      </div>
      
      
      <div className="w-full gap-5 flex justify-center" >
      <Button
          className="w-full rounded-xl mt-6"
          onClick={handleSubmit}
        >
         {"Submit"}
        </Button>
    
        </div>
      
    </Drawer>
  );
}
