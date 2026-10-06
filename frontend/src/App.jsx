import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { SkillsPage } from './pages/SkillsPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { CreateProjectPage } from './pages/CreateProjectPage';
import { ProjectDetailPage } from './pages/ProjectDetailPage';
import { EditProjectPage } from './pages/EditProjectPage';
import { ApplicationsPage } from './pages/ApplicationsPage';
import { ProjectApplicationsPage } from './pages/ProjectApplicationsPage';

export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
          <Navbar />
          <main className="flex-1">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* Authenticated Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/profile/edit" element={<EditProfilePage />} />
                <Route path="/skills" element={<SkillsPage />} />
                <Route path="/projects" element={<ProjectsPage />} />
                <Route path="/projects/new" element={<CreateProjectPage />} />
                <Route path="/projects/:id" element={<ProjectDetailPage />} />
                <Route path="/projects/:id/edit" element={<EditProjectPage />} />
                <Route path="/applications" element={<ApplicationsPage />} />
                <Route path="/projects/:id/applications" element={<ProjectApplicationsPage />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
