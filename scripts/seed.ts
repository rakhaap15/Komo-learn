import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);

const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.userSubscription);

        //courses
        await db.insert(schema.courses).values([
            {
                id:1,
                title: "English",
                imageSrc: "/gb flag.svg"
            },
            {
                id:2,
                title: "Sign Language",
                imageSrc: "/wh.svg"
            },
            {
                id:3,
                title: "Brazil",
                imageSrc: "/br flag.svg"
            },
            {
                id:4,
                title: "Indonesia",
                imageSrc: "/id flag.svg"
            },
        ]);

        //units
        await db.insert(schema.units).values([
            {
                id: 1,
                courseId: 1, //English
                title: "Unit 1",
                description: "Learn the basics of English",
                order: 1,
            }
        ]);

        //units
        await db.insert(schema.lessons).values([
            {
                id: 1,
                unitId: 1, //unit 1 (learn basic eng)
                order: 1,
                title: "Nouns",
            },
             {
                id: 2,
                unitId: 1, //unit 1 (learn basic eng)
                order: 2,
                title: "Verbs",
            },
            {
                id: 3,
                unitId: 1, //unit 1 (learn basic eng)
                order: 3,
                title: "Verbs",
            },
            {
                id: 4,
                unitId: 1, //unit 1 (learn basic eng)
                order: 4,
                title: "Verbs",
            },
            {
                id: 5,
                unitId: 1, //unit 1 (learn basic eng)
                order: 5,
                title: "Verbs",
            },
        ]);

        //question
        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonsId: 1, //nouns
                type: "SELECT",
                order: 1,
                question: 'Mana di bawah ini kata yang Menunjukan "Laki-Laki"?',
            },
            {
                id: 2,
                lessonsId: 1, //nouns
                type: "ASSIST",
                order: 2,
                question: '"Laki-Laki"',
            },
            {
                id: 3,
                lessonsId: 1, //nouns
                type: "SELECT",
                order: 3,
                question: 'Mana di bawah ini kata yang Menunjukan "Perempuan"?',
            },
        ]);

        //answer
        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 1, //Mana di bawah ini kata yang Menunjukan "Laki-Laki"
                imageSrc: "/man.svg",
                correct: true,
                text: "Man",
                audioSrc: "/eng_man.mp3"
            },
            {
                challengeId: 1,
                imageSrc: "/woman.svg",
                correct: false,
                text: "Woman",
                audioSrc: "/eng_woman.mp3"
            },
            {
                challengeId: 1,
                imageSrc: "/robot.svg",
                correct: false,
                text: "Robot",
                audioSrc: "/eng_robot.mp3"
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 2, //"Laki-Laki"
                correct: true,
                text: "Man",
                audioSrc: "/eng_man.mp3"
            },
            {
                challengeId: 2,
                correct: false,
                text: "Woman",
                audioSrc: "/eng_woman.mp3"
            },
            {
                challengeId: 2,
                correct: false,
                text: "Robot",
                audioSrc: "/eng_robot.mp3"
            },
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                challengeId: 3, //'Mana di bawah ini kata yang Menunjukan "Perempuan"?'
                imageSrc: "/man.svg",
                correct: false,
                text: "Man",
                audioSrc: "/eng_man.mp3"
            },
            {
                challengeId: 3,
                imageSrc: "/woman.svg",
                correct: true,
                text: "Woman",
                audioSrc: "/eng_woman.mp3"
            },
            {
                challengeId: 3,
                imageSrc: "/robot.svg",
                correct: false,
                text: "Robot",
                audioSrc: "/eng_robot.mp3"
            },
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonsId: 2, //verbs
                type: "SELECT",
                order: 1,
                question: 'Mana di bawah ini kata yang Menunjukan "Laki-Laki"?',
            },
            {
                id: 5,
                lessonsId: 2, //verbs
                type: "ASSIST",
                order: 2,
                question: '"Laki-Laki"',
            },
            {
                id: 6,
                lessonsId: 2, //verbs
                type: "SELECT",
                order: 3,
                question: 'Mana di bawah ini kata yang Menunjukan "Perempuan"?',
            },
        ]);


        console.log("Seeding finish");
    }   catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();