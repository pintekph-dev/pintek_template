import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { addActivityLog } from '@/lib/adminActivity';
import styles from '@styles/admin/sidebar.module.scss';

export default function Sidebar() {
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      setIsDark(window.localStorage.getItem('taxhelp-theme') === 'dark');
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  function toggleTheme() {
    const nextIsDark = !isDark;
    const nextTheme = nextIsDark ? 'dark' : 'light';

    setIsDark(nextIsDark);
    window.localStorage.setItem('taxhelp-theme', nextTheme);
    window.dispatchEvent(new CustomEvent('taxhelp-theme-change', { detail: nextTheme }));
    addActivityLog(`Changed theme to ${nextTheme}`);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Admin Panel</div>

      <nav className={styles.navigation} aria-label="Admin navigation">
        <Link
          className={router.pathname === '/admin' ? styles.activeLink : styles.link}
          href="/admin"
        >
          Dashboard
        </Link>
        <Link
          className={router.pathname === '/admin/users' ? styles.activeLink : styles.link}
          href="/admin/users"
        >
          Users
        </Link>
        <Link
          className={router.pathname === '/admin/settings' ? styles.activeLink : styles.link}
          href="/admin/settings"
        >
          Settings
        </Link>
        <Link
          className={router.pathname === '/admin/roles' ? styles.activeLink : styles.link}
          href="/admin/roles"
        >
          Roles &amp; Permissions
        </Link>
        <Link
          className={router.pathname === '/admin/data-management' ? styles.activeLink : styles.link}
          href="/admin/data-management"
        >
          Data Management
        </Link>
        <Link
          className={router.pathname === '/admin/reports' ? styles.activeLink : styles.link}
          href="/admin/reports"
        >
          Reports
        </Link>
        <Link
          className={router.pathname === '/admin/activity-logs' ? styles.activeLink : styles.link}
          href="/admin/activity-logs"
        >
          Activity Logs
        </Link>
      </nav>

      <button className={styles.themeToggle} type="button" onClick={toggleTheme}>
        <span>Dark theme</span>
        <span className={`${styles.toggle} ${isDark ? styles.toggleOn : ''}`}>
          <span className={styles.toggleKnob} />
        </span>
      </button>
    </aside>
  );
}
