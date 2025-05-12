import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  QrCode,
  ClipboardList,
  Award,
  BarChart,
} from 'lucide-react';

interface MainLayoutProps {
  children: React.ReactNode;
  userRole?: 'admin' | 'user';
}

const MainLayout = ({ children, userRole = 'user' }: MainLayoutProps) => {
  const router = useRouter();

  const adminNavItems = [
    {
      title: 'Dashboard',
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: '/admin/dashboard',
    },
    {
      title: 'SOPs',
      icon: <FileText className="h-5 w-5" />,
      href: '/admin/sops',
    },
    {
      title: 'Quizzes',
      icon: <ClipboardList className="h-5 w-5" />,
      href: '/admin/quizzes',
    },
    {
      title: 'Candidates',
      icon: <Users className="h-5 w-5" />,
      href: '/admin/candidates',
    },
    {
      title: 'Certificates',
      icon: <Award className="h-5 w-5" />,
      href: '/admin/certificates',
    },
    {
      title: 'Analytics',
      icon: <BarChart className="h-5 w-5" />,
      href: '/admin/analytics',
    },
    {
      title: 'Settings',
      icon: <Settings className="h-5 w-5" />,
      href: '/admin/settings',
    },
  ];

  const userNavItems = [
    {
      title: 'My Quizzes',
      icon: <ClipboardList className="h-5 w-5" />,
      href: '/quizzes',
    },
    {
      title: 'Scan Quiz',
      icon: <QrCode className="h-5 w-5" />,
      href: '/scan',
    },
    {
      title: 'My Certificates',
      icon: <Award className="h-5 w-5" />,
      href: '/certificates',
    },
  ];

  const navItems = userRole === 'admin' ? adminNavItems : userNavItems;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b border-gray-200">
            <h1 className="text-xl font-bold text-primary">Easy AI Quiz</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Button
                key={item.href}
                variant="ghost"
                className="w-full justify-start"
                onClick={() => router.push(item.href)}
              >
                {item.icon}
                <span className="ml-3">{item.title}</span>
              </Button>
            ))}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => {
                // Handle logout
                router.push('/login');
              }}
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="pl-64">
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout; 