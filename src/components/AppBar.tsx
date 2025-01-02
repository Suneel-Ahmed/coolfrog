import { useLocation , useNavigate} from "react-router-dom";
import { cn } from "../lib/utils";
import { $http } from "@/lib/http";
import { toast } from "react-toastify";
import { useUserStore } from "@/store/user-store";
import { uesStore } from "@/store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
const links = [
  { name: "Home", link: "/", image: "/images/explore.png" },
  { name: "Offical", link: "/offical", image: "/images/logo/offical.png" },
  { name: "Referrals", link: "/referrals", image: "/images/friends.png" },
  { name: "Earn", link: "/earn", image: "/images/bounty.png" },
  { name: "Payout", link: "/payout", image: "/images/logo/nav1.png" },
];

export default function AppBar() {
  const { pathname } = useLocation();
  const user = useUserStore();
  const {officalTasks} = uesStore()
  const navigate = useNavigate();

  const { data: missions, refetch: refetchMissions } :any = useQuery({
    queryKey: [`/clicker/offical/check/${user.id}`],
    queryFn: () =>
      $http.$get(`/clicker/offical/check/${user.id}`),
    staleTime: 1000 * 60,
  });


  useEffect(()=>{
    if (officalTasks) {
      // Refetch both queries
      Promise.all([refetchMissions()]).then(() => {
        uesStore.setState({
          officalTasks : false
        })
     
      });
    }
  },[officalTasks])

const handleClick = (link: string) => {
  if (missions?.allTasksCompleted || link === "/" || link === "/offical" || link === "/referrals") {
    navigate(link); // Navigate to the link
  } else {
    toast.error("Must Complete official tasks", { autoClose: 1000 });
  }
};

  return (
    <div className="fixed left-0 z-[9999999] w-full px-5 py-0 bottom-2">
      <div className="flex items-center w-full p-2 gap-2 max-w-lg mx-auto rounded-xl bg-[linear-gradient(180deg,rgba(243,161,85,0.00)_66.37%,rgba(243,161,85,0.05)_100%)] backdrop-blur-3xl">
        {links.map((link, key) => (
          <div
          
            key={key}
            onClick={() => handleClick(link.link)}
            className={cn(
              "relative flex items-center rounded-xl flex-col justify-center font-bold text-xs px-2.5 py-1.5 gap-1 select-none flex-1 text-white/30",
              pathname === link.link && " text-white"
            )}
          >
            {link.image && (
              <img
                src={link.image}
                alt={link.name}
                className={cn(
                  "w-7 h-7 object-contain filter grayscale",
                  pathname === link.link && "filter-none"
                )}
              />
            )}
            <span>{link.name}</span>
            <div
              className={cn(
                "absolute hidden -bottom-1 left-1/2 -translate-x-1/2 bg-[#D9D9D9] rounded-sm shadow-[0px_0px_4px_0px_#B88CFF] h-1 w-4/5",
                pathname === link.link && "block"
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
