
import React, { useState, useEffect, useRef } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
  useParams,
  Navigate
} from 'react-router-dom';
import {
  Home,
  Layers,
  MessageSquare,
  Settings,
  Plus,
  Star,
  ChevronRight,
  Mail,
  Linkedin,
  Instagram,
  Facebook,
  LogOut,
  Trash2,
  Edit,
  Send,
  User,
  ExternalLink,
  ChevronLeft,
  Eye,
  CheckCircle,
  Zap,
  XCircle,
  Clock,
  ArrowRight,
  Menu,
  X,
  Lock,
  FileText,
  Calendar,
  Briefcase,
  TrendingUp,
  Save,
  Image as ImageIcon,
  AlertCircle,
  Activity,
  UserCheck,
  Database
} from 'lucide-react';
import { ref, onValue, set, push, remove, update } from 'firebase/database';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from './firebase';
import {
  Profile,
  Skill,
  Service,
  ClientWork,
  Post,
  Feedback,
  HireRequest,
  ContactMessage,
  Analytics,
  Review
} from './types';

// --- Custom Hooks ---
const useScrollReveal = () => {
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
};

// --- Utilities ---
const toBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });

const formatRelativeTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMins = Math.floor(diffInMs / 60000);
  if (diffInMins < 60) return `${diffInMins}m ago`;
  const diffInHours = Math.floor(diffInMs / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  return date.toLocaleDateString();
};

// --- Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
};

const Button = ({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`px-8 py-4 rounded-2xl font-bold transition-all active:scale-95 disabled:opacity-50 shadow-sm hover:shadow-lg ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card = ({ children, className = '' }: { children?: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={`bg-white rounded-[2.5rem] border border-gray-100 app-shadow overflow-hidden premium-card ${className}`}>
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle, centered = false }: { title: string, subtitle?: string, centered?: boolean }) => (
  <div className={`mb-12 px-4 ${centered ? 'text-center' : ''}`}>
    <h2 className="text-4xl font-extrabold tracking-tight text-gray-900 gradient-text mb-2">{title}</h2>
    {subtitle && <p className="text-gray-400 font-semibold uppercase tracking-[0.2em] text-[10px]">{subtitle}</p>}
  </div>
);

const Header = ({ profile }: { profile: Profile | null }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Posts', path: '/posts', icon: <FileText size={18} /> },
    { label: 'Services', path: '/services', icon: <Layers size={18} /> },
    { label: 'Reviews', path: '/feedback', icon: <MessageSquare size={18} /> },
    { label: 'Contact', path: '/contact', icon: <Mail size={18} /> },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] glass-header">
      <div className="max-w-screen-lg mx-auto px-6 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm transition-transform group-hover:scale-105">
            <img
              src={profile?.profilePic || 'https://i.postimg.cc/SjVpQwjZ/arib.jpg'}
              alt="Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="font-black text-sm uppercase tracking-widest text-gray-900">
            {profile?.name || "Muhammad Arib"}
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative text-[10px] font-black uppercase tracking-widest transition-colors hover:text-blue-600 ${location.pathname === item.path ? 'text-blue-600 nav-link-active' : 'text-gray-400'}`}
            >
              {item.label}
            </Link>
          ))}

        </nav>

        <button
          className="md:hidden p-2 text-gray-900"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-gray-100 shadow-xl animate-in slide-in-from-top duration-300">
          <nav className="flex flex-col p-6 gap-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-4 text-xs font-black uppercase tracking-widest transition-colors ${location.pathname === item.path ? 'text-blue-600' : 'text-gray-400'}`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

// --- Pages ---

