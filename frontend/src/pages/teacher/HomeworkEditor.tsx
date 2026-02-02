import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calculator,
  ArrowRight,
  Plus,
  FileText,
  ClipboardCheck,
  RotateCcw,
  CheckCircle,
  Download,
} from "lucide-react";

interface Question {
  id: number;
  type: "mcq" | "essay";
  text: string;
  options?: string[];
  correctAnswer?: number;
  essayAnswer?: string;
}

const CreateHomework = () => {
  const [assignmentType, setAssignmentType] = useState<
    "assignment" | "homework" | "exam"
  >("assignment");
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 1,
      type: "mcq",
      text: "",
      options: ["إجابة واحد", "إجابة اتنين", "إجابة تلاتة", "إجابة أربعه"],
      correctAnswer: 0,
    },
  ]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [submissionDate, setSubmissionDate] = useState("");
  const [lessonLink, setLessonLink] = useState("");

  const addQuestion = (type: "mcq" | "essay") => {
    const newQuestion: Question = {
      id: questions.length + 1,
      type,
      text: "",
      ...(type === "mcq"
        ? {
            options: [
              "إجابة واحد",
              "إجابة اتنين",
              "إجابة تلاتة",
              "إجابة أربعه",
            ],
            correctAnswer: 0,
          }
        : {
            essayAnswer: "",
          }),
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id: number, updates: Partial<Question>) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
    );
  };

  const resetQuestions = () => {
    setQuestions([
      {
        id: 1,
        type: "mcq",
        text: "",
        options: ["إجابة واحد", "إجابة اتنين", "إجابة تلاتة", "إجابة أربعه"],
        correctAnswer: 0,
      },
    ]);
  };

  const mcqCount = questions.filter((q) => q.type === "mcq").length;
  const essayCount = questions.filter((q) => q.type === "essay").length;

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Calculator className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">منصة التعليم الذكي</span>
          </div>

          {/* Navigation */}
          <nav className="flex items-center gap-6">
            <Link
              to="/teacher/dashboard"
              className="text-muted-foreground hover:text-primary"
            >
              الرئيسية
            </Link>
            <Link
              to="/teacher/homework/create"
              className="text-primary font-medium"
            >
              الواجبات
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary">
              الطلاب
            </Link>
            <Link to="#" className="text-muted-foreground hover:text-primary">
              التقارير
            </Link>
          </nav>

          {/* Profile */}
          <div className="h-10 w-10 rounded-full bg-muted" />
        </div>
      </header>

      <main className="container py-8">
        {/* Assignment Type Tabs */}
        <div className="mb-8 flex justify-center gap-4">
          <Button
            size="lg"
            variant={assignmentType === "assignment" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setAssignmentType("assignment")}
          >
            <Plus className="h-5 w-5" />
            إضافة تكليف
          </Button>
          <Button
            size="lg"
            variant={assignmentType === "homework" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setAssignmentType("homework")}
          >
            <FileText className="h-5 w-5" />
            إنشاء واجب
          </Button>
          <Button
            size="lg"
            variant={assignmentType === "exam" ? "default" : "outline"}
            className="gap-2"
            onClick={() => setAssignmentType("exam")}
          >
            <ClipboardCheck className="h-5 w-5" />
            إنشاء امتحان
          </Button>
        </div>

        {/* Page Title */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              انشاء واجب جديد
            </h1>
            <p className="text-primary">
              قم بتعبئة تفاصيل الواجب و اضافة الاسئلة لطلابك
            </p>
          </div>
          <Button variant="outline" className="gap-2" asChild>
            <Link to="/teacher/dashboard">
              <ArrowRight className="h-4 w-4" />
              رجوع للحصة
            </Link>
          </Button>
        </div>

        {/* General Info Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                i
              </div>
              معلومات الواجب العامة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>تاريخ التسليم النهائي</Label>
                <Input
                  type="date"
                  value={submissionDate}
                  onChange={(e) => setSubmissionDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>تاريخ التسليم النهائي</Label>
                <Input type="date" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Label>رابط الدرس المرتبط بالواجب</Label>
              <Input
                placeholder="أدخل رابط الدرس..."
                value={lessonLink}
                onChange={(e) => setLessonLink(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Questions Builder */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">بناء الاسئلة</h2>
          <Badge variant="secondary">إجمالي الأسئلة : {questions.length}</Badge>
        </div>

        {/* Questions */}
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id}>
              {/* Question Type Toggle */}
              <div className="mb-4 flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={resetQuestions}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Tabs
                  value={question.type}
                  onValueChange={(v) =>
                    updateQuestion(question.id, { type: v as "mcq" | "essay" })
                  }
                >
                  <TabsList>
                    <TabsTrigger value="essay" className="gap-2">
                      <FileText className="h-4 w-4" />
                      سؤال مقالي
                    </TabsTrigger>
                    <TabsTrigger value="mcq" className="gap-2">
                      سؤال اختياري
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Question Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                      {index + 1}
                    </div>
                    السؤال الاول
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {question.type === "mcq" ? (
                    <>
                      <Input
                        placeholder="اكتب السؤال ...."
                        className="mb-4"
                        value={question.text}
                        onChange={(e) =>
                          updateQuestion(question.id, { text: e.target.value })
                        }
                      />
                      <div className="grid grid-cols-4 gap-3">
                        {question.options?.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`flex items-center gap-2 rounded-lg border p-3 cursor-pointer transition-colors ${
                              question.correctAnswer === optIndex
                                ? "border-success bg-success/10"
                                : "hover:border-primary"
                            }`}
                            onClick={() =>
                              updateQuestion(question.id, {
                                correctAnswer: optIndex,
                              })
                            }
                          >
                            <span className="flex-1 text-sm">{option}</span>
                            {question.correctAnswer === optIndex && (
                              <CheckCircle className="h-4 w-4 text-success" />
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 space-y-2">
                        <Label>نص السؤال ؟</Label>
                        <Input
                          placeholder="اكتب الاجابة ...."
                          value={question.text}
                          onChange={(e) =>
                            updateQuestion(question.id, {
                              text: e.target.value,
                            })
                          }
                        />
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Correct Answer Card for MCQ */}
              {question.type === "mcq" && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </div>
                      السؤال الاول
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      الاجابة الصحيحة
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-4 gap-3">
                      {question.options?.map((option, optIndex) => (
                        <div
                          key={optIndex}
                          className={`flex items-center gap-2 rounded-lg border p-3 ${
                            question.correctAnswer === optIndex
                              ? "border-success bg-success/10"
                              : ""
                          }`}
                        >
                          <span className="flex-1 text-sm">{option}</span>
                          {question.correctAnswer === optIndex && (
                            <CheckCircle className="h-4 w-4 text-success" />
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Essay Answer Card */}
              {question.type === "essay" && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                        {index + 1}
                      </div>
                      السؤال الاول
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      الاجابة الصحيحة
                    </p>
                  </CardHeader>
                  <CardContent>
                    <Input
                      placeholder="تترك للمعلم وضع الدرجة"
                      disabled
                      className="bg-muted"
                    />
                  </CardContent>
                </Card>
              )}
            </div>
          ))}
        </div>

        {/* Add Question Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <Button variant="outline" onClick={() => addQuestion("essay")}>
            + إضافة سؤال مقالي
          </Button>
          <Button variant="outline" onClick={() => addQuestion("mcq")}>
            + إضافة سؤال اختياري
          </Button>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-center">
          <Button
            size="lg"
            className="gap-2 px-12"
            onClick={() => setShowConfirmDialog(true)}
          >
            <Download className="h-5 w-5" />
            التكليف
          </Button>
        </div>
      </main>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-xl">
              تأكيد حفظ التكليف
            </DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="mb-6 text-muted-foreground">
              هل أنت متأكد من رغبتك في إنهاء حفظ التكليف؟
            </p>

            <Card className="mx-auto max-w-xs">
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span className="text-sm">حالة الأسئلة</span>
                </div>
                <div className="flex gap-4 text-sm">
                  <span>
                    الأسئلة المقالي{" "}
                    <strong className="text-primary">{essayCount}</strong>
                  </span>
                  <span>
                    الاختياري{" "}
                    <strong className="text-primary">{mcqCount}</strong>
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="flex-row gap-3">
            <Button
              variant="outline"
              className="flex-1 gap-2"
              onClick={() => setShowConfirmDialog(false)}
            >
              <ArrowRight className="h-4 w-4" />
              لتعديل الأسئلة
            </Button>
            <Button
              className="flex-1 gap-2 bg-success hover:bg-success/90"
              onClick={() => {
                setShowConfirmDialog(false);
                // Handle save
              }}
            >
              <CheckCircle className="h-4 w-4" />
              تأكيد حفظ الأسئلة
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateHomework;
