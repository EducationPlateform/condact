import { useState } from "react";
import Sidebar from "../student/Sidebar";
import Header from "../student/Header";

interface StudentLayoutProps {
    children: React.ReactNode;
}

const StudentLayout = ({ children }: StudentLayoutProps) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F8F9FC]">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                toggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
            <main className="flex-1 flex flex-col min-w-0 transition-all duration-300">
                <Header />
                <div className="flex-1 p-8 animate-in fade-in duration-500">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default StudentLayout;
