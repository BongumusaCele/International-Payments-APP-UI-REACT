import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  LockKeyhole,
  Mail,
  ReceiptText,
  Rocket,
  ShieldCheck,
  Smartphone,
  Sparkles,
  WalletCards,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Platform', href: '#platform' },
  { label: 'How it works', href: '#workflow' },
  { label: 'Support', href: '#support' },
];

const stats = [
  ['24/7', 'payment visibility'],
  ['5+', 'supported currencies'],
  ['100%', 'mock workflow coverage'],
];

const features = [
  {
    title: 'Secure beneficiary records',
    copy: 'Create trusted recipient profiles with account, bank, country, SWIFT, and currency details.',
    icon: ShieldCheck,
  },
  {
    title: 'Fast payment creation',
    copy: 'Send payments from saved beneficiaries with amount, reference, and currency captured in one flow.',
    icon: Rocket,
  },
  {
    title: 'Status-led tracking',
    copy: 'Follow pending, review, approved, rejected, and completed states from a single history view.',
    icon: BadgeCheck,
  },
];

const steps = [
  {
    title: 'Create account',
    copy: 'Register or sign in with the demo profile to access your dashboard.',
    icon: WalletCards,
  },
  {
    title: 'Add beneficiary',
    copy: 'Store recipient bank details once and reuse them for future payments.',
    icon: Building2,
  },
  {
    title: 'Track payment',
    copy: 'Create payments and inspect their status, amount, date, and reference.',
    icon: ReceiptText,
  },
];

const testimonials = [
  {
    quote: 'The dashboard gives our finance team a cleaner place to prepare transfers and follow payment progress.',
    name: 'David Smith',
    role: 'Finance Lead',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80',
  },
  {
    quote: 'Beneficiary setup is simple, and the payment history makes every follow-up conversation easier.',
    name: 'Alina Blake',
    role: 'Operations Manager',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80',
  },
];

