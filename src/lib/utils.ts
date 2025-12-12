/**
 * Generates a proxied image URL to bypass CORS/COEP restrictions.
 * Uses wsrv.nl which is a free image proxy and resizing service.
 * 
 * @param url The original image URL
 * @param width Optional width to resize to (optimization)
 * @returns The proxied URL with CORS headers
 */
export function getProxiedImageUrl(url: string, width: number = 800): string {
    if (!url) return '';

    // Don't proxy data URLs or local assets
    if (url.startsWith('data:') || url.startsWith('/') || url.startsWith('blob:')) {
        return url;
    }

    // Already proxied?
    if (url.includes('wsrv.nl')) {
        return url;
    }

    // Encode the URL safely
    const encodedUrl = encodeURIComponent(url);

    // Use wsrv.nl with output=webp for better performance and n=-1 to allow all images
    return `https://wsrv.nl/?url=${encodedUrl}&w=${width}&output=webp`;
}
