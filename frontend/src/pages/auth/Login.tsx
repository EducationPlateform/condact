import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  Users,
  LogIn,
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/useToast";

const Login = () => {
  const [userType, setUserType] = useState<"teacher" | "student">("teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const user = await login(email, password, rememberMe);
      navigate(user.role === "teacher" ? "/teacher" : "/student");
    } catch (error: any) {
      toast({
        title: "فشل تسجيل الدخول",
        description: error.response?.data?.message || "تأكد من صحة البيانات",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-row-reverse min-h-screen font-notoSansArabic">
      {/* Left Panel - Illustration & Features */}
      <div className="hidden w-1/2 bg-gradient-to-br from-[#E0F2FE] via-[#F0FDF4] to-[#F1F5F9] lg:flex lg:flex-col lg:items-center lg:justify-center p-12">
        <div className="max-w-xl text-center">
          {/* Engineer Image Card */}
          <div className="relative mx-auto mb-12 h-[500px] w-full max-w-[400px]">
            <div className="absolute inset-0 rounded-[40px] bg-white shadow-2xl p-4 overflow-hidden transform rotate-2">
              <div className="h-full w-full rounded-[32px] overflow-hidden bg-gray-100 flex items-center justify-center -rotate-2">
                <img
                  src="/modern_engineer.png"
                  alt="المهندس"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            {/* Soft Shadow behind */}
            <div className="absolute -inset-4 z-[-1] rounded-[60px] bg-primary/5 blur-3xl opacity-50" />
          </div>

          <h2 className="mb-4 text-4xl font-extrabold text-[#1E293B] leading-tight">
            مستقبل التعليم الرقمي يبدأ هنا
          </h2>
          <p className="mb-12 text-lg text-slate-500 max-w-md mx-auto">
            منصة تعليمية متكاملة تجمع المعلمين والطلاب في بيئة تفاعلية حديثة وسهلة الاستخدام.
          </p>

          {/* Feature Quick Stats/Cards */}
          <div className="grid grid-cols-2 gap-6 w-full max-w-lg mx-auto">
            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white/70 backdrop-blur-md p-6 border border-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-blue-50">
                <GraduationCap className="h-7 w-7 text-blue-500" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">للطلاب</h4>
              <p className="text-sm text-slate-500">وصول سهل للدروس</p>
            </div>
            <div className="flex flex-col items-center justify-center rounded-[32px] bg-white/70 backdrop-blur-md p-6 border border-white shadow-sm hover:shadow-md transition-shadow">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-3xl bg-emerald-50">
                <Users className="h-7 w-7 text-emerald-500" />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">للمعلمين</h4>
              <p className="text-sm text-slate-500">أدوات إدارة متطورة</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col justify-between p-8 lg:w-1/2 lg:p-16 bg-white overflow-y-auto">
        <div className="mx-auto w-full max-w-md lg:max-w-lg">
          {/* User Type Tabs */}
          <div className="mb-12 flex justify-center">
            <Tabs
              value={userType}
              onValueChange={(v) => setUserType(v as "teacher" | "student")}
              className="w-full max-w-[280px]"
            >
              <TabsList className="grid w-full grid-cols-2 h-14 rounded-2xl bg-slate-50 p-1 border border-slate-100">
                <TabsTrigger
                  value="teacher"
                  className="rounded-xl text-md font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  معلم
                </TabsTrigger>
                <TabsTrigger
                  value="student"
                  className="rounded-xl text-md font-medium data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-sm"
                >
                  طالب
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* New Branding Header from Mockup */}
          <div className="mb-6 flex items-center justify-center gap-2">
            <img src="/logo.png" alt="المهندس" className="h-20 w-auto object-contain" />
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">منصة المهندس</h3>
          </div>

          {/* Welcome Message */}
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">
              {userType === "teacher" ? "أهلاً بك يا معلم" : "أهلاً بك يا طالب"}
            </h1>
            <p className="text-slate-500 text-lg">
              {userType === "teacher"
                ? "سجل دخولك لمتابعة رحلة الطلاب"
                : "سجل دخولك لمتابعة دروسك"}
            </p>
          </div>

          {/* Simple Direct "Register" if needed? Mockup shows a "Sign In" button top-right-ish or similar. 
              Actually mockup shows a button with text "تسجيل الدخول" in a light blue variant at the top? 
              Wait, No, it looks like a secondary registration button. 
          */}
          <Link
            to="/register"
            className="mb-8 flex justify-center py-3 bg-slate-50 rounded-2xl border border-slate-100 text-primary font-bold transition-colors hover:bg-slate-100"
          >
            تسجيل حساب جديد
          </Link>

          {/* Social Login */}
          <div className="mb-8 grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-14 rounded-2xl border-slate-200 gap-3 text-slate-600 font-bold">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              جوجل
            </Button>
            <Button variant="outline" className="h-14 rounded-2xl border-slate-200 gap-3 text-slate-600 font-bold">
              <svg className="h-6 w-6" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              مايكروسوفت
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-8 text-center">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <span className="relative bg-white px-4 text-sm font-medium text-slate-400">أو عبر البريد</span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-slate-700 font-bold pr-1">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50 pr-12 text-lg focus:bg-white transition-all shadow-sm"
                  dir="ltr"
                />
                <Mail className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 font-bold pr-1">كلمة المرور</Label>
                <Link to="/forgot-password" title="نسيت كلمة المرور؟" className="text-sm font-bold text-primary hover:underline">
                  نسيت كلمة المرور؟
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-16 rounded-2xl border-slate-100 bg-slate-50 px-12 text-lg focus:bg-white transition-all shadow-sm"
                  dir="ltr"
                />
                <Lock className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pr-1">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="h-5 w-5 rounded-md border-slate-300"
              />
              <Label htmlFor="remember" className="text-md font-medium text-slate-600">تذكرني على هذا الجهاز</Label>
            </div>

            <Button type="submit" className="h-16 w-full rounded-2xl text-xl font-bold bg-[#3b82f6] hover:bg-blue-600 shadow-xl shadow-blue-200 transition-all gap-3" disabled={isSubmitting}>
              {isSubmitting ? "جاري التحميل..." : "تسجيل الدخول"}
              {!isSubmitting && <LogIn className="h-6 w-6 rotate-180" />}
            </Button>
          </form>
        </div>

        {/* Footer Links (Fixed Bottom) */}
        <div className="mt-12 flex justify-center gap-8 text-sm font-medium text-slate-400">
          <Link to="/terms" className="hover:text-primary transition-colors">الشروط والأحكام</Link>
          <Link to="/privacy" className="hover:text-primary transition-colors">سياسة الخصوصية</Link>
          <Link to="/help" className="hover:text-primary transition-colors">مركز المساعدة</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
