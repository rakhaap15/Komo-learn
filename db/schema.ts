import { relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text, timestamp, } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull(),
});

export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(), //unit 1
    description: text("description").notNull(), //learn basic of english
    courseId: integer("course_id").references(() => courses.id, { onDelete: "cascade"  }).notNull(),
    order: integer("order").notNull(),
});

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseId],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    unitId: integer("unit_id").references(() => units.id, { onDelete: "cascade" }).notNull(),
    order: integer("order").notNull(),
});

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitId],
        references: [units.id],
    }),
    challenges: many(challenges),
}));

export const challengeCategoryEnum = pgEnum("category", [
  "VOCAB",
  "LISTENING",
  "READING",
  "GRAMMAR",
]);

export const challengesEnum = pgEnum("type", ["SELECT", "ASSIST","INPUT"]); //TODO: Merangkai

export const challenges = pgTable("challenges", {
    id: serial("id").primaryKey(),
    lessonsId: integer("lesson_id").references(() => lessons.id, { onDelete: "cascade" }).notNull(),
    type: challengesEnum("type").notNull(),
    category: challengeCategoryEnum("category").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
    passage: text("passage"),
    question: text("question").notNull(),
    order: integer("order").notNull(),
});

export const challengesRelations = relations(challenges, ({ one, many }) => 
    ({
        lessons: one(lessons, {
            fields: [challenges. lessonsId],
            references: [lessons.id],
        }),
        challengeOptions: many(challengeOptions),
        challengeProgress: many(challengeProgress),
}));

export const challengeOptions = pgTable("challenge_options", {
    id: serial("id").primaryKey(),
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    text: text("text").notNull(),
    correct: boolean("correct").notNull(),
    imageSrc: text("image_src"),
    audioSrc: text("audio_src"),
});

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => 
    ({
        challenge: one(challenges, {
            fields: [challengeOptions. challengeId],
            references: [challenges.id],
        }),
}));

export const challengeProgress = pgTable("challenge_progress", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull(), 
    challengeId: integer("challenge_id").references(() => challenges.id, { onDelete: "cascade" }).notNull(),
    completed: boolean("completed").notNull().default(false),
});

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => 
    ({
        challenge: one(challenges, {
            fields: [challengeProgress. challengeId],
            references: [challenges.id],
        }),
}));

export const userProgress = pgTable("user_progress", {
    userId: text("user_id").primaryKey(),
    userName: text("user_name").notNull().default("User"),
    userImageSrc: text("user_image_src").notNull().default("/komo mascots.svg"),
    activeCourseId: integer("active_course_id").references(() => courses.
    id, { onDelete: "cascade" }),
    hearts: integer("hearts").notNull().default(2),
    points: integer("points").notNull().default(0),
});

export const userProgressRelations = relations(userProgress, ({ one }) => 
({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));

export const userSubscription = pgTable("user_subscription", {
    id: serial("id").primaryKey(),
    userId: text("user_id").notNull().unique(),
    stripeCustomerId: text("stripe_customer_id").notNull().unique(),
    stripeSubscriptionId: text("stripe_subscription_id").notNull().unique(),
    stripePriceId: text("stripe_price_id").notNull(),
    stripeCurrentPeriodEnd: timestamp("stripe_current_period_end").notNull(),
});

export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  score: integer("score").notNull(),
  timeSpent: integer("time_spent").notNull(),
  correctCount: integer("correct_count").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  level: text("level").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const questionResults = pgTable("quest_results", {
  id: serial("id").primaryKey(),
  testResultId: integer("test_result_id").notNull(),
  questionId: integer("question_id").notNull(),
  timeSpent: integer("time_spent").notNull(),
  isCorrect: boolean("is_correct").notNull(),
});