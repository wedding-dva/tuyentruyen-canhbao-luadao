export async function onRequest(context) {
    const { searchParams } = new URL(context.request.url);
    const q = searchParams.get('q') || '';
    
    if (!q) {
        return new Response('Missing text query parameter "q"', { status: 400 });
    }

    const encoded = encodeURIComponent(q);
    const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encoded}`;

    try {
        const googleRes = await fetch(googleTtsUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
                'Accept': '*/*'
            }
        });

        if (!googleRes.ok) {
            return new Response(`Google TTS upstream error: ${googleRes.status}`, { 
                status: googleRes.status,
                headers: { 'Access-Control-Allow-Origin': '*' }
            });
        }

        return new Response(googleRes.body, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Cache-Control': 'public, max-age=86400'
            }
        });
    } catch (error) {
        return new Response(`TTS Proxy Internal Error: ${error.message}`, { 
            status: 500,
            headers: { 'Access-Control-Allow-Origin': '*' }
        });
    }
}