const blogPosts = [
  {
    title: 'How payment references reduce reconciliation errors',
    date: 'April 18, 2026',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'What growing teams should track before sending transfers',
    date: 'April 12, 2026',
    image: 'https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=900&q=80',
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="landing-shell min-h-screen text-slate-950">
      <header className="landing-nav">
        <div className="landing-section flex items-center justify-between py-4">
          <Link to="/" className="flex items-center gap-3 font-black text-slate-950">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-600 text-white">
              <CreditCard className="h-6 w-6" />
            </span>
            <span className="text-xl">PaymentApp</span>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-semibold text-slate-600 md:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="hover:text-blue-600">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/login" className="hidden rounded-full px-5 py-2.5 text-sm font-black text-slate-700 hover:text-blue-600 sm:inline-flex">
              Sign in
            </Link>
            <Link to="/register" className="landing-cta px-5 py-2.5 text-sm">
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="landing-section py-8 md:py-12">
          <div className="hero-panel grid grid-cols-1 items-center gap-10 px-6 py-10 md:px-10 lg:grid-cols-[0.92fr_1.08fr] lg:px-14 lg:py-14">
            <div className="hero-copy max-w-2xl">
              <p className="landing-pill text-sm">
                <Sparkles className="h-4 w-4" />
                Secure digital payment workspace
              </p>
              <h1 className="mt-7 text-5xl font-black leading-[0.98] tracking-tight text-white md:text-7xl">
                Manage payments with calm, confident control.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-blue-50/78">
                Build beneficiary records, create payments, and track every transfer from a clean operating dashboard.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link to="/register" className="landing-cta">
                  Create account
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/dashboard" className="rounded-full border border-white/20 px-6 py-3 font-black text-white hover:border-cyan-200 hover:text-cyan-200">
                  Open dashboard
                </Link>
              </div>

              <div className="mt-12 grid max-w-xl grid-cols-3 gap-4">
                {stats.map(([value, label]) => (
                  <div key={label} className="rounded-3xl border border-white/12 bg-white/8 p-4 text-white backdrop-blur">
                    <strong className="block text-2xl font-black">{value}</strong>
                    <span className="mt-1 block text-xs font-semibold leading-5 text-blue-50/70">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="hero-visual hero-dashboard">
              <div className="dashboard-card">
                <div className="dashboard-top">
                  <div className="dashboard-dots">
                    <span />
                    <span />
                    <span />
                  </div>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-black text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="dashboard-screen">
                  <div className="dashboard-balance">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-blue-50/80">Total volume</span>
                      <WalletCards className="h-6 w-6" />
                    </div>
                    <strong>R7,500</strong>
                    <p className="mt-4 text-sm font-semibold text-blue-50/80">Across ZAR payments</p>
                  </div>
                  <div className="dashboard-bars">
                    <span />
                    <span />
                    <span />
                  </div>
                </div>
              </div>

              <div className="floating-card payment">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-[0.22em] text-slate-400">Payment</span>
                  <CreditCard className="h-5 w-5 text-blue-600" />
                </div>
                <strong className="mt-4 block text-2xl font-black text-slate-950">ZAR 5,000</strong>
                <p className="mt-2 text-sm font-semibold text-slate-500">Jane Smith - REF-001</p>
              </div>

              <div className="floating-card approved">
                <span className="grid h-11 w-11 place-items-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <CheckCircle2 className="h-6 w-6" />
                </span>
                <div>
                  <strong className="block text-sm font-black text-slate-950">Approved</strong>
                  <span className="text-xs font-semibold text-slate-500">Ready for review</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="platform" className="landing-section py-20">
          <div className="section-heading">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Platform</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
              Designed for repeatable payment operations.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The interface keeps setup, creation, review, and tracking close together without changing the current app workflow.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <article key={feature.title} className="feature-card">
                  <div className="feature-icon">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="mt-6 text-2xl font-black tracking-tight">{feature.title}</h3>
                  <p className="mt-4 leading-7 text-slate-600">{feature.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="bg-white py-20">
          <div className="landing-section grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="soft-card p-8 md:p-10">
              <div className="rounded-[2rem] bg-slate-950 p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="font-black">Payment health</span>
                  <LockKeyhole className="h-5 w-5 text-cyan-300" />
                </div>
                <div className="mt-8 grid grid-cols-2 gap-4">
                  <div className="rounded-3xl bg-white/10 p-4">
                    <span className="text-sm text-white/60">Pending</span>
                    <strong className="mt-2 block text-3xl font-black">2</strong>
                  </div>
                  <div className="rounded-3xl bg-cyan-300 p-4 text-slate-950">
                    <span className="text-sm font-bold">Completed</span>
                    <strong className="mt-2 block text-3xl font-black">14</strong>
                  </div>
                </div>
                <div className="mt-5 rounded-3xl bg-white p-4 text-slate-950">
                  <div className="flex items-center gap-3">
                    <span className="grid h-12 w-12 place-items-center rounded-2xl bg-blue-50 text-blue-600">
                      <Smartphone className="h-6 w-6" />
                    </span>
                    <div>
                      <strong className="block">Beneficiary ready</strong>
                      <span className="text-sm text-slate-500">Global Bank - GLBKZAJJ</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Why it works</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">
                Less visual clutter, more operational clarity.
              </h2>
              <p className="mt-5 text-lg leading-8 text-slate-600">
                A softer visual system makes the landing page feel closer to a polished Figma marketing design while leaving the authenticated product untouched.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {['Mobile wallet', 'High security', 'Fast setup', 'Support ready'].map((item) => (
                  <span key={item} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-black text-slate-700">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="workflow" className="landing-section py-20">
          <div className="section-heading">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Workflow</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">How PaymentApp works</h2>
          </div>

          <div className="workflow-line mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article key={step.title} className="soft-card relative p-7 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-blue-600 text-white">
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="mx-auto mt-5 block w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-black text-blue-700">
                    Step {index + 1}
                  </span>
                  <h3 className="mt-4 text-xl font-black">{step.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{step.copy}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="support" className="bg-white py-20">
          <div className="landing-section">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Feedback</p>
                <h2 className="mt-4 max-w-2xl text-4xl font-black tracking-tight md:text-5xl">What our clients say</h2>
              </div>
              <div className="flex gap-3">
                <button className="grid h-11 w-11 place-items-center rounded-full border border-slate-200 text-slate-600" aria-label="Previous testimonial">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button className="grid h-11 w-11 place-items-center rounded-full bg-blue-600 text-white" aria-label="Next testimonial">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
              {testimonials.map((testimonial) => (
                <article key={testimonial.name} className="soft-card p-7">
                  <p className="text-lg leading-8 text-slate-600">{testimonial.quote}</p>
                  <div className="mt-8 flex items-center gap-4">
                    <img
                      src={testimonial.image}
                      alt={testimonial.name}
                      className="h-16 w-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-black">{testimonial.name}</h3>
                      <p className="text-sm font-semibold text-slate-500">{testimonial.role}</p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="landing-section py-20">
          <div className="section-heading">
            <p className="text-sm font-black uppercase tracking-[0.24em] text-blue-600">Insights</p>
            <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Read our blog</h2>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
            {blogPosts.map((post) => (
              <article key={post.title} className="feature-card p-4">
                <img src={post.image} alt="" className="blog-image" />
                <div className="p-3">
                  <p className="mt-2 text-sm font-bold text-blue-600">{post.date}</p>
                  <h3 className="mt-3 text-2xl font-black leading-tight">{post.title}</h3>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-section pb-20">
          <div className="newsletter-panel px-6 py-14 text-white md:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-black uppercase tracking-[0.24em] text-cyan-200">Newsletter</p>
              <h2 className="mt-4 text-4xl font-black tracking-tight md:text-5xl">Join our payment updates</h2>
              <p className="mx-auto mt-5 max-w-xl leading-7 text-blue-50/70">
                Get product updates, payment workflow tips, and security notes from PaymentApp.
              </p>
              <form className="mx-auto mt-8 flex max-w-lg rounded-full bg-white p-2" onSubmit={(e) => e.preventDefault()}>
                <label htmlFor="newsletter-email" className="sr-only">Email</label>
                <input
                  id="newsletter-email"
                  type="email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 rounded-full px-5 text-slate-950 outline-none"
                />
                <button className="landing-cta px-5 py-3" aria-label="Subscribe">
                  <Mail className="h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="landing-section flex flex-col justify-between gap-6 text-sm text-slate-500 md:flex-row md:items-center">
          <div className="flex items-center gap-3 font-black text-slate-950">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-600 text-white">
              <CreditCard className="h-5 w-5" />
            </span>
            PaymentApp
          </div>
          <p>Copyright 2026 PaymentApp. All rights reserved.</p>
          <div className="flex gap-5 font-bold">
            <a href="#home" className="hover:text-blue-600">Home</a>
            <Link to="/login" className="hover:text-blue-600">Sign in</Link>
            <Link to="/register" className="hover:text-blue-600">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
