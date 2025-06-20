import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { Toaster } from 'sonner';
import { Navbar } from './components/layout/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { PostAdPage } from './pages/PostAdPage';
import { EditAdPage } from './pages/EditAdPage';
import { AdDetailPage } from './pages/AdDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DataProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="container mx-auto px-4 py-8">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/ad/:id" element={<AdDetailPage />} />
                  <Route
                    path="/post"
                    element={
                      <ProtectedRoute>
                        <PostAdPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/edit/:id"
                    element={
                      <ProtectedRoute>
                        <EditAdPage />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <ProfilePage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </main>
              <Toaster />
            </div>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
