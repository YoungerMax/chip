import { SvelteKitAuth, type SvelteKitAuthConfig } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import type { Handle } from "@sveltejs/kit";
import { Circle, CircleEnvironments } from "@circle-fin/circle-sdk";

export const handleAuth = SvelteKitAuth(async (event) => {
    return {
        providers: [
            GitHub({
                clientId: event.platform?.env!!.GITHUB_ID,
                clientSecret: event.platform?.env!!.GITHUB_SECRET
            })
        ],
        secret: event.platform?.env!!.AUTH_SECRET,
        trustHost: true
    } satisfies SvelteKitAuthConfig;
}) satisfies Handle;

export const handle = async (event) => {
    // const circle = new Circle(
    //     event.event.platform!!.env!!.CIRCLE_API_KEY,
    //     CircleEnvironments.sandbox // API base url
    // );

    // event.event.locals.circle = circle;

    return await handleAuth(event);
}