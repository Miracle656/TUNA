import { registerEnokiWallets } from '@mysten/enoki';
import { ENOKI_PUBLIC_KEY } from '../lib/enoki';
import { useEffect } from 'react';
import { useSuiClient } from '@mysten/dapp-kit';

export default function RegisterEnokiWallets() {
    const suiClient = useSuiClient();

    useEffect(() => {
        const { unregister } = registerEnokiWallets({
            providers: {
                google: {
                    clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '845644888970-sjm125bq4afsl25u1ud8v7qlb8jf08p3.apps.googleusercontent.com',
                },
            },
            apiKey: ENOKI_PUBLIC_KEY,
            network: 'testnet',
            client: suiClient
        });

        return () => unregister();
    }, [suiClient]);

    return null;
}
