import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const str = searchParams.get('str');

    if (!type || !str) {
        return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    const apiBase = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
    const targetUrl = `${apiBase}/hardware/${type}?search=${encodeURIComponent(str)}`;
    
    // ЛОГ ДЛЯ ТЕРМИНАЛА (проверь его, когда упадет ошибка)
    console.log(`>>> Proxying request to: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'X-Requested-With': 'XMLHttpRequest',
                'Referer': 'https://cpu-compare.com/',
            },
            cache: 'no-store' // Чтобы не тянуть старые ошибки из кэша
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`>>> Target server returned ${response.status}: ${errorText}`);
            return NextResponse.json({ error: 'Target returned error', status: response.status }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        console.error(">>> Proxy Error:", error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}