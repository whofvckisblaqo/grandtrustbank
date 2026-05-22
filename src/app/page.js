import Link from 'next/link';
import LandingNav from '@/components/LandingNav';
import GTBLogo from '@/components/GTBLogo';
import {
  Shield, Zap, Globe, BarChart3, ArrowRight, Lock,
  CheckCircle, Smartphone, CreditCard, Send, Bell, Star, Quote,
  Twitter, Linkedin, Instagram, Youtube, Facebook,
  MapPin, Phone, Mail, ExternalLink, ChevronRight
} from 'lucide-react';

const features = [
  { icon: Zap,      title: 'Instant Transfers',    desc: 'Send money to any bank in the US or Europe in seconds. 24/7, every day of the year.',                      color: '#00E0B8' },
  { icon: Shield,   title: 'Bank-Grade Security',  desc: 'Military-grade 256-bit encryption with real-time fraud detection protecting every transaction.',             color: '#00C9A7' },
  { icon: BarChart3,title: 'Smart Analytics',      desc: 'Beautiful spending insights and reports that help you take control of your finances.',                       color: '#00E0B8' },
  { icon: Globe,    title: 'Global Payments',      desc: 'Send and receive money internationally with the best exchange rates.',                                       color: '#00C9A7' },
];

const stats = [
  { value: '50,000+',  label: 'Active Customers' },
  { value: '$2B+',    label: 'Monthly Transactions' },
  { value: '99.9%',   label: 'Uptime SLA' },
  { value: '256-bit', label: 'Encryption Standard' },
];

const steps = [
  { step: '01', title: 'Create Your Account', desc: 'Fill in your details and get started in under 2 minutes.' },
  { step: '02', title: 'Verify Your Identity', desc: 'Quick KYC process to keep your account safe and compliant.' },
  { step: '03', title: 'Start Banking',        desc: 'Deposit, transfer, pay bills, and manage your finances with ease.' },
];

