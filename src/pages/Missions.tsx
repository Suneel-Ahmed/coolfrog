/* eslint-disable @typescript-eslint/no-explicit-any */
import { $http } from "@/lib/http";
import { useUserStore } from "@/store/user-store";
import { useQuery } from "@tanstack/react-query";
import Tasks from "@/components/Tasks";


export default function Missions() {
  const user = useUserStore();
  const missions:any = useQuery({
    queryKey: ["/clicker/partners"],
    queryFn: () =>
      $http.$get(`/clicker/partners`),
    staleTime: 1000 * 60,
  });
  

  return (
    <div className="flex min-h-fit h-screen bg-[url('/images/bg.png')]  bg-cover bg-center flex-col justify-around  ">
      
      <div className="flex flex-col flex-1 w-full h-screen px-6  modal-body">
        <div className="flex items-center justify-center mt-10 space-x-3 text-gradient">
          <img
            src="/images/logo/2.png"
            alt="coins"
            className="object-contain w-10 h-auto"
          />
          <span className="text-3xl font-bold">
            {Math.floor(user.balance)?.toLocaleString()}
          </span>
        </div>
        <Tasks   />
        <div className="h-fit mb-32  mt-10">
          <div className="flex justify-center gap-4">
              <h3
                className={"text-md text-center font-medium uppercase"}
               
              >
                Offical Partners
              </h3>
          </div>
          <div className="mt-6">
            <div className="mt-[30px]" >
                <ul className="w-full" >
                  {
                     missions?.data && missions?.data?.taskPartner?.length > 0 ?
                    missions?.data?.taskPartner?.map((val:any , index:any)=>(
                  <li key={index} className="w-full py-[15px] px-[30px] flex justify-between bg-white/15 rounded-xl" >
                    <h1> <span className="mx-2" >{index + 1}</span>{val?.first_name} {val?.last_name}</h1>
                    <h1>Referrals : {val?.referrals_count}</h1>
                  </li>
                  )) :
                  <li  className="w-full py-[15px] px-[30px] flex justify-center text-center border-white/50 border rounded-xl" >
                    <h1> No Offical Partner available </h1>
                  </li>

                }
                </ul>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
