import { useRouter } from 'next/router';
import styles from '@styles/admin/header.module.scss';

type HeaderProps = {
  title?: string;
};

export default function Header({ title = 'Dashboard' }: HeaderProps) {
  const router = useRouter();

  return (
    <header className={styles.header}>
      <div>
        <h1>{title}</h1>
        <p>Welcome back, Admin</p>
      </div>
      <button
        className={styles.logoutButton}
        type="button"
        onClick={() => router.push('/Login')}
      >
        Logout
      </button>
    </header>
  );
}
