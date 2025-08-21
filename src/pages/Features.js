import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
    Phone, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Play, Star, 
    MessageSquare, Clock, TrendingUp, Award, Globe, Sparkles, Menu, X, ChevronDown,
    Brain, Mic, Target, Settings, Database, Headphones, Bot, Calendar, FileText,
    PieChart, Activity, Layers, Workflow, Filter, Volume2, Languages, Lock,
    Cloud, Monitor, Smartphone, Palette, Code, BarChart4, Timer, UserCheck
} from 'lucide-react';

function Features() {
    const [activeCategory, setActiveCategory] = useState('voice');
    const [scrollY, setScrollY] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState({});

    // Optimized scroll tracking
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

    // Intersection Observer for animations
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
        { name: 'Home', href: '/' },
        { name: 'Features', href: '/features', current: true },
        { name: 'Pricing', href: '/pricing' },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];

    const featureCategories = [
        {
            id: 'voice',
            name: 'AI Voice Technology',
            icon: Mic,
            description: 'Advanced voice synthesis and conversation management',
            color: 'from-blue-500 to-blue-600'
        },
        {
            id: 'analytics',
            name: 'Analytics & Insights',
            icon: BarChart3,
            description: 'Real-time performance tracking and optimization',
            color: 'from-emerald-500 to-emerald-600'
        },
        {
            id: 'automation',
            name: 'Campaign Automation',
            icon: Zap,
            description: 'Intelligent workflow and campaign management',
            color: 'from-purple-500 to-purple-600'
        },
        {
            id: 'integration',
            name: 'Integrations',
            icon: Layers,
            description: 'Seamless connectivity with your existing tools',
            color: 'from-amber-500 to-amber-600'
        },
        {
            id: 'security',
            name: 'Security & Compliance',
            icon: Shield,
            description: 'Enterprise-grade security and data protection',
            color: 'from-red-500 to-red-600'
        }
    ];

    const allFeatures = {
        voice: [
            {
                icon: Brain,
                title: "Neural Voice Synthesis",
                description: "Create ultra-realistic AI voices that are indistinguishable from human speech using advanced neural networks.",
                benefits: ["Natural intonation", "Emotional expression", "99.5% accuracy"],
                color: "from-blue-500 to-blue-600"
            },
            {
                icon: Languages,
                title: "Multi-Language Support",
                description: "Conduct campaigns in 50+ languages with native accent support and cultural adaptation.",
                benefits: ["50+ languages", "Native accents", "Cultural context"],
                color: "from-indigo-500 to-indigo-600"
            },
            {
                icon: Volume2,
                title: "Voice Cloning",
                description: "Clone any voice with just 30 seconds of audio for personalized outreach campaigns.",
                benefits: ["30-second training", "Perfect replication", "Custom voices"],
                color: "from-cyan-500 to-cyan-600"
            },
            {
                icon: MessageSquare,
                title: "Conversation AI",
                description: "Handle complex conversations with context awareness and natural follow-up questions.",
                benefits: ["Context awareness", "Dynamic responses", "Follow-up handling"],
                color: "from-teal-500 to-teal-600"
            }
        ],
        analytics: [
            {
                icon: TrendingUp,
                title: "Real-Time Dashboard",
                description: "Monitor campaign performance with live metrics, conversion tracking, and detailed insights.",
                benefits: ["Live metrics", "Conversion tracking", "Custom reports"],
                color: "from-emerald-500 to-emerald-600"
            },
            {
                icon: PieChart,
                title: "Advanced Segmentation",
                description: "Segment audiences based on behavior, demographics, and engagement patterns.",
                benefits: ["Behavioral targeting", "Smart segmentation", "Predictive insights"],
                color: "from-green-500 to-green-600"
            },
            {
                icon: Activity,
                title: "Performance Optimization",
                description: "AI-powered recommendations to improve campaign performance and conversion rates.",
                benefits: ["AI recommendations", "A/B testing", "Performance alerts"],
                color: "from-lime-500 to-lime-600"
            },
            {
                icon: BarChart4,
                title: "Predictive Analytics",
                description: "Forecast campaign outcomes and identify high-value prospects using machine learning.",
                benefits: ["Outcome forecasting", "Lead scoring", "Trend analysis"],
                color: "from-emerald-600 to-emerald-700"
            }
        ],
        automation: [
            {
                icon: Workflow,
                title: "Smart Workflows",
                description: "Create intelligent automation workflows that adapt based on prospect responses and behavior.",
                benefits: ["Adaptive workflows", "Response triggers", "Smart routing"],
                color: "from-purple-500 to-purple-600"
            },
            {
                icon: Calendar,
                title: "Schedule Management",
                description: "Automatically schedule follow-ups, callbacks, and meetings based on optimal timing.",
                benefits: ["Auto scheduling", "Optimal timing", "Calendar sync"],
                color: "from-violet-500 to-violet-600"
            },
            {
                icon: Filter,
                title: "Lead Qualification",
                description: "Automatically qualify leads using AI-powered scoring and behavioral analysis.",
                benefits: ["AI scoring", "Auto qualification", "Pipeline management"],
                color: "from-fuchsia-500 to-fuchsia-600"
            },
            {
                icon: Timer,
                title: "Campaign Sequencing",
                description: "Design multi-step campaigns with intelligent timing and personalized messaging.",
                benefits: ["Multi-step flows", "Smart timing", "Personalization"],
                color: "from-pink-500 to-pink-600"
            }
        ],
        integration: [
            {
                icon: Database,
                title: "CRM Integration",
                description: "Seamlessly sync with Salesforce, HubSpot, Pipedrive, and 20+ other CRM platforms.",
                benefits: ["20+ CRM platforms", "Real-time sync", "Automated updates"],
                color: "from-amber-500 to-amber-600"
            },
            {
                icon: Code,
                title: "API & Webhooks",
                description: "Powerful REST API and webhook system for custom integrations and workflow automation.",
                benefits: ["RESTful API", "Webhook support", "Custom integrations"],
                color: "from-orange-500 to-orange-600"
            },
            {
                icon: Cloud,
                title: "Cloud Platforms",
                description: "Native integrations with AWS, Google Cloud, Microsoft Azure, and other cloud services.",
                benefits: ["Multi-cloud support", "Scalable infrastructure", "Global deployment"],
                color: "from-yellow-500 to-yellow-600"
            },
            {
                icon: FileText,
                title: "Data Import/Export",
                description: "Flexible data handling with support for CSV, Excel, JSON, and database connections.",
                benefits: ["Multiple formats", "Bulk operations", "Data validation"],
                color: "from-amber-600 to-amber-700"
            }
        ],
        security: [
            {
                icon: Lock,
                title: "End-to-End Encryption",
                description: "Military-grade encryption for all voice data, conversations, and customer information.",
                benefits: ["256-bit encryption", "Zero-knowledge", "Secure transmission"],
                color: "from-red-500 to-red-600"
            },
            {
                icon: UserCheck,
                title: "Compliance Suite",
                description: "Built-in compliance tools for GDPR, CCPA, TCPA, and industry-specific regulations.",
                benefits: ["GDPR compliant", "TCPA ready", "Audit trails"],
                color: "from-rose-500 to-rose-600"
            },
            {
                icon: Monitor,
                title: "Activity Monitoring",
                description: "Comprehensive logging and monitoring of all system activities and user actions.",
                benefits: ["Complete audit logs", "Real-time monitoring", "Security alerts"],
                color: "from-pink-500 to-pink-600"
            },
            {
                icon: Globe,
                title: "Enterprise SSO",
                description: "Single sign-on integration with Active Directory, LDAP, and SAML providers.",
                benefits: ["SSO support", "Role-based access", "Multi-factor auth"],
                color: "from-red-600 to-red-700"
            }
        ]
    };

    const stats = [
        { value: "99.9%", label: "Uptime SLA", icon: Activity },
        { value: "50+", label: "Integrations", icon: Layers },
        { value: "15ms", label: "Response Time", icon: Zap },
        { value: "256-bit", label: "Encryption", icon: Shield }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white overflow-hidden">
            {/* Navigation */}
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

            {/* Background Elements */}
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
                            <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-lg rounded-full text-sm font-medium text-slate-700 border border-white/20 shadow-lg hover:scale-105 transition-all duration-300">
                                <Settings className="w-4 h-4 mr-2 text-blue-600 animate-spin" />
                                Powerful Features of Eva AI ✨
                            </div>
                            
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                                Everything You Need
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                    Built-In
                                </span>
                            </h1>
                            
                            <p className="text-2xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                                Discover Eva's comprehensive suite of 
                                <span className="font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> AI-powered features </span>
                                designed to revolutionize your outreach campaigns and drive unprecedented results.
                            </p>
                        </div>
                        
                        <div className="flex justify-center">
                            <Link to="/register">
                                <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center">
                                        Start Your Free Trial
                                        <Sparkles className="w-5 h-5 ml-2 animate-pulse" />
                                    </span>
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="flex items-center justify-center mb-4">
                                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
                                        <stat.icon className="w-8 h-8 text-white" />
                                    </div>
                                </div>
                                <div className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-slate-600 font-medium">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Categories Navigation */}
            <section className="py-16 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
                            Explore Eva's Capabilities
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Choose a category to dive deep into Eva's powerful features
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {featureCategories.map((category) => (
                            <button
                                key={category.id}
                                onClick={() => setActiveCategory(category.id)}
                                className={`group flex items-center px-6 py-4 rounded-2xl font-semibold transition-all duration-300 border-2 ${
                                    activeCategory === category.id
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg scale-105'
                                        : 'bg-white text-slate-700 border-slate-200 hover:border-blue-300 hover:shadow-lg hover:scale-105'
                                }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center mr-3 transition-all duration-300 ${
                                    activeCategory === category.id
                                        ? 'bg-white/20'
                                        : `bg-gradient-to-r ${category.color}`
                                }`}>
                                    <category.icon className={`w-5 h-5 ${
                                        activeCategory === category.id ? 'text-white' : 'text-white'
                                    }`} />
                                </div>
                                <div className="text-left">
                                    <div className="font-bold">{category.name}</div>
                                    <div className={`text-sm ${
                                        activeCategory === category.id ? 'text-blue-100' : 'text-slate-500'
                                    }`}>
                                        {category.description}
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Feature Details */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="feature-details"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {allFeatures[activeCategory].map((feature, index) => (
                            <div 
                                key={index}
                                className={`group bg-white rounded-3xl p-10 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                                    isVisible['feature-details'] ? `animate-in fade-in slide-in-from-bottom delay-${index * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="relative">
                                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                        <feature.icon className="w-10 h-10 text-white" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-slate-900 mb-4 group-hover:text-blue-700 transition-colors duration-300">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-slate-600 leading-relaxed text-lg mb-8">
                                        {feature.description}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        <div className="font-semibold text-slate-800 mb-3">Key Benefits:</div>
                                        {feature.benefits.map((benefit, benefitIndex) => (
                                            <div key={benefitIndex} className="flex items-center">
                                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-slate-600">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Integration Showcase */}
            <section 
                className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 relative overflow-hidden"
                id="integrations"
                data-animate
            >
                <div className="absolute inset-0">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 3}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className={`text-center mb-20 ${
                        isVisible.integrations ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold text-white mb-6">
                            Seamless Integrations
                        </h2>
                        <p className="text-2xl text-blue-100 max-w-3xl mx-auto">
                            Eva works perfectly with your existing tools and workflows
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                        {[
                            { name: 'Salesforce', icon: '☁️' },
                            { name: 'HubSpot', icon: '🟠' },
                            { name: 'Pipedrive', icon: '🟢' },
                            { name: 'Slack', icon: '💬' },
                            { name: 'Microsoft', icon: '🪟' },
                            { name: 'Google', icon: '🟡' },
                            { name: 'AWS', icon: '☁️' },
                            { name: 'Zapier', icon: '⚡' },
                            { name: 'Calendly', icon: '📅' },
                            { name: 'Zoom', icon: '📹' },
                            { name: 'Twilio', icon: '📞' },
                            { name: 'Stripe', icon: '💳' }
                        ].map((integration, index) => (
                            <div 
                                key={index}
                                className={`bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-110 border border-white/10 ${
                                    isVisible.integrations ? `animate-in fade-in slide-in-from-bottom delay-${index * 100} duration-500` : 'opacity-0'
                                }`}
                            >
                                <div className="text-3xl mb-3">{integration.icon}</div>
                                <div className="text-white font-semibold text-sm">{integration.name}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Advanced Features Showcase */}
            <section 
                className="py-24 bg-white"
                id="advanced-features"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center mb-20 ${
                        isVisible['advanced-features'] ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
                            Advanced Capabilities
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Cutting-edge features that set Eva apart from the competition
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Bot,
                                title: "AI Personality Engine",
                                description: "Create unique AI personalities that match your brand voice and adapt to different audiences dynamically.",
                                features: ["Brand voice matching", "Adaptive personalities", "Emotional intelligence", "Cultural awareness"],
                                color: "from-indigo-500 to-indigo-600",
                                gradient: "from-indigo-50 to-purple-50"
                            },
                            {
                                icon: Target,
                                title: "Smart Lead Scoring",
                                description: "Advanced machine learning algorithms analyze prospect behavior to identify your highest-value opportunities.",
                                features: ["Behavioral analysis", "Predictive scoring", "Intent detection", "Engagement tracking"],
                                color: "from-emerald-500 to-emerald-600",
                                gradient: "from-emerald-50 to-blue-50"
                            },
                            {
                                icon: Palette,
                                title: "Dynamic Content Generation",
                                description: "AI-powered content creation that generates personalized scripts and messages for each prospect automatically.",
                                features: ["Auto script generation", "Personalization engine", "A/B testing", "Content optimization"],
                                color: "from-purple-500 to-purple-600",
                                gradient: "from-purple-50 to-pink-50"
                            }
                        ].map((feature, index) => (
                            <div 
                                key={index}
                                className={`relative group bg-gradient-to-br ${feature.gradient} rounded-3xl p-10 border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 ${
                                    isVisible['advanced-features'] ? `animate-in fade-in slide-in-from-bottom delay-${index * 300} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className="relative z-10">
                                    <div className={`w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                                        <feature.icon className="w-10 h-10 text-white" />
                                    </div>
                                    
                                    <h3 className="text-2xl font-bold text-slate-900 mb-6">
                                        {feature.title}
                                    </h3>
                                    
                                    <p className="text-slate-600 leading-relaxed text-lg mb-8">
                                        {feature.description}
                                    </p>
                                    
                                    <div className="space-y-4">
                                        {feature.features.map((item, itemIndex) => (
                                            <div key={itemIndex} className="flex items-center">
                                                <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mr-4"></div>
                                                <span className="text-slate-700 font-medium">{item}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Performance Metrics */}
            <section 
                className="py-24 bg-gradient-to-b from-slate-50 to-white"
                id="performance"
                data-animate
            >
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center mb-20 ${
                        isVisible.performance ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent mb-6">
                            Performance That Matters
                        </h2>
                        <p className="text-2xl text-slate-600 max-w-3xl mx-auto">
                            Eva delivers measurable results that transform your business outcomes
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            {
                                metric: "300%",
                                label: "Increase in Conversion Rate",
                                description: "Average improvement across all campaigns",
                                icon: TrendingUp,
                                color: "from-emerald-500 to-emerald-600"
                            },
                            {
                                metric: "85%",
                                label: "Reduction in Response Time",
                                description: "Faster prospect engagement and follow-up",
                                icon: Clock,
                                color: "from-blue-500 to-blue-600"
                            },
                            {
                                metric: "70%",
                                label: "Cost Reduction",
                                description: "Lower operational costs vs traditional methods",
                                icon: PieChart,
                                color: "from-purple-500 to-purple-600"
                            },
                            {
                                metric: "99.5%",
                                label: "Voice Quality Score",
                                description: "Human-like voice synthesis accuracy",
                                icon: Headphones,
                                color: "from-amber-500 to-amber-600"
                            }
                        ].map((stat, index) => (
                            <div 
                                key={index}
                                className={`group bg-white rounded-3xl p-8 shadow-lg border border-slate-100 hover:shadow-2xl transition-all duration-500 hover:scale-105 text-center ${
                                    isVisible.performance ? `animate-in fade-in slide-in-from-bottom delay-${index * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500 shadow-lg`}>
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                
                                <div className={`text-4xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-4`}>
                                    {stat.metric}
                                </div>
                                
                                <div className="text-lg font-semibold text-slate-900 mb-3">
                                    {stat.label}
                                </div>
                                
                                <div className="text-slate-600">
                                    {stat.description}
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
                <div className="absolute inset-0">
                    {[...Array(30)].map((_, i) => (
                        <div
                            key={i}
                            className="absolute w-1 h-1 bg-white/20 rounded-full animate-pulse"
                            style={{
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                                animationDelay: `${Math.random() * 5}s`,
                                animationDuration: `${3 + Math.random() * 2}s`
                            }}
                        />
                    ))}
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className={`space-y-12 ${
                        isVisible.cta ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <div className="space-y-8">
                            <h2 className="text-5xl md:text-7xl font-bold text-white leading-tight">
                                Ready to Experience
                                <br />
                                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                                    All These Features?
                                </span>
                            </h2>
                            
                            <p className="text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
                                Join thousands of companies leveraging Eva's powerful features to 
                                <span className="font-semibold text-blue-300"> transform their outreach campaigns</span>
                            </p>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/register">
                                <button className="group relative px-12 py-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center">
                                        Start Your Free Trial
                                        <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/demo">
                                <button className="group px-12 py-6 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-xl hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center hover:scale-105">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                                        <Play className="w-6 h-6 text-white ml-1" />
                                    </div>
                                    Schedule Demo
                                </button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
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
                                <Link to="/contact" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Contact</Link>
                            </div>
                        </div>

                        {/* Support Links */}
                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Support</h4>
                            <div className="space-y-4">
                                <Link to="/help" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Help Center</Link>
                                <Link to="/contact" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Contact Us</Link>
                                <Link to="/status" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Status</Link>
                                <Link to="/privacy" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Privacy</Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Bottom */}
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
                        <p className="text-slate-400 text-sm">
                            © 2024 Eva AI. All rights reserved.
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <Link to="/terms" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Terms</Link>
                            <Link to="/privacy" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Privacy</Link>
                            <Link to="/cookies" className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-300">Cookies</Link>
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

export default Features;