const LandingPage = ({ profile, skills, services, works, feedback }: any) => {
  useScrollReveal();

  return (
    <div className="pb-32 animate-slide-up bg-white min-h-screen">
      {/* Dynamic Banner Section */}
      {profile?.bannerImage && (
        <div className="w-full h-64 md:h-80 relative overflow-hidden">
          <img src={profile.bannerImage} alt="Cover" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent"></div>
        </div>
      )}

      <section className={`${profile?.bannerImage ? '-mt-32 relative z-10' : 'pt-20'} pb-24 px-6 text-center`}>
        <div className="relative inline-block mb-10 animate-hero-pop">
          <div className="w-36 h-36 md:w-48 md:h-48 rounded-[2.5rem] border-8 border-white shadow-2xl overflow-hidden mx-auto rotate-3 hover:rotate-0 transition-transform duration-500">
            <img src={profile?.profilePic || 'https://i.postimg.cc/SjVpQwjZ/arib.jpg'} alt={profile?.name} className="w-full h-full object-cover scale-110 hover:scale-100 transition-transform duration-700" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-2xl border-4 border-white flex items-center justify-center shadow-lg">
            <div className="w-2.5 h-2.5 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
          {profile?.name || "Muhammad Arib"}
        </h1>

        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {profile?.headlines?.map((h: string, i: number) => (
            <span
              key={i}
              className="px-6 py-2 bg-white/60 backdrop-blur-md text-gray-800 text-xs font-bold rounded-full border border-gray-100 shadow-sm uppercase tracking-wider animate-staggered-fade"
              style={{ animationDelay: `${0.4 + (i * 0.1)}s` }}
            >
              {h}
            </span>
          ))}
        </div>

        <p className="max-w-2xl mx-auto text-gray-500 text-xl font-medium leading-relaxed mb-12 px-4 animate-slide-up" style={{ animationDelay: '0.8s' }}>
          {profile?.intro || "Transforming brands through high-impact social media strategies and data-driven marketing."}
        </p>

        <div className="flex justify-center gap-10 py-8 bg-white/40 backdrop-blur-sm rounded-[3rem] border border-white/60 max-w-lg mx-auto shadow-sm animate-slide-up" style={{ animationDelay: '1s' }}>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900">{profile?.experienceYears || "2"}+</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Experience</div>
          </div>
          <div className="w-px bg-gray-200 self-stretch"></div>
          <div className="text-center">
            <div className="text-3xl font-black text-gray-900">{profile?.clientsCompleted || "5"}+</div>
            <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Clients</div>
          </div>
        </div>
      </section>

      <section id="expertise" className="px-6 mb-24 max-w-4xl mx-auto">
        <SectionTitle title="Expertise" subtitle="My dynamic digital toolkit" />
        <div className="flex flex-wrap gap-3">
          {skills.map((skill: Skill) => (
            <div key={skill.id} className="px-6 py-4 bg-white border border-gray-100 rounded-2xl font-bold text-sm text-gray-700 shadow-sm hover:shadow-md hover:border-blue-100 transition-all cursor-default">
              {skill.name}
            </div>
          ))}
        </div>
      </section>

      <section id="services" className="px-6 mb-24 max-w-5xl mx-auto">
        <div className="flex justify-between items-end mb-12">
          <SectionTitle title="Services" subtitle="Professional brand elevation" />
          <Link to="/services" className="text-blue-600 font-black mb-12 flex items-center group text-sm uppercase tracking-wider">
            Explore All <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.slice(0, 4).map((service: Service) => (
            <Link key={service.id} to={`/service/${service.id}`} className="reveal">
              <Card className="p-3 h-full flex flex-col">
                <div className="h-56 rounded-[2rem] overflow-hidden bg-gray-50 mb-6">
                  <img src={service.image} className="w-full h-full object-cover" alt={service.title} />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-black text-gray-900 mb-3">{service.title}</h3>
                  <p className="text-gray-500 font-medium text-sm line-clamp-2 leading-relaxed flex-1">{service.description}</p>
                  <div className="mt-6 flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                    Learn More <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section id="work" className="px-6 mb-24 bg-gray-50/50 py-24 -mx-6 md:mx-auto md:rounded-[4rem] max-w-6xl">
        <SectionTitle title="Success Stories" subtitle="Client results & reviews" centered />
        <div className="flex flex-col gap-8 max-w-4xl mx-auto px-6">
          {works.map((work: ClientWork) => (
            <Card key={work.id} className="p-10 border-none bg-white/80 reveal">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl flex-shrink-0">
                  <img src={work.image} className="w-full h-full object-cover" alt={work.clientName} />
                </div>
                <div className="text-center md:text-left">
                  <div className="flex justify-center md:justify-start text-amber-400 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                  </div>
                  <p className="text-xl font-medium text-gray-700 italic leading-relaxed mb-6">"{work.reviewText}"</p>
                  <h4 className="font-black text-gray-900 text-sm uppercase tracking-widest">— {work.clientName}</h4>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section id="connect" className="px-6 mb-24 text-center">
        <SectionTitle title="Connect with Me" subtitle="Let's strategize together" centered />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <SocialLink href={profile?.linkedin || "https://www.linkedin.com/in/xarib147/"} icon={<Linkedin size={28} />} color="bg-blue-600 hover:bg-blue-700" label="LinkedIn" />
          <SocialLink href={profile?.instagram || "https://www.instagram.com/x.arib147"} icon={<Instagram size={28} />} color="bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 hover:brightness-110" label="Instagram" />
          <SocialLink href={profile?.facebook || "https://www.facebook.com/x.arib147"} icon={<Facebook size={28} />} color="bg-blue-700 hover:bg-blue-800" label="Facebook" />
          <SocialLink href={`mailto:${profile?.email || "x.arib147@gmail.com"}`} icon={<Mail size={28} />} color="bg-gray-900 hover:bg-black" label="Email" />
        </div>
      </section>

      <section id="feedback" className="px-6 mb-24 max-w-6xl mx-auto">
        <SectionTitle title="Community" subtitle="What others are saying" />
        <div className="flex overflow-x-auto gap-6 pb-12 no-scrollbar px-4 -mx-4">
          {feedback.filter((f: Feedback) => f.isVisible).map((f: Feedback) => (
            <div key={f.id} className="min-w-[300px] md:min-w-[350px] bg-white p-8 rounded-[2.5rem] app-shadow border border-gray-50 flex flex-col justify-between transition-all hover:border-blue-100 reveal">
              <div>
                <div className="flex text-amber-400 mb-4">
                  {[...Array(f.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-gray-600 font-medium italic mb-8">"{f.message}"</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gray-900 flex items-center justify-center text-white font-black text-lg">
                  {f.name.charAt(0)}
                </div>
                <div>
                  <h5 className="font-black text-gray-900 text-sm uppercase tracking-wider">{f.name}</h5>
                  <span className="text-[10px] font-bold text-gray-400">Verified Client</span>
                </div>
              </div>
            </div>
          ))}
          <Link to="/feedback" className="min-w-[200px] bg-white border-4 border-dashed border-gray-100 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 group hover:border-blue-200 transition-all reveal">
            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Plus size={28} />
            </div>
            <span className="text-xs font-black text-gray-400 uppercase tracking-widest group-hover:text-blue-600 text-center">Post Your Review</span>
          </Link>
        </div>
      </section>

      <footer className="px-6 py-24 bg-gray-900 text-white rounded-t-[4rem] text-center">
        <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to grow your brand?</h2>
        <p className="text-gray-400 mb-12 max-w-md mx-auto font-medium leading-relaxed">Let's craft high-impact digital campaigns that deliver real results for your business.</p>
        <Link to="/contact">
          <Button className="bg-white text-gray-900 hover:scale-105 px-10">Start the Journey</Button>
        </Link>
        <div className="mt-24 pt-10 border-t border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-600">
          &copy; {new Date().getFullYear()} MUHAMMAD ARIB &bull; DIGITAL MARKETING SPECIALIST
        </div>
      </footer>
    </div>
  );
};

const PostsPage = ({ posts, loading }: { posts: Post[], loading?: boolean }) => {
  useScrollReveal();
  return (
    <div className="px-6 pb-40 pt-40 animate-slide-up max-w-5xl mx-auto">
      <SectionTitle title="Latest Insights" subtitle="Marketing strategies & updates" />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Fetching Insights...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {posts.length > 0 ? posts.map((post) => (
            <Link key={post.id} to={`/post/${post.id}`} className="reveal">
              <Card className="h-full flex flex-col group">
                <div className="h-64 overflow-hidden bg-gray-50">
                  <img
                    src={post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt={post.title}
                  />
                </div>
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center gap-3 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
                    <Calendar size={14} /> {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4 leading-tight group-hover:text-blue-600 transition-colors">{post.title}</h3>
                  <p className="text-gray-500 font-medium text-sm leading-relaxed line-clamp-3 mb-6">{post.content}</p>
                  <div className="mt-auto flex items-center text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Read Full Story <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </Card>
            </Link>
          )) : (
            <div className="md:col-span-2 py-20 text-center">
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No posts published yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const PostDetailPage = ({ posts }: { posts: Post[] }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const post = posts.find(p => p.id === id);

  if (!post) return <div className="p-40 text-center font-bold">Post not found.</div>;

  return (
    <div className="pb-32 animate-slide-up bg-white min-h-screen pt-20">
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={post.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt={post.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl active:scale-90 transition-all hover:bg-white z-10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="px-6 -mt-32 relative max-w-3xl mx-auto">
        <Card className="p-10 md:p-16 border-none shadow-2xl bg-white/95 backdrop-blur-md">
          <div className="flex items-center gap-3 text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-6">
            <Calendar size={14} /> {new Date(post.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-10 leading-tight">{post.title}</h1>
          <div className="prose prose-lg text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">
            {post.content}
          </div>

          <div className="mt-16 pt-10 border-t border-gray-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
              <img src="https://i.postimg.cc/SjVpQwjZ/arib.jpg" alt="Arib" className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Written By</div>
              <div className="font-black text-gray-900 text-sm">Muhammad Arib</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

const SocialLink = ({ href, icon, color, label }: { href: string, icon: any, color: string, label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[2rem] text-white ${color} shadow-lg transition-all duration-300 hover:-translate-y-2 active:scale-95`}
  >
    {icon}
    <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
  </a>
);

const ServiceDetailPage = ({ services, loading }: { services: Service[], loading?: boolean }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Show page loader if still dataLoading
  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center pt-20">
      <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  const service = services.find(s => s.id === id);
  if (!service) return <div className="p-40 text-center font-bold">Service not found.</div>;

  const reviews = (service && service.reviews && typeof service.reviews === 'object') ? Object.values(service.reviews) : [];
  console.log('[DEBUG SERVICE DETAIL]', { serviceId: service.id, reviewCount: reviews.length }); // DEBUG LOG

  const [showHirePopup, setShowHirePopup] = useState(false);
  const [showDirectHireForm, setShowDirectHireForm] = useState(false);
  const [hiringForm, setHiringForm] = useState({ name: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleDirectHire = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await push(ref(db, 'hireRequests'), {
        ...hiringForm,
        serviceId: service.id,
        serviceTitle: service.title,
        date: new Date().toISOString()
      });
      alert('Hiring request sent successfully! I will get back to you soon.');
      setShowDirectHireForm(false);
      setShowHirePopup(false);
      setHiringForm({ name: '', email: '', message: '' });
    } catch (error) {
      alert('Failed to send request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pb-32 animate-slide-up bg-white min-h-screen pt-20">
      <div className="relative h-[60vh] min-h-[400px]">
        <img src={service.image || 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover" alt={service.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-black/20"></div>
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 bg-white/90 backdrop-blur-md px-6 py-4 rounded-3xl shadow-2xl active:scale-90 transition-all hover:bg-white z-10 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
        >
          <ChevronLeft size={16} /> Back
        </button>
      </div>

      <div className="px-6 -mt-32 relative max-w-4xl mx-auto">
        <Card className="p-12 border-none shadow-2xl bg-white/95 backdrop-blur-md mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-8 leading-tight">{service.title}</h1>
          <div className="prose prose-lg text-gray-600 font-medium leading-relaxed mb-12 whitespace-pre-wrap">
            {service.description}
          </div>
          <Button
            onClick={() => setShowHirePopup(true)}
            className="w-full bg-blue-600 text-white shadow-xl shadow-blue-200 py-6 text-lg flex items-center justify-center gap-3"
          >
            <Zap size={20} /> Hire Me for this Service
          </Button>
        </Card>

        {/* Hire Me Popup */}
        {showHirePopup && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <Card className="w-full max-w-md p-10 relative overflow-hidden">
              <button
                onClick={() => setShowHirePopup(false)}
                className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
              >
                <XCircle size={24} />
              </button>

              <h3 className="text-2xl font-black text-gray-900 mb-2">Hire Muhammad Arib</h3>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-10">Select your preferred channel</p>

              <div className="space-y-4">
                <a
                  href={`mailto:x.arib147@gmail.com?subject=Hiring Engagement: ${encodeURIComponent(service.title)}`}
                  className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600 group-hover:scale-110 transition-transform">
                    <Mail size={24} />
                  </div>
                  <div>
                    <div className="font-black text-gray-900">Via Email</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Immediate Response</div>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/xarib147/"
                  target="_blank"
                  className="flex items-center gap-4 p-5 bg-gray-50 rounded-2xl border border-gray-100 hover:border-blue-700 hover:bg-blue-50 transition-all group"
                >
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-700 group-hover:scale-110 transition-transform">
                    <Linkedin size={24} />
                  </div>
                  <div>
                    <div className="font-black text-gray-900">Via LinkedIn</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Professional Network</div>
                  </div>
                </a>

                <button
                  onClick={() => setShowDirectHireForm(true)}
                  className="w-full flex items-center gap-4 p-5 bg-gray-900 text-white rounded-2xl border border-gray-800 hover:bg-black transition-all group text-left"
                >
                  <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shadow-sm text-white group-hover:scale-110 transition-transform">
                    <Zap size={24} />
                  </div>
                  <div>
                    <div className="font-black">Direct Hire</div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Fast Track Protocol</div>
                  </div>
                </button>
              </div>

              {/* Direct Hire Sub-Form */}
              {showDirectHireForm && (
                <div className="absolute inset-0 bg-white p-10 animate-in slide-in-from-right duration-500 z-10 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <button onClick={() => setShowDirectHireForm(false)} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-gray-900">
                      <ChevronLeft size={16} /> Back
                    </button>
                    <h4 className="text-lg font-black font-black text-gray-900">Direct Protocol</h4>
                  </div>

                  <form onSubmit={handleDirectHire} className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Your Name</label>
                      <input
                        className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="John Doe"
                        required
                        value={hiringForm.name}
                        onChange={e => setHiringForm({ ...hiringForm, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                        required
                        value={hiringForm.email}
                        onChange={e => setHiringForm({ ...hiringForm, email: e.target.value })}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Service Request</label>
                      <input
                        className="w-full p-4 bg-gray-200 rounded-xl font-bold border-none outline-none cursor-not-allowed"
                        value={service.title}
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Project Brief</label>
                      <textarea
                        className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none h-32 focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell me about your project..."
                        required
                        value={hiringForm.message}
                        onChange={e => setHiringForm({ ...hiringForm, message: e.target.value })}
                      />
                    </div>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-blue-600 text-white py-5 shadow-lg shadow-blue-100"
                    >
                      {isSubmitting ? 'Transmitting...' : 'Send Direct Request'}
                    </Button>
                  </form>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Always render Reviews Section for Debugging */}
        <section className="mt-12">
          <SectionTitle title="Service Reviews" subtitle="What clients are saying" />
          {reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {reviews.map((rev: any, idx: number) => (
                <Card key={idx} className="p-8 border-none shadow-xl bg-gray-50/50">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-2xl overflow-hidden bg-gray-200 shadow-sm">
                      {rev?.image ? (
                        <img src={rev.image} className="w-full h-full object-cover" alt={rev?.reviewerName} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 font-black">
                          {rev?.reviewerName?.charAt(0) || '?'}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-black text-gray-900 uppercase tracking-wide text-sm">{rev?.reviewerName}</h4>
                      <div className="flex text-amber-400 mt-1">
                        {[...Array(Number(rev?.rating) || 5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600 font-medium italic leading-relaxed">"{rev?.comment || "No comment provided."}"</p>
                  <div className="mt-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {rev?.date ? new Date(rev.date).toLocaleDateString() : 'Recent'}
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="p-10 text-center border-2 border-dashed border-gray-100 rounded-3xl">
              <Star className="mx-auto text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 font-bold">No verified reviews for this service yet.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const FeedbackPage = () => {
  useScrollReveal();
  const [formData, setFormData] = useState({ name: '', rating: 5, message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.message) return;
    setIsSubmitting(true);
    try {
      await push(ref(db, 'feedback'), {
        ...formData,
        isVisible: false,
        date: new Date().toISOString()
      });
      setSubmitted(true);
      // alert handled by UI change
    } catch (e) { alert('Error submitting feedback.'); }
    finally { setIsSubmitting(false); }
  };

  if (submitted) return (
    <div className="p-12 text-center flex flex-col items-center justify-center min-h-[80vh] animate-slide-up pt-20">
      <div className="w-24 h-24 bg-green-50 text-green-500 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-green-100">
        <CheckCircle size={48} />
      </div>
      <h2 className="text-4xl font-black text-gray-900 mb-4">Review Sent</h2>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Your review is being reviewed and will be published shortly</p>
      <Link to="/" className="mt-12 text-blue-600 font-black flex items-center gap-2 uppercase tracking-widest text-sm group">
        <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
      </Link>
    </div>
  );

  return (
    <div className="px-6 pb-40 animate-slide-up max-w-2xl mx-auto pt-40">
      <SectionTitle title="Client Feedback" subtitle="How was your experience?" centered />
      <Card className="p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Your Name</label>
            <input
              type="text"
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="Full Name"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Experience Rating</label>
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`p-3 rounded-2xl transition-all ${formData.rating >= star ? 'text-amber-400 scale-110' : 'text-gray-200 opacity-50'}`}
                >
                  <Star size={32} fill={formData.rating >= star ? 'currentColor' : 'none'} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Review Message</label>
            <textarea
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none h-44 resize-none"
              placeholder="Share the details of your brand's growth and results..."
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-gray-900 text-white py-6 flex items-center justify-center gap-2">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {isSubmitting ? 'Publishing Story...' : 'Publish Your Story'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const ContactPage = () => {
  useScrollReveal();
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await push(ref(db, 'contacts'), {
        ...formData,
        date: new Date().toISOString()
      });
      setSubmitted(true);
    } catch (e) { alert('Transmission failed.'); }
    finally { setIsSubmitting(false); }
  };

  if (submitted) return (
    <div className="p-12 text-center min-h-[80vh] flex flex-col items-center justify-center animate-slide-up pt-20">
      <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-100"><Send size={40} /></div>
      <h2 className="text-4xl font-black mb-4">Message Sent</h2>
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-8">We will contact you soon on your email.</p>
      <Link to="/" className="mt-4 font-black text-blue-600 uppercase tracking-widest text-sm bg-blue-50 px-8 py-3 rounded-2xl">Return Home</Link>
    </div>
  );

  return (
    <div className="px-6 pb-40 animate-slide-up max-w-2xl mx-auto pt-40">
      <SectionTitle title="Get in Touch" subtitle="Start your brand evolution" centered />
      <Card className="p-12">
        <form onSubmit={handleSubmit} className="space-y-8">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email Address"
            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <textarea
            placeholder="Tell me how I can help your brand reach its potential..."
            className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none h-44 resize-none"
            value={formData.message}
            onChange={e => setFormData({ ...formData, message: e.target.value })}
            required
          />
          <div className="bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center gap-4 transition-all hover:shadow-md">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm flex-shrink-0 animate-pulse">
              <Mail size={24} />
            </div>
            <p className="text-xs font-black text-blue-600 uppercase tracking-[0.1em] leading-relaxed">
              We will contact you soon on your email.
            </p>
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full bg-blue-600 text-white py-6 shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
            {isSubmitting ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
            {isSubmitting ? 'Transmitting...' : 'Send Direct Brief'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const ServicesPage = ({ services, loading }: { services: Service[], loading?: boolean }) => {
  useScrollReveal();
  return (
    <div className="px-6 pb-40 animate-slide-up max-w-5xl mx-auto pt-40">
      <SectionTitle title="Full Portfolio" subtitle="Strategic brand elevation" />
      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 gap-4">
          <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">Deploying Protocol view...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {(services || []).map(s => (
            <Link key={s.id} to={`/service/${s.id}`} className="reveal">
              <Card className="p-4 group h-full flex flex-col">
                <div className="h-60 rounded-[2rem] bg-gray-50 overflow-hidden mb-6">
                  <img src={s.image || 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80&w=800'} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={s.title} />
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h4 className="font-black text-2xl text-gray-900 mb-3">{s.title || 'Untitled Service'}</h4>
                  <p className="text-sm font-medium text-gray-500 leading-relaxed line-clamp-3 flex-1">{s.description || 'No description available for this protocol.'}</p>
                  <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-blue-600 font-bold text-xs uppercase tracking-widest">
                    Explore Depth <ChevronRight size={14} className="ml-1" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
          {(!services || services.length === 0) && (
            <div className="md:col-span-2 py-40 text-center">
              <Layers className="mx-auto text-gray-100 mb-6" size={80} />
              <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">No services deployed yet</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// --- Admin Components ---

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Verification failed. Please check your credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 animate-slide-up pt-32 bg-gray-50/30">
      <Card className="p-12 w-full max-w-md border-none shadow-2xl">
        <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-xl shadow-blue-50">
          <Lock size={32} />
        </div>
        <h2 className="text-3xl font-black mb-2 text-center">Admin Portal</h2>
        <p className="text-gray-400 mb-10 font-black text-[10px] uppercase tracking-widest text-center">Identity Verification Required</p>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Email Address</label>
            <input
              type="email"
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="admin@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-2">Secure Password</label>
            <input
              type="password"
              className="w-full p-5 bg-gray-50 border border-gray-100 rounded-2xl font-bold focus:bg-white focus:ring-2 focus:ring-blue-500 transition-all outline-none"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full bg-blue-600 text-white shadow-xl shadow-blue-200 py-6"
          >
            {isLoggingIn ? 'Verifying...' : 'Verify Identity'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

const AdminPanel = ({ profile, skills, services, works, posts, feedback, hireRequests, contacts, analytics }: any) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [newSkill, setNewSkill] = useState('');
  const [editingProfile, setEditingProfile] = useState<any>(null);

  // Forms for adding new items
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', image: '' });

  const [showAddService, setShowAddService] = useState(false);
  const [newService, setNewService] = useState({ title: '', description: '', image: '' });

  const [showAddWork, setShowAddWork] = useState(false);
  const [newWork, setNewWork] = useState({ clientName: '', reviewText: '', image: '' });

  // For adding verification/review to service
  const [showAddServiceReview, setShowAddServiceReview] = useState<string | null>(null);
  const [newServiceReview, setNewServiceReview] = useState({ reviewerName: '', rating: 5, comment: '', image: '' });

  useEffect(() => {
    if (profile) setEditingProfile({ ...profile });
  }, [profile]);

  const handleUpdateProfile = async () => {
    await set(ref(db, 'profile'), editingProfile);
    alert('Global Profile Configured Successfully!');
  };

  const handleAddSkill = async () => {
    if (!newSkill) return;
    await push(ref(db, 'skills'), { name: newSkill });
    setNewSkill('');
    alert('Skill added to toolkit!');
  };

  const handleAddPost = async () => {
    if (!newPost.title || !newPost.content) return;
    await push(ref(db, 'posts'), {
      ...newPost,
      date: new Date().toISOString()
    });
    setNewPost({ title: '', content: '', image: '' });
    setShowAddPost(false);
    alert('Insight published to Journal!');
  };

  const handleAddService = async () => {
    if (!newService.title || !newService.description) return;
    await push(ref(db, 'services'), { ...newService });
    setNewService({ title: '', description: '', image: '' });
    setShowAddService(false);
    alert('Service deployment finalized!');
  };

  const handleAddWork = async () => {
    if (!newWork.clientName || !newWork.reviewText) return;
    await push(ref(db, 'works'), { ...newWork });
    setNewWork({ clientName: '', reviewText: '', image: '' });
    setShowAddWork(false);
    alert('Portfolio success story archived!');
  };

  const handleAddServiceReview = async (serviceId: string) => {
    if (!newServiceReview.reviewerName || !newServiceReview.comment) return;
    await push(ref(db, `services/${serviceId}/reviews`), {
      ...newServiceReview,
      date: new Date().toISOString()
    });
    setNewServiceReview({ reviewerName: '', rating: 5, comment: '', image: '' });
    setShowAddServiceReview(null);
    alert('Review verification added to service!');
  };

  const handleDeleteItem = async (path: string) => {
    if (confirm('Irreversible Operation: Delete this item?')) {
      await remove(ref(db, path));
      alert('Item purged from database.');
    }
  };

  const updateItemField = async (path: string, field: string, value: any) => {
    await update(ref(db, path), { [field]: value });
    alert(`Configuration updated: ${field} synchronized.`);
  };

  const toggleFeedbackVisibility = async (id: string, current: boolean) => {
    await update(ref(db, `feedback/${id}`), { isVisible: !current });
    alert(`Feedback visibility updated to ${!current ? 'Visible' : 'Hidden'}`);
  };

  return (
    <div className="pb-40 animate-in fade-in duration-500 bg-white min-h-screen pt-20">
      <div className="px-6 mb-12 flex flex-col md:flex-row justify-between items-start md:items-center max-w-5xl mx-auto pt-10 gap-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Arib's Workspace</h1>
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Master Management Console</p>
        </div>
        <button onClick={() => signOut(auth)} className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-100 transition-colors">
          <LogOut size={16} /> Sign Out
        </button>
      </div>

      <div className="flex overflow-x-auto gap-3 px-6 mb-12 no-scrollbar max-w-5xl mx-auto border-b border-gray-50 pb-6">
        {[
          { id: 'profile', label: 'Identity', icon: <User size={14} /> },
          { id: 'posts', label: 'Journal', icon: <FileText size={14} /> },
          { id: 'services', label: 'Services', icon: <Layers size={14} /> },
          { id: 'work', label: 'Portfolio', icon: <Briefcase size={14} /> },
          { id: 'management', label: 'CMS', icon: <Database size={14} /> },
          { id: 'feedback', label: 'Reviews', icon: <MessageSquare size={14} /> },
          { id: 'requests', label: 'Inbox', icon: <Mail size={14} /> },
          { id: 'analytics', label: 'Metrics', icon: <TrendingUp size={14} /> },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shrink-0 ${activeTab === tab.id ? 'bg-blue-600 text-white shadow-xl shadow-blue-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="px-6 max-w-5xl mx-auto">
        {/* PROFILE TAB */}
        {activeTab === 'profile' && editingProfile && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <Card className="p-10 space-y-10 border-none shadow-2xl">
              <div className="flex items-center gap-8">
                <div className="w-28 h-28 rounded-[2.5rem] bg-gray-100 overflow-hidden relative group shadow-inner">
                  <img src={editingProfile.profilePic} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                    <ImageIcon size={32} />
                    <input type="file" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await toBase64(file);
                        setEditingProfile({ ...editingProfile, profilePic: base64 });
                        alert("Profile picture updated in editor.");
                      }
                    }} />
                  </label>
                </div>
                <div>
                  <h4 className="font-black text-gray-900 text-lg mb-1">Visual Identity</h4>
                  <p className="text-sm text-gray-400 font-medium italic">Update your brand avatar</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Public Name</label>
                  <input type="text" className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={editingProfile.name} onChange={e => setEditingProfile({ ...editingProfile, name: e.target.value })} placeholder="Muhammad Arib" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Years Exp.</label>
                    <input type="number" className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" value={editingProfile.experienceYears} onChange={e => setEditingProfile({ ...editingProfile, experienceYears: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Clients</label>
                    <input type="number" className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" value={editingProfile.clientsCompleted} onChange={e => setEditingProfile({ ...editingProfile, clientsCompleted: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Banner Image URL</label>
                  <input type="text" className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500 mb-6" value={editingProfile.bannerImage || ''} onChange={e => setEditingProfile({ ...editingProfile, bannerImage: e.target.value })} placeholder="https://example.com/banner.jpg" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 ml-2">Brand Biography</label>
                  <textarea className="w-full p-5 bg-gray-50 rounded-2xl font-bold border-none outline-none h-40 focus:ring-2 focus:ring-blue-500" value={editingProfile.intro} onChange={e => setEditingProfile({ ...editingProfile, intro: e.target.value })} placeholder="Tell your story..." />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-gray-50">
                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Contact Ecosystem</h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={editingProfile.email} onChange={e => setEditingProfile({ ...editingProfile, email: e.target.value })} placeholder="Email" />
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={editingProfile.linkedin} onChange={e => setEditingProfile({ ...editingProfile, linkedin: e.target.value })} placeholder="LinkedIn" />
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={editingProfile.instagram} onChange={e => setEditingProfile({ ...editingProfile, instagram: e.target.value })} placeholder="Instagram" />
                  <input type="text" className="w-full p-4 bg-gray-50 rounded-2xl font-bold outline-none" value={editingProfile.facebook} onChange={e => setEditingProfile({ ...editingProfile, facebook: e.target.value })} placeholder="Facebook" />
                </div>
              </div>

              <Button onClick={handleUpdateProfile} className="w-full bg-blue-600 text-white flex items-center justify-center gap-3 py-6 shadow-xl">
                <Save size={20} /> Save Platform configuration
              </Button>
            </Card>

            <Card className="p-10 space-y-6">
              <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">Skillset Management</h5>
              <div className="flex gap-3">
                <input type="text" className="flex-1 p-5 bg-gray-50 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-blue-500" placeholder="New expertise..." value={newSkill} onChange={e => setNewSkill(e.target.value)} />
                <button onClick={handleAddSkill} className="bg-gray-900 text-white px-8 rounded-2xl font-black hover:bg-black transition-colors"><Plus /></button>
              </div>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: Skill) => (
                  <div key={s.id} className="px-5 py-3 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-sm hover:border-red-100 group transition-all">
                    {s.name}
                    <button onClick={() => handleDeleteItem(`skills/${s.id}`)} className="text-gray-200 group-hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* JOURNAL TAB */}
        {activeTab === 'posts' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {!showAddPost ? (
              <button
                onClick={() => setShowAddPost(true)}
                className="w-full py-20 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-blue-600 hover:border-blue-200 transition-all bg-white group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                <span className="font-black uppercase tracking-widest text-sm">Publish New Insight</span>
              </button>
            ) : (
              <Card className="p-10 border-2 border-blue-500 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-gray-900">New Journal Entry</h3>
                  <button onClick={() => setShowAddPost(false)} className="text-gray-400 hover:text-gray-900"><XCircle size={24} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input type="text" className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500" placeholder="Catchy Headline" value={newPost.title} onChange={e => setNewPost({ ...newPost, title: e.target.value })} />
                    <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none h-48 focus:ring-2 focus:ring-blue-500" placeholder="Insightful content..." value={newPost.content} onChange={e => setNewPost({ ...newPost, content: e.target.value })} />
                  </div>
                  <div className="h-full">
                    <div className="w-full h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                      {newPost.image ? (
                        <img src={newPost.image} className="absolute inset-0 w-full h-full object-cover" />
                      ) : (
                        <>
                          <ImageIcon className="text-gray-300 mb-3" size={48} />
                          <span className="text-[10px] font-black text-gray-400 uppercase">Cover Image required</span>
                        </>
                      )}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) setNewPost({ ...newPost, image: await toBase64(f) });
                      }} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddPost} className="w-full bg-blue-600 text-white py-6">Publish Instantly</Button>
              </Card>
            )}

            {/* List of existing posts */}
            <div className="space-y-6 pt-10">
              <SectionTitle title="Global Archive" subtitle="Manage your published insights" />
              {posts.length > 0 ? posts.map((p: Post) => (
                <Card key={p.id} className="p-6 flex flex-col md:flex-row gap-8 items-center border-none shadow-xl reveal">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2.5rem] overflow-hidden flex-shrink-0 bg-gray-100 relative group shadow-lg">
                    <img src={p.image} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <Edit size={32} />
                      <input type="file" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          updateItemField(`posts/${p.id}`, 'image', base64);
                        }
                      }} />
                    </label>
                  </div>
                  <div className="flex-1 w-full">
                    <input className="w-full font-black text-xl text-gray-900 focus:outline-none mb-3 bg-transparent p-2 rounded-lg focus:bg-gray-50 transition-colors" defaultValue={p?.title} onBlur={e => updateItemField(`posts/${p.id}`, 'title', e.target.value)} />
                    <textarea className="w-full text-sm font-medium text-gray-500 focus:outline-none h-32 bg-transparent resize-none leading-relaxed p-2 rounded-lg focus:bg-gray-50 transition-colors" defaultValue={p?.content} onBlur={e => updateItemField(`posts/${p.id}`, 'content', e.target.value)} />
                    <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-50">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Calendar size={12} /> {p?.date ? new Date(p.date).toLocaleDateString() : 'Draft'}</span>
                      <button onClick={() => handleDeleteItem(`posts/${p.id}`)} className="text-red-400 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                    </div>
                  </div>
                </Card>
              )) : (
                <div className="text-center py-20 bg-gray-50/50 rounded-[3.5rem] border border-dashed border-gray-200">
                  <FileText className="mx-auto text-gray-200 mb-4" size={48} />
                  <p className="text-gray-400 font-black text-[10px] uppercase tracking-widest">No entries found in archive</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SERVICES TAB */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {!showAddService ? (
              <button
                onClick={() => setShowAddService(true)}
                className="w-full py-20 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-blue-600 hover:border-blue-200 transition-all bg-white group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                <span className="font-black uppercase tracking-widest text-sm">Deploy New Solution</span>
              </button>
            ) : (
              <Card className="p-10 border-2 border-blue-500 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-gray-900">Configure Service</h3>
                  <button onClick={() => setShowAddService(false)} className="text-gray-400 hover:text-gray-900"><XCircle size={24} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input type="text" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" placeholder="Service Designation" value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })} />
                    <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none h-48" placeholder="Full technical brief..." value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })} />
                  </div>
                  <div className="h-full">
                    <div className="w-full h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                      {newService.image ? <img src={newService.image} className="absolute inset-0 w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) setNewService({ ...newService, image: await toBase64(f) });
                      }} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddService} className="w-full bg-blue-600 text-white py-6">Finalize Deployment</Button>
              </Card>
            )}

            {services.map((s: Service) => (
              <Card key={s.id} className="p-6 border-none shadow-xl reveal overflow-visible">
                <div className="flex flex-col md:flex-row gap-8 items-start p-2">
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] overflow-hidden flex-shrink-0 bg-gray-100 relative group shadow-lg">
                    <img src={s.image} className="w-full h-full object-cover" />
                    <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer">
                      <Edit size={32} />
                      <input type="file" className="hidden" onChange={async e => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const base64 = await toBase64(file);
                          updateItemField(`services/${s.id}`, 'image', base64);
                          alert("Service icon updated.");
                        }
                      }} />
                    </label>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-4">
                      <input className="font-black text-2xl text-gray-900 focus:outline-none bg-transparent p-1 focus:bg-gray-50 rounded-lg flex-1 mr-4 transition-colors" defaultValue={s.title} onBlur={e => updateItemField(`services/${s.id}`, 'title', e.target.value)} />
                      <button onClick={() => handleDeleteItem(`services/${s.id}`)} className="text-red-400 p-3 hover:bg-red-50 rounded-xl"><Trash2 size={20} /></button>
                    </div>
                    <textarea className="w-full text-sm font-medium text-gray-500 focus:outline-none h-24 bg-transparent resize-none leading-relaxed p-1 focus:bg-gray-50 rounded-lg transition-colors" defaultValue={s.description} onBlur={e => updateItemField(`services/${s.id}`, 'description', e.target.value)} />

                    <div className="mt-8 flex flex-wrap gap-4">
                      <button
                        onClick={() => setShowAddServiceReview(s.id)}
                        className="flex items-center gap-3 text-xs font-black uppercase text-white tracking-widest bg-blue-600 px-8 py-4 rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                      >
                        <UserCheck size={18} /> Inject Verification (Review)
                      </button>
                    </div>

                    {/* Service Reviews List (Mini Manage) */}
                    {s?.reviews && (
                      <div className="mt-8 space-y-4 pt-6 border-t border-gray-50">
                        <h6 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Linked Verifications</h6>
                        {Object.entries(s.reviews || {}).map(([rid, rev]: [string, any]) => (
                          <div key={rid} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-200">
                                <img src={rev.image} className="w-full h-full object-cover" />
                              </div>
                              <div>
                                <span className="font-black text-gray-900 text-xs">{rev.reviewerName}</span>
                                <div className="flex text-amber-400 scale-75 origin-left">
                                  {[...Array(rev.rating)].map((_, i) => <Star key={i} size={10} fill="currentColor" />)}
                                </div>
                              </div>
                            </div>
                            <button onClick={() => handleDeleteItem(`services/${s.id}/reviews/${rid}`)} className="text-gray-300 hover:text-red-500 transition-colors"><Trash2 size={16} /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Inline Modal for adding review */}
                {showAddServiceReview === s.id && (
                  <div className="fixed inset-0 z-[1000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6">
                    <Card className="w-full max-w-lg p-10 space-y-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-black text-gray-900">Inject Verification</h3>
                        <button onClick={() => setShowAddServiceReview(null)} className="text-gray-400 hover:text-gray-900"><XCircle size={24} /></button>
                      </div>
                      <div className="space-y-4">
                        <div className="flex gap-4">
                          <div className="w-20 h-20 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden flex-shrink-0">
                            {newServiceReview.image ? <img src={newServiceReview.image} className="absolute inset-0 w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={24} />}
                            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => {
                              const f = e.target.files?.[0];
                              if (f) setNewServiceReview({ ...newServiceReview, image: await toBase64(f) });
                            }} />
                          </div>
                          <div className="flex-1 space-y-3">
                            <input type="text" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" placeholder="Client Name" value={newServiceReview.reviewerName} onChange={e => setNewServiceReview({ ...newServiceReview, reviewerName: e.target.value })} />
                            <select className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" value={newServiceReview.rating} onChange={e => setNewServiceReview({ ...newServiceReview, rating: parseInt(e.target.value) })}>
                              {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Stars</option>)}
                            </select>
                          </div>
                        </div>
                        <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none h-32" placeholder="Review details..." value={newServiceReview.comment} onChange={e => setNewServiceReview({ ...newServiceReview, comment: e.target.value })} />
                      </div>
                      <Button onClick={() => handleAddServiceReview(s.id)} className="w-full bg-blue-600 text-white">Finalize Verification</Button>
                    </Card>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}

        {/* PORTFOLIO TAB */}
        {activeTab === 'work' && (
          <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            {!showAddWork ? (
              <button
                onClick={() => setShowAddWork(true)}
                className="w-full py-20 border-4 border-dashed border-gray-100 rounded-[3rem] flex flex-col items-center justify-center gap-4 text-gray-300 hover:text-blue-600 hover:border-blue-200 transition-all bg-white group"
              >
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform"><Plus size={32} /></div>
                <span className="font-black uppercase tracking-widest text-sm">Upload Project Success</span>
              </button>
            ) : (
              <Card className="p-10 border-2 border-blue-500 shadow-2xl space-y-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-black text-gray-900">Log Project Success</h3>
                  <button onClick={() => setShowAddWork(false)} className="text-gray-400 hover:text-gray-900"><XCircle size={24} /></button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <input type="text" className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none" placeholder="Corporate/Client Name" value={newWork.clientName} onChange={e => setNewWork({ ...newWork, clientName: e.target.value })} />
                    <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold outline-none h-48" placeholder="Summarized outcome..." value={newWork.reviewText} onChange={e => setNewWork({ ...newWork, reviewText: e.target.value })} />
                  </div>
                  <div className="h-full">
                    <div className="w-full h-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden">
                      {newWork.image ? <img src={newWork.image} className="absolute inset-0 w-full h-full object-cover" /> : <ImageIcon className="text-gray-300" size={48} />}
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={async e => {
                        const f = e.target.files?.[0];
                        if (f) setNewWork({ ...newWork, image: await toBase64(f) });
                      }} />
                    </div>
                  </div>
                </div>
                <Button onClick={handleAddWork} className="w-full bg-blue-600 text-white py-6">Archive Achievement</Button>
              </Card>
            )}

            {works.map((w: ClientWork) => (
              <Card key={w.id} className="p-6 flex flex-col md:flex-row gap-8 items-center border-none shadow-xl reveal">
                <div className="w-32 h-32 md:w-44 md:h-44 rounded-[2rem] overflow-hidden flex-shrink-0 bg-gray-100 relative group shadow-lg">
                  <img src={w.image} className="w-full h-full object-cover" />
                  <label className="absolute inset-0 bg-black/60 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 cursor-pointer">
                    <Edit size={32} />
                    <input type="file" className="hidden" onChange={async e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const base64 = await toBase64(file);
                        updateItemField(`works/${w.id}`, 'image', base64);
                        alert("Work image updated.");
                      }
                    }} />
                  </label>
                </div>
                <div className="flex-1 w-full">
                  <input className="w-full font-black text-2xl text-gray-900 focus:outline-none mb-4 bg-transparent p-2 focus:bg-gray-50 rounded-lg transition-colors" defaultValue={w.clientName} onBlur={e => updateItemField(`works/${w.id}`, 'clientName', e.target.value)} />
                  <textarea className="w-full text-sm font-medium text-gray-500 focus:outline-none h-24 bg-transparent resize-none leading-relaxed p-2 focus:bg-gray-50 rounded-lg transition-colors" defaultValue={w.reviewText} onBlur={e => updateItemField(`works/${w.id}`, 'reviewText', e.target.value)} />
                  <div className="flex justify-end mt-6 pt-6 border-t border-gray-50">
                    <button onClick={() => handleDeleteItem(`works/${w.id}`)} className="text-red-400 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}


        {/* MANAGEMENT / CMS TAB */}
        {activeTab === 'management' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Posts Column */}
              <div className="space-y-6">
                <SectionTitle title="Journal Entries" subtitle="Manage Content" />
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {posts.map((p: Post) => (
                    <div key={p.id} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={p.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            className="w-full font-bold text-sm text-gray-900 focus:text-blue-600 bg-transparent outline-none truncate"
                            defaultValue={p.title}
                            onBlur={e => updateItemField(`posts/${p.id}`, 'title', e.target.value)}
                          />
                          <p className="text-[10px] text-gray-400 mt-1">{new Date(p.date).toLocaleDateString()}</p>
                        </div>
                        <button onClick={() => handleDeleteItem(`posts/${p.id}`)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Services Column */}
              <div className="space-y-6">
                <SectionTitle title="Protocols" subtitle="Manage Services" />
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {services.map((s: Service) => (
                    <div key={s.id} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={s.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            className="w-full font-bold text-sm text-gray-900 focus:text-blue-600 bg-transparent outline-none truncate"
                            defaultValue={s.title}
                            onBlur={e => updateItemField(`services/${s.id}`, 'title', e.target.value)}
                          />
                          <div className="text-[10px] text-gray-400 mt-1 flex items-center gap-1">
                            <Star size={10} /> {Object.keys(s.reviews || {}).length} Reviews
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <button onClick={() => setShowAddServiceReview(s.id)} className="text-blue-400 p-2 hover:bg-blue-50 rounded-xl transition-colors" title="Add Review">
                            <MessageSquare size={16} />
                          </button>
                          <button onClick={() => handleDeleteItem(`services/${s.id}`)} className="text-gray-300 hover:text-red-500 transition-colors p-2" title="Delete Service">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Service Review Modal */}
              {showAddServiceReview && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                  <Card className="w-full max-w-md p-8 relative">
                    <button onClick={() => setShowAddServiceReview(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"><X size={20} /></button>
                    <SectionTitle title="Inject Validation" subtitle="Add Service Review" />
                    <div className="space-y-4">
                      <input className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none" placeholder="Client Name" value={newServiceReview.reviewerName} onChange={e => setNewServiceReview({ ...newServiceReview, reviewerName: e.target.value })} />
                      <textarea className="w-full p-4 bg-gray-50 rounded-xl font-bold border-none outline-none h-24 resize-none" placeholder="Feedback/Comment" value={newServiceReview.comment} onChange={e => setNewServiceReview({ ...newServiceReview, comment: e.target.value })} />
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(r => (
                          <button key={r} onClick={() => setNewServiceReview({ ...newServiceReview, rating: r })} className={`p-2 rounded-lg ${newServiceReview.rating >= r ? 'text-amber-400 bg-amber-50' : 'text-gray-300'}`}><Star size={20} fill={newServiceReview.rating >= r ? 'currentColor' : 'none'} /></button>
                        ))}
                      </div>
                      <label className="flex items-center gap-2 p-4 bg-blue-50 text-blue-600 rounded-xl cursor-pointer hover:bg-blue-100 transition-colors justify-center font-bold text-xs uppercase tracking-widest">
                        <ImageIcon size={18} /> {newServiceReview.image ? 'Image Selected' : 'Client Photo'}
                        <input type="file" className="hidden" onChange={async e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const base64 = await toBase64(file);
                            setNewServiceReview({ ...newServiceReview, image: base64 });
                          }
                        }} />
                      </label>
                      <Button onClick={() => handleAddServiceReview(showAddServiceReview)} className="w-full bg-blue-600 text-white">Inject Review</Button>
                    </div>
                  </Card>
                </div>
              )}

              {/* Portfolio Column */}
              <div className="space-y-6">
                <SectionTitle title="Portfolio" subtitle="Manage Work" />
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                  {works.map((w: ClientWork) => (
                    <div key={w.id} className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 group hover:border-blue-200 transition-all">
                      <div className="flex gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                          <img src={w.image} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <input
                            className="w-full font-bold text-sm text-gray-900 focus:text-blue-600 bg-transparent outline-none truncate"
                            defaultValue={w.clientName}
                            onBlur={e => updateItemField(`works/${w.id}`, 'clientName', e.target.value)}
                          />
                          <p className="text-[10px] text-gray-400 mt-1 truncate">{w.reviewText}</p>
                        </div>
                        <button onClick={() => handleDeleteItem(`works/${w.id}`)} className="text-gray-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FEEDBACK TAB */}
        {activeTab === 'feedback' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            {feedback.length > 0 ? feedback.map((f: Feedback) => (
              <Card key={f.id} className={`p-8 border-none shadow-xl border-l-8 ${f.isVisible ? 'border-l-green-500' : 'border-l-amber-400'}`}>
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h6 className="font-black text-xl text-gray-900">{f.name}</h6>
                    <div className="flex text-amber-400 mt-1">
                      {[...Array(f.rating)].map((_, i) => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleFeedbackVisibility(f.id, f.isVisible)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${f.isVisible ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'}`}
                    >
                      {f.isVisible ? 'Approved' : 'Pending Approval'}
                    </button>
                    <button onClick={() => handleDeleteItem(`feedback/${f.id}`)} className="text-red-400 p-2 hover:bg-red-50 rounded-xl">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 font-medium italic">"{f.message}"</p>
                <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mt-6">
                  Incoming Signal: {new Date(f.date).toLocaleString()}
                </div>
              </Card>
            )) : (
              <div className="text-center py-40">
                <ImageIcon className="mx-auto text-gray-100 mb-6" size={80} />
                <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Awaiting client validation</p>
              </div>
            )}
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'analytics' && (
          <div className="space-y-12 animate-in slide-in-from-bottom-4 duration-500">
            {/* Real-time IP Tracking Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Active Now', value: analytics.filter((a: any) => (new Date().getTime() - new Date(a.timestamp).getTime()) < 5 * 60 * 1000).length, icon: <div className="relative"><Activity className="text-green-500" /><div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" /></div>, color: 'bg-green-50' },
                { label: 'Last 24 Hours', value: analytics.filter((a: any) => (new Date().getTime() - new Date(a.timestamp).getTime()) < 24 * 60 * 60 * 1000).length, icon: <Clock className="text-blue-500" />, color: 'bg-blue-50' },
                { label: 'Last 30 Days', value: analytics.filter((a: any) => (new Date().getTime() - new Date(a.timestamp).getTime()) < 30 * 24 * 60 * 60 * 1000).length, icon: <Calendar className="text-purple-500" />, color: 'bg-purple-50' },
                { label: 'Total Visibility', value: analytics.length, icon: <Eye className="text-amber-500" />, color: 'bg-amber-50' },
              ].map((stat, i) => (
                <Card key={i} className="p-8 border-none shadow-xl flex flex-col items-center text-center hover:scale-105 transition-transform">
                  <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center mb-4`}>
                    {stat.icon}
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</div>
                  <div className="text-3xl font-black text-gray-900">{stat.value || 0}</div>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="p-10 bg-gray-900 text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><Mail size={80} /></div>
                <div className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Total Outreach</div>
                <div className="text-6xl font-black">{hireRequests.length + contacts.length}</div>
                <div className="mt-4 text-[10px] font-black text-gray-500 uppercase">Requests Received</div>
              </Card>
              <Card className="p-10 bg-blue-600 text-white flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><CheckCircle size={80} /></div>
                <div className="text-blue-200 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Completed Protocol</div>
                <div className="text-6xl font-black">
                  {[...hireRequests, ...contacts].filter((r: any) => r.isCompleted).length}
                </div>
                <div className="mt-4 text-[10px] font-black text-blue-300 uppercase">Successful Deliveries</div>
              </Card>
              <Card className="p-10 bg-white border border-gray-100 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform"><Star size={80} /></div>
                <div className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em] mb-2">Client Sentiment</div>
                <div className="text-6xl font-black text-gray-900">{feedback.length}</div>
                <div className="mt-4 text-[10px] font-black text-gray-400 uppercase">Approved Testimonials</div>
              </Card>
            </div>

            <SectionTitle title="Engagement Pulse" subtitle={`Detailed IP Tracking Log (Raw: ${analytics.length})`} />
            <div className="space-y-4">
              {analytics.length > 0 ? analytics.slice().reverse().slice(0, 50).map((a: Analytics, i: number) => (
                <div key={i} className="flex justify-between items-center p-6 bg-white rounded-3xl border border-gray-50 shadow-sm hover:border-blue-100 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold text-xs">IP</div>
                    <div>
                      <div className="font-black text-gray-900 text-sm tracking-widest">{a.ip || 'Unknown IP'}</div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{a.page || '/'}</div>
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                    {a.timestamp ? formatRelativeTime(a.timestamp) : 'Just now'}
                  </div>
                </div>
              )) : (
                <div className="text-center py-20 text-gray-400 font-black uppercase text-xs">No traffic data available</div>
              )}
            </div>
          </div>
        )}

        {/* INBOX TAB */}
        {
          activeTab === 'requests' && (
            <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
              {[...hireRequests, ...contacts.map(c => ({ ...c, serviceTitle: 'General Inquiry' }))].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((r: any) => (
                <Card key={r.id} className={`p-10 border-none shadow-xl border-l-8 transition-all ${r.isCompleted ? 'border-l-green-500 bg-green-50/20' : 'border-l-blue-600 bg-white'}`}>
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-3">
                      <span className={`${r.isCompleted ? 'bg-green-500' : 'bg-blue-600'} text-white px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest`}>{r.serviceTitle}</span>
                      {r.isCompleted && <span className="text-green-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-1"><CheckCircle size={12} /> Completed</span>}
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Clock size={12} /> {formatRelativeTime(r.date)}</span>
                  </div>
                  <h6 className="font-black text-2xl text-gray-900 mb-2">{r.name}</h6>
                  <div className="flex items-center gap-6">
                    <a href={`mailto:${r.email}`} className="text-blue-600 font-bold flex items-center gap-2 mb-6 hover:underline underline-offset-4"><Mail size={16} /> {r.email}</a>
                  </div>
                  <div className="bg-white/60 p-6 rounded-2xl text-gray-600 font-medium leading-relaxed italic border border-gray-100 shadow-inner">
                    "{r.message || "No briefing provided."}"
                  </div>
                  <div className="flex justify-between items-center mt-8 pt-8 border-t border-gray-100">
                    <button
                      onClick={() => updateItemField(`${r.serviceTitle === 'General Inquiry' ? 'contacts' : 'hireRequests'}/${r.id}`, 'isCompleted', !r.isCompleted)}
                      className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${r.isCompleted ? 'bg-amber-50 text-amber-600' : 'bg-green-50 text-green-600'}`}
                    >
                      <CheckCircle size={14} /> {r.isCompleted ? 'Re-open Request' : 'Mark as Completed'}
                    </button>
                    <button onClick={() => handleDeleteItem(`${r.serviceTitle === 'General Inquiry' ? 'contacts' : 'hireRequests'}/${r.id}`)} className="text-red-400 p-3 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={20} /></button>
                  </div>
                </Card>
              ))}
              {hireRequests.length === 0 && contacts.length === 0 && (
                <div className="text-center py-40">
                  <Mail className="mx-auto text-gray-100 mb-6" size={80} />
                  <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-xs">Inbox at equilibrium</p>
                </div>
              )}
            </div>
          )
        }
      </div >
    </div >
  );
};

// --- Main App Shell ---

const App = () => {
  // Initial empty states - STRICTLY NO MOCK DATA
  const [profile, setProfile] = useState<any>(null);
  const [skills, setSkills] = useState<any[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [works, setWorks] = useState<ClientWork[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [hireRequests, setHireRequests] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<Analytics[]>([]); // Start empty
  const [loading, setLoading] = useState(true);
  const [dataLoading, setDataLoading] = useState(true); // General/fallback loading
  const [postsLoading, setPostsLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // --- Authentication ---
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    // Universal Data Loader
    const loadData = (path: string, setter: any, loadingSetter?: any) => {
      onValue(ref(db, path), snapshot => {
        const val = snapshot.val();
        if (val) {
          // Convert object to array
          const list = Object.keys(val).map(key => ({ id: key, ...val[key] }));
          console.log(`[DATA LOADED] ${path}:`, list); // DEBUG LOG
          setter(list);
          setDataLoading(false); // Data arrived
          if (loadingSetter) loadingSetter(false);
        } else {
          console.warn(`[DATA EMPTY] ${path}`); // DEBUG LOG
          setter([]);
          // If empty, we still stop loading
          setDataLoading(false);
          if (loadingSetter) loadingSetter(false);
        }
      }, (err) => {
        console.error(`[DATA ERROR] ${path}:`, err);
        setter([]);
        setDataLoading(false);
        if (loadingSetter) loadingSetter(false);
      });
    };

    // Load all collections
    // Re-implementing specific profile load for safety
    onValue(ref(db, 'profile'), snap => setProfile(snap.val()));

    loadData('skills', setSkills);
    loadData('services', setServices, setServicesLoading);
    loadData('works', setWorks);
    loadData('posts', setPosts, setPostsLoading);
    loadData('feedback', setFeedback);
    loadData('hireRequests', setHireRequests);
    loadData('contacts', setContacts);
    loadData('analytics', setAnalytics);

    return () => unsubAuth();
  }, []);

  // --- Tracker Component ---
  const VisitorTracker = () => {
    const location = useLocation();
    useEffect(() => {
      const logVisitor = async () => {
        if (location.pathname.includes('admin')) return;
        let ip = 'Private/Internal';
        try {
          const res = await fetch('https://api.ipify.org?format=json');
          if (res.ok) {
            const data = await res.json();
            ip = data.ip;
            console.log('[TRACKER SUCCESS] Primary API:', ip);
          } else {
            throw new Error("Ipify failed");
          }
        } catch (e) {
          try {
            // Fallback to second provider if first fails (often due to blocked requests)
            const res2 = await fetch('https://ipapi.co/json/');
            if (res2.ok) {
              const data2 = await res2.json();
              ip = data2.ip;
              console.log('[TRACKER FALLBACK] Secondary API:', ip);
            }
          } catch (e2) {
            console.error('[TRACKER FAILED] All IP APIs failed. Using fallback:', ip, e2);
          }
        }
        try {
          await push(ref(db, 'analytics'), {
            ip,
            page: location.pathname || '/',
            timestamp: new Date().toISOString()
          });
          console.log('[TRACKER PUSHED] to DB');
        } catch (e) { console.error('[TRACKER DB ERROR]', e); }
      };
      logVisitor();
    }, [location.pathname]);
    return null;
  };

  if (loading) return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-[9999] animate-out fade-out duration-700">
      <div className="relative flex flex-col items-center">
        {/* Animated Brand Container */}
        <div className="w-24 h-24 relative mb-8">
          <div className="absolute inset-0 border-4 border-gray-100 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="absolute inset-4 bg-gray-900 rounded-full flex items-center justify-center shadow-xl animate-pulse">
            <span className="text-white font-black text-2xl">A</span>
          </div>
        </div>

        {/* Typographic Status */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">System Initializing</h2>
          <div className="flex items-center justify-center gap-2">
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
            <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
          </div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-4">Establishing Secure Connection</p>
        </div>
      </div>
    </div>
  );

  return (
    <Router>
      <VisitorTracker />
      <ScrollToTop />
      <div className="max-w-screen-lg mx-auto bg-transparent min-h-screen relative font-sans">
        <Header profile={profile} />

        <Routes>
          <Route path="/" element={<LandingPage profile={profile} skills={skills} services={services} works={works} posts={posts} feedback={feedback} />} />
          <Route path="/posts" element={<PostsPage posts={posts} loading={postsLoading} />} />
          <Route path="/post/:id" element={<PostDetailPage posts={posts} />} />
          <Route path="/services" element={<ServicesPage services={services} loading={servicesLoading} />} />
          <Route path="/service/:id" element={<ServiceDetailPage services={services} loading={servicesLoading} />} />
          <Route path="/feedback" element={<FeedbackPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin" element={
            user ? (
              <AdminPanel
                profile={profile}
                skills={skills}
                services={services}
                works={works}
                posts={posts}
                feedback={feedback}
                hireRequests={hireRequests}
                contacts={contacts}
                analytics={analytics}
              />
            ) : (
              <AdminLoginPage />
            )
          } />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
