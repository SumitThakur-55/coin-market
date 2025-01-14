import React from 'react'
import WalletToken from './WalletToken'
import WalletNft from './WalletNft'
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
function WalletAsset() {
    const publicKey = useSelector((state: RootState) => state.wallet.publicKey);
    return (
        <div>

            {
                publicKey ? < div className="text-white px-4 " >
                    <div className="py-2">
                        <h1 className="text-4xl font-bold">Dashboard</h1>
                    </div>
                    <div className="h-20 rounded-2xl p-3 bg-slate-300">
                        <h1>Net Worth</h1>
                    </div>
                    <WalletToken />
                    <WalletNft />
                </div >
                    :
                    <div className='h-screen flex flex-col items-center justify-center'>
                        <div className='text-4xl  flex text-white/80 flex-col  rounded-md  p-10   '>Wallet not connected</div>
                    </div>
            }


        </div>
    )
}

export default WalletAsset
