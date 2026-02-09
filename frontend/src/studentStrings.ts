/**
 * Arabic strings for the student area (RTL).
 * Used by Layout, Header, Sidebar, and student pages.
 */
export const studentStrings = {
  // Shell
  menu: "القائمة",
  platformTitle: "منصة أ/ علي السيد - تعليم الرياضيات",
  logout: "تسجيل الخروج",
  studentGradePlaceholder: "طالب",

  // Sidebar
  dashboard: "لوحة التحكم",
  lectures: "المحاضرات",
  homework: "الواجبات",
  exams: "الامتحانات",
  scores: "الدرجات",
  profile: "الملف الشخصي",

  // Dashboard
  myCourses: "دوراتي التعليمية",
  welcome: (name: string) => `أهلاً بك يا ${name}، تابع تقدمك في مناهجك`,
  progressInCourse: "التقدم في الكورس",
  continueCourse: "استكمال الكورس",
  discoverNewCourses: "استكشف كورسات جديدة",
  discoverSubtext: "أضف المزيد من المواد التعليمية لجدولك الدراسي",
  totalLearningHours: "إجمالي ساعات التعلم",
  completedCourses: (n: number) => `${n} كورسات مكتملة`,
  lessonsRemainingThisWeek: (n: number) => `${n} دروس متبقية هذا الأسبوع`,
  viewCertificates: "عرض الشهادات",
  lessonsCount: (done: number, total: number) => `${done}/${total} درس`,
  lastSession: "آخر حصة",
  couldNotLoadData: "تعذر تحميل بعض بيانات لوحة التحكم.",

  // Dashboard (first-pic design)
  welcomeFamily: "اهلا بيك في بيت العيلة يا بطل",
  lecturesStat: (n: number) => `${n} حصة مسجلة`,
  homeworkStat: (n: number) => `${n} واجبات قيد الحل`,
  examsStat: (n: number) => `${n} امتحان متاح`,
  reportsStat: "تقرير الشهر الحالي",
  mathMasteryTitle: "نسبة إتقان الرياضيات",
  mathMasteryProgressText: "لقد أحرزت تقدماً ملحوظاً في وحدة تفاضل الدوال اللوغاريتمية هذا الأسبوع.",
  currentLevel: "المستوى الحالي: تلميذ متفوق",
  percentFromLastMonth: "+5% عن الشهر الماضي",
  todaysChallenge: "تحدي اليوم",
  todaysChallengeDesc: "حل خمسين مسالة تكمل الدوال المثلثية خلص التحدي و اكسب",
  startChallengeNow: "ابدأ التحدي الان",
  questionForTeacher: "لديك سؤال للمستر ؟",
  messageTeacherDirectly: "يمكنك مراسلة أ/ علي السيد مباشرة",
  readyForExam: "جاهز للاختبار؟",
  completedLessonsThisWeek: "لقد أكملت 100% من دروس هذا الأسبوع. يمكنك الآن خوض الاختبار التدريبي.",
  startExamNow: "ابدأ الاختبار الآن",
  continueStudying: "استكمال المذاكرة",
  defaultUnitName: "الوحدة الرابعة : الهندسة الفراغية",
  startLesson: "بدء الدرس",
  notificationsFromTeacher: "تنبيهات من أ/ علي السيد",
  showDetails: "عرض التفاصيل",
  download: "تحميل",
  addToCalendar: "إضافة للتقويم",
  timeAgoHours: (n: number) => (n <= 1 ? "منذ ساعة" : `منذ ${n} ساعتين`),
  timeAgoYesterday: "أمس",
  timeAgoDays: (n: number) => (n === 2 ? "منذ يومين" : `منذ ${n} أيام`),
  upcomingExamTitle: "موعد الامتحان القادم",
  memoUpdateTitle: "تحديث المذكرة",
  liveBroadcastTitle: "بث مباشر",
  engineerFamilyQuote: "عيلة المهندس اعظم عيلة كده كده.",

  // Lectures
  myLectures: "المحاضرات",
  viewLecture: "عرض المحاضرة",
  enterLesson: "الدخول للدرس",
  scheduled: "مجدول",

  // Lecture detail
  backToLectures: "العودة إلى المحاضرات",
  lessonDescription: "وصف الحصة",
  educationalResources: "المصادر التعليمية",
  comments: "التعليقات",
  startHomework: "ابدأ حل الواجب",
  lectureNotFound: "المحاضرة غير موجودة",
  published: "منشور",
  courseContent: "محتوى الدورة",
  unitOne: (unitName: string) => `الوحدة الأولى: ${unitName}`,
  contactSupport: "تواصل مع الدعم الفني",
  uploadDate: "تاريخ الرفع",
  views: (count: number) => {
    const thousands = count / 1000;
    return thousands >= 1 ? `${thousands.toFixed(1)} ألف مشاهدة` : `${count} مشاهدة`;
  },
  whatYouWillLearn: "ماذا ستتعلم في هذا الدرس؟",
  availableResources: "المصادر التعليمية المتاحة",
  minutes: (duration: number) => {
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    return `${mins}:${secs.toString().padStart(2, '0')} دقيقة`;
  },
  trainingCourses: "الدورات التدريبية",

  // Homework
  myHomework: "الواجبات",
  due: "الموعد النهائي",
  viewHomework: "عرض الواجب",

  // Exams
  myExams: "الامتحانات",
  startExam: "ابدأ الامتحان",
  questionMap: "خريطة الأسئلة",
  solved: "تم الحل",
  remaining: "متبقى",
  endExam: "إنهاء الاختبار",
  next: "التالي",
  previous: "السابق",
  questionOf: (i: number, total: number) => `السؤال ${i} من ${total}`,
  confirmSubmitTitle: "تأكيد تسليم الامتحان",
  confirmSubmitQuestion: "هل أنت متأكد من رغبتك في إنهاء وتسليم الامتحان؟",
  noEditAfterSubmit: "لا يمكنك التعديل بعد التسليم.",
  answerStatus: "حالة الإجابات",
  answeredCount: (done: number, total: number) => `لقد أجبت على ${done} من أصل ${total} سؤالاً`,
  unansweredWarning: (n: number) => `يوجد ${n === 2 ? "سؤالان" : n === 1 ? "سؤال واحد" : `${n} أسئلة`} لم ${n === 1 ? "يتم" : "يتم"} الإجابة عليه${n === 1 ? "" : n === 2 ? "ما" : "م"} بعد.`,
  confirmSubmit: "تأكيد التسليم",
  returnToReview: "عودة للمراجعة",
  savedAutomatically: "تم الحفظ تلقائياً",

  // Scores
  myScores: "تقاريري",
  scoresTitle: "الدرجات",

  // Profile
  myProfile: "الملف الشخصي",
  name: "الاسم",
  email: "البريد الإلكتروني",
  save: "حفظ",

  // Loading
  loading: "جاري التحميل…",
};
