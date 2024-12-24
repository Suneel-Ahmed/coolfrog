import { useState } from "react";
import Drawer, { DrawerProps } from "./ui/drawer";
import { toast } from "react-toastify";
import { Mission } from "@/types/MissionType";
// import { NavLink , useNavigate } from "react-router-dom";
import { useUserStore } from "../store/user-store";
import axios from "axios";
const token = localStorage.getItem("token");



export default function ExchangeDrawer({
  mission,
  ...props
}: DrawerProps & {
  mission: Mission | null;
}) {
  const user : any = useUserStore();

  const [accountHolder , setAccountHolder] = useState("")
  const [accountNumber , setAccountNumber] = useState("")
 
  if(mission === null) return null
  

  const handleSubmit = async ()=>{
    try {
      if(accountHolder && accountNumber){
       
        if(user?.payment_verified === 1) {
          return toast.success('You Already Integrated Payment Method')
        }
       
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/clicker/payment-methods`,
          { 
            user_id : user.id,
            method : mission?.title,
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
  toast.success('Payment Method Integrated')
  setAccountNumber("");
  setAccountHolder("");
}
      }else{
        toast.error('please fill the fields')
        setAccountNumber("");
        setAccountHolder("");
      }
      
    } catch (error) {
      console.log(error)
      setAccountNumber("");
      setAccountHolder("");
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
        <p className="text-xs text-center">Add Your Account Number</p>
      </div>


      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setAccountHolder(e.target.value)} value={accountHolder} type="text" placeholder="Account Holder Name" className="w-[300px] mx-auto px-3 py-2 rounded-[20px] bg-transparent text-white border " />
      </div>
      <div className="flex items-center justify-center mx-auto mt-6 gap-20 text-black">
        <input onChange={(e)=>setAccountNumber(e.target.value)} value={accountNumber} type="text" placeholder="Account Number" className="w-[300px] mx-auto px-3 py-2 rounded-[20px] bg-transparent text-white border " />
      </div>
      
      
      <div className="w-full gap-5 flex justify-center" >
      <button
        className="px-10 bg-green-800 outline-none border-none py-3 rounded-[20px] mt-4 "
        onClick={handleSubmit}
        >
        {"Submit Code"}
      </button>
        </div>
      
    </Drawer>
  );
}
