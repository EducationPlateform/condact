import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Header = () => {
  const navLinks = [
    { label: "المسارات التعليمية", href: "#paths" },
    { label: "قصص النجاح", href: "#success-stories" },
    { label: "من نحن", href: "#about" },
    { label: "التواصل معنا", href: "#contact" },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button asChild>
            <Link to="/login">تسجيل الدخول</Link>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
