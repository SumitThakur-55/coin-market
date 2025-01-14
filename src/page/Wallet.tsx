import WalletToken from "../component/WalletToken"
import WalletDetail from "../component/WalletDetail"
import WalletAsset from "../component/WalletAsset"

export default function Wallet() {
    return (
        <div className="flex flex-col sm:flex-row">
            <div className="sm:w-1/4 bg-[#0D1421] text-white sm:h-screen sm:sticky top-0 overflow-y-auto scrollbar-hide p-4 sm:p-0 no-scrollbar">
                <WalletDetail />
            </div>
            <div className="flex-1 p-4 bg-[#151c2b] overflow-hidden sticky ">
                <WalletAsset />

            </div>
        </div>
    )
}
