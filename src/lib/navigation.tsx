import React, { createContext, useContext, useState, useEffect } from 'react';

interface NavigationContextType {
  pathname: string;
  navigate: (to: string) => void;
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  navigate: () => {},
});

export function NavigationProvider({ children }: { children: React.ReactNode }) {
  const [pathname, setPathname] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setPathname(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setPathname(to);
      window.scrollTo(0, 0);
    }
  };

  return (
    <NavigationContext.Provider value={{ pathname, navigate }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useRouter() {
  const { navigate, pathname } = useContext(NavigationContext);
  return {
    push: (href: string) => navigate(href),
    replace: (href: string) => navigate(href),
    pathname,
  };
}

export function usePathname() {
  const { pathname } = useContext(NavigationContext);
  return pathname;
}

export function useSearchParams() {
  if (typeof window === 'undefined') {
    return new URLSearchParams();
  }
  return new URLSearchParams(window.location.search);
}

export function Link({
  href,
  children,
  className = '',
  title,
  onClick,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  [key: string]: any;
}) {
  const { navigate } = useContext(NavigationContext);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // If external link or special key pressed
    if (href.startsWith('http') || e.ctrlKey || e.metaKey || e.shiftKey) {
      return;
    }
    e.preventDefault();
    if (onClick) onClick();
    navigate(href);
  };

  return (
    <a href={href} onClick={handleClick} className={className} title={title} {...props}>
      {children}
    </a>
  );
}

export default Link;
