
import CopyIcon from "@/components/icons/CopyIcon";
import { Button } from "@/components/ui/button";
import { $http } from "@/lib/http";
import { compactNumber } from "@/lib/utils";
import { uesStore } from "@/store";
import { useUserStore } from "@/store/user-store";
import { PaginationResponse } from "@/types/Response";
import { UserType } from "@/types/UserType";
import { useQuery } from "@tanstack/react-query";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useMemo, useState , useEffect } from "react";
import { toast } from "react-toastify";
// import { RxCross2 } from "react-icons/rx";
// import ComponentWithAdBanner from "@/components/ComponentWithAdBanner";


const shareMessage = encodeURI(
  "Boze Coin with me!"
);

export default function Friends() {
  const [, copy] = useCopyToClipboard();
  const { telegram_id } = useUserStore();
  const { referral, levels } = uesStore();
  const [timmer, setTimmer] = useState<boolean>(false);
  const [showMoreBonuses, setShowMoreBonuses] = useState(false);
  
  const referralLink = useMemo(
    () => `https://t.me/BozeCoinBot/bozecoin?startapp=${telegram_id}`,
    [telegram_id]
  );

  const referredUsers = useQuery({
    queryKey: ["referredUsers"],
    queryFn: () => $http.$get<PaginationResponse<UserType>>("/referred-users"),
  });
useEffect(() => {
      if (!timmer) {
        const timerId = setTimeout(() => setTimmer(true), 10000);
        return () => clearTimeout(timerId);
      }
    }, [timmer]);
  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')]  min-h-fit bg-cover flex-1">
    
     <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <h1 className="text-2xl font-bold text-center uppercase">Friends</h1>
       
        <p className="mt-2.5 font-medium text-center">
          You and your friend will receive bonuses.
        </p>
        <div className="mt-4 space-y-2">
          <button className="flex items-center w-full gap-4 px-4 py-2 bg-white/10 rounded-xl">
            <img
              src="/images/chest.png"
              loading="lazy" width="500" height="500"
              alt="chest"
              className="object-contain w-9 h-9 mix-blend-screen"
            />
            <div className="text-sm font-medium text-left">
              <p>Invite a friend</p>
              <div className="flex items-center space-x-1">
                <img
                  src="/images/logo/2.png"
                  alt="coin"
                  loading="lazy" width="500" height="500"
                  className="object-contain w-5 h-5"
                />
                <span className="font-bold text-primary">
                  +400
                </span>
                <span className="text-sm">for you and your friend</span>
              </div>
            </div>
          </button>
        </div>
        <div className="relative flex-1">
          <div className="absolute inset-0 w-full h-[calc(100%-1rem)] py-6 mt-4 overflow-y-scroll">
            {!showMoreBonuses ? (
              <div className="text-center">
               
              </div>
            ) : (
              <>
                <p
                  className="mt-8 text-sm font-bold uppercase"
                  onClick={() => setShowMoreBonuses((value) => !value)}
                >
                  Bonus for leveling up
                </p>
                <div className="relative flex-1 mt-6 min-h-60">
                  <div className="absolute inset-0 w-full h-full overflow-y-auto">
                    <table className="w-full">
                      <thead className="text-xs text-white/30">
                        <tr className="border-b border-[#D9D9D9]/10">
                          <th className="px-2 py-2 text-left">Level</th>
                          <th className="px-2 py-2 text-right">For friend</th>
                          <th className="px-2 py-2 text-right">Premium</th>
                        </tr>
                      </thead>
                      <tbody>
                        {levels
                          .filter((item) => referral.base.levelUp[item.level])
                          .map((item, key) => (
                            <tr
                              key={key}
                              className="border-b border-[#D9D9D9]/10"
                            >
                              <td className="px-2 py-2 text-xs">{item.name}</td>
                              <td className="px-2 py-2">
                                <div className="flex items-center justify-end gap-1">
                                  <img
                                    src="/images/logo/2.png"
                                    alt="coin"
                                    loading="lazy" width="500" height="500"
                                    className="object-contain w-4 h-4"
                                  />
                                </div>
                              </td>
                              <td className="px-2 py-2">
                                <div className="flex items-center justify-end gap-1">
                                  <img
                                    src="/images/logo/2.png"
                                    alt="coin"
                                    loading="lazy" width="500" height="500"
                                    className="object-contain w-4 h-4"
                                  />
                                 
                                </div>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
            <p className="mt-8 text-sm font-bold uppercase">
              List of your friends{" "}
              {referredUsers.data?.meta
                ? `(${referredUsers.data?.meta.total})`
                : null}
            </p>
            {referredUsers.data?.data?.length ? (
              <div className="mt-4 space-y-4">
                {referredUsers?.data?.data?.map((item, key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-xl"
                  >
                    <div className="flex items-center gap-2">
                    
                      <div>
                        <p className="text-sm font-medium">
                          {item.first_name} 
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/logo/2.png"
                        alt="coin"
                        loading="lazy" width="500" height="500"
                        className="object-contain w-5 h-5"
                      />
                      <span className="text-sm font-medium text-primary">
                        {compactNumber(item.balance)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center justify-center px-4 mt-4 border-2 border-dashed rounded-xl border-white/10 h-14">
                <p className="text-xs font-medium text-center text-white/30">
                  You didn’t invite anyone yet
                </p>
              </div>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <Button
          
            className="flex-shrink-0 bg-none border border-gray-600 "
            onClick={() => {
              copy(referralLink);
              toast.success("Referral link copied to clipboard");
            }}
          >
            <CopyIcon className="w-5 h-5 text-white" />
          </Button>
          <Button
            className="flex-1 bg-none border border-gray-600 text-white font-light"
            onClick={() =>
              Telegram.WebApp.openTelegramLink(
                `https://t.me/share/url?text=${shareMessage}&url=${referralLink}`
              )
            }
          >
            Invite a friend
          </Button>
        </div>
      </div>
    
    </div>
  );
}

// {adsStore < 25 && !timmer && (
//   <div className="absolute w-full flex flex-col h-fit bg-white rounded-xl justify-center items-center top-1/2 inset-0">
//     <button
//       onClick={() => setTimmer(true)}
//       className="w-[30px] z-[9999999] h-[30px] me-4 border-white bg-black text-white mt-2 rounded-full flex items-center justify-center text-[26px] relative ms-auto"
//     >
//       <RxCross2 /> 
//     </button>
//     {/* <ComponentWithAdBanner adId="6056294" /> */}
//   </div>
// )}