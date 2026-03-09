"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import {
  MessageSquare,
  Bot,
  Zap,
  BarChart3,
  Shield,
  Sparkles,
  Check,
  Crown,
  Rocket,
  Building2,
  Users,
  ShoppingBag,
  TrendingUp,
  Star,
  ChevronDown,
  X,
  Play,
  ArrowRight
} from "lucide-react";

// Pricing data
const pricingPlans = {
  monthly: {
    starter: { price: "₮49,000", period: "/сар" },
    business: { price: "₮99,000", period: "/сар" },
    enterprise: { price: "Тохиролцоно", period: "" }
  },
  yearly: {
    starter: { price: "₮490,000", period: "/жил", savings: "2 сар үнэгүй" },
    business: { price: "₮990,000", period: "/жил", savings: "2 сар үнэгүй" },
    enterprise: { price: "Тохиролцоно", period: "" }
  }
};

// Stats data
const stats = [
  { value: "500+", label: "Бизнес хэрэглэгч", icon: Building2 },
  { value: "2M+", label: "Боловсруулсан мессеж", icon: MessageSquare },
  { value: "50K+", label: "Захиалга", icon: ShoppingBag },
  { value: "98%", label: "Сэтгэл ханамж", icon: TrendingUp }
];

// Testimonials data
const testimonials = [
  {
    name: "Батжаргал Г.",
    role: "Clothing Store эзэмшигч",
    image: "🧑‍💼",
    content: "Vertmon Hub-ийг ашиглаж эхэлснээс хойш борлуулалт 40%-иар өсөв. AI чатбот 24/7 захиалга авдаг болсон нь маш их хөнгөлөлт болсон.",
    rating: 5
  },
  {
    name: "Сарантуяа Б.",
    role: "Гоо сайхны бизнес",
    image: "👩‍💼",
    content: "Урьд нь бүх мессежд хариулахад өдөрт 3-4 цаг зарцуулдаг байсан. Одоо AI автоматаар хариулж, би бусад ажилдаа төвлөрч чадаж байна.",
    rating: 5
  },
  {
    name: "Ганболд Д.",
    role: "Электроник худалдаа",
    image: "👨‍💻",
    content: "QPay интеграц маш тохиромжтой. Харилцагчид шууд төлбөрөө хийж, захиалга автоматаар бүртгэгддэг болсон.",
    rating: 5
  }
];

// FAQ data
const faqs = [
  {
    question: "Vertmon Hub хэрхэн ажилладаг вэ?",
    answer: "Vertmon Hub таны Facebook хуудастай холбогдож, Messenger-ээр ирсэн мессежүүдэд AI ашиглан автоматаар хариулна. Бүтээгдэхүүний мэдээлэл, үнэ, захиалга авах зэрэг бүх зүйлийг автоматжуулна."
  },
  {
    question: "Суулгахад хэр хугацаа шаардагдах вэ?",
    answer: "Бүртгүүлсний дараа 5 минутын дотор Facebook хуудастайгаа холбож эхлэх боломжтой. Бүтээгдэхүүнээ оруулсны дараа AI шууд ажиллаж эхэлнэ."
  },
  {
    question: "AI хэр зөв хариулт өгдөг вэ?",
    answer: "Бид Google-ийн хамгийн сүүлийн үеийн Gemini AI загварыг ашигладаг. Таны бүтээгдэхүүний мэдээлэл, брэндийн өнгө аястай тохируулсан хариултууд өгнө."
  },
  {
    question: "Төлбөрийн ямар сонголтууд байдаг вэ?",
    answer: "Бид QPay болон банкны шилжүүлгийг дэмждэг. Жилээр төлөхөд 2 сарын хөнгөлөлт эдлэх боломжтой."
  },
  {
    question: "Туршилтын хугацаа байдаг уу?",
    answer: "Тийм, бүх төлөвлөгөө 14 хоногийн үнэгүй туршилттай. Картын мэдээлэл шаардахгүй."
  },
  {
    question: "Хэзээ ч цуцалж болох уу?",
    answer: "Тийм, та хүссэн үедээ захиалгаа цуцалж болно. Цуцалсаны дараа тухайн сарын төгсгөл хүртэл үргэлжлүүлэн үйлчилгээ авах боломжтой."
  }
];

