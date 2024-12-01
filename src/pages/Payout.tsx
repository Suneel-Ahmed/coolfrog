import Exchange from "@/components/Exchange";
export default function Payout() {




  return (
    <div className="flex flex-col justify-end bg-[url('/images/bg.png')] bg-cover flex-1">
      <div className="flex flex-col flex-1 w-full h-full px-6 py-8 pb-24 mt-12 modal-body">
        <img
          src="/images/logo/nav1.png"
          alt="coins-3"
          className="object-contain w-32 h-32 mx-auto"
        />
        <h1 className="mt-4 text-2xl font-bold text-center uppercase">
        Exchange COINS
        </h1>
   <Exchange/>    
       
      </div>
   
    </div>
  );
}
