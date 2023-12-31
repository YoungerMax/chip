import type { RequestEvent } from "@sveltejs/kit";

export async function generateWallet(event: RequestEvent) {
    const response = await fetch("https://learn.circle.com/quickstarts/dev-controlled-wallets/api/playground/wallets", {
        "headers": {
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:120.0) Gecko/20100101 Firefox/120.0",
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.5",
            "Content-Type": "text/plain;charset=UTF-8",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin"
        },
        "body": JSON.stringify({
            "apiKey": event.platform?.env?.CIRCLE_API_KEY!!,
            "entitySecret": event.platform?.env?.CIRCLE_ENTITY_SECRET_HEX,
            "walletSetId": event.platform?.env?.CIRCLE_WALLET_SET,
            "blockchains": "MATIC-MUMBAI",
            "count": 1
        }),
        "method": "POST",
    });

    const data = await response.json();

    return data['response']['data']['wallets'][0];
}
