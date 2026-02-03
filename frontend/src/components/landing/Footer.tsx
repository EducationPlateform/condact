import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Youtube, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-50 py-20 relative overflow-hidden">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-16">
          {/* Socials Column (Visual Right in RTL, Column 4 in grid but placed 1st for mobile order if needed) */}
          <div className="text-right order-4 flex flex-col gap-6 items-start">
            <h4 className="font-normal text-[#1E293B] text-base font-amin">
              تابع تحديثاتنا
            </h4>
            <div className="flex justify-end gap-6">
              {/* Youtube Blob */}
              <a href="#" className="relative group">
                <div className="h-20 w-20 flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-red-200">
                  <img
                    src="/icons/youtube.png"
                    alt="youtube logo"
                    className="h-20 w-20 fill-current"
                  />
                </div>
              </a>
              {/* Facebook Blob */}
              <a href="#" className="relative group">
                <div className="h-20 w-20 flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-red-200">
                  <img
                    src="/icons/facebook.png"
                    alt="facebook logo"
                    className="h-20 w-20 fill-current"
                  />{" "}
                </div>
              </a>
              {/* WhatsApp Blob */}
              <a href="#" className="relative group">
                <div className="h-20 w-20 flex items-center justify-center text-white transition-all duration-500 group-hover:rotate-12 group-hover:scale-110 shadow-red-200">
                  <img
                    src="/icons/whatsapp.png"
                    alt="whatsapp logo"
                    className="h-20 w-20 fill-current"
                  />{" "}
                </div>
              </a>
            </div>

            {/* Big Engineer Logo at Bottom Left corner visual */}
            <div className="absolute bottom-0 left-0 lg:left-10 w-40 lg:w-64 opacity-90">
              <img
                src="/logo.png"
                alt="المهندس"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>

          {/* Support Column */}
          <div className="text-right order-3 flex flex-col gap-6 items-start">
            <h4 className="font-normal text-[#1E293B] text-base font-amin">
              الدعم
            </h4>
            <ul className="space-y-6">
              <li>
                <Link
                  to="/help"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  مركز المساعدة
                </Link>
              </li>
              <li>
                <Link
                  to="/faq"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  الأسئلة الشائعة
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  تواصل معنا
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  سياسة الخصوصية
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Column */}
          <div className="text-right order-2 flex flex-col gap-6 items-start">
            <h4 className="font-normal text-[#1E293B] text-base font-amin">
              المنصة
            </h4>
            <ul className="space-y-6">
              <li>
                <Link
                  to="/about"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  عن المنهجية
                </Link>
              </li>
              <li>
                <Link
                  to="/levels"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  المستويات الدراسية
                </Link>
              </li>
              <li>
                <Link
                  to="/exams"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  نماذج الاختبارات
                </Link>
              </li>
              <li>
                <Link
                  to="/olympiad"
                  className="text-gray-400 hover:text-[#3b82f6] text-sm font-medium font-awesome"
                >
                  أولمبياد الرياضيات
                </Link>
              </li>
            </ul>
          </div>

          {/* Brand Column */}
          <div className="text-right order-1 flex flex-col gap-6 items-start">
            <Logo size="lg" isFooter={true} className="justify-end" />
            <p className="text-sm text-gray-400 leading-relaxed font-medium font-awesome">
              المنصة التعليمية المتكاملة لتمكين الطلاب من مهارات القرن الحادي
              والعشرين عبر بوابة الرياضيات.
            </p>
          </div>
        </div>

        <div className="mt-14 w-full flex justify-center text-center">
          <p className="border-t border-gray-100 w-fit p-5 text-sm text-gray-400 font-medium font-notoSansArabic">
            © ٢٠٢٤ منصة الرياضيات التعليمية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
