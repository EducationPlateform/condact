import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Shield } from "lucide-react";
import StudentLayout from "@/components/layouts/StudentLayout";
import { useAuth } from "@/context/AuthContext";
import { studentStrings } from "@/studentStrings";

const Profile = () => {
    const { user } = useAuth();

    return (
        <StudentLayout>
            <div className="mx-auto max-w-2xl">
                {/* Page Title */}
                <h1 className="mb-8 text-3xl font-extrabold text-gray-900">
                    {studentStrings.myProfile}
                </h1>

                {/* Profile Form Card */}
                <Card className="rounded-xl shadow-sm">
                    <CardContent className="p-6">
                        <form className="space-y-6">
                            {/* Name Field */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <User className="h-4 w-4" />
                                    {studentStrings.name}
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={user?.name || ""}
                                    disabled
                                    className="bg-gray-50 text-gray-900"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Mail className="h-4 w-4" />
                                    {studentStrings.email}
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={user?.email || ""}
                                    disabled
                                    className="bg-gray-50 text-gray-900"
                                />
                            </div>

                            {/* Role Field */}
                            <div className="space-y-2">
                                <Label htmlFor="role" className="flex items-center gap-2 text-sm font-medium text-gray-700">
                                    <Shield className="h-4 w-4" />
                                    الدور
                                </Label>
                                <Input
                                    id="role"
                                    type="text"
                                    value={user?.role === "student" ? "طالب" : user?.role || ""}
                                    disabled
                                    className="bg-gray-50 text-gray-900"
                                />
                            </div>

                            {/* Save Button */}
                            <div className="pt-4">
                                <Button
                                    type="button"
                                    disabled
                                    className="w-full bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                                >
                                    {studentStrings.save} (قريباً)
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </StudentLayout>
    );
};

export default Profile;
