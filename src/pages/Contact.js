import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
    Sparkles, Menu, X, ChevronDown, ArrowRight, Send,
    Mail, Phone, MapPin, Clock, MessageSquare, 
    Headphones, Shield, Zap, CheckCircle, Star,
    Calendar, Globe, Award, Users, Building2
} from 'lucide-react';

function ContactPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [isVisible, setIsVisible] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        subject: '',
        message: '',
        contactReason: 'general'
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        // Simulate form submission
        setTimeout(() => {
            setSubmitStatus('success');
            setIsSubmitting(false);
            setFormData({
                name: '',
                email: '',
                company: '',
                phone: '',
                subject: '',
                message: '',
                contactReason: 'general'
            });
        }, 2000);
    };

    const navigationLinks = [
        { name: 'Home', href: '/', current: false },
        { name: 'Features', href: '/Features' },
        { name: 'Pricing', href: '/Pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact', current: true }
    ];

    const contactInfo = [
        {
            icon: Mail,
            title: "Email Us",
            primary: "hello@eva.ai",
            secondary: "support@eva.ai",
            description: "Get in touch via email for general inquiries or support",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            emoji: "📧",
            action: "mailto:hello@eva.ai"
        },
        {
            icon: Phone,
            title: "Call Us",
            primary: "+1 (555) 123-4567",
            secondary: "+1 (555) 123-4568",
            description: "Speak directly with our team during business hours",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-700",
            emoji: "📞",
            action: "tel:+15551234567"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            primary: "San Francisco, CA",
            secondary: "New York, NY",
            description: "Our headquarters and office locations",
            color: "from-purple-500 to-purple-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            emoji: "🏢",
            action: "#"
        },
        {
            icon: Clock,
            title: "Business Hours",
            primary: "Mon - Fri: 9AM - 6PM PST",
            secondary: "Weekend: Emergency only",
            description: "When you can reach our support team",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700",
            emoji: "🕒",
            action: "#"
        }
    ];

    const supportOptions = [
        {
            icon: MessageSquare,
            title: "Live Chat",
            description: "Get instant answers to your questions with our 24/7 chat support",
            color: "from-blue-500 to-purple-600",
            action: "Start Chat",
            emoji: "💬"
        },
        {
            icon: Headphones,
            title: "Phone Support",
            description: "Call our expert support team for personalized assistance",
            color: "from-purple-500 to-blue-600",
            action: "Call Now",
            emoji: "🎧"
        },
        {
            icon: Calendar,
            title: "Schedule Demo",
            description: "Book a personalized demo to see Eva AI in action",
            color: "from-blue-600 to-purple-500",
            action: "Book Demo",
            emoji: "📅"
        }
    ];

    const officeLocations = [
        {
            city: "San Francisco",
            address: "123 Innovation Drive, Suite 400",
            zipcode: "San Francisco, CA 94105",
            type: "Headquarters",
            employees: "25+ employees",
            color: "from-blue-500 to-blue-600"
        },
        {
            city: "New York",
            address: "456 Business Plaza, Floor 12",
            zipcode: "New York, NY 10001",
            type: "East Coast Office",
            employees: "15+ employees",
            color: "from-purple-500 to-purple-600"
        },
        {
            city: "Remote",
            address: "Distributed Team Worldwide",
            zipcode: "Global Coverage",
            type: "Remote Workforce",
            employees: "10+ employees",
            color: "from-emerald-500 to-emerald-600"
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
                                Get in Touch with Eva AI ✨
                            </div>
                            
                            <h1 className="text-6xl md:text-8xl font-bold text-slate-900 leading-tight">
                                Let's Start a
                                <br />
                                <span className="relative inline-block">
                                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                        Conversation
                                    </span>
                                    <div className="absolute -inset-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-2xl -z-10 animate-pulse"></div>
                                </span>
                            </h1>
                            
                            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                                Ready to transform your outreach with Eva's AI voice technology? 
                                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> We're here to help you get started.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Methods Section */}
            <section 
                className="py-24 bg-white relative"
                id="contact-methods"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible['contact-methods'] ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            How to Reach Us
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Multiple ways to connect with the Eva AI team
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {contactInfo.map((info, index) => (
                            <div 
                                key={index} 
                                className={`group relative bg-white rounded-3xl p-8 border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 overflow-hidden ${
                                    isVisible['contact-methods'] ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                <div className="absolute top-4 right-4 text-2xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-500 delay-200">
                                    {info.emoji}
                                </div>
                                
                                <div className="relative z-10">
                                    <div className={`w-20 h-20 ${info.bgColor} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-xl`}>
                                        <info.icon className={`w-10 h-10 ${info.textColor}`} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                        {info.title}
                                    </h3>
                                    <div className="space-y-2 mb-4">
                                        <div className="font-semibold text-slate-900">
                                            {info.primary}
                                        </div>
                                        <div className="text-slate-600">
                                            {info.secondary}
                                        </div>
                                    </div>
                                    <p className="text-slate-600 leading-relaxed text-sm mb-6">
                                        {info.description}
                                    </p>
                                    <a 
                                        href={info.action}
                                        className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${info.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 text-sm`}
                                    >
                                        Contact
                                        <ArrowRight className="w-4 h-4 ml-2" />
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="contact-form"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                        {/* Form */}
                        <div className={`${
                            isVisible['contact-form'] ? 'animate-in fade-in slide-in-from-left duration-1000' : 'opacity-0'
                        }`}>
                            <div className="bg-white rounded-3xl p-10 shadow-xl border border-slate-100">
                                <div className="mb-8">
                                    <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                                        Send us a Message
                                    </h2>
                                    <p className="text-xl text-slate-600">
                                        Fill out the form and we'll get back to you within 24 hours.
                                    </p>
                                </div>

                                {submitStatus === 'success' && (
                                    <div className="mb-8 p-6 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center animate-in fade-in duration-500">
                                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                                            <CheckCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-emerald-900 mb-1">Message Sent!</h3>
                                            <p className="text-emerald-700">We'll get back to you soon.</p>
                                        </div>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit} className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Full Name *
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                                placeholder="John Smith"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Email Address *
                                            </label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                                placeholder="john@company.com"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Company
                                            </label>
                                            <input
                                                type="text"
                                                name="company"
                                                value={formData.company}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                                placeholder="Your Company"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="block text-sm font-semibold text-slate-700">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                                placeholder="+1 (555) 123-4567"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            What can we help you with?
                                        </label>
                                        <select
                                            name="contactReason"
                                            value={formData.contactReason}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                        >
                                            <option value="general">General Inquiry</option>
                                            <option value="demo">Schedule a Demo</option>
                                            <option value="pricing">Pricing Questions</option>
                                            <option value="support">Technical Support</option>
                                            <option value="partnership">Partnership</option>
                                            <option value="enterprise">Enterprise Sales</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Subject *
                                        </label>
                                        <input
                                            type="text"
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg"
                                            placeholder="How can we help you?"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-slate-700">
                                            Message *
                                        </label>
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleInputChange}
                                            required
                                            rows={6}
                                            className="w-full px-4 py-4 border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 text-lg resize-none"
                                            placeholder="Tell us more about your needs..."
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="group relative w-full px-8 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl overflow-hidden hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                        <span className="relative z-10 flex items-center justify-center">
                                            {isSubmitting ? (
                                                <>
                                                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin mr-3"></div>
                                                    Sending Message...
                                                </>
                                            ) : (
                                                <>
                                                    Send Message
                                                    <Send className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                                </>
                                            )}
                                        </span>
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Support Options */}
                        <div className={`space-y-8 ${
                            isVisible['contact-form'] ? 'animate-in fade-in slide-in-from-right delay-500 duration-1000' : 'opacity-0'
                        }`}>
                            <div className="mb-12">
                                <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-4">
                                    Other Ways to Connect
                                </h2>
                                <p className="text-xl text-slate-600">
                                    Choose the method that works best for you
                                </p>
                            </div>

                            <div className="space-y-6">
                                {supportOptions.map((option, index) => (
                                    <div 
                                        key={index}
                                        className="group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-500 cursor-pointer"
                                    >
                                        <div className="flex items-start space-x-6">
                                            <div className={`w-16 h-16 bg-gradient-to-r ${option.color} rounded-2xl flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg flex-shrink-0`}>
                                                <option.icon className="w-8 h-8" />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-3">
                                                    <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-700 transition-colors duration-300">
                                                        {option.title}
                                                    </h3>
                                                    <div className="text-2xl opacity-0 group-hover:opacity-100 group-hover:animate-bounce transition-all duration-300">
                                                        {option.emoji}
                                                    </div>
                                                </div>
                                                <p className="text-slate-600 leading-relaxed mb-4">
                                                    {option.description}
                                                </p>
                                                <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r ${option.color} text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300`}>
                                                    {option.action}
                                                    <ArrowRight className="w-4 h-4 ml-2" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Quick Stats */}
                            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 mt-12">
                                <h3 className="text-2xl font-bold text-slate-900 mb-6 text-center">
                                    Our Support Promise
                                </h3>
                                <div className="grid grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            &lt;24h
                                        </div>
                                        <div className="text-sm text-slate-600">Response Time</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            99%
                                        </div>
                                        <div className="text-sm text-slate-600">Satisfaction Rate</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                                            24/7
                                        </div>
                                        <div className="text-sm text-slate-600">Live Chat</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Office Locations Section */}
            <section 
                className="py-24 bg-white relative"
                id="locations"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.locations ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Our Global Presence
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Eva AI offices and team locations worldwide
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {officeLocations.map((location, index) => (
                            <div 
                                key={index} 
                                className={`group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-500 ${
                                    isVisible.locations ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="relative overflow-hidden">
                                    <div className={`w-20 h-20 bg-gradient-to-r ${location.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg mx-auto`}>
                                        {location.city === 'Remote' ? (
                                            <Globe className="w-10 h-10 text-white" />
                                        ) : (
                                            <Building2 className="w-10 h-10 text-white" />
                                        )}
                                    </div>
                                    
                                    <div className="text-center">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2 group-hover:text-blue-700 transition-colors duration-300">
                                            {location.city}
                                        </h3>
                                        <div className="text-blue-600 font-semibold text-sm mb-4">
                                            {location.type}
                                        </div>
                                        <div className="space-y-2 text-slate-600 mb-6">
                                            <div>{location.address}</div>
                                            <div>{location.zipcode}</div>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2 text-slate-500">
                                            <Users className="w-4 h-4" />
                                            <span className="text-sm">{location.employees}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="faq"
                data-animate
            >
                <div className="max-w-4xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-20 ${
                        isVisible.faq ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-2xl text-slate-600">
                            Quick answers to common questions about Eva AI
                        </p>
                    </div>
                    
                    <div className={`space-y-6 ${
                        isVisible.faq ? 'animate-in fade-in slide-in-from-bottom delay-500 duration-1000' : 'opacity-0'
                    }`}>
                        {[
                            {
                                question: "How quickly can I get started with Eva AI?",
                                answer: "You can start using Eva AI within minutes! Sign up for your free trial, upload your contacts, and launch your first AI voice campaign in under 10 minutes."
                            },
                            {
                                question: "What kind of support do you provide?",
                                answer: "We offer 24/7 live chat support, phone support during business hours, comprehensive documentation, and personalized onboarding for enterprise customers."
                            },
                            {
                                question: "Is my data secure with Eva AI?",
                                answer: "Absolutely. We use enterprise-grade security with end-to-end encryption, SOC 2 compliance, and follow strict data privacy regulations including GDPR and CCPA."
                            },
                            {
                                question: "Can I customize the AI voices?",
                                answer: "Yes! Eva AI offers premium voice customization, including accent selection, tone adjustment, and even custom voice cloning for enterprise customers."
                            },
                            {
                                question: "What's your refund policy?",
                                answer: "We offer a 30-day money-back guarantee. If you're not satisfied with Eva AI within your first month, we'll provide a full refund, no questions asked."
                            }
                        ].map((faq, index) => (
                            <div 
                                key={index}
                                className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300"
                            >
                                <h3 className="text-xl font-bold text-slate-900 mb-4">
                                    {faq.question}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {faq.answer}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className={`text-center mt-16 ${
                        isVisible.faq ? 'animate-in fade-in slide-in-from-bottom delay-1000 duration-700' : 'opacity-0'
                    }`}>
                        <p className="text-slate-600 mb-6 text-lg">Still have questions?</p>
                        <Link 
                            to="/help"
                            className="inline-flex items-center px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
                        >
                            Visit Help Center
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Link>
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
                                Ready to Transform Your Outreach? ✨
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                Start Your
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                                    Eva AI Journey
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
                                        Start Your Free Trial
                                        <div className="ml-3 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/demo">
                                <button className="group px-12 py-6 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Calendar className="w-6 h-6 text-white" />
                                    </div>
                                    Schedule a Demo
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
                                    <Star className="w-6 h-6 text-blue-400" />
                                </div>
                                <span className="font-semibold text-lg">5-Star Support</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Award className="w-6 h-6 text-amber-400" />
                                </div>
                                <span className="font-semibold text-lg">30-Day Guarantee</span>
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
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                                    <span className="text-sm">📘</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-400 transition-colors duration-300">
                                    <span className="text-sm">🐦</span>
                                </a>
                                <a href="#" className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-blue-700 transition-colors duration-300">
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

export default ContactPage;