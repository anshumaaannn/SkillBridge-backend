import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Briefcase, 
  Award, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Layers,
  Sparkles
} from 'lucide-react';

export const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>SkillBridge Platform MVP</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Connect skills with <span className="text-brand-600">opportunities</span>.
            </h1>

            <p className="mt-6 text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              SkillBridge brings together students, developers, and clients. Build your professional profile, showcase verified technical skills, discover real projects, and apply with ease.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <Link
                  to="/dashboard"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                >
                  Go to Dashboard
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-slate-300 text-base font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
                  >
                    Sign In
                  </Link>
                </>
              )}
              <Link
                to="/projects"
                className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 text-base font-medium text-slate-600 hover:text-slate-900"
              >
                Browse Projects &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold text-brand-600 uppercase tracking-wider">
              Simple Workflow
            </h2>
            <p className="mt-2 text-3xl font-bold text-slate-900">
              How SkillBridge works
            </p>
            <p className="mt-3 text-slate-600">
              A straightforward process designed specifically for developers, students, and project owners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                1
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Build Your Identity</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Register as a Freelancer or Client. Set up your professional title, bio, location, and connect GitHub and LinkedIn links.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                2
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Add Your Skills</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Attach recognized platform skills like Java, Spring Boot, React, and PostgreSQL to your profile to stand out to project owners.
              </p>
            </div>

            <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 hover:border-slate-300 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white font-bold flex items-center justify-center mb-4 text-sm">
                3
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Collaborate on Projects</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Post detailed project specifications or browse available opportunities. Submit proposals, track statuses, and manage candidates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">
              Built for real project execution
            </h2>
            <p className="mt-3 text-slate-600">
              Everything you need to discover opportunities or hire talent without unnecessary friction.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex space-x-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-lg h-fit">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Project Marketplace</h3>
                <p className="text-sm text-slate-600">
                  Publish projects with clear descriptions and budgets. Open to all students and freelancers on the platform.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex space-x-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-lg h-fit">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Structured Skill System</h3>
                <p className="text-sm text-slate-600">
                  Select and manage core competencies directly from the central catalog to highlight your stack.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex space-x-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-lg h-fit">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Application Lifecycle</h3>
                <p className="text-sm text-slate-600">
                  Submit tailored proposals with personalized messages. Owners review and accept or reject candidates directly.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex space-x-4">
              <div className="p-3 bg-brand-50 text-brand-600 rounded-lg h-fit">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-slate-900 mb-1">Authentic Profiles</h3>
                <p className="text-sm text-slate-600">
                  View full user bios, technical stacks, contact locations, and external portfolio links on GitHub and LinkedIn.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Ready to get started with SkillBridge?
          </h2>
          <p className="text-slate-600 mb-8 max-w-xl mx-auto text-sm sm:text-base">
            Create an account in seconds and start connecting with opportunities and talent today.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              to="/register"
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-lg text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-colors"
            >
              Create Account
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center px-6 py-3 border border-slate-300 text-sm font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
