import * as schema from '$lib/schema';
import { drizzle } from 'drizzle-orm/d1';
import type { PageServerLoad } from './$types';
import { desc, eq } from 'drizzle-orm';

export const load: PageServerLoad = async (event) => {
    const db = drizzle(event.platform?.env?.DATABASE!!, { schema });

    const questions = await db.query.questions.findMany({
        with: {
            upvotes: true
        },
        orderBy: desc(schema.questions.id)
    });

    return {
        questions: questions
    };
}
