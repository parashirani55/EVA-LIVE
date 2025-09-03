import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
    Sparkles, Menu, X, ChevronDown, ArrowRight, 
    Users, Target, Zap, Award, Globe, Heart, 
    Lightbulb, TrendingUp, Shield, Clock,
    Linkedin, Twitter, Mail, Calendar
} from 'lucide-react';

function About() {
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
        { name: 'Home', href: '/', current: false },
        { name: 'Features', href: '/Features' },
        { name: 'Pricing', href: '/Pricing' },
        { name: 'About', href: '/about', current: true },
        { name: 'Contact', href: '/contact' }
    ];

    const values = [
        {
            icon: Lightbulb,
            title: "Innovation First",
            description: "We constantly push the boundaries of AI technology to deliver cutting-edge voice solutions that transform how businesses connect with their customers.",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700",
            emoji: "💡"
        },
        {
            icon: Heart,
            title: "Customer Success",
            description: "Every decision we make is driven by our commitment to helping our customers achieve unprecedented growth and success with Eva's platform.",
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50",
            textColor: "text-red-700",
            emoji: "❤️"
        },
        {
            icon: Shield,
            title: "Trust & Security",
            description: "We maintain the highest standards of security and privacy, ensuring your data and campaigns are always protected with enterprise-grade encryption.",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            emoji: "🔐"
        },
        {
            icon: TrendingUp,
            title: "Continuous Growth",
            description: "We believe in constant improvement, both for our platform and our team, always striving to deliver better results for our customers.",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            emoji: "📈"
        }
    ];

    const team = [
        {
            name: "Sarah Chen",
            role: "CEO & Co-Founder",
            bio: "Former VP of Engineering at TechCorp with 15+ years in AI and machine learning. Passionate about transforming business communications.",
            avatar: "SC",
            gradient: "from-blue-500 to-purple-600",
            social: { linkedin: "#", twitter: "#", email: "sarah@eva.ai" }
        },
        {
            name: "Michael Rodriguez",
            role: "CTO & Co-Founder", 
            bio: "AI researcher and former Google engineer. Expert in natural language processing and voice synthesis technologies.",
            avatar: "MR",
            gradient: "from-purple-500 to-blue-600",
            social: { linkedin: "#", twitter: "#", email: "michael@eva.ai" }
        },
        {
            name: "Emily Watson",
            role: "VP of Product",
            bio: "Product strategist with deep experience in SaaS platforms. Focused on creating intuitive user experiences that drive results.",
            avatar: "EW",
            gradient: "from-blue-600 to-purple-500",
            social: { linkedin: "#", twitter: "#", email: "emily@eva.ai" }
        },
        {
            name: "David Kim",
            role: "VP of Sales",
            bio: "Sales leader with track record of scaling B2B companies. Expert in building relationships and driving customer success.",
            avatar: "DK",
            gradient: "from-purple-600 to-blue-700",
            social: { linkedin: "#", twitter: "#", email: "david@eva.ai" }
        }
    ];

    const stats = [
        { value: "2019", label: "Founded", icon: Calendar, color: "from-blue-400 to-blue-600" },
        { value: "50+", label: "Team Members", icon: Users, color: "from-purple-400 to-purple-600" },
        { value: "$25M", label: "Funding Raised", icon: TrendingUp, color: "from-emerald-400 to-emerald-600" },
        { value: "15+", label: "Countries", icon: Globe, color: "from-amber-400 to-amber-600" }
    ];

    const timeline = [
        {
            year: "2019",
            title: "Eva AI Founded",
            description: "Started with a vision to revolutionize business communications through AI voice technology.",
            color: "from-blue-500 to-purple-600"
        },
        {
            year: "2020",
            title: "First AI Voice Platform",
            description: "Launched our first AI voice calling platform with natural conversation capabilities.",
            color: "from-purple-500 to-blue-600"
        },
        {
            year: "2021",
            title: "Series A Funding",
            description: "Raised $10M Series A to expand our AI capabilities and grow our team.",
            color: "from-blue-600 to-purple-500"
        },
        {
            year: "2022",
            title: "Enterprise Launch",
            description: "Launched enterprise-grade features with advanced analytics and security.",
            color: "from-purple-600 to-blue-700"
        },
        {
            year: "2023",
            title: "Global Expansion",
            description: "Expanded to 15+ countries and reached 10M+ calls completed milestone.",
            color: "from-blue-500 to-purple-600"
        },
        {
            year: "2024",
            title: "Next Generation AI",
            description: "Launched Eva 2.0 with advanced conversational AI and real-time optimization.",
            color: "from-purple-500 to-blue-600"
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

            {/* Clean Background Elements */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-purple-400/10 to-blue-400/10 rounded-full blur-3xl"></div>
            </div>

            {/* Hero Section */}
            <section 
                className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 pb-20"
                id="hero"
                data-animate
            >
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-12 ${
                        isVisible.hero ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <div className="space-y-8">
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-lg rounded-full text-sm font-medium text-slate-700 border border-white/20 shadow-lg">
                                <Sparkles className="w-4 h-4 mr-2 text-blue-600 animate-pulse" />
                                About Eva AI ✨
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-tight">
                                Revolutionizing
                                <br />
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                        Communication
                                    </span>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse"></div>
                                </span>
                                <br />
                                with AI
                            </h1>
                            
                            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                                We're building the future of business communications with 
                                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> cutting-edge AI voice technology </span>
                                that helps companies connect with customers like never before.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section 
                className="py-24 bg-white relative"
                id="mission"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div className={`${
                            isVisible.mission ? 'animate-in fade-in slide-in-from-left duration-1000' : 'opacity-0'
                        }`}>
                            <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-8">
                                Our Mission
                            </h2>
                            <div className="space-y-6 text-xl text-slate-600 leading-relaxed">
                                <p>
                                    At Eva AI, we believe that every business conversation should be meaningful, personal, and effective. Our mission is to democratize access to advanced AI voice technology, making it possible for companies of all sizes to create authentic connections with their customers.
                                </p>
                                <p>
                                    We're not just building software – we're crafting the future of human-AI interaction, where technology enhances rather than replaces the human touch in business communications.
                                </p>
                                <p>
                                    Through Eva's platform, we empower businesses to scale their outreach while maintaining the personal touch that drives real results and lasting relationships.
                                </p>
                            </div>
                        </div>
                        
                        <div className={`relative ${
                            isVisible.mission ? 'animate-in fade-in slide-in-from-right delay-500 duration-1000' : 'opacity-0'
                        }`}>
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 relative overflow-hidden">
                                <div className="absolute top-4 right-4 text-4xl animate-bounce">🎯</div>
                                <div className="absolute bottom-4 left-4 text-3xl animate-bounce delay-1000">🚀</div>
                                <div className="space-y-8">
                                    <div className="text-center">
                                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                            <Target className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-3xl font-bold text-slate-900 mb-4">
                                            Vision 2030
                                        </h3>
                                        <p className="text-lg text-slate-600">
                                            To become the global leader in AI-powered business communications, enabling millions of meaningful conversations worldwide.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="values"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.values ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Our Core Values
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            The principles that guide everything we do at Eva AI
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {values.map((value, index) => (
                            <div 
                                key={index} 
                                className={`group relative bg-white rounded-3xl p-10 border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden ${
                                    isVisible.values ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-4 right-4 text-3xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-200">
                                    {value.emoji}
                                </div>
                                
                                <div className="relative z-10">
                                    <div className={`w-20 h-20 ${value.bgColor} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                        <value.icon className={`w-10 h-10 ${value.textColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                        {value.title}
                                    </h3>
                                    <p className="text-slate-600 leading-relaxed text-lg">
                                        {value.description}
                                    </p>
                                </div>
                                
                                <div className="absolute inset-0 rounded-3xl border-2 border-transparent group-hover:border-blue-200 transition-all duration-500"></div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Timeline Section */}
            <section 
                className="py-24 bg-white relative"
                id="timeline"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.timeline ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Our Journey
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Key milestones in Eva AI's evolution
                        </p>
                    </div>
                    
                    <div className="relative">
                        {/* Timeline line */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 to-purple-600 rounded-full"></div>
                        
                        <div className="space-y-16">
                            {timeline.map((item, index) => (
                                <div 
                                    key={index} 
                                    className={`relative flex items-center ${
                                        index % 2 === 0 ? 'justify-start' : 'justify-end'
                                    } ${
                                        isVisible.timeline ? `animate-in fade-in slide-in-from-${index % 2 === 0 ? 'left' : 'right'} delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                    }`}
                                >
                                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                                        <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-500 group">
                                            <div className="flex items-center mb-4">
                                                <div className={`w-12 h-12 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg mr-4 group-hover:scale-110 transition-transform duration-300`}>
                                                    {item.year.slice(-2)}
                                                </div>
                                                <div className="text-sm text-slate-500 font-semibold">
                                                    {item.year}
                                                </div>
                                            </div>
                                            <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors duration-300">
                                                {item.title}
                                            </h3>
                                            <p className="text-slate-600 leading-relaxed">
                                                {item.description}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {/* Timeline dot */}
                                    <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-white border-4 border-blue-500 rounded-full shadow-lg hover:scale-125 transition-transform duration-300"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
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
                            Eva AI by the Numbers
                        </h2>
                        <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
                            Our growth story in numbers
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
                                    <div className="relative z-10">
                                        <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                            <stat.icon className="w-8 h-8 text-white" />
                                        </div>
                                        <div className="text-4xl font-bold text-white mb-3">
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

            {/* Team Section */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="team"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.team ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Meet Our Leadership Team
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            The visionaries behind Eva AI's success
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, index) => (
                            <div 
                                key={index} 
                                className={`group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 text-center ${
                                    isVisible.team ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className={`w-24 h-24 bg-gradient-to-r ${member.gradient} rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-xl`}>
                                    {member.avatar}
                                </div>
                                
                                <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                                    {member.name}
                                </h3>
                                <div className="text-blue-600 font-semibold mb-4">
                                    {member.role}
                                </div>
                                <p className="text-slate-600 text-sm leading-relaxed mb-6">
                                    {member.bio}
                                </p>
                                
                                <div className="flex justify-center space-x-4">
                                    <a href={member.social.linkedin} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all duration-300 group/social">
                                        <Linkedin className="w-5 h-5" />
                                    </a>
                                    <a href={member.social.twitter} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-blue-400 hover:text-white transition-all duration-300 group/social">
                                        <Twitter className="w-5 h-5" />
                                    </a>
                                    <a href={`mailto:${member.social.email}`} className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center hover:bg-slate-600 hover:text-white transition-all duration-300 group/social">
                                        <Mail className="w-5 h-5" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
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
                                <Sparkles className="w-4 h-4 mr-2 text-blue-400" />
                                Ready to Get Started? ✨
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                Join Eva AI's
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                                    Success Story
                                </span>
                            </h2>
                            
                            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                                Become part of the companies revolutionizing their outreach with 
                                <span className="font-semibold text-blue-300"> Eva's AI voice technology</span>
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
                                        Start Your Free Trial
                                        <div className="ml-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/contact">
                                <button className="group px-12 py-6 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    Contact Our Team
                                </button>
                            </Link>
                        </div>
                        
                        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto pt-8 ${
                            isVisible.cta ? 'animate-in slide-in-from-bottom delay-1000 duration-700' : 'opacity-0'
                        }`}>
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Award className="w-6 h-6 text-emerald-400" />
                                </div>
                                <span className="font-semibold text-lg">Industry Leading</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="font-semibold text-lg">Enterprise Security</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Clock className="w-6 h-6 text-purple-400" />
                                </div>
                                <span className="font-semibold text-lg">24/7 Support</span>
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

export default About;