import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Form submitted:", formData);
        alert("تم إرسال رسالتك بنجاح!");
        setFormData({ name: "", email: "", message: "" });
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-[#4a5568] flex justify-center items-center py-12">
            {/* Mathematical Chalkboard Background */}
            <div className="absolute inset-0 opacity-40 bg-[url('/Hero-bg.png')] bg-cover bg-center" />

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4">
                <div className="flex flex-row-reverse items-start justify-center gap-8 max-w-6xl mx-auto">
                    {/* Left Side - Contact Form */}
                    <div className="w-full max-w-md">
                        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl">
                            <CardContent className="p-8">
                                <h2 className="text-2xl font-bold text-center mb-8 text-[#1e3a8a]">
                                    رسالة
                                </h2>
                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div>
                                        <Input
                                            type="text"
                                            placeholder="محمود هشام"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full text-right bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-14 px-6 text-lg"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            type="email"
                                            placeholder="john@example.com"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-xl h-14 px-6 text-lg"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <Textarea
                                            placeholder="أهلا أريد أن أعلم ميعاد التسليم ...."
                                            value={formData.message}
                                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                            className="w-full min-h-[180px] text-right bg-white border-gray-300 focus:border-blue-500 focus:ring-blue-500 resize-none rounded-xl p-6 text-lg"
                                            required
                                            dir="rtl"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] text-white font-bold py-6 text-xl rounded-xl shadow-lg transition-all"
                                    >
                                        إرسال للمسير
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Side - Social Media & Business Hours */}
                    <div className="space-y-4 w-full max-w-md">
                        {/* YouTube Card */}
                        <a
                            href="https://www.youtube.com/@alielsaied5790"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Card className="bg-[#CC0000] hover:bg-[#b30000] transition-all cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 rounded-2xl">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 flex items-center justify-center">
                                            <img
                                                src="/icons/youtube.png"
                                                alt="youtube logo"
                                                className="h-16 w-16"
                                            />
                                        </div>
                                        <div className="text-white text-right">
                                            <h3 className="font-bold text-xl">يوتيوب</h3>
                                            <p className="text-sm opacity-90">Ali Elsaied</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://ui-avatars.com/api/?name=Ali+Elsaied&background=CC0000&color=fff&size=56"
                                            alt="Ali Elsaied"
                                            className="rounded-full"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>

                        {/* Facebook Card */}
                        <a
                            href="https://www.facebook.com/share/17vQYe3Fpk/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Card className="bg-[#1877F2] hover:bg-[#166fe5] transition-all cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 rounded-2xl">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 flex items-center justify-center">
                                            <img
                                                src="/icons/facebook.png"
                                                alt="facebook logo"
                                                className="h-16 w-16"
                                            />
                                        </div>
                                        <div className="text-white text-right">
                                            <h3 className="font-bold text-xl">فيس بوك</h3>
                                            <p className="text-sm opacity-90">المهندس علي السيد</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://ui-avatars.com/api/?name=Ali+Elsaied&background=1877F2&color=fff&size=56"
                                            alt="Ali Elsaied"
                                            className="rounded-full"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>

                        {/* WhatsApp Card */}
                        <a
                            href="https://wa.me/201064601237"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block"
                        >
                            <Card className="bg-[#25D366] hover:bg-[#20bd5a] transition-all cursor-pointer shadow-xl hover:shadow-2xl transform hover:scale-105 rounded-2xl">
                                <CardContent className="p-5 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="h-16 w-16 flex items-center justify-center">
                                            <img
                                                src="/icons/whatsapp.png"
                                                alt="whatsapp logo"
                                                className="h-16 w-16"
                                            />
                                        </div>
                                        <div className="text-white text-right">
                                            <h3 className="font-bold text-xl">تواصل</h3>
                                            <p className="text-sm opacity-90">+20 10 64601237</p>
                                        </div>
                                    </div>
                                    <div className="bg-white rounded-full w-14 h-14 flex items-center justify-center overflow-hidden">
                                        <img
                                            src="https://ui-avatars.com/api/?name=Ali+Elsaied&background=25D366&color=fff&size=56"
                                            alt="Ali Elsaied"
                                            className="rounded-full"
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </a>

                        {/* Business Hours Card */}
                        <Card className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl">
                            <CardContent className="p-6">
                                <h3 className="text-center font-bold text-gray-600 mb-4 uppercase tracking-wider text-sm">
                                    BUSINESS HOURS
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Mon - Fri</span>
                                        <span className="text-gray-800 font-semibold">9:00 AM - 6:00 PM</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600 font-medium">Sat - Sun</span>
                                        <span className="text-red-600 font-semibold">Closed</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
