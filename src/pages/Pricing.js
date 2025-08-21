import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Phone, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight, 
    Star, Clock, TrendingUp, Award, Globe, Sparkles, Menu, X, 
    ChevronDown, Calculator, Headphones, Settings, Crown, 
    MessageSquare, Database, Lock, Wifi, Coffee, Rocket
} from 'lucide-react';

function Pricing() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrollY, setScrollY] = useState(0);
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [isVisible, setIsVisible] = useState({});

    // Scroll tracking
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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
        { name: 'Features', href: '/features' },
        { name: 'Pricing', href: '/pricing', current: true },
        { name: 'About', href: '/about' },
        { name: 'Contact', href: '/contact' }
    ];

    const pricingPlans = {
        monthly: [
            {
                name: "Starter",
                price: "$99",
                period: "/month",
                originalPrice: null,
                description: "Perfect for small businesses getting started with AI voice campaigns",
                features: [
                    "1,000 AI voice calls/month",
                    "5 campaign templates",
                    "Basic analytics dashboard",
                    "Email support",
                    "Standard AI voices (3 options)",
                    "CRM integration (basic)",
                    "Call recording & playback"
                ],
                limits: [
                    "Up to 2 team members",
                    "Basic reporting only",
                    "Email support only"
                ],
                popular: false,
                color: "from-slate-600 to-slate-700",
                bgColor: "bg-slate-50",
                link: "/register?plan=starter&billing=monthly",
                badge: null
            },
            {
                name: "Professional",
                price: "$299",
                period: "/month",
                originalPrice: null,
                description: "Ideal for growing teams that need advanced features and higher volume",
                features: [
                    "10,000 AI voice calls/month",
                    "Unlimited campaign templates",
                    "Advanced analytics & insights",
                    "Priority email & chat support",
                    "Premium AI voices (15+ options)",
                    "Advanced CRM integrations",
                    "A/B campaign testing",
                    "Custom caller ID",
                    "Lead scoring & routing",
                    "Automated follow-up sequences"
                ],
                limits: [
                    "Up to 10 team members",
                    "Advanced reporting",
                    "Priority support"
                ],
                popular: true,
                color: "from-blue-500 to-purple-600",
                bgColor: "bg-blue-50",
                link: "/register?plan=professional&billing=monthly",
                badge: "Most Popular"
            },
            {
                name: "Enterprise",
                price: "Custom",
                period: "",
                originalPrice: null,
                description: "For large organizations requiring unlimited scale and custom solutions",
                features: [
                    "Unlimited AI voice calls",
                    "Custom AI voice creation",
                    "White-label solution",
                    "Dedicated success manager",
                    "24/7 priority support",
                    "Custom integrations & API",
                    "Advanced security & compliance",
                    "Multi-region deployment",
                    "Custom analytics & reporting",
                    "SLA guarantees",
                    "Training & onboarding"
                ],
                limits: [
                    "Unlimited team members",
                    "Custom reporting",
                    "Dedicated support team"
                ],
                popular: false,
                color: "from-purple-600 to-blue-700",
                bgColor: "bg-purple-50",
                link: "/contact?plan=enterprise",
                badge: "Best Value"
            }
        ],
        annual: [
            {
                name: "Starter",
                price: "$79",
                period: "/month",
                originalPrice: "$99",
                description: "Perfect for small businesses getting started with AI voice campaigns",
                features: [
                    "1,000 AI voice calls/month",
                    "5 campaign templates",
                    "Basic analytics dashboard",
                    "Email support",
                    "Standard AI voices (3 options)",
                    "CRM integration (basic)",
                    "Call recording & playback"
                ],
                limits: [
                    "Up to 2 team members",
                    "Basic reporting only",
                    "Email support only"
                ],
                popular: false,
                color: "from-slate-600 to-slate-700",
                bgColor: "bg-slate-50",
                link: "/register?plan=starter&billing=annual",
                badge: "Save 20%"
            },
            {
                name: "Professional",
                price: "$239",
                period: "/month",
                originalPrice: "$299",
                description: "Ideal for growing teams that need advanced features and higher volume",
                features: [
                    "10,000 AI voice calls/month",
                    "Unlimited campaign templates",
                    "Advanced analytics & insights",
                    "Priority email & chat support",
                    "Premium AI voices (15+ options)",
                    "Advanced CRM integrations",
                    "A/B campaign testing",
                    "Custom caller ID",
                    "Lead scoring & routing",
                    "Automated follow-up sequences"
                ],
                limits: [
                    "Up to 10 team members",
                    "Advanced reporting",
                    "Priority support"
                ],
                popular: true,
                color: "from-blue-500 to-purple-600",
                bgColor: "bg-blue-50",
                link: "/register?plan=professional&billing=annual",
                badge: "Save 20%"
            },
            {
                name: "Enterprise",
                price: "Custom",
                period: "",
                originalPrice: null,
                description: "For large organizations requiring unlimited scale and custom solutions",
                features: [
                    "Unlimited AI voice calls",
                    "Custom AI voice creation",
                    "White-label solution",
                    "Dedicated success manager",
                    "24/7 priority support",
                    "Custom integrations & API",
                    "Advanced security & compliance",
                    "Multi-region deployment",
                    "Custom analytics & reporting",
                    "SLA guarantees",
                    "Training & onboarding"
                ],
                limits: [
                    "Unlimited team members",
                    "Custom reporting",
                    "Dedicated support team"
                ],
                popular: false,
                color: "from-purple-600 to-blue-700",
                bgColor: "bg-purple-50",
                link: "/contact?plan=enterprise",
                badge: "Best Value"
            }
        ]
    };

    const addOns = [
        {
            name: "Additional Voice Minutes",
            description: "Extra AI voice calling minutes for high-volume campaigns",
            price: "$0.08",
            unit: "per minute",
            icon: Phone,
            color: "from-blue-500 to-blue-600"
        },
        {
            name: "Custom Voice Creation",
            description: "Create unique AI voices that match your brand personality",
            price: "$499",
            unit: "per voice",
            icon: Headphones,
            color: "from-purple-500 to-purple-600"
        },
        {
            name: "Advanced Analytics",
            description: "Deep insights and custom reporting dashboards",
            price: "$99",
            unit: "per month",
            icon: BarChart3,
            color: "from-emerald-500 to-emerald-600"
        },
        {
            name: "Priority Support",
            description: "24/7 premium support with dedicated account manager",
            price: "$199",
            unit: "per month",
            icon: Headphones,
            color: "from-amber-500 to-amber-600"
        }
    ];

    const faqs = [
        {
            question: "How does Eva's AI voice technology work?",
            answer: "Eva uses advanced natural language processing and speech synthesis to create human-like conversations. Our AI can understand context, respond appropriately, and maintain engaging dialogues with your prospects."
        },
        {
            question: "Can I customize the AI voices?",
            answer: "Yes! Professional and Enterprise plans include access to premium AI voices, and Enterprise customers can create completely custom voices that match their brand personality."
        },
        {
            question: "What happens if I exceed my monthly call limit?",
            answer: "You can purchase additional minutes at $0.08 per minute, or upgrade to a higher plan. We'll notify you before you reach your limit so you can make the best choice for your needs."
        },
        {
            question: "Do you offer refunds?",
            answer: "We offer a 14-day money-back guarantee on all plans. If you're not satisfied with Eva within the first 14 days, we'll provide a full refund."
        },
        {
            question: "Can I change plans anytime?",
            answer: "Absolutely! You can upgrade or downgrade your plan at any time. Changes take effect at your next billing cycle, and we'll prorate any differences."
        },
        {
            question: "Is there a setup fee?",
            answer: "No setup fees! We believe in transparent pricing. What you see is what you pay - no hidden costs or surprise charges."
        }
    ];

    const currentPlans = pricingPlans[billingCycle];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Navigation */}
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
                scrollY > 50 
                    ? 'bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50' 
                    : 'bg-transparent'
            }`}>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-lg">
                                <Sparkles className="w-7 h-7 text-white" />
                            </div>
                            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Eva AI
                            </span>
                        </Link>

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

                        <button
                            className="md:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors duration-300"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                        </button>
                    </div>

                    {isMenuOpen && (
                        <div className="md:hidden absolute top-full left-0 w-full bg-white/95 backdrop-blur-lg shadow-xl border-b border-slate-200/50">
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
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 bg-gradient-to-br from-blue-50 via-white to-purple-50" id="hero" data-animate>
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-purple-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
                </div>
                
                <div className="relative max-w-7xl mx-auto px-6 text-center">
                    <div className={`space-y-8 ${isVisible.hero ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'}`}>
                        <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-100/80 to-purple-100/80 backdrop-blur-lg rounded-full text-sm font-medium text-slate-700 border border-white/20 shadow-lg">
                            <Calculator className="w-4 h-4 mr-2 text-blue-600" />
                            Transparent Pricing for Every Business Size
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                            Choose Your
                            <br />
                            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                                Eva AI Plan
                            </span>
                        </h1>
                        
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Start with our free trial, then choose the plan that scales with your business. 
                            All plans include Eva's powerful AI voice technology with no setup fees.
                        </p>

                        {/* Billing Toggle */}
                        <div className="flex items-center justify-center mt-12">
                            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-2 shadow-lg border border-slate-200/50">
                                <div className="flex items-center space-x-1">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                                            billingCycle === 'monthly'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('annual')}
                                        className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                                            billingCycle === 'annual'
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                                                : 'text-slate-600 hover:text-slate-900'
                                        }`}
                                    >
                                        Annual
                                        <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                                            20% OFF
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Plans */}
            <section className="py-24 bg-white" id="pricing" data-animate>
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {currentPlans.map((plan, index) => (
                            <div 
                                key={`${plan.name}-${billingCycle}`}
                                className={`relative bg-white rounded-3xl p-8 shadow-lg border transition-all duration-500 hover:shadow-2xl ${
                                    plan.popular 
                                        ? 'border-blue-500 scale-105 shadow-blue-500/20' 
                                        : 'border-slate-100 hover:scale-105'
                                } ${
                                    isVisible.pricing ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                {plan.badge && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                                        <div className={`px-6 py-2 rounded-full text-sm font-bold shadow-lg flex items-center ${
                                            plan.popular 
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white animate-pulse' 
                                                : plan.name === 'Starter' && billingCycle === 'annual'
                                                    ? 'bg-emerald-500 text-white'
                                                    : 'bg-purple-600 text-white'
                                        }`}>
                                            {plan.popular && <Star className="w-4 h-4 mr-1 fill-current" />}
                                            {plan.badge}
                                        </div>
                                    </div>
                                )}
                                
                                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${plan.color} opacity-0 hover:opacity-5 transition-opacity duration-500`}></div>
                                
                                <div className="relative z-10">
                                    <div className="text-center mb-8">
                                        <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                        <p className="text-slate-600 mb-6">{plan.description}</p>
                                        
                                        <div className="flex items-baseline justify-center mb-2">
                                            <span className={`text-5xl font-bold bg-gradient-to-r ${plan.color} bg-clip-text text-transparent`}>
                                                {plan.price}
                                            </span>
                                            <span className="text-slate-600 ml-2 text-lg">{plan.period}</span>
                                        </div>
                                        
                                        {plan.originalPrice && (
                                            <div className="text-slate-400 line-through text-sm">
                                                Originally {plan.originalPrice}/month
                                            </div>
                                        )}
                                        
                                        {billingCycle === 'annual' && plan.originalPrice && (
                                            <div className="text-emerald-600 font-semibold text-sm">
                                                Save ${(parseInt(plan.originalPrice.replace('$', '')) - parseInt(plan.price.replace('$', ''))) * 12}/year
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="space-y-4 mb-8">
                                        <h4 className="font-semibold text-slate-900 border-b border-slate-100 pb-2">Features Included:</h4>
                                        {plan.features.map((feature, featureIndex) => (
                                            <div key={featureIndex} className="flex items-start">
                                                <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mr-3 flex-shrink-0 mt-0.5">
                                                    <CheckCircle className="w-4 h-4 text-white" />
                                                </div>
                                                <span className="text-slate-600">{feature}</span>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <Link to={plan.link}>
                                        <button className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                            plan.popular
                                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105 shadow-lg'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:scale-105'
                                        }`}>
                                            {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Add-ons Section */}
            <section className="py-24 bg-gradient-to-b from-slate-50 to-white" id="addons" data-animate>
                <div className="max-w-7xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-16 ${
                        isVisible.addons ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Enhance Your Eva Experience
                        </h2>
                        <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                            Optional add-ons to supercharge your AI voice campaigns
                        </p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {addOns.map((addon, index) => (
                            <div 
                                key={index}
                                className={`bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:shadow-xl hover:scale-105 transition-all duration-300 ${
                                    isVisible.addons ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 200} duration-700` : 'opacity-0'
                                }`}
                            >
                                <div className={`w-12 h-12 bg-gradient-to-r ${addon.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <addon.icon className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-bold text-slate-900 mb-2">{addon.name}</h3>
                                <p className="text-slate-600 text-sm mb-4">{addon.description}</p>
                                <div className="flex items-baseline">
                                    <span className={`text-2xl font-bold bg-gradient-to-r ${addon.color} bg-clip-text text-transparent`}>
                                        {addon.price}
                                    </span>
                                    <span className="text-slate-500 ml-1 text-sm">{addon.unit}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="py-24 bg-white" id="faq" data-animate>
                <div className="max-w-4xl mx-auto px-6">
                    <div className={`text-center space-y-6 mb-16 ${
                        isVisible.faq ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                            Frequently Asked Questions
                        </h2>
                        <p className="text-xl text-slate-600">
                            Everything you need to know about Eva AI pricing
                        </p>
                    </div>
                    
                    <div className="space-y-6">
                        {faqs.map((faq, index) => (
                            <div 
                                key={index}
                                className={`bg-slate-50 rounded-2xl p-6 hover:bg-slate-100 transition-colors duration-300 ${
                                    isVisible.faq ? `animate-in fade-in slide-in-from-bottom delay-${(index + 1) * 100} duration-700` : 'opacity-0'
                                }`}
                            >
                                <h3 className="font-bold text-slate-900 mb-3">{faq.question}</h3>
                                <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 relative overflow-hidden" id="cta" data-animate>
                <div className="absolute top-10 left-10 w-40 h-40 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-10 right-10 w-60 h-60 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                
                <div className="relative max-w-4xl mx-auto px-6 text-center">
                    <div className={`space-y-8 ${
                        isVisible.cta ? 'animate-in fade-in slide-in-from-bottom duration-1000' : 'opacity-0'
                    }`}>
                        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                            Ready to Transform Your
                            <br />
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-300 bg-clip-text text-transparent">
                                Outreach with Eva?
                            </span>
                        </h2>
                        
                        <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                            Start your 14-day free trial today. No credit card required, no setup fees.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <Link to="/register">
                                <button className="group relative px-10 py-5 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-lg overflow-hidden hover:scale-110 transition-all duration-300 shadow-2xl hover:shadow-blue-500/50">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    <span className="relative z-10 flex items-center">
                                        Start Your Free Trial
                                        <Rocket className="w-5 h-5 ml-2" />
                                    </span>
                                </button>
                            </Link>
                            
                            <Link to="/contact">
                                <button className="group px-10 py-5 bg-white/10 backdrop-blur-lg text-white rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300 border-2 border-white/20 hover:border-white/40 flex items-center hover:scale-105">
                                    <MessageSquare className="w-5 h-5 mr-3" />
                                    Talk to Sales
                                </button>
                            </Link>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto pt-8">
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                                </div>
                                <span className="font-semibold">14-Day Free Trial</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Shield className="w-5 h-5 text-blue-400" />
                                </div>
                                <span className="font-semibold">No Setup Fees</span>
                            </div>
                            
                            <div className="flex items-center justify-center space-x-3 text-slate-300 hover:text-white transition-colors duration-300 group">
                                <div className="w-10 h-10 bg-amber-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <Coffee className="w-5 h-5 text-amber-400" />
                                </div>
                                <span className="font-semibold">Cancel Anytime</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-slate-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
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

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Product</h4>
                            <div className="space-y-4">
                                <Link to="/features" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Features</Link>
                                <Link to="/pricing" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Pricing</Link>
                                <Link to="/integrations" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Integrations</Link>
                                <Link to="/api" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">API</Link>
                            </div>
                        </div>

                        <div>
                            <h4 className="text-lg font-semibold mb-6 text-white">Company</h4>
                            <div className="space-y-4">
                                <Link to="/about" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">About Us</Link>
                                <Link to="/careers" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Careers</Link>
                                <Link to="/blog" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Blog</Link>
                                <Link to="/press" className="block text-slate-400 hover:text-blue-400 transition-colors duration-300">Press</Link>
                            </div>
                        </div>

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

export default Pricing;