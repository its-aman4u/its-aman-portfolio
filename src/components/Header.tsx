
import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Menu, X, Moon, Sun, Bike } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, profile, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Journey', path: '/journey' },
    { name: 'Skills', path: '/skills' },
    { name: 'Projects', path: '/projects' },
    { name: 'AI Chatbot', path: '/chatbot' },
    { name: 'Blog', path: '/blog' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate('/');
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleTheme = () => setIsDarkMode(!isDarkMode);
  
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/40 dark:bg-card/45 backdrop-blur-md border-b border-white/20 dark:border-white/10 shadow-lg' : 'bg-transparent'}`}>
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <a href="#" onClick={handleLogoClick} className="flex items-center gap-2 text-primary font-heading font-bold text-xl">
          <Bike className="w-6 h-6" />
          <span>Aman Singh</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <ul className="flex space-x-8">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `text-base font-medium transition-colors relative before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5 before:origin-left before:scale-x-0 before:bg-primary before:transition-transform hover:before:scale-x-100 ${isActive ? 'text-primary before:scale-x-100' : 'text-foreground/80'}`
                  }
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
          
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {profile?.is_admin && (
                  <Link to="/admin/blog">
                    <Button variant="outline" size="sm">Admin</Button>
                  </Link>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Logout ({profile?.full_name || 'User'})
                </Button>
              </div>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">Login</Button>
              </Link>
            )}
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="ml-2"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <div className="flex items-center md:hidden">
          {!isOpen && (
            <>
              {isAuthenticated ? (
                <div className="flex items-center gap-2">
                  {profile?.is_admin && (
                    <Link to="/admin/blog" className="mr-2">
                      <Button variant="outline" size="sm">Admin</Button>
                    </Link>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleLogout}
                    className="mr-2"
                  >
                    Logout
                  </Button>
                </div>
              ) : (
                <Link to="/auth" className="mr-2">
                  <Button variant="outline" size="sm">Login</Button>
                </Link>
              )}
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleTheme}
            className="mr-2"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button 
            variant="ghost"
            size="icon"
            className="text-foreground"
            onClick={toggleMenu}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden bg-background dark:bg-card fixed inset-x-0 transition-all duration-300 ease-in-out ${isOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'}`}>
        <nav className="container mx-auto px-4 py-8">
          <ul className="space-y-6">
            {navItems.map((item) => (
              <li key={item.name}>
                <NavLink 
                  to={item.path}
                  className={({ isActive }) => 
                    `block text-lg font-medium transition-colors ${isActive ? 'text-primary' : 'text-foreground/80'}`
                  }
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </NavLink>
              </li>
            ))}
            
            {isAuthenticated && profile?.is_admin && (
              <li>
                <Link 
                  to="/admin/blog" 
                  className="block text-lg font-medium text-primary"
                  onClick={() => setIsOpen(false)}
                >
                  Admin
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
