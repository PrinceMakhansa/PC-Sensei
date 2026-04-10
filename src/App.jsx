import { Routes, Route, Navigate } from 'react-router-dom'

// Layout
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'

// Client pages
import HomePage from './pages/client/HomePage'
import ManualBuilderPage from './pages/client/ManualBuilderPage'
import AiBuildPage from './pages/client/AiBuildPage'
import UpgradePlannerPage from './pages/client/UpgradePlannerPage'
import AboutPage from './pages/client/AboutPage'
import AuthPage from './pages/client/AuthPage'
import AdminLoginPage from './pages/client/AdminLoginPage'
import ProfilePage from './pages/client/ProfilePage'
import TermsPage from './pages/client/TermsPage'
import PrivacyPage from './pages/client/PrivacyPage'
import PrebuildsPage from './pages/PrebuildsPage'

// Admin pages
import AdminLayout from './pages/admin/AdminLayout'
import DashboardPage from './pages/admin/DashboardPage'
import ComponentsPage from './pages/admin/ComponentsPage'
import UsersPage from './pages/admin/UsersPage'
import BuildsPage from './pages/admin/BuildsPage'
import AdminsPage from './pages/admin/AdminsPage'

import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './hooks/useAuth'

function AuthRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (user) return <Navigate to="/" replace />
  return <AuthPage />
}

function ClientLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="builder" element={<ManualBuilderPage />} />
        <Route path="ai-build" element={<AiBuildPage />} />
        <Route path="prebuilds" element={<PrebuildsPage />} />
        <Route path="upgrade-planner" element={<UpgradePlannerPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="terms" element={<TermsPage />} />
        <Route path="privacy" element={<PrivacyPage />} />
        <Route path="auth" element={<AuthRedirect />} />
        <Route path="admin-login" element={<AdminLoginPage />} />
        <Route
          path="profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </div>
  )
} 

function App() {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute role="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="components" element={<ComponentsPage />} />
        <Route path="users" element={<UsersPage />} />
        <Route path="admins" element={<AdminsPage />} />
        <Route path="builds" element={<BuildsPage />} />
      </Route>
      <Route path="/*" element={<ClientLayout />} />
    </Routes>
  )
}

export default App