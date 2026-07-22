import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/common/ProtectedRoute'
import Sidebar from './components/common/Sidebar'
import useAuth from './hooks/useAuth'

import Landing  from './pages/Landing'
import Login    from './pages/auth/Login'
import Register from './pages/auth/Register'

import Dashboard      from './pages/student/Dashboard'
import MyCourses      from './pages/student/MyCourses'
import ExploreCourses from './pages/student/ExploreCourses'
import CourseDetail   from './pages/student/CourseDetail'
import LearnPage      from './pages/student/LearnPage'
import QuizPage       from './pages/student/QuizPage'
import MyProgress     from './pages/student/MyProgress'
import Certificates   from './pages/student/Certificates'
import AITutor        from './pages/student/AITutor'
import Settings       from './pages/student/Settings'

import InstructorDashboard from './pages/instructor/InstructorDashboard'
import CreateCourse        from './pages/instructor/CreateCourse'
import ManageCourse        from './pages/instructor/ManageCourse'
import ManageQuiz          from './pages/instructor/ManageQuiz'

import AdminDashboard from './pages/admin/AdminDashboard'

function AppLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <main className="main-content">{children}</main>
    </div>
  )
}

function DashboardRedirect() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  const map = { student: '/dashboard', instructor: '/instructor/dashboard', admin: '/admin/dashboard' }
  return <Navigate to={map[user.role] || '/dashboard'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public landing page */}
      <Route path="/"            element={<Landing />} />
      <Route path="/login"       element={<Login />} />
      <Route path="/register"    element={<Register />} />
      <Route path="/home"        element={<DashboardRedirect />} />
      <Route path="/courses/:id" element={<AppLayout><CourseDetail /></AppLayout>} />

      {/* Student */}
      <Route path="/dashboard"    element={<ProtectedRoute roles={['student']}><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/my-courses"   element={<ProtectedRoute roles={['student']}><AppLayout><MyCourses /></AppLayout></ProtectedRoute>} />
      <Route path="/explore"      element={<ProtectedRoute roles={['student']}><AppLayout><ExploreCourses /></AppLayout></ProtectedRoute>} />
      <Route path="/learn/:courseId"        element={<ProtectedRoute roles={['student']}><AppLayout><LearnPage /></AppLayout></ProtectedRoute>} />
      <Route path="/quiz/:courseId/:quizId" element={<ProtectedRoute roles={['student']}><AppLayout><QuizPage /></AppLayout></ProtectedRoute>} />
      <Route path="/progress"     element={<ProtectedRoute roles={['student']}><AppLayout><MyProgress /></AppLayout></ProtectedRoute>} />
      <Route path="/certificates" element={<ProtectedRoute roles={['student']}><AppLayout><Certificates /></AppLayout></ProtectedRoute>} />
      <Route path="/ai-tutor"     element={<ProtectedRoute roles={['student']}><AppLayout><AITutor /></AppLayout></ProtectedRoute>} />
      <Route path="/settings"     element={<ProtectedRoute roles={['student','instructor','admin']}><AppLayout><Settings /></AppLayout></ProtectedRoute>} />

      {/* Instructor */}
      <Route path="/instructor/dashboard"         element={<ProtectedRoute roles={['instructor','admin']}><AppLayout><InstructorDashboard /></AppLayout></ProtectedRoute>} />
      <Route path="/instructor/create"            element={<ProtectedRoute roles={['instructor','admin']}><AppLayout><CreateCourse /></AppLayout></ProtectedRoute>} />
      <Route path="/instructor/courses/:courseId" element={<ProtectedRoute roles={['instructor','admin']}><AppLayout><ManageCourse /></AppLayout></ProtectedRoute>} />
      <Route path="/instructor/quiz/:courseId"    element={<ProtectedRoute roles={['instructor','admin']}><AppLayout><ManageQuiz /></AppLayout></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin/dashboard" element={<ProtectedRoute roles={['admin']}><AppLayout><AdminDashboard /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100vh', flexDirection:'column', gap:'16px' }}>
          <div style={{ fontSize:'64px' }}>🔍</div>
          <div style={{ fontSize:'20px', fontWeight:'700' }}>Page not found</div>
          <a href="/" style={{ color:'#2563EB', fontSize:'14px' }}>Go home</a>
        </div>
      } />
    </Routes>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 3000, style: { fontSize: '14px', fontFamily: 'Inter, sans-serif' } }} />
      <AppRoutes />
    </AuthProvider>
  )
}