import { Link } from "react-router-dom";
import Logo from "@/components/Logo";
import { Youtube, Facebook, MessageCircle } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-100 py-16">
      <div className="container px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          
          {/* Brand Column */}
          <div className="md:col-span-1 text-right order-1 md:order-1">
            <Logo size="lg" className="mb-6 justify-start md:justify-end" />
            <p className="text-sm text-gray-500 leading-relaxed font-medium">
              المنصة التعليمية المتكاملة لتمكين الطلاب من مهارات القرن الحادي والعشرين عبر بوابة الرياضيات الممتعة والمبسطة.
            </p>
          </div>

          {/* Links Column 1 */}
          <div className="text-right order-2 md:order-2">
            <h4 className="font-extrabold text-[#003366] mb-6">المنصة</h4>
            <ul className="space-y-4">
              <li><Link to="/about" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">عن المنهجية</Link></li>
              <li><Link to="/levels" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">المستويات الدراسية</Link></li>
              <li><Link to="/exams" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">نماذج الاختبارات</Link></li>
              <li><Link to="/olympiad" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">أولمبياد الرياضيات</Link></li>
            </ul>
          </div>

          {/* Links Column 2 */}
          <div className="text-right order-3 md:order-3">
            <h4 className="font-extrabold text-[#003366] mb-6">الدعم</h4>
            <ul className="space-y-4">
              <li><Link to="/help" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">مركز المساعدة</Link></li>
              <li><Link to="/faq" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">الأسئلة الشائعة</Link></li>
              <li><Link to="/contact" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">تواصل معنا</Link></li>
              <li><Link to="/privacy" className="text-gray-500 hover:text-[#3b82f6] text-sm font-medium">سياسة الخصوصية</Link></li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="text-right order-4 md:order-4">
            <h4 className="font-extrabold text-[#003366] mb-6">تابع تحديثاتنا</h4>
            <div className="flex justify-end gap-4 mb-8">
              {/* WhatsApp Icon */}
              <a href="#" className="h-12 w-12 rounded-full bg-[#25d366] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                <MessageCircle className="h-7 w-7 fill-current" />
              </a>
              {/* Facebook Icon */}
              <a href="#" className="h-12 w-12 rounded-full bg-[#1877f2] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                <Facebook className="h-7 w-7 fill-current" />
              </a>
              {/* Youtube Icon */}
              <a href="#" className="h-12 w-12 rounded-full bg-[#ff0000] text-white flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
                <Youtube className="h-7 w-7 fill-current" />
              </a>
            </div>
            
            {/* The additional branded logo in the corner as per Figma */}
            <div className="flex justify-end mt-4">
              <div className="p-2 bg-white rounded-xl shadow-lg border border-gray-50">
                <img src="/logo.png" alt="المهندس" className="h-16 w-auto" />
              </div>
            </div>
          </div>

        </div>

        <div className="mt-16 pt-8 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400 font-medium">
            © ٢٠٢٤ منصة الرياضيات التعليمية. جميع الحقوق محفوظة.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
