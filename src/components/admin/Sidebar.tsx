import Link from 'next/link';
import styles from '@styles/admin/sidebar.module.scss';

export default function Sidebar() {
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
    </aside>
  );
}
