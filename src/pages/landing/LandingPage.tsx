import React from 'react';
import { Link } from 'react-router-dom';
import {
  BadgeDollarSign,
  CheckCircle2,
  Clock3,
  Contact,
  FileCheck2,
  Landmark,
  LockKeyhole,
  Mail,
  MapPin,
  Phone,
  Plane,
  ShieldCheck,
  UserRound,
} from 'lucide-react';

const navItems = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Security', href: '#security' },
  { label: 'Contact Us', href: '#contact' },
];

const heroBenefits = [
  { label: 'Secure', value: 'Transaction', icon: LockKeyhole },
  { label: 'Multiple', value: 'Currencies', icon: BadgeDollarSign },
  { label: 'Real-Time', value: 'Tracking', icon: Clock3 },
  { label: 'Fast', value: 'Processing', icon: Plane },
];

const services = [
  {
    title: 'International Payments',
    copy: 'Send money securely to beneficiaries across multiple countries using trusted payment rails.',
    icon: Plane,
  },
  {
    title: 'Multiple Currencies',
    copy: 'Choose from common currencies with ZAR as the primary starting point for South African customers.',
    icon: Landmark,
  },
  {
    title: 'Secure Transactions',
    copy: 'Register, log in, and make payments through a focused portal designed around account verification.',
    icon: ShieldCheck,
  },
  {
    title: 'Real-Time Tracking',
    copy: 'Follow payment status from creation through review, approval, and completion.',
    icon: Clock3,
  },
];

const steps = [
  {
    title: 'Create an Account',
    copy: 'Register your personal, account, and security details to get started.',
    icon: UserRound,
  },
  {
    title: 'Enter Payment Details',
    copy: 'Select currency, enter amount, provider, recipient account, and SWIFT code.',
    icon: BadgeDollarSign,
  },
  {
    title: 'Review & Confirm',
    copy: 'Check recipient and payment information before submitting the transaction.',
    icon: CheckCircle2,
  },
  {
    title: 'We Process the Payment',
    copy: 'Your payment is recorded and tracked through the portal workflow.',
    icon: Plane,
  },
];

const securityItems = [
  {
    title: 'Data Encryption',
    copy: 'Payment and account details are handled through secure API communication.',
    icon: LockKeyhole,
  },
  {
    title: 'Access Control',
    copy: 'Login requires username, account number, and password verification.',
    icon: Contact,
  },
  {
    title: 'Verified Records',
    copy: 'Registration checks unique username, account number, ID number, and email.',
    icon: FileCheck2,
  },
  {
    title: 'Secure Infrastructure',
    copy: 'The portal is structured for protected routes and authenticated payment access.',
    icon: ShieldCheck,
  },
];

