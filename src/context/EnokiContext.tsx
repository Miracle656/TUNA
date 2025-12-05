import React, { createContext, useContext, useEffect, useState } from 'react';
import { enokiFlow } from '../lib/enoki';
import { useConnectWallet, useWallets, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

interface EnokiContextType {
    address: string | null;
    isLoading: boolean;
    login: () => void;
    logout: () => void;
    handleCallback: () => Promise<void>;
}

const EnokiContext = createContext<EnokiContextType>({
    address: null,
    isLoading: true,
    login: () => { },
    logout: () => { },
    handleCallback: async () => { },
});

export function EnokiProvider({ children }: { children: React.ReactNode }) {
    const [address, setAddress] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Dapp Kit hooks
    const { mutate: connect } = useConnectWallet();
    const { mutate: disconnect } = useDisconnectWallet();
    const wallets = useWallets();
    const currentAccount = useCurrentAccount();

    // Initialize session on mount
    useEffect(() => {
        checkSession();
    }, []);

    // Sync Enoki session with Dapp Kit
    useEffect(() => {
        // If we have an Enoki session but Dapp Kit isn't connected to it
        if (address && !currentAccount) {
            const enokiWallet = wallets.find(w => w.name.includes('Enoki'));
            if (enokiWallet) {
                console.log('Connecting to Enoki wallet in Dapp Kit...');
                connect({ wallet: enokiWallet });
            }
        }
    }, [address, wallets, currentAccount, connect]);

    const checkSession = async () => {
        try {
            const session = await enokiFlow.getSession();
            if (session) {
                setAddress(session.address);
            } else {
                setAddress(null);
            }
        } catch (error) {
            console.error('Enoki session check failed:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async () => {
        const protocol = window.location.protocol;
        const host = window.location.host;
        const redirectUrl = `${protocol}//${host}`;

        // Use the explicit Google provider flow
        const url = await enokiFlow.createSigninUrl({
            provider: 'google',
            clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            redirectUrl,
            network: 'testnet'
        });
        window.location.href = url;
    };

    const logout = async () => {
        await enokiFlow.logout();
        setAddress(null);
        disconnect(); // Also disconnect from Dapp Kit
        window.location.reload();
    };

    const handleCallback = async () => {
        try {
            setIsLoading(true);
            await enokiFlow.handleAuthCallback();
            await checkSession();
        } catch (error) {
            console.error('Enoki auth callback failed:', error);
        } finally {
            setIsLoading(false);
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    };

    return (
        <EnokiContext.Provider value={{ address, isLoading, login, logout, handleCallback }}>
            {children}
        </EnokiContext.Provider>
    );
}

export const useEnoki = () => useContext(EnokiContext);
