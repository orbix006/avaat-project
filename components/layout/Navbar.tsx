'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getUserRole, signOut } from '@/lib/auth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

// Defined exact navigation links requested
const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Process', href: '/#process' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    let mounted = true;
    async function checkRole() {
      const currentRole = await getUserRole();
      if (mounted) {
        setRole(currentRole);
        setLoadingRole(false);
      }
    }
    checkRole();
    return () => { mounted = false; };
  }, []);

  const handleLogout = async () => {
    await signOut();
    setRole(null);
    window.location.href = '/';
  };

  const centerLinks = [...NAV_LINKS];
  if (role === 'admin' || role === 'super_admin') {
    centerLinks.push({ label: 'Admin Panel', href: '/admin' });
  }

  const mobileLinks: { label: string; href: string; onClick?: () => void }[] = [
    { label: 'Home', href: '/' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'Process', href: '/#process' },
    { label: 'Contact', href: '/contact' },
  ];

  if (role === 'admin' || role === 'super_admin') {
    mobileLinks.push({ label: 'Admin Panel', href: '/admin' });
  }

  if (role) {
    mobileLinks.push({
      label: 'Logout',
      href: '#',
      onClick: handleLogout
    });
  } else {
    mobileLinks.push({
      label: 'Login',
      href: '/auth/login'
    });
  }

  mobileLinks.push({ label: 'Book Consultation', href: '/contact' });

  // Scroll handler for dynamic background transformation
  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 30);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-onyx/80 backdrop-blur-xl border-b border-gold/10 py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center justify-between h-14">
            {/* AVAAT / DESIGN logo */}
            <Link
              href="/"
              className="group flex flex-col items-start leading-none z-50 select-none"
            >
              <span className="font-cormorant text-2xl tracking-[0.25em] text-ivory group-hover:text-gold transition-colors duration-300">
                AVAAT
              </span>
              <span className="font-jost text-[9px] tracking-[0.45em] text-gold uppercase mt-1">
                DESIGN
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <ul className="hidden md:flex items-center gap-8">
              {centerLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        'relative py-2 font-jost text-xs tracking-[0.2em] uppercase transition-colors duration-300 group block',
                        isActive ? 'text-gold' : 'text-muted hover:text-ivory'
                      )}
                    >
                      {link.label}
                      {/* Interactive Gold Slide Underline */}
                      <span
                        className={cn(
                          'absolute bottom-0 left-0 h-px bg-gold transition-all duration-300',
                          isActive ? 'w-full' : 'w-0 group-hover:w-full'
                        )}
                      />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:flex items-center gap-6">
              {!loadingRole && (
                role ? (
                  <button
                    onClick={handleLogout}
                    className="font-jost text-[10px] text-ivory hover:text-gold uppercase tracking-[0.2em] transition-colors"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="font-jost text-[10px] text-ivory hover:text-gold uppercase tracking-[0.2em] transition-colors"
                  >
                    Login
                  </Link>
                )
              )}

              <ThemeToggle />

              {/* CTA Option: Book Consultation */}
              <Link
                href="/contact"
                id="navbar-cta"
                className="hidden md:inline-flex items-center px-6 py-2.5 border border-gold/60 text-gold font-jost text-[10px] tracking-[0.2em] uppercase hover:bg-gold hover:text-onyx hover:border-gold transition-all duration-300"
              >
                Book Consultation
              </Link>
            </div>

            {/* Hamburger Trigger */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              className="md:hidden relative z-50 text-ivory hover:text-gold transition-colors p-2 -mr-2"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </nav>
        </div>
      </motion.header>

      {/* Mobile Full-Screen Overlay Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 bg-onyx/98 backdrop-blur-2xl flex flex-col items-center justify-center"
          >
            {/* Top gold line accent */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-gold to-transparent opacity-30" />

            {/* Mobile Drawer Theme Toggle at top left */}
            <div className="absolute top-6 left-6 z-50">
              <ThemeToggle />
            </div>

            {/* Decorative layout elements */}
            <div className="absolute top-0 left-[10%] w-px h-1/4 bg-gradient-to-b from-transparent to-gold/10" />
            <div className="absolute bottom-0 right-[10%] w-px h-1/4 bg-gradient-to-t from-transparent to-gold/10" />

            <nav className="w-full text-center">
              <ul className="flex flex-col items-center gap-6">
                {!loadingRole && mobileLinks.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
                    <motion.li
                      key={link.label + '-' + link.href}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{
                        delay: i * 0.05 + 0.1,
                        duration: 0.5,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      {link.onClick ? (
                        <button
                          onClick={() => {
                            setMenuOpen(false);
                            link.onClick?.();
                          }}
                          className="font-cormorant text-4xl sm:text-5xl tracking-wide text-ivory hover:text-gold transition-colors duration-300 block py-1 w-full text-center"
                        >
                          {link.label}
                        </button>
                      ) : (
                        <Link
                          href={link.href}
                          onClick={() => setMenuOpen(false)}
                          className={cn(
                            'font-cormorant text-4xl sm:text-5xl tracking-wide transition-colors duration-300 block py-1',
                            isActive ? 'text-gold italic font-medium' : 'text-ivory hover:text-gold'
                          )}
                        >
                          {link.label}
                        </Link>
                      )}
                    </motion.li>
                  );
                })}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}