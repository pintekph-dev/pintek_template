import { useEffect } from 'react';
import type { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';
import styles from '@styles/admin/dashboard.module.scss';

type DashboardLayoutProps = {
  children: ReactNode;
  title?: string;
};

export default function DashboardLayout({
  children,
  title,
}: DashboardLayoutProps) {
  useEffect(() => {
    const savedTheme = window.localStorage.getItem('taxhelp-theme');
    const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

    document.body.classList.toggle('adminDark', initialTheme === 'dark');

    function handleThemeChange(event: Event) {
      const nextTheme = (event as CustomEvent<'light' | 'dark'>).detail;
      document.body.classList.toggle('adminDark', nextTheme === 'dark');
    }

    window.addEventListener('taxhelp-theme-change', handleThemeChange);
    return () => {
      window.removeEventListener('taxhelp-theme-change', handleThemeChange);
      document.body.classList.remove('adminDark');
    };
  }, []);

  return (
    <div className={styles.layout}>
      <Sidebar />
      <div className={styles.contentWrapper}>
        <Header title={title} />
        <main className={styles.main}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
