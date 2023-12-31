import * as schema from '$lib/schema';
import { error } from '@sveltejs/kit';
import { and, eq, isNull, ne, desc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/d1';
import type { Actions, PageServerLoad } from './$types';
import { env } from '$env/dynamic/private';

export const load: PageServerLoad = async (event) => {
    const db = drizzle(event.platform?.env?.DATABASE!!, { schema });
    const id = parseInt(event.params.id);

    if (id < 0) {
        error(400, { message: 'Bad ID' });
    }

    const question = await db.query.questions.findFirst({
        where: eq(schema.questions.id, id),
        with: {
            upvotes: true,
            answers: false
        }
    });

    if (!question) {
        return error(404, { message: 'Question does not exist' });
    }

    const answers = await db.query.answers.findMany({
        where: eq(schema.answers.question_id, id),
        with: {
            upvotes: true
        }
    });

    let sorted = answers.sort((a, b) => {
        return b.upvotes.length - a.upvotes.length;
    });

    let selectedAnswerIdx = sorted.findIndex((answer) => answer.id === question.selected_answer_id);
    let selectedAnswer = sorted.splice(selectedAnswerIdx, 1)[0];

    if (selectedAnswer) {
        sorted = [selectedAnswer, ...sorted];
    }

    const response = await fetch(
        `https://api.circle.com/v1/w3s/wallets/${question.chip_wallet_id}/balances?pageSize=1`,
        {
            method: 'GET',
            headers: {
                accept: 'application/json',
                authorization: 'Bearer ' + event.platform?.env?.CIRCLE_API_KEY!!
            }
        }
    );

    const data = await response.json();
    console.log(data);
    console.log(`https://api.circle.com/v1/w3s/wallets/${question.chip_wallet_id}/balances?pageSize=1`,
    {
        method: 'GET',
        headers: {
            accept: 'application/json',
            authorization: 'Bearer ' + event.platform?.env?.CIRCLE_API_KEY!!
        }
    });
    const balance = data['data']['tokenBalances'][0];

    return {
        question: question,
        answers: sorted,
        chipped: {
            symbol: balance['token']['symbol'],
            decimals: balance['token']['decimals'],
            amount: balance['amount'],
        }
    };
}


export const actions = {
    vote: async (event) => {
        const form = await event.request.formData();
        const user = await event.locals.getSession();
        const db = drizzle(event.platform?.env?.DATABASE!!, { schema });

        if (user === null || user.user === undefined) {
            error(401, { message: 'You have to log in to vote.' });
        }

        if (!user.user.name) {
            error(400, { message: 'Your user account does not have a name, but needs one.' });
        }

        let key: string;

        if (form.has('question_id')) {
            key = 'question_id';
        } else if (form.has('answer_id')) {
            key = 'answer_id';
        } else {
            error(400, { message: 'Missing ID' });
        }

        const idString = form.get(key);

        if (idString === null) {
            error(400, { message: 'Missing ID' });
        }

        const id = parseInt(idString.toString());

        if (key === 'question_id') {
            const questionUpvote = await db.query.upvotes.findFirst({
                where: and(
                    eq(schema.upvotes.question_id, id),
                    eq(schema.upvotes.upvoter_name, user.user.name)
                )
            });

            if (questionUpvote) {
                await db.delete(schema.upvotes).where(
                    and(
                        eq(schema.upvotes.question_id, id),
                        eq(schema.upvotes.upvoter_name, user.user.name)
                    )
                );
            } else {
                await db.insert(schema.upvotes).values({
                    question_id: id,
                    upvoter_name: user.user.name
                });
            }
        } else if (key === 'answer_id') {
            const answerUpvote = await db.query.answerUpvotes.findFirst({
                where: and(
                    eq(schema.answerUpvotes.answer_id, id),
                    eq(schema.answerUpvotes.upvoter_name, user.user.name)
                )
            });

            if (answerUpvote) {
                await db.delete(schema.answerUpvotes).where(
                    and(
                        eq(schema.answerUpvotes.answer_id, id),
                        eq(schema.answerUpvotes.upvoter_name, user.user.name)
                    )
                );
            } else {
                await db.insert(schema.answerUpvotes).values({
                    answer_id: id,
                    upvoter_name: user.user.name
                });
            }
        } else {
            error(400, { message: 'Missing ID' });
        }

        return {};
    },
    answer: async (event) => {
        const form = await event.request.formData();
        const id = parseInt(event.params.id);

        if (id < 0) {
            error(400, { message: 'Bad ID' });
        }

        const description = form.get('description');

        if (description === null) {
            error(400, { message: 'Missing description' });
        }

        const address = form.get('address');

        if (address === null) {
            error(400, { message: 'Missing address' });
        }

        const user = await event.locals.getSession();

        if (user === null || user.user === undefined) {
            error(401, { message: 'You have to log in to answer a question.' });
        }

        if (!user.user.name) {
            error(400, { message: 'Your user account does not have a name, but needs one.' });
        }

        const db = drizzle<typeof schema>(event.platform?.env?.DATABASE!!);

        return await db.insert(schema.answers).values({
            creation_timestamp: new Date().toUTCString(),
            creator_name: user.user.name,
            creator_image: user.user.image,
            description: description.toString(),
            question_id: id,
            creator_crypto_address: address
        }).returning();
    },
    answered: async (event) => {
        const form = await event.request.formData();
        const user = await event.locals.getSession();
        const db = drizzle(event.platform?.env?.DATABASE!!, { schema });

        if (user === null || user.user === undefined) {
            error(401, { message: 'You have to log in mark the answer.' });
        }

        if (!user.user.name) {
            error(400, { message: 'Your user account does not have a name, but needs one.' });
        }

        const idString = form.get('answer_id');

        if (idString === null) {
            error(400, { message: 'Missing ID' });
        }

        const id = parseInt(idString.toString());
        const answer = await db.query.answers.findFirst({
            where: eq(schema.answers.id, id),
            with: {
                question: true
            }
        });

        if (!answer) {
            error(404, { message: 'Answer not found' });
        }

        await db.update(schema.questions)
            .set({
                selected_answer_id: id
            })
            .where(
                and(
                    eq(schema.questions.id, answer.question_id),
                    isNull(schema.questions.selected_answer_id),
                    eq(schema.questions.creator_name, user.user.name)
                )
            );

        // get token ids
        const tokenOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + event.platform?.env?.CIRCLE_API_KEY!! }
        };

        const response = await fetch(`https://api.circle.com/v1/w3s/wallets/${answer.question.chip_wallet_id}/balances`, tokenOptions);
        const balances = (await response.json())['data']['tokenBalances'];

        for (let balance of balances) {
            // transfer tokens
            const response = await fetch("https://learn.circle.com/quickstarts/dev-controlled-wallets/api/playground/create-transaction", {
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
                    "destinationAddress": answer.creator_crypto_address,
                    "amount": parseFloat(balance['amount']),
                    "tokenId": balance['token']['id'],
                    "feeLevel": "LOW",
                    "walletId": answer.question.chip_wallet_id,
                    "entitySecret": event.platform?.env?.CIRCLE_ENTITY_SECRET_HEX!!,
                    "apiKey": event.platform?.env?.CIRCLE_API_KEY!!
                }),
                "method": "POST"
            });

            console.log(await response.text());
        }


        return {};
    }
} satisfies Actions;