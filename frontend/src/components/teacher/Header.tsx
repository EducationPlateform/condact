import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Bell, MessageSquare } from "lucide-react";
import { Divider } from "@mui/material";

const Header = () => {
    const [academicYear] = useState("العام الدراسي 2024");
    const [semester] = useState("الفصل الأول");

    return (
        <header className="sticky top-0 z-30 flex flex-row-reverse gap-5 h-20 items-center justify-between bg-white/80 px-8 py-4 backdrop-blur-md">
            {/* Left Side (in RTL this appears on Left) - Date/Year */}
            <div className="flex items-center gap-3">
                <span className="text-sm/5 font-bold font-inter text-[#0D131B]">{academicYear}</span>
                <Badge
                    variant="secondary"
                    className="bg-blue-50 text-primary px-3 py-1 text-xs/4 font-bold font-inter"
                >
                    {semester}
                </Badge>
            </div>

            <Divider orientation="vertical" flexItem />

            {/* Center - Actions */}
            <div className="flex items-center gap-3">
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100"
                >
                    <MessageSquare className="h-5 w-5" />
                </Button>
            </div>

            {/* Right Side - Search */}
            <div className="flex-1 px-12">
                <div className="relative max-w-xl mx-auto">
                    <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        placeholder="البحث عن دروس، طلاب، أو نتائج..."
                        className="h-11 rounded-full border-gray-100 bg-gray-50 pr-11 shadow-sm transition-all focus:bg-white focus:ring-2 focus:ring-primary/20"
                    />
                </div>
            </div>
        </header>
    );
};

export default Header;
