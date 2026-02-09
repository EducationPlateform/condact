import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
    Users,
    LogOut,
    ChevronRight,
    ChevronLeft,
    LayoutDashboard,
    FileText,
    Video,
    GraduationCap,
    Award,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Logo from "@/components/Logo";
import { useAuth } from "@/context/AuthContext";
import { studentStrings } from "@/studentStrings";

interface SidebarProps {
    isCollapsed: boolean;
    toggleSidebar: () => void;
}

const Sidebar = ({ isCollapsed, toggleSidebar }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const menuItems = [
        { icon: LayoutDashboard, label: studentStrings.dashboard, href: "/student" },
        { icon: Video, label: studentStrings.lectures, href: "/student/lectures" },
        { icon: FileText, label: studentStrings.homework, href: "/student/homework" },
        { icon: GraduationCap, label: studentStrings.exams, href: "/student/exams" },
        { icon: Award, label: studentStrings.scores, href: "/student/scores" },
        { icon: User, label: studentStrings.profile, href: "/student/profile" },
    ];

    return (
        <aside
            className={cn(
                "relative hidden border-l bg-white transition-all duration-300 lg:flex lg:flex-col",
                isCollapsed ? "w-20" : "w-72"
            )}
        >
            {/* Collapse Button */}
            <Button
                variant="ghost"
                size="icon"
                className="absolute -left-3 top-6 z-50 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-50"
                onClick={toggleSidebar}
            >
                {isCollapsed ? (
                    <ChevronLeft className="h-4 w-4" />
                ) : (
                    <ChevronRight className="h-4 w-4" />
                )}
            </Button>

            <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden py-6">
                {/* Logo */}
                <div className={cn("mb-10 flex items-center justify-center", isCollapsed ? "gap-0" : "")}>
                    {isCollapsed ? (
                        <Link to="/">
                            <img src="/logo.png" alt="المهندس" className="h-10 w-auto object-contain" />
                        </Link>
                    ) : (
                        <Logo />
                    )}
                </div>

                {/* User Profile */}
                <div className={cn(
                    "mx-4 mb-6 transition-all duration-300",
                    isCollapsed ? "bg-transparent p-0" : "rounded-2xl bg-gray-50 p-6"
                )}>
                    <div className={cn(
                        "mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm transition-all",
                        isCollapsed ? "h-10 w-10 mb-0" : "mb-3"
                    )}>
                        <Users className={cn("text-gray-400", isCollapsed ? "h-5 w-5" : "h-8 w-8")} />
                    </div>
                    {!isCollapsed && (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <h3 className="font-bold text-foreground">{user?.name || "طالب"}</h3>
                            <p className="text-sm text-muted-foreground">طالب</p>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 px-3">
                    {menuItems.map((item) => {
                        const isActive = item.href === "/student"
                            ? location.pathname === "/student"
                            : location.pathname.startsWith(item.href);

                        return (
                            <Button
                                key={item.href}
                                variant="ghost"
                                className={cn(
                                    "w-full justify-start gap-3 rounded-xl transition-all duration-200",
                                    isActive
                                        ? "bg-primary/10 text-primary hover:bg-primary/15"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-foreground",
                                    isCollapsed && "justify-center p-2"
                                )}
                                asChild
                            >
                                <Link to={item.href}>
                                    <item.icon className={cn("h-5 w-5 shrink-0", isActive && "fill-primary/20")} />
                                    {!isCollapsed && <span>{item.label}</span>}
                                </Link>
                            </Button>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="mt-auto px-3">
                    <Button
                        variant="ghost"
                        className={cn(
                            "w-full rounded-xl bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700",
                            isCollapsed ? "justify-center p-2" : "justify-start gap-2"
                        )}
                        onClick={handleLogout}
                    >
                        <LogOut className={cn("h-5 w-5 shrink-0")} />
                        {!isCollapsed && <span>{studentStrings.logout}</span>}
                    </Button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
