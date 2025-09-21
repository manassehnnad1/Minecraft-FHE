

import {PrivyProvider} from '@privy-io/react-auth';

export default function Providers({children}: {children: React.ReactNode}) {
  return (
    <PrivyProvider
      appId="cmfsdgum800r4ld0cl8s0kiln"
      clientId="client-WY6QjsGTaYqJpQqC6nrT3Lqpn3wVf23SLoMqCrPGABDzS"
      config={{
        // Create embedded wallets for users who don't have a wallet
        embeddedWallets: {
          ethereum: {
            createOnLogin: 'users-without-wallets'
          }
        }
      }}
    >
      {children}
    </PrivyProvider>
  );
}