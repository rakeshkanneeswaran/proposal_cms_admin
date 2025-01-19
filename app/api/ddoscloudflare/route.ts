import { NextRequest, NextResponse } from 'next/server';

const SECRET_KEY = "0x4AAAAAAAYBk9tjVIKa93z8ZQh3cU2TX9k";
const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const clouflaretoken = body.cloudflaretoken
    if (clouflaretoken) {
        try {
            let formData = new FormData();
            formData.append('secret', SECRET_KEY);
            formData.append('response', clouflaretoken);
            const result = await fetch(url, {
                body: formData,
                method: 'POST',
            });
            console.log(result)
            const challengeSucceeded = (await result.json()).success;
            return NextResponse.json({ status: challengeSucceeded })
        } catch (error) {
            console.log(error)
        }
    }
    return NextResponse.json({ message: "Something went worng" })
}

