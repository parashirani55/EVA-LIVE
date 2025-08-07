import React from 'react';
import TestCall from '../components/TestCall'
import { Phone, Users, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Play, Star, MessageSquare, Clock, TrendingUp, Award, Globe } from 'lucide-react';

function Home() {
    const features = [
        {
            icon: Phone,
            title: "AI Voice Campaigns",
            description: "Advanced AI-powered voice calling with natural conversation flows",
            color: "from-blue-500 to-blue-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700"
        },
        {
            icon: BarChart3,
            title: "Real-time Analytics",
            description: "Track performance metrics and optimize campaigns instantly",
            color: "from-emerald-500 to-emerald-600",
            bgColor: "bg-emerald-50",
            textColor: "text-emerald-700"
        },
        {
            icon: Shield,
            title: "Enterprise Security",
            description: "Bank-grade security with end-to-end encryption",
            color: "from-amber-500 to-amber-600",
            bgColor: "bg-amber-50",
            textColor: "text-amber-700"
        },
        {
            icon: Zap,
            title: "Lightning Fast",
            description: "Deploy campaigns in minutes with our intuitive interface",
            color: "from-red-500 to-red-600",
            bgColor: "bg-red-50",
            textColor: "text-red-700"
        }
    ];

    const stats = [
        { value: "10M+", label: "Calls Completed", icon: Phone },
        { value: "98.5%", label: "Success Rate", icon: TrendingUp },
        { value: "500+", label: "Happy Clients", icon: Users },
        { value: "24/7", label: "Support", icon: Clock }
    ];

    const testimonials = [
        {
            name: "Sarah Johnson",
            role: "Marketing Director",
            company: "TechCorp",
            content: "This platform revolutionized our outreach campaigns. The AI voices are incredibly natural and our conversion rates increased by 300%.",
            avatar: "SJ",
            rating: 5
        },
        {
            name: "Michael Chen",
            role: "Sales Manager",
            company: "GrowthCo",
            content: "The analytics dashboard gives us insights we never had before. Campaign optimization has never been this easy.",
            avatar: "MC",
            rating: 5
        },
        {
            name: "Emma Rodriguez",
            role: "CEO",
            company: "StartupXYZ",
            content: "From setup to execution, everything is seamless. Our team productivity has increased dramatically.",
            avatar: "ER",
            rating: 5
        }
    ];

    const pricingPlans = [
        {
            name: "Starter",
            price: "$99",
            period: "/month",
            features: ["1,000 calls/month", "Basic analytics", "Email support", "Standard voices"],
            popular: false
        },
        {
            name: "Professional",
            price: "$299",
            period: "/month",
            features: ["10,000 calls/month", "Advanced analytics", "Priority support", "Premium voices", "A/B testing"],
            popular: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            period: "",
            features: ["Unlimited calls", "Custom analytics", "24/7 support", "Custom voices", "White-label solution"],
            popular: false
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
            {/* Section 1: Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5"></div>
                <div className="relative max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-8">
                        <div className="space-y-4">
                            <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full text-sm font-medium text-slate-700">
                                <Zap className="w-4 h-4 mr-2 text-blue-600" />
                                AI-Powered Voice Campaigns
                            </div>
                            <h1 className="text-5xl md:text-7xl font-bold text-slate-900 leading-tight">
                                Transform Your
                                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Outreach</span>
                            </h1>
                            <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
                                Leverage cutting-edge AI voice technology to create personalized, scalable campaigns that convert prospects into customers with unprecedented efficiency.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center">
                                Start Free Trial
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                            <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-semibold hover:shadow-xl transition-all duration-300 flex items-center justify-center">
                                <Play className="w-5 h-5 mr-2" />
                                Watch Demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Section 2: Key Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Powerful Features</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Everything you need to run successful AI voice campaigns at scale
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-white rounded-2xl p-8 border border-slate-100 hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                <div className={`w-16 h-16 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                    <feature.icon className={`w-8 h-8 ${feature.textColor}`} />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 3: Statistics */}
            <section className="py-20 bg-gradient-to-r from-blue-500 to-purple-600">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-white">Trusted by Industry Leaders</h2>
                        <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                            Join thousands of companies achieving remarkable results
                        </p>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center group">
                                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 hover:bg-white/20 transition-all duration-300">
                                    <stat.icon className="w-12 h-12 text-white mx-auto mb-4 group-hover:scale-110 transition-transform duration-300" />
                                    <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                                    <div className="text-blue-100 font-medium">{stat.label}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 4: How It Works */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">How It Works</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Get started with AI voice campaigns in three simple steps
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "01",
                                title: "Upload Your Contacts",
                                description: "Import your prospect list and segment your audience for targeted campaigns",
                                icon: Users
                            },
                            {
                                step: "02",
                                title: "Create AI Scripts",
                                description: "Design personalized conversation flows with our intuitive script builder",
                                icon: MessageSquare
                            },
                            {
                                step: "03",
                                title: "Launch & Monitor",
                                description: "Deploy your campaign and track real-time performance metrics",
                                icon: BarChart3
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative group">
                                <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300">
                                    <div className="text-6xl font-bold text-gradient bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-4">
                                        {item.step}
                                    </div>
                                    <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6">
                                        <item.icon className="w-8 h-8 text-blue-700" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed">{item.description}</p>
                                </div>
                                {index < 2 && (
                                    <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-8">
                                        <ArrowRight className="w-6 h-6 text-slate-400" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 5: Testimonials */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">What Our Clients Say</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Hear from companies that transformed their outreach with our platform
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 hover:shadow-2xl transition-all duration-300">
                                <div className="flex items-center space-x-1 mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                                <p className="text-slate-600 leading-relaxed mb-6 italic">"{testimonial.content}"</p>
                                <div className="flex items-center">
                                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                                        {testimonial.avatar}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-slate-900">{testimonial.name}</div>
                                        <div className="text-slate-600 text-sm">{testimonial.role} at {testimonial.company}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 6: Pricing */}
            <section className="py-20 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center space-y-4 mb-16">
                        <h2 className="text-4xl font-bold text-slate-900">Simple, Transparent Pricing</h2>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                            Choose the perfect plan for your business needs
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {pricingPlans.map((plan, index) => (
                            <div key={index} className={`relative bg-white rounded-2xl p-8 shadow-sm border ${plan.popular ? 'border-blue-500 scale-105' : 'border-slate-100'} hover:shadow-2xl transition-all duration-300`}>
                                {plan.popular && (
                                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                                            Most Popular
                                        </div>
                                    </div>
                                )}
                                <div className="text-center mb-8">
                                    <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                                    <div className="flex items-baseline justify-center">
                                        <span className="text-5xl font-bold text-slate-900">{plan.price}</span>
                                        <span className="text-slate-600 ml-2">{plan.period}</span>
                                    </div>
                                </div>
                                <div className="space-y-4 mb-8">
                                    {plan.features.map((feature, featureIndex) => (
                                        <div key={featureIndex} className="flex items-center">
                                            <CheckCircle className="w-5 h-5 text-emerald-600 mr-3" />
                                            <span className="text-slate-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                                <button className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 ${plan.popular
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                    }`}>
                                    Get Started
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Section 7: CTA Section */}
            <section className="py-20 bg-gradient-to-r from-slate-900 to-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-4xl md:text-5xl font-bold text-white">
                                Ready to Transform Your Outreach?
                            </h2>
                            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
                                Join thousands of companies using AI voice campaigns to achieve unprecedented growth
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300">
                                Start Your Free Trial
                            </button>
                            <button className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl font-semibold hover:bg-white/20 transition-all duration-300 border border-white/20">
                                Schedule a Demo
                            </button>
                        </div>
                        <div className="flex items-center justify-center space-x-8 text-slate-400">
                            <div className="flex items-center">
                                <CheckCircle className="w-5 h-5 mr-2 text-emerald-400" />
                                No Credit Card Required
                            </div>
                            <div className="flex items-center">
                                <Globe className="w-5 h-5 mr-2 text-blue-400" />
                                Available Worldwide
                            </div>
                            <div className="flex items-center">
                                <Award className="w-5 h-5 mr-2 text-amber-400" />
                                Award Winning Support
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div>
                <h1>Welcome</h1>
                <TestCall />
            </div>
        </div>
    );
}

export default Home;