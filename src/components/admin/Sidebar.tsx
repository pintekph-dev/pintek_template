import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@styles/admin/sidebar.module.scss';

export default function Sidebar() {
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
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>Admin Panel</div>

      <nav className={styles.navigation} aria-label="Admin navigation">
        <Link className={styles.activeLink} href="/admin">
          Dashboard
        </Link>
        <Link className={styles.link} href="/admin/users">
          Users
        </Link>
        <Link className={styles.link} href="/admin/settings">
          Settings
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
