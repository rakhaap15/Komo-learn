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
                title: "Check Your Level",
                description: "Answer 60 questions to find out your current English level.",
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
        ]);

        //question
        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 1,
                imageSrc:'/vocab/apple.svg',
                question: 'What is "apple"?',
            },

            {
                id: 2,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 2,
                imageSrc:'/vocab/book.svg',
                question: 'What is "book"?',
            },
            {
                id: 3,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 3,
                imageSrc:'/vocab/dog.svg',
                question: '"Dog" means:....',
            },
            {
                id: 4,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 4,
                imageSrc:'/vocab/water.svg',
                question: '"Water" is:.....',
            },
            {
                id: 5,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 5,
                imageSrc:'/vocab/teacher.svg',
                question: 'Meaning of "teacher":....',
            },
            /*
            {
                id: 6,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 6,
                imageSrc:'/vocab/airport.svg',
                question: '"Airport" is:....',
            },
            {
                id: 7,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 7,
                imageSrc:'/vocab/beautiful.svg',
                question: '"Beautiful" means:....',
            },
            {
                id: 8,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 8,
                imageSrc:'/vocab/hungry.svg',
                question: '"Hungry" means:.....',
            },
            {
                id: 9,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 9,
                imageSrc:'/vocab/efficient.svg',
                question: '"Efficient" means:....',
            },
            {
                id: 10,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 10,
                imageSrc:'/vocab/ancient.svg',
                question: '"Ancient" means:....',
            },
            {
                id: 11,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 11,
                imageSrc:'/vocab/realiable.svg',
                question: '"Reliable" means:....',
            },
            {
                id: 12,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 12,
                imageSrc:'/vocab/complex.svg',
                question: '"Complex" means:....',
            },
            {
                id: 13,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 13,
                imageSrc:'/vocab/rapid.svg',
                question: '"Rapid" means:....',
            },
            {
                id: 14,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 14,
                imageSrc:'/vocab/demand.svg',
                question: '"Demand" means:....',
            },
            {
                id: 15,
                lessonsId: 1, //vocab
                type: "SELECT",
                category: "VOCAB",
                order: 15,
                imageSrc:'/vocab/increase.svg',
                question: '"Increase" means:....',
            },
            {
                id: 16,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 16,
                question: 'She ___ a teacher.',
            },
            {
                id: 17,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 17,
                question: 'I ___ happy.',
            },
            {
                id: 18,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 18,
                question: 'They ___ students.',
            },
            {
                id: 19,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 19,
                question: 'He ___ a car.',
            },
            {
                id: 20,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 20,
                question: 'I ___ to school yesterday.',
            },
            {
                id: 21,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 21,
                question: 'She ___ TV now.',
            },
            {
                id: 22,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 22,
                question: 'We ___ finished homework.',
            },
            {
                id: 23,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 23,
                question: 'He ___ playing football.',
            },
            {
                id: 24,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 24,
                question: 'If I ___ rich, I would travel.',
            },
            {
                id: 25,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 25,
                question: 'She has been ___ for 2 hours.',
            },
            {
                id: 26,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 26,
                question: 'They ___ already left.',
            },
            {
                id: 27,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 27,
                question: 'The book ___ by John.',
            },
            {
                id: 28,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 28,
                question: 'I wish I ___ taller.',
            },
            {
                id: 29,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 29,
                question: 'She ___ here since morning.',
            },
            {
                id: 30,
                lessonsId: 1, //grammar
                type: "ASSIST",
                category: "GRAMMAR",
                order: 30,
                question: 'By next year, I ___ graduated.',
            },

            {
                id: 31,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 31,
                audioSrc:'listening/john.mp3',
                question: 'who is Speaking?',
            },

            {
                id: 32,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 32,
                audioSrc:'listening/she is my sister.mp3',
                question: 'who is She?',
            },

            {
                id: 33,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 33,
                audioSrc:'listening/i like apples.mp3',
                question: 'what does he like?',
            },

            {
                id: 34,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 34,
                audioSrc:'listening/it is raining.mp3',
                question: 'what is happening?',
            },

            {
                id: 35,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 35,
                audioSrc:'listening/i go to school every day.mp3',
                question: 'what does he do?',
            },

            {
                id: 36,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 36,
                audioSrc:'listening/she is cooking rice.mp3',
                question: 'What is she doing?',
            },

            {
                id: 37,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 37,
                audioSrc:'listening/they are playing football.mp3',
                question: 'what are they playing?',
            },

            {
                id: 38,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 38,
                audioSrc:'listening/i wake up at 6 AM.mp3',
                question: 'what time do i wake up?',
            },

            {
                id: 39,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 39,
                audioSrc:'listening/i have been studying for 3 hours.mp3',
                question: 'how long have i been studying?',
            },

            {
                id: 40,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 40,
                audioSrc:'listening/she will arrive tomorrow.mp3',
                question: 'when will she arrive?',
            },

            {
                id: 41,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 41,
                audioSrc:'listening/they were watching movie when i came.mp3',
                question: 'what were they doing?',
            },

            {
                id: 42,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 42,
                audioSrc:'listening/he had finished before i arrived.mp3',
                question: 'did he finish before i came?',
            },

            {
                id: 43,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 43,
                audioSrc:'listening/i am going to travel next month.mp3',
                question: 'what am i going to do next month?',
            },

            {
                id: 44,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 44,
                audioSrc:'listening/she has been working here since 2020.mp3',
                question: 'when did she start working here?',
            },

            {
                id: 45,
                lessonsId: 1, //listening
                type: "INPUT",
                category: "LISTENING",
                order: 45,
                audioSrc:'listening/by 2025, i will have completed mu studies.mp3',
                question: 'what will i finish by 2025?',
            },

            {
                id: 46,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 46,
                passage:'Tom is a 10-year-old boy. He lives in a small house with his parents. Every morning, he wakes up at 6 AM and goes to school. He likes playing football with his friends after school.',
                question: 'Who is tom?',
            },

            {
                id: 47,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 47,
                passage:'Lisa has a cat named Mimi. The cat is white and very cute. Every day, Lisa gives food to Mimi and plays with her in the afternoon.',
                question: 'What animal does Lisa have?',
            },

            {
                id: 48,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 48,
                passage:'John is a student. He goes to school by bus every day. His favorite subject is English because he likes reading stories.',
                question: 'How does John go to school?',
            },

            {
                id: 49,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 49,
                passage:'Today is a sunny day. The sky is blue and the weather is warm. Many people go outside to walk or play.',
                question: 'What is the weather like?',
            },

            {
                id: 50,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 50,
                passage:'Anna is a hardworking student. She reads books every night before sleeping. She believes that reading can improve her knowledge and help her become smarter.',
                question: 'What is Anna’s habit?',
            },

            {
                id: 51,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 51,
                passage:'There is a dog sleeping under the table in the living room. The dog looks very comfortable and does not move even when people walk around.',
                question: 'Where is the dog?',
            },

            {
                id: 52,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 52,
                passage:'Michael works in a hospital as a doctor. Every day, he helps sick people and gives them medicine. He enjoys his job because he likes helping others.',
                question: 'Where does Michael work?',
            },

            {
                id: 53,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 53,
                passage:'Every evening, the family eats dinner together at 7 PM. They talk about their day and share stories while eating.',
                question: 'What time do they eat dinner?',
            },

            {
                id: 54,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 54,
                passage:'Last weekend, John went to the market early in the morning. He bought fruits, vegetables, and some snacks. After that, he went home and cooked lunch for his family.',
                question: 'What did John do at the market?',
            },

            {
                id: 55,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 55,
                passage:'Sarah studied very hard for her final exam. She spent many hours reading books and practicing questions because she wanted to pass with a good score.',
                question: 'Why did Sarah study hard?',
            },

            {
                id: 56,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 56,
                passage:'The company was founded in 1990 and has grown rapidly over the years. Today, it has offices in many countries and employs thousands of workers.',
                question: 'When was the company founded?',
            },

            {
                id: 57,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 57,
                passage:'David left his house early in the morning because he knew there would be heavy traffic. He wanted to arrive at the office on time.',
                question: 'Why did David leave early?',
            },

            {
                id: 58,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 58,
                passage:'Students who study hard and practice regularly usually achieve better results. Success often comes from discipline and consistent effort.',
                question: 'Who will succeed?',
            },

            {
                id: 59,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 59,
                passage:'Before leaving the office, Maria finished all her tasks. She checked her work carefully to make sure there were no mistakes.',
                question: 'What did Maria do first?',
            },

              {
                id: 60,
                lessonsId: 1, //reading
                type: "INPUT",
                category: "READING",
                order: 60,
                passage:'The meeting has been postponed until next week due to unexpected problems. All participants will be informed about the new schedule soon.',
                question: 'What happened to the meeting?',
            },
            */
        ]);

        //answer
        await db.insert(schema.challengeOptions).values([

            //Question 1
            {
                challengeId: 1, 
                correct: true,
                text: "Fruit",
            },
            {
                challengeId: 1,
                correct: false,
                text: "Car",
            },
            {
                challengeId: 1,
                correct: false,
                text: "Animal",
            },
            //Question 2
            {
                challengeId: 2, 
                correct: false,
                text: "Food",
            },
            {
                challengeId: 2,
                correct: true,
                text: "Reading Material",
            },
            {
                challengeId: 2,
                correct: false,
                text: "Drink",
            },

            //Question 3
            {
                challengeId: 3, 
                correct: false,
                text: "Cat",
            },
            {
                challengeId: 3,
                correct: true,
                text: "Animal",
            },
            {
                challengeId: 3,
                correct: false,
                text: "Food",
            },

            //Question 4
            {
                challengeId: 4, 
                correct: false,
                text: "Book",
            },
            {
                challengeId: 4,
                correct: false,
                text: "Chair",
            },
            {
                challengeId: 4,
                correct: true,
                text: "Drink",
            },

            //Question 5
            {
                challengeId: 5, 
                correct: true,
                text: "Person who teaches",
            },
            {
                challengeId: 5,
                correct: false,
                text: "Student",
            },
            {
                challengeId: 5,
                correct: false,
                text: "Driver",
            },
            /*

            //Question 6
            {
                challengeId: 6, 
                correct: false,
                text: "Market",
            },
            {
                challengeId: 6,
                correct: false,
                text: "School",
            },
            {
                challengeId: 6,
                correct: true,
                text: "Place for planes",
            },

            //Question 7
            {
                challengeId: 7, 
                correct: true,
                text: "Nice Looking",
            },
            {
                challengeId: 7,
                correct: false,
                text: "Ugly",
            },
            {
                challengeId: 7,
                correct: false,
                text: "Fast",
            },

            //Question 8
            {
                challengeId: 8, 
                correct: true,
                text: "Want Food",
            },
            {
                challengeId: 8,
                correct: false,
                text: "Sleepy",
            },
            {
                challengeId: 8,
                correct: false,
                text: "Angry",
            },

            //Question 9
            {
                challengeId: 9, 
                correct: false,
                text: "Slow",
            },
            {
                challengeId: 9,
                correct: true,
                text: "Productive with little waste",
            },
            {
                challengeId: 9,
                correct: false,
                text: "Expensive",
            },

             //Question 10
            {
                challengeId: 10, 
                correct: false,
                text: "New",
            },
            {
                challengeId: 10,
                correct: false,
                text: "Modern",
            },
            {
                challengeId: 10,
                correct: true,
                text: "Very Old",
            },

            //Question 11
            {
                challengeId: 11, 
                correct: true,
                text: "Can be trusted",
            },
            {
                challengeId: 11,
                correct: false,
                text: "Very Funny",
            },
            {
                challengeId: 11,
                correct: false,
                text: "Weak",
            },

            //Question 12
            {
                challengeId: 12, 
                correct: false,
                text: "Simple",
            },
            {
                challengeId: 12,
                correct: true,
                text: "Complicated",
            },
            {
                challengeId: 12,
                correct: false,
                text: "Empty",
            },

            //Question 13
            {
                challengeId: 13, 
                correct: true,
                text: "Fast",
            },
            {
                challengeId: 13,
                correct: false,
                text: "Slow",
            },
            {
                challengeId: 13,
                correct: false,
                text: "Heavy",
            },

            //Question 14
            {
                challengeId: 14, 
                correct: true,
                text: "Request Or Need",
            },
            {
                challengeId: 14,
                correct: false,
                text: "Sleep",
            },
            {
                challengeId: 14,
                correct: false,
                text: "Walk",
            },

            //Question 15
            {
                challengeId: 15, 
                correct: false,
                text: "Go down",
            },
            {
                challengeId: 15,
                correct: true,
                text: "Go up",
            },
            {
                challengeId: 15,
                correct: false,
                text: "Stop",
            },

            //Question 16
            {
                challengeId: 16, 
                correct: true,
                text: "is",
            },
            {
                challengeId: 16,
                correct: false,
                text: "are",
            },
            {
                challengeId: 16,
                correct: false,
                text: "am",
            },

            //Question 17
            {
                challengeId: 17, 
                correct: false,
                text: "is",
            },
            {
                challengeId: 17,
                correct: true,
                text: "am",
            },
            {
                challengeId: 17,
                correct: false,
                text: "are",
            },

            //Question 18
            {
                challengeId: 18, 
                correct: false,
                text: "is",
            },
            {
                challengeId: 18,
                correct: true,
                text: "are",
            },
            {
                challengeId: 18,
                correct: false,
                text: "am",
            },

            //Question 19
            {
                challengeId: 19, 
                correct: true,
                text: "has",
            },
            {
                challengeId: 19,
                correct: false,
                text: "have",
            },
            {
                challengeId: 19,
                correct: false,
                text: "is",
            },

            //Question 20
            {
                challengeId: 20, 
                correct: true,
                text: "went",
            },
            {
                challengeId: 20,
                correct: false,
                text: "go",
            },
            {
                challengeId: 20,
                correct: false,
                text: "going",
            },

            //Question 21
            {
                challengeId: 21, 
                correct: true,
                text: "is watching",
            },
            {
                challengeId: 21,
                correct: false,
                text: "watch",
            },
            {
                challengeId: 21,
                correct: false,
                text: "watched",
            },

            //Question 22
            {
                challengeId: 22, 
                correct: false,
                text: "has",
            },
            {
                challengeId: 22,
                correct: true,
                text: "have",
            },
            {
                challengeId: 22,
                correct: false,
                text: "had",
            },

            //Question 23
            {
                challengeId: 23, 
                correct: true,
                text: "is",
            },
            {
                challengeId: 23,
                correct: false,
                text: "are",
            },
            {
                challengeId: 23,
                correct: false,
                text: "am",
            },

            //Question 24
            {
                challengeId: 24, 
                correct: false,
                text: "am",
            },
            {
                challengeId: 24,
                correct: false,
                text: "is",
            },
            {
                challengeId: 24,
                correct: true,
                text: "were",
            },

            //Question 25
            {
                challengeId: 25, 
                correct: false,
                text: "study",
            },
            {
                challengeId: 25,
                correct: true,
                text: "studying",
            },
            {
                challengeId: 25,
                correct: false,
                text: "studied",
            },

            //Question 26
            {
                challengeId: 26, 
                correct: false,
                text: "has",
            },
            {
                challengeId: 26,
                correct: true,
                text: "have",
            },
            {
                challengeId: 26,
                correct: false,
                text: "had",
            },

            //Question 27
            {
                challengeId: 27, 
                correct: true,
                text: "was written",
            },
            {
                challengeId: 27,
                correct: false,
                text: "wrote",
            },
            {
                challengeId: 27,
                correct: false,
                text: "writes",
            },

            //Question 28
            {
                challengeId: 28, 
                correct: false,
                text: "am",
            },
            {
                challengeId: 28,
                correct: true,
                text: "were",
            },
            {
                challengeId: 28,
                correct: false,
                text: "is",
            },

            //Question 29
            {
                challengeId: 29, 
                correct: true,
                text: "has been",
            },
            {
                challengeId: 29,
                correct: false,
                text: "have been",
            },
            {
                challengeId: 29,
                correct: false,
                text: "is",
            },

            //Question 30
            {
                challengeId: 30, 
                correct: true,
                text: "will have",
            },
            {
                challengeId: 30,
                correct: false,
                text: "have",
            },
            {
                challengeId: 30,
                correct: false,
                text: "had",
            },

            //Question 31
            {
                challengeId: 31, 
                correct: true,
                text: "John",
            },
            
            //Question 32
            {
                challengeId: 32, 
                correct: true,
                text: "Sister",
            },

            //Question 33
            {
                challengeId: 33, 
                correct: true,
                text: "Apples",
            },

            //Question 34
            {
                challengeId: 34, 
                correct: true,
                text: "Rain",
            },

            //Question 35
            {
                challengeId: 35, 
                correct: true,
                text: "Go to school",
            },

            //Question 36
            {
                challengeId: 36, 
                correct: true,
                text: "Cooking",
            },

             //Question 37
            {
                challengeId: 37, 
                correct: true,
                text: "Football",
            },

            
             //Question 38
            {
                challengeId: 38, 
                correct: true,
                text: "6 AM",
            },

            
             //Question 39
            {
                challengeId: 39, 
                correct: true,
                text: "3 Hour",
            },

            
             //Question 40
            {
                challengeId: 40, 
                correct: true,
                text: "Tomorrow",
            },

             //Question 41
            {
                challengeId: 41, 
                correct: true,
                text: "Watching movie",
            },

             //Question 42
            {
                challengeId: 42, 
                correct: true,
                text: "Finished earlier",
            },

             //Question 43
            {
                challengeId: 43, 
                correct: true,
                text: "Travel",
            },

             //Question 44
            {
                challengeId: 44, 
                correct: true,
                text: "2020",
            },

             //Question 45
            {
                challengeId: 45, 
                correct: true,
                text: "Completed studies",
            },

            //Question 46
            {
                challengeId: 46, 
                correct: true,
                text: "A boy",
            },

            //Question 47
            {
                challengeId: 47, 
                correct: true,
                text: "A cat",
            },

            //Question 48
            {
                challengeId: 48, 
                correct: true,
                text: "By bus",
            },

            //Question 49
            {
                challengeId: 49, 
                correct: true,
                text: "Sunny",
            },

            //Question 50
            {
                challengeId: 50, 
                correct: true,
                text: "Reading books every night",
            },

            //Question 51
            {
                challengeId: 51, 
                correct: true,
                text: "Under the table",
            },

            //Question 52
            {
                challengeId: 52, 
                correct: true,
                text: "In a hospital",
            },

            //Question 53
            {
                challengeId: 53, 
                correct: true,
                text: "7 PM",
            },

            //Question 54
            {
                challengeId: 54, 
                correct: true,
                text: "Bought fruits and vegetables",
            },

            //Question 55
            {
                challengeId: 55, 
                correct: true,
                text: "To pass the exam",
            },

            //Question 56
            {
                challengeId: 56, 
                correct: true,
                text: "1990",
            },

            //Question 57
            {
                challengeId: 57, 
                correct: true,
                text: "Because of traffic",
            },

            //Question 58
            {
                challengeId: 58, 
                correct: true,
                text: "Students who study hard",
            },

            //Question 59
            {
                challengeId: 59, 
                correct: true,
                text: "Finished her work",
            },

            //Question 60
            {
                challengeId: 60, 
                correct: true,
                text: "It was delayed",
            },
            */
        ]);

        console.log("Seeding finish");
    }   catch (error) {
        console.error(error);
        throw new Error("Failed to seed the database");
    }
};

main();