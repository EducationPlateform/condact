import React from "react";
import TeacherLayout from "@/components/layouts/TeacherLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Mail, Shield, Calendar } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const TeacherProfile: React.FC = () => {
    const { user } = useAuth();

    return (
        <TeacherLayout>
            <div className="mx-auto max-w-4xl space-y-8 font-notoSansArabic">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 font-amin">الملف الشخصي</h1>
                    <p className="mt-1 text-gray-500">عرض وتعديل بياناتك الشخصية</p>
                </div>

                <div className="grid gap-8 md:grid-cols-3">
                    {/* Profile Summary */}
                    <Card className="md:col-span-1 overflow-hidden rounded-[32px] border-none shadow-xl shadow-gray-200/50">
                        <CardContent className="p-8 flex flex-col items-center text-center">
                            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 text-primary">
                                <User className="h-12 w-12" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900">{user?.name || "المعلم"}</h2>
                            <p className="text-gray-500">{user?.role === 'teacher' ? 'معلم' : 'مستخدم'}</p>

                            <Button className="mt-8 w-full rounded-2xl bg-primary font-bold shadow-lg shadow-primary/20">
                                تعديل الصورة
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Profile Details */}
                    <Card className="md:col-span-2 overflow-hidden rounded-[32px] border-none shadow-xl shadow-gray-200/50">
                        <CardHeader className="border-b border-gray-50 p-8">
                            <CardTitle className="text-xl font-bold text-gray-900">البيانات الشخصية</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                    <User className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-400">الاسم بالكامل</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.name}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-400">البريد الإلكتروني</p>
                                    <p className="text-lg font-bold text-gray-700">{user?.email || "غير متوفر"}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-400">الصلاحيات</p>
                                    <p className="text-lg font-bold text-gray-700">معلم معتمد</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-50 text-gray-400">
                                    <Calendar className="h-5 w-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-400">تاريخ الانضمام</p>
                                    <p className="text-lg font-bold text-gray-700">فبراير 2026</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </TeacherLayout>
    );
};

export default TeacherProfile;
