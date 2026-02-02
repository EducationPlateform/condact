import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calculator,
  Eye,
  EyeOff,
  Mail,
  Lock,
  GraduationCap,
  Users,
  ArrowLeft,
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
      await login(email, password);
      // Navigate is handled by App.tsx redirect or we can do it here
      navigate("/");
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
    <div className="flex min-h-screen">
      {/* Left Panel - Info */}
      <div className="hidden w-1/2 bg-gradient-to-b from-primary/5 to-primary/10 lg:flex lg:flex-col lg:items-center lg:justify-center lg:p-12">
        <div className="max-w-md text-center">
          {/* Engineer Image */}
          <div className="relative mx-auto mb-8 h-80 w-80">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/20 to-primary/5 border-4 border-primary/20" />
            <div className="absolute inset-4 rounded-xl bg-white flex items-center justify-center p-6 shadow-inner">
              <img 
                src="/logo.png" 
                alt="المهندس" 
                className="h-full w-full object-contain"
              />
            </div>
            {/* Decorative corners */}
            <div className="absolute -top-2 -right-2 h-8 w-8 border-r-4 border-t-4 border-primary rounded-tr-lg" />
            <div className="absolute -bottom-2 -left-2 h-8 w-8 border-l-4 border-b-4 border-primary rounded-bl-lg" />
          </div>

          <h2 className="mb-4 text-2xl font-bold text-foreground">
            مستقبل التعليم الرقمي يبدأ هنا
          </h2>
          <p className="mb-8 text-muted-foreground">
            منصة تعليمية متكاملة تجمع المعلمين والطلاب في بيئة تفاعلية حديثة
            وسهلة الاستخدام.
          </p>

          {/* Feature Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="border-primary/20">
              <CardContent className="flex flex-col items-center p-4">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h4 className="font-semibold text-foreground">للطلاب</h4>
                <p className="text-xs text-muted-foreground">وصول سهل للدروس</p>
              </CardContent>
            </Card>
            <Card className="border-success/20">
              <CardContent className="flex flex-col items-center p-4">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <h4 className="font-semibold text-foreground">للمعلمين</h4>
                <p className="text-xs text-muted-foreground">
                  أدوات إدارة متطورة
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex w-full flex-col justify-between p-6 lg:w-1/2 lg:p-12">
        {/* User Type Tabs */}
        <div className="mb-8 flex justify-center">
          <Tabs
            value={userType}
            onValueChange={(v) => setUserType(v as "teacher" | "student")}
          >
            <TabsList className="grid w-64 grid-cols-2">
              <TabsTrigger value="teacher">معلم</TabsTrigger>
              <TabsTrigger value="student">طالب</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Login Form */}
        <div className="mx-auto w-full max-w-md">
          {/* Logo */}
          <div className="mb-6 flex flex-col items-center justify-center gap-2">
            <img 
              src="/logo.png" 
              alt="المهندس" 
              className="h-20 w-auto object-contain"
            />
            <span className="text-2xl font-bold text-primary">منصة المهندس</span>
          </div>

          {/* Welcome Message */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-foreground">
              {userType === "teacher" ? "أهلاً بك يا معلم" : "أهلاً بك يا طالب"}
            </h1>
            <p className="text-muted-foreground">
              {userType === "teacher"
                ? "سجل دخولك لمتابعة رحلة الطلاب"
                : "سجل دخولك لمتابعة دروسك"}
            </p>
          </div>

          {/* Social Login */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <Button variant="outline" className="gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              جوجل
            </Button>
            <Button variant="outline" className="gap-2">
              <svg className="h-5 w-5" viewBox="0 0 23 23">
                <path fill="#f35325" d="M1 1h10v10H1z" />
                <path fill="#81bc06" d="M12 1h10v10H12z" />
                <path fill="#05a6f0" d="M1 12h10v10H1z" />
                <path fill="#ffba08" d="M12 12h10v10H12z" />
              </svg>
              مايكروسوفت
            </Button>
          </div>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                أو عبر البريد
              </span>
            </div>
          </div>

          {/* Email & Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  dir="ltr"
                />
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">كلمة المرور</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
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
                  className="pl-10"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
                <Lock className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <Label htmlFor="remember" className="text-sm font-normal">
                تذكرني على هذا الجهاز
              </Label>
            </div>

            <Button type="submit" className="w-full gap-2" size="lg" disabled={isSubmitting}>
              {isSubmitting ? "جاري التحميل..." : "تسجيل الدخول"}
              {!isSubmitting && <ArrowLeft className="h-5 w-5" />}
            </Button>
          </form>
        </div>

        {/* Footer Links */}
        <div className="mt-8 flex justify-center gap-4 text-sm text-muted-foreground">
          <Link to="/terms" className="hover:text-primary hover:underline">
            الشروط والأحكام
          </Link>
          <Link to="/privacy" className="hover:text-primary hover:underline">
            سياسة الخصوصية
          </Link>
          <Link to="/help" className="hover:text-primary hover:underline">
            مركز المساعدة
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
