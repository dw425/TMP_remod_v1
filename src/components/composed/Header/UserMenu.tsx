import { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/features/auth/useAuth';
import { ROUTES } from '@/config/routes';

export function UserMenu() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        closeMenu();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, closeMenu]);

  if (!isAuthenticated || !user) {
    return (
      <Link
        to={ROUTES.LOGIN}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blueprint-blue transition-colors"
      >
        Sign In
      </Link>
    );
  }

  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

  const handleLogout = async () => {
    setOpen(false);
    await logout();
    navigate(ROUTES.HOME);
  };

  const menuItems = [
    { label: 'Dashboard', to: ROUTES.DASHBOARD },
    { label: 'Orders', to: ROUTES.ORDERS },
    { label: 'Wishlist', to: ROUTES.WISHLIST },
    { label: 'Settings', to: ROUTES.SETTINGS },
  ];

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Account menu for ${user.firstName} ${user.lastName}`}
        className="w-8 h-8 bg-blueprint-blue text-white text-xs font-bold flex items-center justify-center hover:bg-blue-800 transition-colors"
      >
        {initials}
      </button>

      {open && (
        <div role="menu" aria-label="Account menu" className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-700 shadow-lg z-50">
          <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
          </div>
          {menuItems.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 hover:text-blueprint-blue"
            >
              {item.label}
            </Link>
          ))}
          {user.role === 'admin' && (
            <Link
              to={ROUTES.ADMIN_DASHBOARD}
              role="menuitem"
              onClick={() => setOpen(false)}
              className="block px-4 py-2 text-sm text-blueprint-blue font-bold hover:bg-blue-50 dark:hover:bg-slate-800"
            >
              Admin Portal
            </Link>
          )}
          <button
            role="menuitem"
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-slate-800 border-t border-gray-200 dark:border-slate-700"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}