const testimonials = [
  {
    name: 'Marcus Okonkwo',
    role: 'Entrepreneur, Lagos & New York',
    avatar: 'MO',
    color: '#00E0B8',
    rating: 5,
    text: 'Grand Trust Bank completely transformed how I manage cross-border payments. Moving funds between my US and Nigerian operations used to take days — now it\'s seconds. Absolutely game-changing.',
  },
  {
    name: 'Sophia Hartmann',
    role: 'CFO, Berlin-based SaaS Startup',
    avatar: 'SH',
    color: '#7dd3fc',
    rating: 5,
    text: 'The analytics dashboard alone is worth switching for. I have a real-time view of our company spend, instant FX rates, and the team card controls are flawless. Our finance team saved 6 hours a week.',
  },
  {
    name: 'James Whitfield',
    role: 'Property Investor, London',
    avatar: 'JW',
    color: '#f0c040',
    rating: 5,
    text: 'I\'ve used four different banks over the years. GTB is the first one that actually feels like it was built for someone with serious money to move. The security is bulletproof and the support is incredible.',
  },
  {
    name: 'Aisha Bello',
    role: 'Freelance Designer, Toronto',
    avatar: 'AB',
    color: '#00C9A7',
    rating: 5,
    text: 'Getting paid from international clients used to be a nightmare with hidden fees. GTB gives me the best exchange rates I\'ve seen anywhere, and the virtual card works perfectly for all my subscriptions.',
  },
  {
    name: 'Liam Chen',
    role: 'Tech Lead, San Francisco',
    avatar: 'LC',
    color: '#a78bfa',
    rating: 5,
    text: 'Set up my account in under 3 minutes. Sent $12,000 internationally the same day. No holds, no questions, no nonsense. The app is cleaner than anything else in the fintech space right now.',
  },
  {
    name: 'Fatima Al-Rashid',
    role: 'Import/Export Business, Dubai',
    avatar: 'FA',
    color: '#fb923c',
    rating: 5,
    text: 'Running an import business means I\'m constantly dealing with multi-currency invoices. GTB handles it all seamlessly. The loan facility also helped me bridge a cash flow gap at the perfect moment.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gtb-dark overflow-x-hidden">

      <LandingNav />

      {/* Hero */}
      <section className="relative pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden" style={{ background: '#010810' }}>

        {/* City skyline background */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 1440 700"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Sky gradient */}
            <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#010810"/>
              <stop offset="60%" stopColor="#020d1c"/>
              <stop offset="100%" stopColor="#051428"/>
            </linearGradient>
            {/* Horizon teal glow */}
            <radialGradient id="horizonGlow" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#00E0B8" stopOpacity="0.18"/>
              <stop offset="50%" stopColor="#00E0B8" stopOpacity="0.06"/>
              <stop offset="100%" stopColor="#00E0B8" stopOpacity="0"/>
            </radialGradient>
            {/* Right glow from tall skyscraper */}
            <radialGradient id="skyscraperGlow" cx="62%" cy="40%" r="25%">
              <stop offset="0%" stopColor="#00C9A7" stopOpacity="0.12"/>
              <stop offset="100%" stopColor="#00C9A7" stopOpacity="0"/>
            </radialGradient>
            {/* Text readability overlay */}
            <linearGradient id="overlay" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%"   stopColor="#010810" stopOpacity="0.55"/>
              <stop offset="35%"  stopColor="#010810" stopOpacity="0.20"/>
              <stop offset="65%"  stopColor="#010810" stopOpacity="0.30"/>
              <stop offset="100%" stopColor="#010810" stopOpacity="0.80"/>
            </linearGradient>
            {/* Window patterns */}
            <pattern id="winA" x="0" y="0" width="8" height="10" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="5" height="7" fill="#00E0B8" opacity="0.55" rx="0.5"/>
            </pattern>
            <pattern id="winB" x="0" y="0" width="7" height="9" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="4" height="6" fill="#f0c040" opacity="0.45" rx="0.5"/>
            </pattern>
            <pattern id="winC" x="0" y="0" width="6" height="9" patternUnits="userSpaceOnUse">
              <rect x="0.5" y="1" width="4" height="6" fill="#7dd3fc" opacity="0.35" rx="0.5"/>
            </pattern>
            <pattern id="winD" x="0" y="0" width="9" height="11" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="5" height="7" fill="#00E0B8" opacity="0.40" rx="0.5"/>
              <rect x="1" y="9" width="5" height="1" fill="transparent"/>
            </pattern>
            <pattern id="winMix" x="0" y="0" width="10" height="12" patternUnits="userSpaceOnUse">
              <rect x="1" y="1" width="4" height="8" fill="#00E0B8" opacity="0.50" rx="0.5"/>
              <rect x="6" y="1" width="3" height="8" fill="#f0c040" opacity="0.35" rx="0.5"/>
            </pattern>
          </defs>

          {/* Sky fill */}
          <rect width="1440" height="700" fill="url(#sky)"/>

          {/* Stars */}
          {[
            [80,30],[140,55],[220,20],[310,45],[400,18],[480,60],[570,25],[660,48],[750,15],[840,38],
            [920,22],[1010,52],[1100,30],[1180,18],[1270,42],[1360,28],[1410,58],[50,70],[170,85],
            [290,75],[430,90],[560,68],[700,82],[820,72],[960,88],[1090,65],[1220,80],[1380,75],
          ].map(([x,y], i) => (
            <circle key={i} cx={x} cy={y} r={i % 3 === 0 ? 1.2 : 0.7} fill="white" opacity={0.3 + (i % 4) * 0.1}/>
          ))}

          {/* ── BACK LAYER: distant buildings (darker, shorter) ── */}
          {/* Far left cluster */}
          <rect x="0"   y="420" width="60"  height="280" fill="#071220"/>
          <rect x="55"  y="390" width="45"  height="310" fill="#081525"/>
          <rect x="95"  y="430" width="55"  height="270" fill="#071220"/>
          <rect x="145" y="400" width="40"  height="300" fill="#091628"/>
          <rect x="180" y="450" width="50"  height="250" fill="#071220"/>
          {/* Left-center cluster */}
          <rect x="225" y="370" width="55"  height="330" fill="#091628"/>
          <rect x="275" y="410" width="40"  height="290" fill="#081525"/>
          <rect x="310" y="380" width="65"  height="320" fill="#0a1a2e"/>
          <rect x="370" y="420" width="45"  height="280" fill="#071220"/>
          {/* Center-back */}
          <rect x="500" y="350" width="60"  height="350" fill="#0c1e34"/>
          <rect x="555" y="380" width="50"  height="320" fill="#091628"/>
          {/* Right cluster */}
          <rect x="1050" y="400" width="55" height="300" fill="#091628"/>
          <rect x="1100" y="370" width="65" height="330" fill="#0a1a2e"/>
          <rect x="1160" y="420" width="45" height="280" fill="#071220"/>
          <rect x="1200" y="390" width="55" height="310" fill="#081525"/>
          <rect x="1250" y="440" width="40" height="260" fill="#071220"/>
          <rect x="1285" y="400" width="60" height="300" fill="#091628"/>
          <rect x="1340" y="430" width="50" height="270" fill="#071220"/>
          <rect x="1385" y="410" width="55" height="290" fill="#081525"/>

          {/* Back layer windows — teal tinted */}
          <rect x="0"   y="420" width="60"  height="200" fill="url(#winC)" opacity="0.5"/>
          <rect x="55"  y="390" width="45"  height="220" fill="url(#winC)" opacity="0.4"/>
          <rect x="225" y="370" width="55"  height="250" fill="url(#winC)" opacity="0.45"/>
          <rect x="310" y="380" width="65"  height="240" fill="url(#winC)" opacity="0.4"/>
          <rect x="500" y="350" width="60"  height="260" fill="url(#winC)" opacity="0.45"/>
          <rect x="1100" y="370" width="65" height="250" fill="url(#winC)" opacity="0.4"/>
          <rect x="1200" y="390" width="55" height="230" fill="url(#winC)" opacity="0.45"/>

          {/* ── MID LAYER: medium buildings ── */}
          <rect x="30"  y="310" width="75"  height="390" fill="#0d2035"/>
          <rect x="100" y="340" width="60"  height="360" fill="#0e2438"/>
          <rect x="155" y="300" width="80"  height="400" fill="#0c1e34"/>
          <rect x="230" y="280" width="70"  height="420" fill="#0f2640"/>
          <rect x="295" y="320" width="85"  height="380" fill="#0d2035"/>
          <rect x="375" y="290" width="65"  height="410" fill="#0c1e34"/>
          <rect x="435" y="340" width="75"  height="360" fill="#0e2438"/>

          {/* Right mid buildings */}
          <rect x="980"  y="330" width="75" height="370" fill="#0d2035"/>
          <rect x="1050" y="300" width="60" height="400" fill="#0c1e34"/>
          <rect x="1105" y="320" width="80" height="380" fill="#0e2438"/>
          <rect x="1180" y="270" width="70" height="430" fill="#0f2640"/>
          <rect x="1245" y="310" width="85" height="390" fill="#0d2035"/>
          <rect x="1325" y="290" width="65" height="410" fill="#0c1e34"/>
          <rect x="1385" y="330" width="55" height="370" fill="#0e2438"/>

          {/* Mid layer windows */}
          <rect x="30"  y="310" width="75"  height="280" fill="url(#winB)" opacity="0.55"/>
          <rect x="100" y="340" width="60"  height="250" fill="url(#winA)" opacity="0.50"/>
          <rect x="155" y="300" width="80"  height="290" fill="url(#winB)" opacity="0.45"/>
          <rect x="230" y="280" width="70"  height="300" fill="url(#winMix)" opacity="0.50"/>
          <rect x="295" y="320" width="85"  height="270" fill="url(#winA)" opacity="0.45"/>
          <rect x="375" y="290" width="65"  height="280" fill="url(#winB)" opacity="0.55"/>
          <rect x="980"  y="330" width="75" height="270" fill="url(#winA)" opacity="0.50"/>
          <rect x="1105" y="320" width="80" height="280" fill="url(#winB)" opacity="0.45"/>
          <rect x="1180" y="270" width="70" height="300" fill="url(#winMix)" opacity="0.50"/>
          <rect x="1245" y="310" width="85" height="270" fill="url(#winA)" opacity="0.45"/>
          <rect x="1325" y="290" width="65" height="280" fill="url(#winB)" opacity="0.55"/>

          {/* ── MAIN SKYSCRAPERS (center focus) ── */}

          {/* Left main tower */}
          <rect x="490" y="180" width="110" height="520" fill="#102840" rx="2"/>
          {/* setback */}
          <rect x="510" y="140" width="70"  height="50"  fill="#122e48" rx="1"/>
          <rect x="530" y="100" width="30"  height="50"  fill="#142f48" rx="1"/>
          {/* antenna */}
          <rect x="543" y="60"  width="4"   height="45"  fill="#1a3d5c"/>
          <circle cx="545" cy="58" r="3" fill="#00E0B8" opacity="0.9"/>
          {/* windows */}
          <rect x="495" y="185" width="100" height="440" fill="url(#winMix)" opacity="0.60"/>
          <rect x="515" y="145" width="60"  height="44"  fill="url(#winA)"  opacity="0.55"/>

          {/* Tallest center skyscraper */}
          <rect x="620" y="80"  width="130" height="620" fill="#132c45" rx="2"/>
          {/* stepped crown */}
          <rect x="635" y="60"  width="100" height="30"  fill="#163450" rx="1"/>
          <rect x="650" y="38"  width="70"  height="30"  fill="#183858" rx="1"/>
          <rect x="665" y="18"  width="40"  height="26"  fill="#1a3c5e" rx="1"/>
          {/* spire */}
          <rect x="683" y="-20" width="4"   height="45"  fill="#1f4a72"/>
          <circle cx="685" cy="-22" r="4"   fill="#00E0B8" opacity="0.95"/>
          <circle cx="685" cy="-22" r="8"   fill="#00E0B8" opacity="0.15"/>
          {/* windows */}
          <rect x="625" y="85"  width="120" height="560" fill="url(#winD)"  opacity="0.60"/>
          <rect x="640" y="65"  width="90"  height="28"  fill="url(#winA)"  opacity="0.50"/>
          <rect x="655" y="44"  width="60"  height="22"  fill="url(#winA)"  opacity="0.45"/>
          {/* accent glow lines */}
          <rect x="620" y="80"  width="3"   height="620" fill="#00E0B8" opacity="0.06"/>
          <rect x="747" y="80"  width="3"   height="620" fill="#00E0B8" opacity="0.06"/>

          {/* Right main tower */}
          <rect x="760" y="150" width="120" height="550" fill="#102840" rx="2"/>
          <rect x="775" y="120" width="90"  height="38"  fill="#122e48" rx="1"/>
          <rect x="790" y="90"  width="60"  height="38"  fill="#142f48" rx="1"/>
          <rect x="818" y="50"  width="4"   height="46"  fill="#1a3d5c"/>
          <circle cx="820" cy="48" r="3" fill="#f0c040" opacity="0.8"/>
          <rect x="765" y="155" width="110" height="500" fill="url(#winMix)" opacity="0.58"/>
          <rect x="780" y="125" width="80"  height="32"  fill="url(#winB)"  opacity="0.50"/>

          {/* Second tallest — far right of center */}
          <rect x="890" y="120" width="100" height="580" fill="#11263e" rx="2"/>
          <rect x="905" y="100" width="70"  height="28"  fill="#13304c" rx="1"/>
          <rect x="920" y="78"  width="40"  height="30"  fill="#163456" rx="1"/>
          <rect x="938" y="38"  width="4"   height="46"  fill="#1a3d5c"/>
          <circle cx="940" cy="36" r="3.5" fill="#00E0B8" opacity="0.85"/>
          <rect x="895" y="125" width="90"  height="540" fill="url(#winA)"  opacity="0.55"/>

          {/* Skyscraper glow */}
          <rect width="1440" height="700" fill="url(#skyscraperGlow)"/>

          {/* ── FRONT LAYER: close buildings (dark silhouettes) ── */}
          <rect x="0"   y="560" width="90"  height="140" fill="#050e1a"/>
          <rect x="85"  y="530" width="70"  height="170" fill="#060f1b"/>
          <rect x="150" y="555" width="85"  height="145" fill="#050e1a"/>
          <rect x="230" y="520" width="60"  height="180" fill="#060f1b"/>
          <rect x="285" y="545" width="75"  height="155" fill="#050e1a"/>
          <rect x="355" y="535" width="55"  height="165" fill="#060f1b"/>
          <rect x="405" y="560" width="80"  height="140" fill="#050e1a"/>

          <rect x="1000" y="560" width="80" height="140" fill="#050e1a"/>
          <rect x="1075" y="535" width="55" height="165" fill="#060f1b"/>
          <rect x="1125" y="545" width="75" height="155" fill="#050e1a"/>
          <rect x="1195" y="520" width="60" height="180" fill="#060f1b"/>
          <rect x="1250" y="555" width="85" height="145" fill="#050e1a"/>
          <rect x="1330" y="530" width="70" height="170" fill="#060f1b"/>
          <rect x="1395" y="560" width="45" height="140" fill="#050e1a"/>

          {/* Ground — city base */}
          <rect x="0" y="680" width="1440" height="20" fill="#020810"/>

          {/* Horizon glow */}
          <rect width="1440" height="700" fill="url(#horizonGlow)"/>

          {/* Text readability overlay */}
          <rect width="1440" height="700" fill="url(#overlay)"/>
        </svg>

        {/* Subtle dot-grid on top */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(0,224,184,0.05) 1px, transparent 1px)',
            backgroundSize: '36px 36px',
          }}
        />

        <div className="orb orb-teal w-[600px] h-[600px] -top-40 -right-40 animate-pulse-glow" style={{ opacity: 0.35 }} />
        <div className="orb orb-blue w-[400px] h-[400px] -bottom-20 -left-20 animate-pulse-glow delay-700" style={{ opacity: 0.25 }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* Left */}
            <div className="animate-slide-up">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full glass border border-gtb-accent/20 mb-6">
                <div className="w-2 h-2 rounded-full bg-gtb-accent animate-pulse" />
                <span className="text-gtb-accent text-xs font-medium">Now live in USA &amp; Europe</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.1] mb-6">
                Banking
                <span className="block gradient-text">Beyond</span>
                <span className="block text-white">Boundaries.</span>
              </h1>
              <p className="text-gtb-subtle text-lg leading-relaxed mb-8 max-w-md">
                Grand Trust Bank — where cutting-edge technology meets financial excellence.
                Experience banking that actually works for you.
              </p>
              <div className="flex flex-wrap gap-4 mb-10">
                <Link href="/register" className="btn-primary text-base px-6 py-3">
                  Open Free Account <ArrowRight size={16} />
                </Link>
                <Link href="/login" className="btn-ghost text-base px-6 py-3">Sign In</Link>
              </div>
              <div className="flex flex-wrap gap-5">
                {['No monthly fees', 'Instant setup', 'FDIC insured'].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm text-gtb-subtle">
                    <CheckCircle size={14} className="text-gtb-accent" /> {item}
                  </div>
                ))}
              </div>
            </div>

            {/* Right — floating card */}
            <div className="relative flex justify-center lg:justify-end animate-slide-up delay-200">
              <div className="relative w-full max-w-sm">

                <div
                  className="relative w-full aspect-[1.7/1] rounded-2xl p-6 overflow-hidden animate-float"
                  style={{
                    background: 'linear-gradient(135deg, #00E0B8 0%, #0d3d35 40%, #0B1020 100%)',
                    boxShadow: '0 25px 80px rgba(0,224,184,0.35), 0 0 120px rgba(0,224,184,0.1)',
                  }}
                >
                  <div className="absolute inset-0 opacity-[0.07]"
                    style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <div className="text-white/60 text-xs">Grand Trust Bank</div>
                      <div className="text-white font-bold text-sm">PREMIUM</div>
                    </div>
                    <div className="w-10 h-8 rounded"
                      style={{ background: 'linear-gradient(135deg, #f0c040, #d4a020)', boxShadow: '0 2px 8px rgba(240,192,64,0.4)' }} />
                  </div>
                  <div className="mb-4">
                    <div className="text-white/50 text-xs mb-1">Available Balance</div>
                    <div className="text-white text-2xl font-black">$ 2,845,392.50</div>
                  </div>
                  <div className="flex justify-between items-end">
                    <div>
                      <div className="text-white/50 text-xs">**** **** **** 4521</div>
                      <div className="text-white text-sm font-medium mt-1">JOHN DOE</div>
                    </div>
                    <div className="text-right">
                      <div className="text-white/50 text-xs">EXPIRES</div>
                      <div className="text-white text-sm">12/28</div>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-6 -left-6 glass-card rounded-2xl p-4 animate-float2" style={{ minWidth: 170, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'rgba(0,224,184,0.15)' }}>
                      <Send size={14} className="text-gtb-accent" />
                    </div>
                    <div>
                      <div className="text-xs text-gtb-subtle">Last Transfer</div>
                      <div className="text-white text-sm font-semibold">$45,000</div>
                    </div>
                  </div>
                  <div className="text-xs text-gtb-success flex items-center gap-1">
                    <CheckCircle size={11} /> Completed
                  </div>
                </div>

                <div className="absolute -top-4 -right-4 glass-card rounded-2xl p-3 animate-float delay-300" style={{ minWidth: 155, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gtb-success/10">
                      <Bell size={13} className="text-gtb-success" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Credit Alert</div>
                      <div className="text-xs text-gtb-accent">+$150,000</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-white/[0.06] py-8 bg-gtb-card/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x divide-white/[0.06]">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center px-6">
                <div className="text-2xl sm:text-3xl font-black gradient-text mb-1">{value}</div>
                <div className="text-gtb-muted text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-gradient py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-info text-xs font-medium mb-4">
              <Zap size={12} /> Why Choose GTB
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Everything you need to <span className="gradient-text">bank smarter</span>
            </h2>
            <p className="text-gtb-subtle max-w-xl mx-auto">
              Built with the latest technology to give you the most seamless and secure banking experience possible.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ icon: Icon, title, desc, color }) => (
              <div key={title} className="glass-card rounded-2xl p-6 card-hover cursor-default">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
                  <Icon size={22} style={{ color }} />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Up and running in <span className="gradient-text">3 simple steps</span>
            </h2>
            <p className="text-gtb-subtle max-w-md mx-auto">
              No branch visits. No paperwork. Open your account from anywhere in minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {steps.map(({ step, title, desc }, i) => (
              <div key={step} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-full h-px"
                    style={{ background: 'linear-gradient(90deg, rgba(0,224,184,0.3), transparent)' }} />
                )}
                <div className="glass-card rounded-2xl p-6 text-center card-hover">
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
                    style={{ background: 'linear-gradient(135deg, rgba(0,224,184,0.15), rgba(0,201,167,0.08))', border: '1px solid rgba(0,224,184,0.25)' }}>
                    <span className="gradient-text font-black text-lg">{step}</span>
                  </div>
                  <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                  <p className="text-gtb-subtle text-sm leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-info text-xs font-medium mb-4">
              <Star size={12} /> Customer Stories
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              Trusted by customers <span className="gradient-text">worldwide</span>
            </h2>
            <p className="text-gtb-subtle max-w-lg mx-auto">
              From solo freelancers to growing businesses — see what real customers say about banking with GTB.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {testimonials.map(({ name, role, avatar, color, rating, text }) => (
              <div key={name} className="glass-card rounded-2xl p-6 card-hover flex flex-col gap-4">
                {/* Quote icon */}
                <Quote size={22} style={{ color }} className="opacity-60 flex-shrink-0" />

                {/* Stars */}
                <div className="flex items-center gap-1">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={13} className="fill-current text-gtb-accent" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-gtb-subtle text-sm leading-relaxed flex-1">"{text}"</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                    style={{ background: `${color}20`, border: `1px solid ${color}35`, color }}
                  >
                    {avatar}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{name}</div>
                    <div className="text-gtb-muted text-xs">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Trust bar */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8">
            {[
              { label: '4.9/5 App Store rating',    sub: 'Over 12,000 reviews' },
              { label: '4.8/5 Trustpilot score',    sub: 'Rated Excellent' },
              { label: '#1 Fintech bank 2025',       sub: 'FinTech Global Awards' },
            ].map(({ label, sub }) => (
              <div key={label} className="text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className="fill-current text-gtb-accent" />
                  ))}
                </div>
                <div className="text-white text-sm font-semibold">{label}</div>
                <div className="text-gtb-muted text-xs">{sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28 border-t border-white/[0.06]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative glass-card rounded-3xl p-8 md:p-12 overflow-hidden text-center">
            <div className="orb orb-teal w-96 h-96 -top-20 -right-20 animate-pulse-glow" />
            <div className="orb orb-blue w-80 h-80 -bottom-10 -left-10 animate-pulse-glow delay-500" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
                Ready to experience <span className="gradient-text">premium banking?</span>
              </h2>
              <p className="text-gtb-subtle mb-8 max-w-lg mx-auto">
                Join thousands of customers who have already made the switch to smarter banking.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/register" className="btn-primary text-base px-8 py-4">
                  Open Free Account <ArrowRight size={18} />
                </Link>
                <Link href="/login" className="btn-ghost text-base px-8 py-4">Sign In</Link>
              </div>
              <div className="flex flex-wrap justify-center gap-6 mt-8">
                {[Shield, Lock, CreditCard, Smartphone].map((Icon, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gtb-subtle">
                    <Icon size={14} className="text-gtb-accent" />
                    {['Bank-grade security', 'FDIC insured', 'Free virtual card', 'Mobile ready'][i]}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] bg-gtb-card/30">

        {/* Newsletter strip */}
        <div className="border-b border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Stay ahead of your finances</h3>
                <p className="text-gtb-muted text-sm">Market updates, product news and exclusive offers — no spam.</p>
              </div>
              <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
                <div className="relative flex-1 md:w-72">
                  <Mail size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gtb-muted pointer-events-none" />
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="w-full bg-white/[0.05] border border-white/[0.10] rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gtb-muted focus:outline-none focus:border-gtb-accent/50 transition-colors"
                  />
                </div>
                <button className="btn-primary text-sm px-5 py-2.5 whitespace-nowrap">Subscribe</button>
              </form>
            </div>
          </div>
        </div>

        {/* Main link grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">

            {/* Brand column */}
            <div className="col-span-2 md:col-span-3 lg:col-span-2">
              <GTBLogo size={38} showText={true} />
              <p className="text-gtb-muted text-sm leading-relaxed mt-4 max-w-xs">
                Grand Trust Bank brings world-class digital banking to individuals and businesses
                across the US and Europe. Fast, secure, and built for the way you live.
              </p>

              {/* Social links */}
              <div className="flex gap-3 mt-6">
                {[
                  { Icon: Twitter,   label: 'Twitter'   },
                  { Icon: Linkedin,  label: 'LinkedIn'  },
                  { Icon: Instagram, label: 'Instagram' },
                  { Icon: Facebook,  label: 'Facebook'  },
                  { Icon: Youtube,   label: 'YouTube'   },
                ].map(({ Icon, label }) => (
                  <a
                    key={label}
                    href="#"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-gtb-muted hover:text-gtb-accent hover:border-gtb-accent/30 hover:bg-gtb-accent/10 transition-all"
                  >
                    <Icon size={15} />
                  </a>
                ))}
              </div>

              {/* Contact block */}
              <div className="mt-6 space-y-2">
                {[
                  { Icon: MapPin, text: '350 Fifth Avenue, New York, NY 10118' },
                  { Icon: Phone,  text: '+1 (800) 482-7265' },
                  { Icon: Mail,   text: 'support@grandtrustbank.com' },
                ].map(({ Icon, text }) => (
                  <div key={text} className="flex items-start gap-2.5 text-xs text-gtb-muted">
                    <Icon size={13} className="text-gtb-accent mt-0.5 flex-shrink-0" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Products */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Products</h4>
              <ul className="space-y-2.5">
                {[
                  'Checking Account', 'Savings Account', 'Virtual Cards',
                  'Instant Transfers', 'International Payments',
                  'Bill Payments', 'Crypto Trading', 'Business Loans',
                ].map(item => (
                  <li key={item}>
                    <a href="#" className="group flex items-center gap-1.5 text-sm text-gtb-muted hover:text-white transition-colors">
                      <ChevronRight size={12} className="text-gtb-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Company</h4>
              <ul className="space-y-2.5">
                {[
                  'About Us', 'Careers', 'Press & Media', 'Blog',
                  'Partners', 'Investor Relations', 'ESG Report',
                ].map(item => (
                  <li key={item}>
                    <a href="#" className="group flex items-center gap-1.5 text-sm text-gtb-muted hover:text-white transition-colors">
                      <ChevronRight size={12} className="text-gtb-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources & Legal */}
            <div>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Resources</h4>
              <ul className="space-y-2.5 mb-8">
                {[
                  { label: 'Help Center', ext: false },
                  { label: 'Security',    ext: false },
                  { label: 'API Docs',    ext: true  },
                  { label: 'System Status', ext: true },
                  { label: 'Community',   ext: false },
                ].map(({ label, ext }) => (
                  <li key={label}>
                    <a href="#" className="group flex items-center gap-1.5 text-sm text-gtb-muted hover:text-white transition-colors">
                      <ChevronRight size={12} className="text-gtb-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {label}
                      {ext && <ExternalLink size={10} className="text-gtb-muted/50 ml-auto" />}
                    </a>
                  </li>
                ))}
              </ul>
              <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4">Legal</h4>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Compliance'].map(item => (
                  <li key={item}>
                    <a href="#" className="group flex items-center gap-1.5 text-sm text-gtb-muted hover:text-white transition-colors">
                      <ChevronRight size={12} className="text-gtb-accent opacity-0 group-hover:opacity-100 transition-opacity -ml-1" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>

        {/* Regulatory badges row */}
        <div className="border-t border-white/[0.06]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-wrap gap-3 justify-center md:justify-start mb-6">
              {[
                { label: 'FDIC Insured',       sub: 'Up to $250,000'     },
                { label: 'FCA Regulated',      sub: 'Reg. No. 987654'    },
                { label: '256-bit SSL',         sub: 'TLS 1.3 Encrypted'  },
                { label: 'PCI DSS Level 1',    sub: 'Payment Security'   },
                { label: 'SOC 2 Type II',      sub: 'Certified'          },
              ].map(({ label, sub }) => (
                <div key={label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/[0.07]">
                  <Shield size={12} className="text-gtb-accent flex-shrink-0" />
                  <div>
                    <div className="text-white text-xs font-semibold leading-none">{label}</div>
                    <div className="text-gtb-muted text-[10px] leading-none mt-0.5">{sub}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-5 border-t border-white/[0.06]">
              <p className="text-gtb-muted text-xs text-center sm:text-left">
                © 2026 Grand Trust Bank, Inc. All rights reserved. Grand Trust Bank is a registered financial institution.
                Deposits insured by the FDIC. Banking services provided by Grand Trust Bank, N.A., Member FDIC.
              </p>
              <Link href="/admin/login" className="text-gtb-muted/30 hover:text-gtb-muted/60 text-xs transition-colors whitespace-nowrap">
                Staff Portal
              </Link>
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
}