export const LandingPage: React.FC = () => {
  return (
    <div className="ipp-shell min-h-screen bg-[#e5fff1] text-slate-950">
      <header className="ipp-header">
        <div className="ipp-container flex items-center justify-between gap-6 py-5">
          <Link to="/" className="ipp-brand">
            International
            <span>Payment Portal</span>
          </Link>

          <nav className="hidden items-center gap-8 text-base font-medium text-white/88 lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="transition hover:text-blue-400">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link to="/employee/login" className="hidden text-sm font-black text-white/80 transition hover:text-blue-400 sm:inline">
              Employee Portal
            </Link>
            <Link to="/login" className="ipp-login-button">
              Login
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section id="home" className="ipp-hero">
          <div className="ipp-container ipp-hero-grid">
            <div className="ipp-hero-copy">
              <h1>
                Happy International
                <span>Payment</span>
                <strong>Transactions</strong>
              </h1>
              <p>
                Our secure portal helps South African customers send money to beneficiaries around the world.
                Fast, reliable, and protected with practical account verification.
              </p>

              <div className="ipp-hero-actions">
                <Link to="/register" className="ipp-primary-action">
                  Create an Account
                </Link>
                <Link to="/login" className="ipp-secondary-action">
                  Login to your Account
                </Link>
              </div>
            </div>

            <div className="ipp-hero-art" aria-hidden="true">
              <div className="ipp-globe">
                <img
                  src="https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=1200&q=80"
                  alt=""
                />
                <span className="ipp-orbit orbit-one" />
                <span className="ipp-orbit orbit-two" />
                <span className="ipp-orbit orbit-three" />
              </div>
              <div className="ipp-transfer-card">
                <h2>Send Money Worldwide</h2>
                <label htmlFor="landing-send">You send</label>
                <div className="ipp-converter-row">
                  <input id="landing-send" value="15 000" readOnly aria-label="Amount you send" />
                  <span>
                    <span className="ipp-currency-flag ipp-flag-za" aria-label="South Africa" />
                    ZAR
                  </span>
                </div>
                <label htmlFor="landing-receive">Recipient gets</label>
                <div className="ipp-converter-row">
                  <input id="landing-receive" value="904,64" readOnly aria-label="Recipient amount" />
                  <span>
                    <span className="ipp-currency-flag ipp-flag-us" aria-label="United States" />
                    USD
                  </span>
                </div>
                <Link to="/register" className="ipp-card-action">
                  Get Started
                </Link>
              </div>
            </div>
          </div>

          <div className="ipp-container">
            <div className="ipp-benefit-strip">
              {heroBenefits.map((item) => {
                const Icon = item.icon;

                return (
                  <div key={item.label} className="ipp-benefit">
                    <Icon className="h-6 w-6" />
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.value}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="services" className="ipp-services">
          <div className="ipp-container">
            <div className="ipp-section-heading">
              <p>Our Services</p>
              <h2>Everything you need for international payments</h2>
              <span>Simple, secure, and efficient tools designed for cross-border transfers.</span>
            </div>

            <div className="ipp-service-grid">
              {services.map((service) => {
                const Icon = service.icon;

                return (
                  <article key={service.title} className="ipp-service-card">
                    <div>
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3>{service.title}</h3>
                    <p>{service.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="how-it-works" className="ipp-steps-section">
          <div className="ipp-container">
            <div className="ipp-section-heading">
              <p>How It Works</p>
              <h2>Send money in just a few simple steps</h2>
            </div>

            <div className="ipp-step-grid">
              {steps.map((step, index) => {
                const Icon = step.icon;

                return (
                  <article key={step.title} className="ipp-step-card">
                    <span className="ipp-step-number">{index + 1}</span>
                    <div className="ipp-step-icon">
                      <Icon className="h-9 w-9" />
                    </div>
                    <h3>{step.title}</h3>
                    <p>{step.copy}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="security" className="ipp-security">
          <div className="ipp-container ipp-security-grid">
            <div className="ipp-lock-visual" aria-hidden="true">
              <div className="ipp-lock-body">
                <LockKeyhole className="h-28 w-28" />
              </div>
            </div>

            <div>
              <p className="ipp-green-kicker">Security</p>
              <h2>Your security is our priority</h2>
              <p className="ipp-security-copy">
                We use account verification, authenticated sessions, and secure backend validation to help keep
                customer details and payment activity protected.
              </p>

              <div className="ipp-security-list">
                {securityItems.map((item) => {
                  const Icon = item.icon;

                  return (
                    <article key={item.title}>
                      <Icon className="h-7 w-7" />
                      <h3>{item.title}</h3>
                      <p>{item.copy}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="contact" className="ipp-contact">
          <div className="ipp-container ipp-contact-grid">
            <div>
              <p className="ipp-blue-kicker">Contact Us</p>
              <h2>We're here to help</h2>
              <p className="ipp-contact-intro">
                Have a question or need assistance? Fill out the form and our team will get back to you.
              </p>

              <div className="ipp-contact-list">
                <div>
                  <Mail className="h-7 w-7" />
                  <p>
                    <strong>Email</strong>
                    support@internationalpayment.co.za
                  </p>
                </div>
                <div>
                  <Phone className="h-7 w-7" />
                  <p>
                    <strong>Phone</strong>
                    +27 01 125 3656
                  </p>
                </div>
                <div>
                  <MapPin className="h-7 w-7" />
                  <p>
                    <strong>Address</strong>
                    1 Dingle Street, Waterfront
                    <span>Cape Town, 8001</span>
                    <span>South Africa</span>
                  </p>
                </div>
              </div>
            </div>

            <form className="ipp-contact-form" onSubmit={(e) => e.preventDefault()}>
              <div className="ipp-contact-name-row">
                <label>
                  First Name
                  <input type="text" />
                </label>
                <label>
                  Last Name
                  <input type="text" />
                </label>
              </div>
              <label>
                Email Address
                <input type="email" />
              </label>
              <label>
                Subject
                <input type="text" />
              </label>
              <label>
                Message
                <textarea rows={3} />
              </label>
              <button type="submit">Send Message</button>
            </form>
          </div>
        </section>
      </main>

      <footer className="ipp-footer">
        <div className="ipp-container ipp-footer-grid">
          <div>
            <h2>
              International
              <span>Payment Portal</span>
            </h2>
            <p>A secure and reliable portal for sending international payments worldwide.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            {navItems.map((item) => (
              <a key={item.label} href={item.href}>{item.label}</a>
            ))}
          </div>

          <div>
            <h3>Support</h3>
            <a href="#contact">FAQs</a>
            <a href="#contact">User Guide</a>
            <a href="#contact">Support Center</a>
          </div>

          <div>
            <h3>Legal</h3>
            <a href="#contact">Terms & Conditions</a>
            <a href="#contact">Privacy Policy</a>
          </div>

          <div>
            <h3>Get In Touch</h3>
            <p>support@payment.co.za</p>
            <p>+27 01 125 3656</p>
            <p>1 Dingle Street, Waterfront Cape Town, 8001 South Africa</p>
          </div>
        </div>
        <div className="ipp-container ipp-footer-line" />
      </footer>
    </div>
  );
};
