import { drizzle } from 'drizzle-orm/d1';
import type { Actions } from './$types';
import * as schema from '$lib/schema';
import { error, redirect } from '@sveltejs/kit';
import { generateWallet } from '$lib/wallet';
import { goto } from '$app/navigation';

export const actions = {
    default: async (event) => {
        const form = await event.request.formData();
        const title = form.get('title');

        if (title === null) {
            error(400, { message: 'Missing title' });
        }

        const description = form.get('description');

        if (description === null) {
            error(400, { message: 'Missing description' });
        }

        const user = await event.locals.getSession();

        if (user === null || user.user === undefined) {
            error(401, { message: 'You have to log in to ask a question.' });
        }

        if (!user.user.name) {
            error(400, { message: 'Your user account does not have a name, but needs one.' });
        }
        
        const db = drizzle<typeof schema>(event.platform?.env?.DATABASE!!);

        const wallet = await generateWallet(
            event
        );

        const question = await db.insert(schema.questions).values({
            creation_timestamp: new Date().toUTCString(),
            creator_name: user.user.name,
            creator_image: user.user.image,
            title: title.toString(),
            description: description.toString(),
            chip_recipient_address: wallet['address'],
            chip_wallet_id: wallet['id']
        }).returning();

        throw redirect(307, `/q/${question[0].id}`);

        return {};
    },
} satisfies Actions;