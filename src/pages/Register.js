import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Phone, User, Building, CheckCircle, Shield, Zap, ArrowRight, Users, BarChart3, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

function Register() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        company: '',
        password: '',
        confirmPassword: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);

    const benefits = [
        {
            icon: Phone,
            title: "Launch in Minutes",
            description: "Set up your first AI voice campaign in under 10 minutes",
            color: "text-blue-600",
            bgColor: "bg-blue-50"
        },
        {
            icon: BarChart3,
            title: "Real-time Insights",
            description: "Track every call with detailed analytics and performance metrics",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50"
        },
        {
            icon: Users,
            title: "Scale Effortlessly",
            description: "Handle thousands of calls simultaneously with AI automation",
            color: "text-amber-600",
            bgColor: "bg-amber-50"
        },
        {
            icon: Shield,
            title: "Enterprise Ready",
            description: "Built for security, compliance, and enterprise-grade reliability",
            color: "text-red-600",
            bgColor: "bg-red-50"
        }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = () => {
        // Handle registration logic here
        console.log('Registration submitted:', { ...formData, agreedToTerms });
    };

    const isStepComplete = (step) => {
        if (step === 1) {
            return formData.firstName && formData.lastName && formData.email;
        }
        if (step === 2) {
            return formData.company && formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;
        }
        return false;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex">
            {/* Left Side - Benefits & Branding */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-32 left-16 w-64 h-64 bg-purple-500 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-32 right-16 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"></div>
                </div>

                <div className="relative flex flex-col justify-center px-12 py-12 text-white">
                    {/* Header */}
                    <div className="mb-12">
                        <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium mb-6">
                            <Zap className="w-4 h-4 mr-2 text-blue-400" />
                            Join 500+ Companies
                        </div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            Start Your
                            <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Success Story</span>
                        </h2>
                        <p className="text-xl text-slate-300 leading-relaxed">
                            Create your account and join thousands of businesses transforming their outreach with AI voice campaigns.
                        </p>
                    </div>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 gap-6 mb-12">
                        {benefits.map((benefit, index) => (
                            <div key={index} className="flex items-start space-x-4 group">
                                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    <benefit.icon className={`w-6 h-6 ${benefit.color.replace('600', '400')}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-lg mb-1">{benefit.title}</h3>
                                    <p className="text-slate-300 text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Success Metrics */}
                    <div className="grid grid-cols-2 gap-8 mb-8">
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">300%</div>
                            <div className="text-slate-400 text-sm">Avg. ROI Increase</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold text-white mb-1">24hrs</div>
                            <div className="text-slate-400 text-sm">Setup Time</div>
                        </div>
                    </div>

                    {/* Testimonial */}
                    <div className="p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
                        <div className="flex items-center space-x-1 mb-3">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-4 h-4 bg-amber-400 rounded-full"></div>
                            ))}
                        </div>
                        <p className="text-slate-300 italic mb-4 text-sm">
                            "Setup was incredibly smooth. We launched our first campaign within hours and saw immediate results."
                        </p>
                        <div className="flex items-center">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-3 text-xs">
                                MC
                            </div>
                            <div>
                                <div className="font-semibold text-white text-xs">Michael Chen</div>
                                <div className="text-slate-400 text-xs">Sales Director</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Registration Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
                            <Phone className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Your Account</h1>
                        <p className="text-slate-600">Start your AI voice campaign journey today</p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="flex items-center space-x-4">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                1
                            </div>
                            <div className={`w-16 h-1 transition-all duration-300 ${currentStep > 1 ? 'bg-blue-600' : 'bg-slate-200'
                                }`}></div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-600'
                                }`}>
                                2
                            </div>
                        </div>
                    </div>

                    {/* Step 1: Personal Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Personal Information</h3>
                                <p className="text-slate-600 text-sm">Tell us about yourself</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                            <User className="w-5 h-5 text-slate-400" />
                                        </div>
                                        <input
                                            type="text"
                                            value={formData.firstName}
                                            onChange={(e) => handleInputChange('firstName', e.target.value)}
                                            className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                            placeholder="John"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                                    <input
                                        type="text"
                                        value={formData.lastName}
                                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Mail className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                        placeholder="john@company.com"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setCurrentStep(2)}
                                disabled={!isStepComplete(1)}
                                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${isStepComplete(1)
                                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                                    : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                    }`}
                            >
                                Continue
                                <ArrowRight className="w-5 h-5 ml-2" />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Company & Security */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="text-center mb-6">
                                <h3 className="text-lg font-semibold text-slate-900">Company & Security</h3>
                                <p className="text-slate-600 text-sm">Secure your account</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Building className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type="text"
                                        value={formData.company}
                                        onChange={(e) => handleInputChange('company', e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                        placeholder="Your Company"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                        placeholder="Create a strong password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <Lock className="w-5 h-5 text-slate-400" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                                    <p className="text-red-600 text-sm mt-2">Passwords do not match</p>
                                )}
                            </div>

                            <div className="flex items-start space-x-3">
                                <input
                                    type="checkbox"
                                    checked={agreedToTerms}
                                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500 mt-1"
                                />
                                <label className="text-sm text-slate-600 leading-relaxed">
                                    I agree to the{' '}
                                    <button className="text-blue-600 hover:text-blue-700 font-medium">Terms of Service</button>
                                    {' '}and{' '}
                                    <button className="text-blue-600 hover:text-blue-700 font-medium">Privacy Policy</button>
                                </label>
                            </div>

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setCurrentStep(1)}
                                    className="flex-1 py-3 px-4 bg-slate-200 text-slate-700 rounded-xl font-semibold hover:bg-slate-300 transition-all duration-300"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={!isStepComplete(2) || !agreedToTerms}
                                    className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center ${isStepComplete(2) && agreedToTerms
                                        ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-xl hover:scale-105'
                                        : 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                        }`}
                                >
                                    Create Account
                                    <CheckCircle className="w-5 h-5 ml-2" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sign In Link */}
                    <div className="text-center mt-8">
                        <p className="text-slate-600">
                            Already have an account?{' '}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
                            >
                                Sign in here
                            </Link>

                        </p>
                    </div>

                    {/* Trust Indicators */}
                    <div className="mt-8 flex items-center justify-center space-x-6 text-xs text-slate-500">
                        <div className="flex items-center">
                            <Shield className="w-4 h-4 mr-1 text-emerald-600" />
                            SSL Secured
                        </div>
                        <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-1 text-blue-600" />
                            Setup in Minutes
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;