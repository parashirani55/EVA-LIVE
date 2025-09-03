import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Play, Star, MessageSquare, Clock, TrendingUp, Award, Globe, Sparkles, Menu, X, ChevronDown } from 'lucide-react';

function Home() {
    const [currentTestimonial, setCurrentTestimonial] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});

    // Optimized scroll tracking with throttling
    const handleScroll = useCallback(() => {
        setScrollY(window.scrollY);
    }, []);

    useEffect(() => {
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', throttledScroll, { passive: true });
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [handleScroll]);

    // Testimonial auto-rotation
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Optimized Intersection Observer for scroll animations
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                const updates = {};
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        updates[entry.target.id] = true;
                    }
                });
                if (Object.keys(updates).length > 0) {
                    setIsVisible(prev => ({ ...prev, ...updates }));
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        );

        const sections = document.querySelectorAll('[data-animate]');
        sections.forEach((section) => observer.observe(section));

        return () => observer.disconnect();
    }, []);

    const navigationLinks = [
        { name: 'Home', href: '/', current: true },
        { name: 'Features', href: '/Features' },
        { name: 'Pricing', href: '/Pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];

    const features = [
        {
            icon: Phone,
            title: "AI Voice Campaigns",
            description: "Advanced AI-powered voice calling with natural conversation flows powered by Eva",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            particles: "🎙️",
            delay: "delay-100"
        },
        {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Track performance metrics and optimize campaigns instantly with Eva's dashboard",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            particles: "📊",
            delay: "delay-200"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-grade security with end-to-end encryption for Eva's platform",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700",
            particles: "🔐",
            delay: "delay-300"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Deploy campaigns in minutes with Eva's intuitive interface",
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50",
            textColor: "text-red-700",
            particles: "⚡",
            delay: "delay-500"
        }
    ];

    const stats = [
        { value: "10M+", label: "Calls Completed", icon: Phone, color: "from-blue-400 to-blue-600" },
        { value: "98.5%", label: "Success Rate", icon: TrendingUp, color: "from-emerald-400 to-emerald-600" },
        { value: "500+", label: "Happy Clients", icon: Users, color: "from-purple-400 to-purple-600" },
        { value: "24/7", label: "Support", icon: Clock, color: "from-amber-400 to-amber-600" }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Director",
            company: "TechCorp",
            content: "Eva revolutionized our outreach campaigns. The AI voices are incredibly natural and our conversion rates increased by 300%.",
            avatar: "SJ",
            rating: 5,
            gradient: "from-blue-500 to-purple-600"
        },
        {
            name: "Michael Chen",
            role: "Sales Manager",
            company: "GrowthCo",
            content: "Eva's analytics dashboard gives us insights we never had before. Campaign optimization has never been this easy.",
            avatar: "MC",
            rating: 5,
            gradient: "from-purple-500 to-blue-600"
        },
        {
            name: "Emma Rodriguez",
            role: "CEO",
            company: "StartupXYZ",
            content: "From setup to execution, Eva makes everything seamless. Our team productivity has increased dramatically.",
            avatar: "ER",
            rating: 5,
            gradient: "from-blue-600 to-purple-500"
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$99",
            period: "/month",
            features: ["1,000 calls/month", "Basic analytics", "Email support", "Standard voices"],
            popular: false,
            color: "from-slate-600 to-slate-700",
            link: "/register?plan=starter"
        },
        {
            name: "Professional",
            price: "$299",
            period: "/month",
            features: ["10,000 calls/month", "Advanced analytics", "Priority support", "Premium voices", "A/B testing"],
            popular: true,
            color: "from-blue-500 to-purple-600",
            link: "/register?plan=professional"
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            features: ["Unlimited calls", "Custom analytics", "24/7 support", "Custom voices", "White-label solution"],
            popular: false,
            color: "from-purple-600 to-blue-700",
            link: "/contact?plan=enterprise"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            {/* Professional Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrollY > 50 
                    ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Eva AI
                            </span>
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            {navigationLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.href}
                                    className={`relative px-4 py-2 rounded-lg font-medium transition-all duration-300 group ${
                                        link.current 
                                            ? 'text-blue-600' 
                                            : 'text-slate-700 hover:text-blue-600'
                                    }`}
                                >
                                    {link.name}
                                    <div className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-500 to-purple-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${
                                        link.current ? 'scale-x-100' : ''
                                    }`}></div>
                                </Link>
                            ))}
                        </div>

                        {/* Desktop CTA Buttons */}
                        <div className="hidden md:flex items-center space-x-4">
                            <Link 
                                to="/login"
                                className="px-6 py-3 text-slate-700 font-semibold hover:text-blue-600 transition-colors duration-300"
                            >
                                Sign In
                            </Link>
                            <Link 
                                to="/register"
                                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                            >
                                Start Free Trial
                            </Link>
                        </div>

                        {/* Mobile Menu Button */}
                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <X className="w-6 h-6 text-slate-700" />
                            ) : (
                                <Menu className="w-6 h-6 text-slate-700" />
                            )}
                        </button>
                    </div>

                    {/* Mobile Menu */}
                    {isMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50 animate-in slide-in-from-top duration-300">
                            <div className="px-6 py-4 space-y-4">
                                {navigationLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.href}
                                        className={`block px-4 py-3 rounded-lg font-medium transition-all duration-300 ${
                                            link.current 
                                                ? 'text-blue-600 bg-blue-50' 
                                                : 'text-slate-700 hover:text-blue-600 hover:bg-slate-50'
                                        }`}
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                                <div className="pt-4 border-t border-slate-200 space-y-3">
                                    <Link 
                                        to="/login"
                                        className="block px-4 py-3 text-slate-700 font-semibold hover:text-blue-600 hover:bg-slate-50 rounded-lg transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Sign In
                                    </Link>
                                    <Link 
                                        to="/register"
                                        className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold text-center transition-all duration-300"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Start Free Trial
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Clean Background Elements (No Particles) */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Section 1: Enhanced Hero Section */}
            <section 
                className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20"
                id="hero"
                data-animate
            >
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-r from-blue-300/10 to-purple-300/10 rounded-full blur-3xl animate-pulse delay-500"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-12 ${
                        isVisible.hero ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-lg rounded-full text-sm font-medium text-slate-700 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300 animate-in slide-in-from-top delay-300">
                                <Sparkles className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
                                Eva's AI-Powered Voice Campaigns ✨
                            </div>
                            
                            <div className="relative">
                                <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-tight animate-in slide-in-from-bottom delay-500">
                                    Transform Your
                                    <br />
                                    <span className="relative inline-block">
                                        <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-pulse">
                                            Outreach
                                        </span>
                                        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse"></div>
                                    </span>
                                    <br />
                                    with Eva
                                </h1>
                                
                                {/* Floating particles around the title */}
                                <div className="absolute -top-10 -left-10 text-4xl animate-bounce delay-700">🎯</div>
                                <div className="absolute -top-5 -right-10 text-3xl animate-bounce delay-1000">🚀</div>
                                <div className="absolute -bottom-5 left-20 text-3xl animate-bounce delay-1300">💫</div>
                            </div>
                            
                            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed animate-in slide-in-from-bottom delay-700">
                                Leverage Eva's cutting-edge AI voice technology to create 
                                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> personalized, scalable campaigns </span>
                                that convert prospects into customers with unprecedented efficiency.
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-in slide-in-from-bottom delay-1000">
                            <Link to="/register">
                                <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center">
                                        Start Your Free Trial with Eva
                                        <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/demo">
                                <button className="group px-10 py-5 bg-white/80 backdrop-blur-lg border-2 border-slate-200/50 text-slate-700 rounded-2xl font-bold text-lg hover:bg-white hover:shadow-2xl transition-all duration-300 flex items-center hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-white ml-1" />
                                    </div>
                                    Watch Eva's Demo
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Enhanced Key Features */}
            <section 
                className="py-24 bg-white relative"
                id="features"
                data-animate
            >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-purple-50/30"></div>
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.features ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Powerful Features of Eva
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Everything you need to run successful AI voice campaigns with Eva
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div 
                                key={index} 
                                className={`group relative bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden ${
                                    isVisible.features ? `animate-in fade-in slide-in-from-bottom ${feature.delay} duration-700` : 'opacity-0'
                                }`}
                            >
                                {/* Animated background */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                
                                {/* Floating particle */}
                                <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-200">
                                    {feature.particles}
                                </div>
                                
                                <div className="relative z-10">
                                    <div className={`w-20 h-20 ${feature.bgColor} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                        <feature.icon className={`w-10 h-10 ${feature.textColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {feature.description}
                                    </p>
                                </div>
                                
                                {/* Hover border effect */}
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Enhanced Statistics (No Particles) */}
            <section 
                className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden"
                id="stats"
                data-animate
            >
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.stats ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold text-white">
                            Trusted by Industry Leaders
                        </h2>
                        <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
                            Join thousands of companies achieving remarkable results with Eva
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div 
                                key={index} 
                                className={`group text-center ${
                                    isVisible.stats ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="relative bg-white/10 backdrop-blur-lg rounded-3xl p-10 hover:bg-white/20 transition-all duration-500 hover:scale-110 border border-white/10">
                                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/5 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                    
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                            <stat.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-5xl font-bold text-white mb-3 group-hover:text-blue-100 transition-colors duration-300">
                                            {stat.value}
                                        </div>
                                        <div className="text-blue-100 font-semibold text-lg">
                                            {stat.label}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: Enhanced How It Works */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="how-it-works"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible['how-it-works'] ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            How Eva Works
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Get started with Eva's AI voice campaigns in three simple steps
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            {
                                step: "01",
                                title: "Upload Your Contacts",
                                description: "Import your prospect list and segment your audience for targeted campaigns with Eva",
                                icon: Users,
                                color: "from-blue-500 to-blue-600",
                                emoji: "📋",
                                link: "/dashboard/contacts"
                            },
                            {
                                step: "02",
                                title: "Create AI Scripts",
                                description: "Design personalized conversation flows with Eva's intuitive script builder",
                                icon: MessageSquare,
                                color: "from-purple-500 to-purple-600",
                                emoji: "✨",
                                link: "/dashboard/scripts"
                            },
                            {
                                step: "03",
                                title: "Launch & Monitor",
                                description: "Deploy your campaign and track real-time performance metrics with Eva",
                                icon: BarChart3,
                                color: "from-blue-600 to-purple-600",
                                emoji: "🚀",
                                link: "/dashboard/campaigns"
                            }
                        ].map((item, index) => (
                            <div 
                                key={index} 
                                className={`relative group ${
                                    isVisible['how-it-works'] ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 300} duration-700` : 'opacity-0'
                                }`}
                            >
                                <Link to={item.link}>
                                    <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 relative overflow-hidden cursor-pointer">
                                        {/* Background gradient on hover */}
                                        <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>
                                        
                                        <div className="relative z-10">
                                            {/* Large step number with gradient */}
                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`text-8xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>
                                                    {item.step}
                                                </div>
                                                <div className="text-4xl group-hover:animate-bounce transition-all duration-300 delay-200">
                                                    {item.emoji}
                                                </div>
                                            </div>
                                            
                                            {/* Icon container */}
                                            <div className={`bg-gradient-to-r ${item.color} w-20 h-20 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                                <item.icon className="w-10 h-10 text-white" />
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed text-lg mb-4">
                                                {item.description}
                                            </p>
                                            <div className="flex items-center text-blue-600 font-semibold group-hover:text-purple-600 transition-colors duration-300">
                                                <span className="mr-2">Learn More</span>
                                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                                
                                {/* Animated arrow */}
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-6 w-12 h-12 z-20">
                                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                                            <ArrowRight className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Enhanced Testimonials Carousel */}
            <section 
                className="py-24 bg-white relative overflow-hidden"
                id="testimonials"
                data-animate
            >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50"></div>
                
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.testimonials ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            What Our Clients Say About Eva
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Hear from companies that transformed their outreach with Eva
                        </p>
                    </div>
                    
                    <div className={`relative ${
                        isVisible.testimonials ? 'animate-in fade-in slide-in-from-bottom delay-500 duration-1000' : 'opacity-0'
                    }`}>
                        {/* Main testimonial display */}
                        <div className="max-w-4xl mx-auto">
                            <div className="bg-white rounded-3xl p-12 shadow-2xl border border-slate-100 relative overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[currentTestimonial].gradient} opacity-5`}></div>
                                
                                <div className="relative z-10 text-center">
                                    {/* Stars */}
                                    <div className="flex items-center justify-center space-x-2 mb-8">
                                        {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                                            <Star key={i} className="w-8 h-8 fill-amber-400 text-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                                        ))}
                                    </div>
                                    
                                    {/* Quote */}
                                    <p className="text-2xl text-slate-700 leading-relaxed mb-10 italic font-light">
                                        "{testimonials[currentTestimonial].content}"
                                    </p>
                                    
                                    {/* Author */}
                                    <div className="flex items-center justify-center">
                                        <div className={`w-20 h-20 bg-gradient-to-r ${testimonials[currentTestimonial].gradient} rounded-full flex items-center justify-center text-white font-bold text-xl mr-6 shadow-lg hover:scale-110 transition-transform duration-300`}>
                                            {testimonials[currentTestimonial].avatar}
                                        </div>
                                        <div className="text-left">
                                            <div className="font-bold text-slate-900 text-xl">
                                                {testimonials[currentTestimonial].name}
                                            </div>
                                            <div className="text-slate-600 text-lg">
                                                {testimonials[currentTestimonial].role} at {testimonials[currentTestimonial].company}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Testimonial indicators */}
                        <div className="flex items-center justify-center mt-12 space-x-4">
                            {testimonials.map((_, index) => (
                                <button
                                    key={index}
                                    className={`w-4 h-4 rounded-full transition-all duration-300 hover:scale-125 ${
                                        index === currentTestimonial
                                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 scale-125'
                                            : 'bg-slate-300 hover:bg-slate-400'
                                    }`}
                                    onClick={() => setCurrentTestimonial(index)}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 6: Enhanced Pricing */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="pricing"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.pricing ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Eva's Simple, Transparent Pricing
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Choose the perfect Eva plan for your business needs
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div 
                                key={index} 
                                className={`relative bg-white rounded-3xl p-10 shadow-lg border transition-all duration-500 hover:shadow-2xl ${
                                    plan.popular 
                                        ? 'border-blue-500 scale-105 shadow-blue-500/20' 
                                        : 'border-slate-100 hover:scale-105'
                                } ${
                                    isVisible.pricing ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                {plan.popular && (
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-full text-sm font-bold shadow-lg flex items-center animate-pulse">
                                            <Star className="w-4 h-4 mr-2 fill-current" />
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.color} opacity-0 hover:opacity-5 transition-opacity duration-500`}></div>
                                
                                <div className="relative z-10">
                                    <div className="text-center mb-10">
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">{plan.name}</h3>
                                        <div className="flex items-baseline justify-center">
                                            <span className={`text-6xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                                {plan.price}
                                            </span>
                                            <span className="text-slate-600 ml-3 text-xl">{plan.period}</span>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-6 mb-10">
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-center">
                                                <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                                                    <CheckCircle className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-slate-600 text-lg">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Link to={plan.link}>
                                        <button className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 shadow-lg'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                                        }`}>
                                            Get Started with Eva
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {/* Additional CTA */}
                    <div className={`text-center mt-16 ${
                        isVisible.pricing ? 'animate-in fade-in slide-in-from-bottom delay-1000 duration-700' : 'opacity-0'
                    }`}>
                        <p className="text-slate-600 mb-6 text-lg">Need a custom solution?</p>
                        <Link 
                            to="/contact"
                            className="inline-flex items-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Talk to Our Sales Team
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* Section 7: Enhanced CTA Section (No Particles) */}
            <section 
                className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden"
                id="cta"
                data-animate
            >
                <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className={`space-y-12 ${
                        isVisible.cta ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium text-white border border-white/20 mb-6 animate-pulse">
                                <Sparkles className="w-4 h-4 mr-2 text-blue-400 animate-pulse" />
                                Join The AI Revolution ✨
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                Ready to Transform Your
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                                    Outreach with Eva?
                                </span>
                            </h2>
                            
                            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                                Join thousands of companies using Eva's AI voice campaigns to achieve 
                                <span className="font-semibold text-blue-300"> unprecedented growth</span>
                            </p>
                        </div>
                        
                        <div className={`flex flex-col sm:flex-row gap-6 justify-center items-center ${
                            isVisible.cta ? 'animate-in slide-in-from-bottom delay-500 duration-700' : 'opacity-0'
                        }`}>
                            <Link to="/register">
                                <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center">
                                        Start Your Free Trial with Eva
                                        <div className="ml-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/demo">
                                <button className="group px-12 py-6 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-white ml-1" />
                                    </div>
                                    Schedule a Demo with Eva
                                </button>
                            </Link>
                        </div>
                        
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 ${
                            isVisible.cta ? 'animate-in slide-in-from-bottom delay-1000 duration-700' : 'opacity-0'
                        }`}>
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-6 h-6 text-emerald-400" />
                                </div>
                                <span className="font-semibold text-lg">No Credit Card Required</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Globe className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="font-semibold text-lg">Available Worldwide</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Award className="w-6 h-6 text-amber-400" />
                                </div>
                                <span className="font-semibold text-lg">Award Winning Support</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Professional Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                        {/* Company Info */}
                        <div className="space-y-6">
                            <Link to="/" className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                    <Sparkles className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    Eva AI
                                </span>
                            </Link>
                            <p className="text-slate-400 leading-relaxed">
                                Transform your outreach with Eva's cutting-edge AI voice technology and achieve unprecedented growth.
                            </p>
                            <div className="flex space-x-4">
                                {/* Social Media Icons */}
                                <a href="/login" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                                    <span className="text-sm">📘</span>
                                </a>
                                <a href="/login" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                                    <span className="text-sm">🐦</span>
                                </a>
                                <a href="/login" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
                                    <span className="text-sm">💼</span>
                                </a>
                            </div>
                        </div>

                        {/* Product Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Product</h4>
                            <div className="space-y-4">
                                <Link to="/features" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Features</Link>
                                <Link to="/pricing" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Pricing</Link>
                                <Link to="/integrations" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Integrations</Link>
                                <Link to="/api" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">API</Link>
                            </div>
                        </div>

                        {/* Company Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
                            <div className="space-y-4">
                                <Link to="/about" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">About Us</Link>
                                <Link to="/careers" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Careers</Link>
                                <Link to="/blog" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Blog</Link>
                                <Link to="/press" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Press</Link>
                            </div>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
                            <div className="space-y-4">
                                <Link to="/help" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Help Center</Link>
                                <Link to="/contact" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Contact Us</Link>
                                <Link to="/status" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Status</Link>
                                <Link to="/privacy" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Privacy Policy</Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 text-sm">
                            © 2024 Eva AI. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/terms" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Terms of Service</Link>
                            <Link to="/privacy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Privacy Policy</Link>
                            <Link to="/cookies" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Cookie Policy</Link>
                        </div>
                    </div>
                </div>
            </footer>

            {/* Scroll to Top Button */}
            {scrollY > 500 && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 z-40 animate-bounce"
                >
                    <ChevronDown className="w-6 h-6 rotate-180" />
                </button>
            )}
        </div>
    );
}

export default Home;    