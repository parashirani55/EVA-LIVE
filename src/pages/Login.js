import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Phone, ArrowRight, Shield, Zap, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const features = [
    {
      icon: Phone,
      title: "Eva's AI Voice Campaigns",
      description: "Launch intelligent voice campaigns with Eva to drive conversions",
      color: "text-blue-600",
      bgColor: "bg-blue-50"
    },
    {
      icon: CheckCircle,
      title: "Eva's Real-time Analytics",
      description: "Track performance with Eva's detailed insights dashboard",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50"
    },
    {
      icon: Shield,
      title: "Eva's Enterprise Security",
      description: "Bank-grade security for your data with Eva's platform",
      color: "text-amber-600",
      bgColor: "bg-amber-50"
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('accessToken', data.accessToken || '');

        const userData = {
          name: data.user?.name || 'Unknown User',
          role: data.user?.role || 'User',
          email: data.user?.email || email,
          company: data.user?.company || 'Not provided'
        };
        localStorage.setItem('userData', JSON.stringify(userData));

        toast.success(`Welcome to Eva, ${userData.name || 'User'}!`, { position: 'top-right' });
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Login to Eva failed', { position: 'top-right' });
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again with Eva.', { position: 'top-right' });
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex">
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to Eva</h1>
            <p className="text-slate-600">Sign in to access Eva's AI voice campaign dashboard</p>
          </div>
          <div className="space-y-3 mb-8">
            <button className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all duration-300">
              <div className="w-5 h-5 mr-3 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
              Continue with Google
            </button>
            <button className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 hover:shadow-md transition-all duration-300">
              <div className="w-5 h-5 mr-3 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">G</div>
              Continue with GitHub
            </button>
          </div>
          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500">Or continue with email</span>
            </div>
          </div>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-white placeholder-slate-400"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 text-sm text-slate-600">
                  Remember me
                </label>
              </div>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
                onClick={() => alert('Forgot password flow not implemented')}
              >
                Forgot password?
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Signing In to Eva...' : 'Sign In to Eva'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
          </form>
          <div className="text-center mt-8">
            <p className="text-slate-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Create one with Eva now
              </Link>
            </p>
          </div>
          <div className="mt-8 flex items-center justify-center text-sm text-slate-500">
            <Shield className="w-4 h-4 mr-2 text-emerald-600" />
            Secured with Eva's 256-bit SSL encryption
          </div>
        </div>
      </div>
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-slate-900 to-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>
        </div>
        <div className="relative flex flex-col justify-center px-12 py-12 text-white">
          <div className="mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-lg rounded-full text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2 text-blue-400" />
              Eva's AI-Powered Platform
            </div>
            <h2 className="text-4xl font-bold mb-4 leading-tight">
              Transform Your
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Business </span>
              with Eva
            </h2>
            <p className="text-xl text-slate-300 leading-relaxed">
              Join thousands of companies using Eva's AI voice campaign platform to achieve unprecedented growth and customer engagement.
            </p>
          </div>
          <div className="space-y-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start space-x-4 group">
                <div className="flex-shrink-0 w-12 h-12 bg-white/10 backdrop-blur-lg rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className={`w-6 h-6 ${feature.color.replace('600', '400')}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{feature.title}</h3>
                  <p className="text-slate-300 text-sm leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 grid grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10M+</div>
              <div className="text-slate-400 text-sm">Calls Made with Eva</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">98.5%</div>
              <div className="text-slate-400 text-sm">Eva's Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">500+</div>
              <div className="text-slate-400 text-sm">Happy Eva Clients</div>
            </div>
          </div>
          <div className="mt-12 p-6 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10">
            <p className="text-slate-300 italic mb-4">
              "Eva revolutionized our outreach campaigns. The AI voices are incredibly natural and our conversion rates increased by 300%."
            </p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                SJ
              </div>
              <div>
                <div className="font-semibold text-white text-sm">Sarah Johnson</div>
                <div className="text-slate-400 text-xs">Marketing Director, TechCorp</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;