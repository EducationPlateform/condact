import { Exam } from "@/types/api";

export const createDummyExam = (): Exam => ({
    id: "dummy-exam-1",
    lectureId: "dummy-lecture",
    title: "اختبار الرياضيات الاول",
    description: "اختبار تجريبي للرياضيات",
    questions: [
        { question: "1+1= ؟", type: "multiple-choice", options: ["1", "2", "3", "4"], correctAnswer: "2", points: 5 },
        { question: "2×3= ؟", type: "multiple-choice", options: ["4", "5", "6", "7"], correctAnswer: "6", points: 5 },
        { question: "10-5= ؟", type: "multiple-choice", options: ["3", "4", "5", "6"], correctAnswer: "5", points: 5 },
        { question: "8÷2= ؟", type: "multiple-choice", options: ["2", "3", "4", "5"], correctAnswer: "4", points: 5 },
        { question: "3²= ؟", type: "multiple-choice", options: ["6", "9", "12", "15"], correctAnswer: "9", points: 5 },
        { question: "√16= ؟", type: "multiple-choice", options: ["2", "3", "4", "5"], correctAnswer: "4", points: 5 },
        { question: "7+8= ؟", type: "multiple-choice", options: ["13", "14", "15", "16"], correctAnswer: "15", points: 5 },
        { question: "9×2= ؟", type: "multiple-choice", options: ["16", "17", "18", "19"], correctAnswer: "18", points: 5 },
        { question: "20-7= ؟", type: "multiple-choice", options: ["11", "12", "13", "14"], correctAnswer: "13", points: 5 },
        { question: "15÷3= ؟", type: "multiple-choice", options: ["3", "4", "5", "6"], correctAnswer: "5", points: 5 },
        { question: "4²= ؟", type: "multiple-choice", options: ["8", "12", "16", "20"], correctAnswer: "16", points: 5 },
        { question: "√25= ؟", type: "multiple-choice", options: ["3", "4", "5", "6"], correctAnswer: "5", points: 5 },
        { question: "12+9= ؟", type: "multiple-choice", options: ["19", "20", "21", "22"], correctAnswer: "21", points: 5 },
        { question: "6×4= ؟", type: "multiple-choice", options: ["20", "22", "24", "26"], correctAnswer: "24", points: 5 },
        { question: "25-10= ؟", type: "multiple-choice", options: ["13", "14", "15", "16"], correctAnswer: "15", points: 5 },
        { question: "18÷2= ؟", type: "multiple-choice", options: ["7", "8", "9", "10"], correctAnswer: "9", points: 5 },
        { question: "5²= ؟", type: "multiple-choice", options: ["20", "25", "30", "35"], correctAnswer: "25", points: 5 },
        { question: "√36= ؟", type: "multiple-choice", options: ["4", "5", "6", "7"], correctAnswer: "6", points: 5 },
        { question: "11+12= ؟", type: "multiple-choice", options: ["21", "22", "23", "24"], correctAnswer: "23", points: 5 },
        { question: "7×3= ؟", type: "multiple-choice", options: ["19", "20", "21", "22"], correctAnswer: "21", points: 5 },
    ],
    maxScore: 100,
    timeLimit: 30, // minutes
    isActive: true,
    createdAt: new Date().toISOString(),
});