// Feature comparison data
const featureComparison = [
  { feature: "Facebook хуудас холбох", starter: "1", business: "3", enterprise: "Хязгааргүй" },
  { feature: "Сарын мессеж", starter: "500", business: "Хязгааргүй", enterprise: "Хязгааргүй" },
  { feature: "Бүтээгдэхүүний тоо", starter: "50", business: "500", enterprise: "Хязгааргүй" },
  { feature: "AI чатбот", starter: "Үндсэн", business: "Ахисан", enterprise: "Тусгай" },
  { feature: "CRM систем", starter: false, business: true, enterprise: true },
  { feature: "Тайлан, аналитик", starter: false, business: true, enterprise: true },
  { feature: "QPay интеграц", starter: false, business: true, enterprise: true },
  { feature: "API хандалт", starter: false, business: false, enterprise: true },
  { feature: "Dedicated менежер", starter: false, business: false, enterprise: true },
  { feature: "24/7 дэмжлэг", starter: false, business: false, enterprise: true }
];

export default function Home() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [showVideo, setShowVideo] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 pb-20 lg:pt-20 lg:pb-32">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none opacity-40 dark:opacity-20">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neutral-400 rounded-full mix-blend-multiply filter blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-gold rounded-full mix-blend-multiply filter blur-3xl animate-float delay-100"></div>
          <div className="absolute -bottom-20 left-1/3 w-96 h-96 bg-neutral-300 rounded-full mix-blend-multiply filter blur-3xl animate-float delay-200"></div>
        </div>

        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header/Nav */}
          <nav className="mb-8 sm:mb-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-primary">
                <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground" />
              </div>
              <span className="text-xl sm:text-2xl font-bold text-foreground">Vertmon Hub</span>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="sm:hidden p-2 rounded-lg hover:bg-secondary"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6 text-muted-foreground" />
              ) : (
                <div className="space-y-1.5">
                  <div className="w-6 h-0.5 bg-muted-foreground"></div>
                  <div className="w-6 h-0.5 bg-muted-foreground"></div>
                  <div className="w-6 h-0.5 bg-muted-foreground"></div>
                </div>
              )}
            </button>

            {/* Desktop nav */}
            <div className="hidden sm:flex gap-4">
              <Button href="/cart" variant="ghost" size="icon">
                <ShoppingBag className="h-5 w-5" />
              </Button>
              <Button href="/dashboard" variant="ghost">
                Dashboard
              </Button>
              <Button href="/auth/login" variant="primary">
                Нэвтрэх
              </Button>
            </div>
          </nav>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden mb-8 p-4 bg-card rounded-2xl shadow-lg border border-border">
              <div className="flex flex-col gap-2">
                <Button href="/dashboard" variant="ghost" className="w-full justify-center">
                  Dashboard
                </Button>
                <Button href="/auth/login" variant="primary" className="w-full justify-center">
                  Нэвтрэх
                </Button>
              </div>
            </div>
          )}

          {/* Hero Content */}
          <div className="mx-auto max-w-4xl text-center">

            <Badge variant="info" className="mb-4 sm:mb-8 px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">
              <Bot className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              AI-Powered Business Solutions
            </Badge>

            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight text-foreground leading-tight">
              Таны бизнест зориулсан<br />
              <span className="bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent inline-block">AI туслах</span>
            </h1>

            <p className="mb-6 sm:mb-10 text-base sm:text-xl leading-relaxed text-muted-foreground px-4 max-w-2xl mx-auto">
              Facebook Messenger дээр ажилладаг AI чатбот. Автоматаар захиалга авч, харилцагчидтай харилцаж,
              борлуулалтаа нэмэгдүүлээрэй.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 sm:flex-row animate-fade-in-up delay-200">
              <Button href="/auth/register" size="lg" className="w-full sm:w-auto shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 hover:scale-105 active:scale-95">
                <Zap className="h-5 w-5 mr-2" />
                Үнэгүй турших
                <ArrowRight className="h-4 w-4 opacity-50 ml-2" />
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => setShowVideo(true)}
                className="w-full sm:w-auto border-2 border-neutral-300 dark:border-neutral-600 bg-white/80 dark:bg-neutral-800/80 text-neutral-900 dark:text-white backdrop-blur-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 hover:scale-105 active:scale-95"
              >
                <Play className="h-5 w-5 mr-2" />
                Demo үзэх
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-10 sm:py-16 border-y border-border bg-accent/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index} className="group text-center border-border hover:border-primary/20 hover:shadow-lg transition-all hover:-translate-y-1">
                <CardContent className="pt-6">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <stat.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div className="text-2xl sm:text-4xl font-black text-foreground mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-10 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              Онцлог шийдлүүд
            </h2>
            <p className="mt-3 sm:mt-4 text-base sm:text-lg text-muted-foreground">
              Бизнесээ автоматжуулж, илүү үр дүнтэй болгоорой
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <Card hover className="group border-border hover:shadow-primary/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 group-hover:scale-110 transition-transform">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                  AI Чатбот
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Facebook Messenger дээр 24/7 харилцагчидтай автоматаар харилцана
                </p>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card hover className="group border-border hover:shadow-purple-500/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-900/20 group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-7 w-7 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  Analytics Dashboard
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Борлуулалт, харилцагчид, захиалгын статистик хянах
                </p>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card hover className="group border-border hover:shadow-green-500/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 dark:bg-green-900/20 group-hover:scale-110 transition-transform">
                  <Zap className="h-7 w-7 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                  Шуурхай суулгалт
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  5 минутын дотор Facebook хуудастайгаа холбож эхэлнэ
                </p>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card hover className="group border-border hover:shadow-blue-500/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 dark:bg-blue-900/20 group-hover:scale-110 transition-transform">
                  <Bot className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  Gemini AI
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Google-ийн хамгийн сүүлийн үеийн AI загвар ашиглана
                </p>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card hover className="group border-border hover:shadow-orange-500/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 dark:bg-orange-900/20 group-hover:scale-110 transition-transform">
                  <Shield className="h-7 w-7 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                  Аюулгүй найдвартай
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Supabase болон Vercel дээр хостлогдсон, өндөр хамгаалалттай
                </p>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card hover className="group border-border hover:shadow-pink-500/10 hover:-translate-y-2">
              <CardContent className="p-8">
                <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-pink-100 dark:bg-pink-900/20 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-7 w-7 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                  CRM систем
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Харилцагчийн мэдээлэл автоматаар хадгалж, tag-аар ангилна
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-24 sm:py-32 bg-gradient-to-b from-primary/5 to-background">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="warning" className="mb-4">
              <Star className="h-4 w-4 mr-1" />
              Хэрэглэгчдийн сэтгэгдэл
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Бизнес эрхлэгчид юу гэж хэлдэг вэ?
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="hover:shadow-xl transition-all"
              >
                <CardContent className="p-8">
                  <div className="mb-4 flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="mb-6 text-muted-foreground leading-relaxed">
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-2xl">
                      {testimonial.image}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="relative py-24 sm:py-32 bg-secondary/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <Badge variant="vip" className="mb-4">
              <Crown className="h-4 w-4 mr-1" />
              Үнийн Төлөвлөгөө
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Таны бизнест тохирсон төлөвлөгөө сонгоорой
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Бүх төлөвлөгөө 14 хоногийн үнэгүй туршилттай
            </p>

            {/* Billing Toggle */}
            <div className="mt-8 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${billingPeriod === "monthly" ? "text-foreground" : "text-muted-foreground"}`}>
                Сараар
              </span>
              <button
                onClick={() => setBillingPeriod(billingPeriod === "monthly" ? "yearly" : "monthly")}
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${billingPeriod === "yearly" ? "translate-x-6" : "translate-x-1"
                    }`}
                />
              </button>
              <span className={`text-sm font-medium ${billingPeriod === "yearly" ? "text-foreground" : "text-muted-foreground"}`}>
                Жилээр
                <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  2 сар үнэгүй
                </span>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Starter Plan */}
            <Card className="hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-900/20">
                    <Rocket className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Starter</h3>
                <p className="mt-2 text-sm text-muted-foreground">Жижиг бизнест тохиромжтой</p>

                <div className="mt-8">
                  <span className="text-4xl font-black text-foreground">
                    {pricingPlans[billingPeriod].starter.price}
                  </span>
                  <span className="text-muted-foreground font-medium">{pricingPlans[billingPeriod].starter.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-muted-foreground">1 Facebook хуудас холбох</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-muted-foreground">500 мессеж/сар</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                    </div>
                    <span className="text-muted-foreground">50 бүтээгдэхүүн</span>
                  </li>
                </ul>

                <Button href="/auth/register?plan=starter" variant="outline" className="mt-8 w-full border-2 border-primary/20 text-primary hover:bg-primary/5 hover:border-primary/50">
                  Эхлүүлэх
                </Button>
              </CardContent>
            </Card>

            {/* Business Plan - Recommended */}
            <Card className="border-2 border-primary shadow-2xl shadow-primary/10 hover:scale-105 transition-transform">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-neutral-900 to-neutral-700 px-4 py-1.5 text-sm font-bold text-gold shadow-lg shadow-gold/20">
                  <Sparkles className="h-4 w-4 fill-gold text-gold" />
                  Санал болгох
                </span>
              </div>

              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-neutral-900 to-neutral-700 shadow-lg shadow-gold/20">
                    <Crown className="h-7 w-7 text-gold" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-foreground">Business</h3>
                <p className="mt-2 text-sm text-muted-foreground">Дунд болон том бизнест</p>

                <div className="mt-8">
                  <span className="text-5xl font-black bg-gradient-to-r from-gold via-gold-light to-gold-dark bg-clip-text text-transparent">
                    {pricingPlans[billingPeriod].business.price}
                  </span>
                  <span className="text-muted-foreground font-medium">{pricingPlans[billingPeriod].business.period}</span>
                </div>

                <ul className="mt-8 space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">3 Facebook хуудас холбох</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">Хязгааргүй мессеж & Ахисан AI</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <Check className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium">QPay & CRM систем</span>
                  </li>
                </ul>

                <Button
                  href="/auth/register?plan=business"
                  className="mt-8 w-full bg-gradient-to-r from-neutral-900 to-neutral-700 text-gold hover:opacity-90 transition-opacity"
                  size="lg"
                >
                  Эхлүүлэх
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="hover:shadow-xl transition-all">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 dark:bg-orange-900/30">
                    <Building2 className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-foreground">Enterprise</h3>
                <p className="mt-2 text-sm text-muted-foreground">Том байгууллагуудад</p>

                <div className="mt-6">
                  <span className="text-4xl font-bold text-foreground">
                    {pricingPlans[billingPeriod].enterprise.price}
                  </span>
                </div>

                <ul className="mt-8 space-y-4">
                  {['Хязгааргүй хуудас холбох', 'Хязгааргүй мессеж', 'Хязгааргүй бүтээгдэхүүн', 'Тусгай AI тохиргоо', '24/7 дэмжлэг', 'API хандалт', 'Dedicated менежер'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <Check className="h-5 w-5 shrink-0 text-green-500 mt-0.5" />
                      <span className="text-muted-foreground">{item}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/auth/register?plan=enterprise" variant="outline" className="mt-8 w-full">
                  Холбогдох
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="relative py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Бүх боломжуудыг харьцуулах
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Төлөвлөгөө бүрт ямар боломжууд багтсаныг харна уу
            </p>
          </div>

          <div className="-mx-6 overflow-x-auto pb-4 lg:mx-0">
            <div className="min-w-[800px] px-6 lg:px-0">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-border">
                    <th className="py-4 px-6 text-left text-sm font-semibold text-foreground">Боломжууд</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Starter</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold bg-primary/10 text-primary rounded-t-lg">Business</th>
                    <th className="py-4 px-6 text-center text-sm font-semibold text-foreground">Enterprise</th>
                  </tr>
                </thead>
                <tbody>
                  {featureComparison.map((row, index) => (
                    <tr key={index} className="border-b border-gray-100 dark:border-gray-800">
                      <td className="py-4 px-6 text-sm text-foreground">{row.feature}</td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.starter === "boolean" ? (
                          row.starter ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-foreground">{row.starter}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center bg-primary/5">
                        {typeof row.business === "boolean" ? (
                          row.business ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm font-medium text-primary">{row.business}</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {typeof row.enterprise === "boolean" ? (
                          row.enterprise ? (
                            <Check className="h-5 w-5 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-5 w-5 text-muted-foreground mx-auto" />
                          )
                        ) : (
                          <span className="text-sm text-foreground">{row.enterprise}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-24 sm:py-32 bg-secondary/20">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Түгээмэл асуултууд
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Хэрэглэгчид ихэвчлэн асуудаг асуултууд
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <Card
                key={index}
                className="overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="flex w-full items-center justify-between p-6 text-left"
                >
                  <span className="font-semibold text-foreground">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-muted-foreground transition-transform ${openFaq === index ? "rotate-180" : ""
                      }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 px-8 py-16 shadow-2xl sm:px-16 sm:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Өнөөдөр эхэлцгээе
              </h2>
              <p className="mt-4 text-lg leading-8 text-neutral-300">
                AI туслахыг бизнестээ нэвтрүүлж, борлуулалтаа нэмэгдүүлээрэй. 14 хоногийн үнэгүй туршилт эхлүүлнэ үү.
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Button href="/auth/register" size="lg" className="bg-gold text-neutral-900 hover:bg-gold-light font-semibold">
                  Үнэгүй турших
                </Button>
                <Button href="/dashboard" size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Demo үзэх
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 mb-8">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Бүтээгдэхүүн</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Онцлогууд</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Үнийн төлөвлөгөө</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Интеграц</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Компани</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Бидний тухай</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Блог</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">Карьер</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Дэмжлэг</h3>
              <ul className="space-y-2">
                <li><a href="/help" className="text-sm text-muted-foreground hover:text-foreground">Тусламж</a></li>
                <li><a href="mailto:info@vertmon.mn" className="text-sm text-muted-foreground hover:text-foreground">Холбогдох</a></li>
                <li><a href="#" className="text-sm text-muted-foreground hover:text-foreground">API Docs</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-4">Хуулийн</h3>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Нууцлалын бодлого</a></li>
                <li><a href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Үйлчилгээний нөхцөл</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Sparkles className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-lg font-bold text-foreground">Vertmon Hub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                &copy; 2026 Vertmon Hub. Бүх эрх хуулиар хамгаалагдсан.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Video Modal */}
      {showVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="relative w-full max-w-4xl">
            <button
              onClick={() => setShowVideo(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <X className="h-8 w-8" />
            </button>
            <div className="aspect-video rounded-2xl bg-gray-900 flex items-center justify-center">
              <div className="text-center text-white">
                <Play className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Demo видео удахгүй нэмэгдэнэ</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
