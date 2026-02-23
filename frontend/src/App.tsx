import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useAuth } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import theme from './theme/theme';

// Auth pages
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ContactUs from './pages/ContactUs';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import StudentLectures from './pages/student/Lectures';
import LectureDetail from './pages/student/LectureDetail';
import VideoViewer from './pages/student/VideoViewer';
import StudentHomework from './pages/student/Homework';
import StudentExams from './pages/student/Exams';
import StudentScores from './pages/student/Scores';
import StudentProfile from './pages/student/Profile';

// Teacher pages
import TeacherDashboard from './pages/teacher/Dashboard';
import Groups from './pages/teacher/Groups';
import GroupEditor from './pages/teacher/GroupEditor';
import TeacherLectures from './pages/teacher/Lectures';
import LectureEditor from './pages/teacher/LectureEditor';
import VideoUpload from './pages/teacher/VideoUpload';
import TeacherHomeworks from './pages/teacher/Homeworks';
import HomeworkEditor from './pages/teacher/HomeworkEditor';
import StudentScoresTeacher from './pages/teacher/StudentScores';
import AccessManagement from './pages/teacher/AccessManagement';
import TeacherProfile from './pages/teacher/Profile';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import AccessExtension from './pages/admin/AccessExtension';
import SystemSettings from './pages/admin/SystemSettings';
import Analytics from './pages/admin/Analytics';

import Loading from './components/common/Loading';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loading />;
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to="/" replace />} />
      <Route path="/register" element={!user ? <Register /> : <Navigate to="/" replace />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Student Routes */}
      <Route
        path="/student"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/lectures"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentLectures />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/lectures/:id"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <LectureDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/video/:lectureId"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <VideoViewer />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/homework"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentHomework />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentExams />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/scores"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentScores />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/profile"
        element={
          <ProtectedRoute allowedRoles={['student']}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Teacher Routes */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/groups"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <Groups />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/groups/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <GroupEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/groups/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <GroupEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/lectures"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherLectures />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/lectures/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <LectureEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/lectures/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <LectureEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/video/upload"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <VideoUpload />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherHomeworks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <HomeworkEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/homework/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <HomeworkEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherHomeworks />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams/new"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <HomeworkEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/exams/:id/edit"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <HomeworkEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/scores"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <StudentScoresTeacher />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/access"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <AccessManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['teacher']}>
            <TeacherProfile />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <UserManagement />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/access"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AccessExtension />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <SystemSettings />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/analytics"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <Analytics />
          </ProtectedRoute>
        }
      />

      {/* Root - Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Catch-all - Redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

import { Toaster } from './components/ui/toaster';

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppRoutes />
      </Router>
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
