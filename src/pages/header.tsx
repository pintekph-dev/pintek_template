
import styles from '@/styles/_header.module.scss';

export default function Header() {
  return (
    <header className={styles.header}>

      <div className={styles.title}>
        <h1>Dashboard</h1>
        <p>Welcome back! Manage your account here.</p>
      </div>

      <div className={styles.user}>
        <span>Admin User</span>
        <img src="/image.png" alt="User Profile" />
      </div>

    </header>
  );
}
