import { EnokiFlow } from '@mysten/enoki';

export const ENOKI_PUBLIC_KEY = import.meta.env.VITE_ENOKI_PUBLIC_KEY || 'enoki_public_c6930169d6800d51a67f59aff1345b40';

export const enokiFlow = new EnokiFlow({
    apiKey: ENOKI_PUBLIC_KEY,
});

/**
 * Helper to get the current authenticated address or null
 */
export async function getEnokiAddress(): Promise<string | null> {
    const session = await enokiFlow.getSession();
    return session ? session.address : null;
}
