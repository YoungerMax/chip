import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const questions = sqliteTable('questions', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    title: text('title').notNull().unique(),
    creator_name: text('creator_name').notNull(),  // TODO: bad way to do this, should have user table with IDs
    creator_image: text('creator_image'),
    creation_timestamp: text('creation_timestamp').notNull(),
    description: text('description').notNull(),
    selected_answer_id: integer('selected_answer_id').references(() => answers.id),
    chip_recipient_address: text('chip_recipient_address').notNull().default(''),
    chip_wallet_id: text('chip_wallet_id').notNull().default('')
});

export const questionsRelations = relations(questions, ({ many }) => ({
    upvotes: many(upvotes),
    answers: many(answers)
}));

export const upvotes = sqliteTable('upvotes', {
    upvoter_name: text('upvoter_name').notNull(),  // TODO: bad way to do this, should have user table with IDs
    question_id: integer('question_id').notNull().references(() => questions.id)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.question_id, table.upvoter_name] })
    }
});

export const upvotesRelations = relations(upvotes, ({ one }) => ({
    question: one(questions, {
        fields: [upvotes.question_id],
        references: [questions.id],
    }),
}));



// ANSWERS
export const answers = sqliteTable('answers', {
    id: integer('id').primaryKey({ autoIncrement: true }),
    creator_name: text('creator_name').notNull(),  // TODO: bad way to do this, should have user table with IDs
    creator_image: text('creator_image'),
    creation_timestamp: text('creation_timestamp').notNull(),
    description: text('description').notNull(),
    question_id: integer('question_id').references(() => questions.id),
    creator_crypto_address: text('creator_crypto_address').notNull().default('')
});

export const answersRelations = relations(answers, ({ many, one }) => ({
    upvotes: many(answerUpvotes),
    question: one(questions, {
        fields: [answers.question_id],
        references: [questions.id]
    })
}));

export const answerUpvotes = sqliteTable('answer_upvotes', {
    upvoter_name: text('upvoter_name').notNull(),  // TODO: bad way to do this, should have user table with IDs
    answer_id: integer('answer_id').notNull().references(() => answers.id)
}, (table) => {
    return {
        pk: primaryKey({ columns: [table.answer_id, table.upvoter_name] })
    }
});

export const answerUpvotesRelations = relations(answerUpvotes, ({ one }) => ({
    answer: one(answers, {
        fields: [answerUpvotes.answer_id],
        references: [answers.id],
    }),
}));