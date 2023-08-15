'use client'
import Image from 'next/image'
import '@rainbow-me/rainbowkit/styles.css';
import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import { useState, useEffect } from "react";
import { SwapWidget, darkTheme } from '@uniswap/widgets'
import '@uniswap/widgets/fonts.css'
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { createWalletClient, custom } from 'viem'
import { Alchemy, Network } from "alchemy-sdk";



const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, zora],
  [
    alchemyProvider({ apiKey: process.env.ALCHEMY_ID }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'My RainbowKit App',
  projectId: '008beb8e05b6e54446f2f09c634508b8',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})


export default function Home() {
  const [tokenInfo, setTokenInfo] = useState({
    uniswapTokenBalance: "-",
    unibotTokenBalance: "-",
  });

  const getUserTokenBalance = async () => {
    const client = createWalletClient({
      chain: mainnet,
     transport: custom(window.ethereum)
     })
     const [address] = await client.getAddresses();

    const config = {
      apiKey: "R8acHt8YAXvEhE0v9xt5mpB6aU9MMpJk",
      network: Network.ETH_MAINNET,
    };
    const alchemy = new Alchemy(config);
    const ownerAddress = address;

    //The below token contract address corresponds to USDT
    const uniswapAddresses = ["0x1f9840a85d5af5bf1d1762f925bdaddc4201f984"];
    const unibotAddresses = ["0xf819d9cb1c2a819fd991781a822de3ca8607c3c9"];

    const uniswapData = await alchemy.core.getTokenBalances(
      ownerAddress,
      uniswapAddresses
        );

        const unibotData = await alchemy.core.getTokenBalances(
          ownerAddress,
          unibotAddresses
            );

            const uni = unibotData["tokenBalances"];
            const swap = uniswapData["tokenBalances"];
            const newUnibotData = uni[0];
            const newUniswapData = swap[0];
            const finalUnibotData = newUnibotData["tokenBalance"];
            const finalUniswapData = newUniswapData["tokenBalance"];


        console.log(finalUnibotData, finalUniswapData);

    setTokenInfo({
        uniswapTokenBalance: parseInt(finalUniswapData, 18),
        unibotTokenBalance: parseInt(finalUnibotData, 18),
    })
  }
  useEffect(() => {
    getUserTokenBalance();
  }, []); 
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
    <main className="">
    <div className="mt-[0rem]"></div>
      <nav>
        <div className="grid grid-cols-2 py-4 w-[90%] mx-auto">
          <div>
            <img src="/logo1.jpeg" alt="img" className="h-24" />
          </div>
          <div className="place-self-end my-auto">
          
            <ConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        // Note: If your app doesn't use authentication, you
        // can remove all 'authenticationStatus' checks
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              'style': {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <button onClick={openConnectModal} className="md:px-6 px-4 py-2 rounded-[30px] text-white bg-blue-700 md:text-[20px] text-[16px] font-semibold "
                  type="button">
                    Connect Wallet
                  </button>
                );
              }

              if (chain.unsupported) {
                return (
                  <button className="md:px-6 px-4 py-2 rounded-[30px] text-white bg-blue-700 md:text-[20px] text-[16px] font-semibold " onClick={openChainModal} type="button">
                    Wrong network
                  </button>
                );
              }

              return (
                <div style={{ display: 'flex', gap: 12 }}>
                  <button
                    onClick={openChainModal}
                    className="md:px-6 px-4 py-2 rounded-[30px] text-white bg-blue-700 md:text-[20px] text-[16px] font-semibold "
                    style={{ display: 'flex', alignItems: 'center' }}
                    type="button"
                  >
                    {chain.hasIcon && (
                      <div
                        style={{
                          background: chain.iconBackground,
                          width: 12,
                          height: 12,
                          borderRadius: 999,
                          overflow: 'hidden',
                          marginRight: 4,
                        }}
                      >
                        {chain.iconUrl && (
                          <img
                            alt={chain.name ?? 'Chain icon'}
                            src={chain.iconUrl}
                            style={{ width: 12, height: 12 }}
                          />
                        )}
                      </div>
                    )}
                    {chain.name}
                  </button>

                  <button className="md:px-6 px-4 py-2 rounded-[30px] text-white bg-blue-700 md:text-[20px] text-[16px] font-semibold " onClick={openAccountModal} type="button">
                    {account.displayName}
                    {account.displayBalance
                      ? ` (${account.displayBalance})`
                      : ''}
                  </button>
                </div>
              );
            })()}
          </div>
        );
      }}
    </ConnectButton.Custom>
          </div>
        </div>
      </nav>

      <div className="mt-[5rem]">
        <div className="grid md:grid-cols-2 grid-cols-1 w-[90%] mx-auto gap-x-20 gap-y-8">
          <div className="text-white my-auto">
            <h2 className="text-white text-[40px] text-bold w-[80%] mx-auto">
              The Most User-Friendly{" "}
              <span className="bg-gradient-to-r from-yellow-300 to-yellow-800 text-transparent bg-clip-text font-bold">
                Token Swap App
              </span>
              is Here
            </h2>
            <p className="text-[18px] w-[80%] text-justify mx-auto">
              Do you find yourself constantly navigating through a labyrinth of
              complicated token exchanges and sluggish trade speed ? say goodbye
              to the hassle and hello to a better trasing experience with
              swiftapp
            </p>
          </div>
          <div>
            <div>
              <h2 className="text-[22px] font-semibold   text-white my-2">
                UNIMIXER
              </h2>
              <div className="Uniswap">
                <SwapWidget theme={darkTheme} width={500} hideConnectionUI={true}  brandedFooter={false}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-[5rem]">
      <div>
        <div className='grid md:grid-cols-2 grid-cols-1 w-[90%] mx-auto gap-x-20 gap-y-8 '>
        <div className='my-auto text-white bg-blue-700 p-10 rounded-[10px]'>
            <div className=''>
                <p>Uniswap Token Balance</p>
            </div>
            <div className='bal'>
                <p>{tokenInfo.uniswapTokenBalance}</p>
            </div>
        </div>
        <div className='my-auto text-white bg-blue-700 p-10 rounded-[10px]'>
            <div className=''>
                <p>Unibot Token Balance</p>
            </div>
            <div className='bal'>
                <p>{tokenInfo.unibotTokenBalance}</p>
            </div>
        </div>
        </div>
    </div>
      </div>
    </main>
    </RainbowKitProvider>
    </WagmiConfig>
  )
}
