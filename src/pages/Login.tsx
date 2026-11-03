
import { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@styles/login.module.scss';

export default function Login() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/admin');
  }

  return (
    <div className={styles.appWrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>L</div>

          <h1>Welcome Back</h1>
          <p>Sign in to continue to your account.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              required
            />
          </div>

          <div className={styles.field}>
            <div className={styles.formOptions}>
              <label htmlFor="password">Password</label>

              <Link href="/forgot-password" className={styles.link}>
                Forgot Password?
              </Link>
            </div>

            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className={styles.loginButton}>
            Sign In
          </button>
        </form>

        <div className={styles.footer}>
          Don&apos;t have an account?{' '}
          <Link href="/Register" className={styles.link}>
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
