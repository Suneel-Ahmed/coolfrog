/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserStore } from "@/store/user-store";
// import { Mission } from "@/types/MissionType";
import { Loader2Icon } from "lucide-react";
import { useState , useEffect } from "react";
import {WalletData} from '@/data/data'
import { toast } from "react-toastify";
import ExchangeDrawer from "./ExchangeDrawer";
import { $http } from "@/lib/http";
import { useQuery } from "@tanstack/react-query";
import UpdateExchangeDrawer from '@/components/UpdateExchangeDrawer';

const token = localStorage.getItem("token");


export default function Exchange() {
  const user : any = useUserStore();
  const [openDrawer, setOpenDrawer] = useState(false);
  const [updatedDrawer, setUpdatedDrawer] = useState(false);
  const [selectedMission, setSelectedMission] = useState<any>(null);
 const [changeDATA , setChangeDATA] = useState(false)
  
 const { data: paymentStatus, refetch: refetchPaymentStatus }  : any  = useQuery({
    queryKey: ["/clicker/payment-method/lock_status"],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/payment-method/lock_status`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token here
        },
      }),
    staleTime: Infinity,

  });


  const { data: paymentGet, refetch: refetchPaymentGet }  : any  = useQuery({
    queryKey: [`/clicker/payment-methods/${user.id}`],
    queryFn: () =>
      $http.$get<any[]>(`/clicker/payment-methods/${user.id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add your token here
        },
      }),
    staleTime: Infinity,

  });


  useEffect(() => {
    if (changeDATA) {
      // Refetch both queries
      Promise.all([refetchPaymentGet(), refetchPaymentStatus()]).then(() => {
        // Reset missionChange after both refetches complete
        setChangeDATA(false);
      });
    }
  }, [changeDATA, refetchPaymentGet, refetchPaymentStatus , openDrawer , updatedDrawer]);

  useEffect(()=>{
    if(changeDATA){
      window.location.reload()
    }
  },[changeDATA])
  if(!paymentGet){
    return <div><Loader2Icon className="animate-spin text-primary h-12 w-12 mx-auto mt-5 " /></div>
  }

  return (
    <>
    
    
    <div className="mt-10">
         
          <div className="mt-6">
            <div className="grid grid-cols-1 gap-4">
            {
  WalletData?.data &&
  WalletData?.data
    ?.filter((mission) => {// Exclude 'Easypaisa' and 'Jazzcash' if paymentStatus?.data[0]?.locked === 0
      if ( paymentStatus && paymentStatus[0]?.locked === 0) {
        return mission?.title !== 'Easypaisa' && mission?.title !== 'Jazzcash';
      }
      else if(user?.payment_verified === 1 && paymentGet && paymentGet[0]?.method === mission?.title){
        
        return user?.payment_verified === 1 && paymentGet && paymentGet[0]?.method === mission?.title;
      }else if(user?.payment_verified !== 1 && paymentGet && paymentGet[0]?.method !== mission?.title){
        return mission;
      }
  
    })
    ?.slice(0, 4)
    ?.map((mission, key) => (
   
      <div
        key={key}
        className="flex flex-col py-3 px-3 bg-[#D9D9D9]/10 rounded-xl cursor-pointer"
        onClick={() => {
          if (user?.payment_verified === 1 && paymentGet && paymentGet[0]?.method === mission?.title ) {
            setSelectedMission({id : paymentGet && paymentGet[0]?.id ,   logo : mission?.logo,
              title : mission?.title});
            setUpdatedDrawer(true)
            setOpenDrawer(false);
          } else if(user?.payment_verified === 1 && paymentGet && paymentGet[0]?.method !== mission?.title) {
            toast.success('Choose Your Previous Payment Method', { autoClose: 1000 });
            setSelectedMission(mission);
            setOpenDrawer(false);
            setUpdatedDrawer(false)
          }else{
            setSelectedMission(mission);
            setOpenDrawer(true);

          }
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center flex-1 space-x-5">
            <div className="w-[25%]">
              <img
                src={mission.logo}
                alt={mission.title}
                className="object-contain w-auto h-16"
              />
            </div>
            <div className="flex w-[90%] mx-auto h-full">
              <p className="text-[14px] font-bold">{mission.title}</p>
            </div>
          </div>
        </div>
      </div>
      
    ))
}

            </div>

          </div>
        </div>
        <ExchangeDrawer
        open={openDrawer}
        onOpenChange={setOpenDrawer}
        mission={selectedMission}
        changeDATA = {changeDATA}
        setChangeDATA = {setChangeDATA}
      />
        <UpdateExchangeDrawer
        open={updatedDrawer}
        paymentGet = {paymentGet}
        onOpenChange={setUpdatedDrawer}
        mission={selectedMission}
        changeDATA = {changeDATA}
        setChangeDATA = {setChangeDATA}
      />
    </>
  );
}
