
import { usePrivy } from "@privy-io/react-auth"
import Loader from "./Loader";
import { useState } from "react";

const ButtonWallet = () => {
    const { login, user, logout, authenticated} = usePrivy();
    const [loading, setLoading] = useState(false);

    const handleLogout = async () => {
        setLoading(true);
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading){
        return <Loader />;
    }

    if (authenticated){
        return(
            <div className="absolute w-36 h-12 text-white bg-green-950 font-tektur cursor-pointer transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-y-[3px] flex items-center justify-between px-3">
                <div className="flex flex-col">
                    <div>Connected</div>
                    {user?.wallet?.address && (
                        <div className="text-xs">
                            {user.wallet.address.slice(0, 6)}...{user.wallet.address.slice(-4)}
                        </div>
                    )}
                </div>
                <svg onClick={handleLogout} xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-log-out-icon lucide-log-out">
                    <path d="m16 17 5-5-5-5"/>
                    <path d="M21 12H9"/>
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                </svg>
            </div>
        )
    };
  return (
        <button onClick={login} className=" absolute w-36 h-12 text-white bg-green-950 font-tektur cursor-pointer  transition-all shadow-[3px_3px_0px_black] hover:shadow-none hover:translate-y-[3px]">Login</button>

  )
}

export default ButtonWallet

