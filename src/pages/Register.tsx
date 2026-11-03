
import { FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '@styles/register.module.scss';

export default function Register() {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push('/Login');
  }

  return (
    <div className={styles.appWrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>L</div>

          <h1>Create Account</h1>
          <p>Sign up to get started with your account.</p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label htmlFor="name">Full Name</label>
            <input
              className={styles.input}
              id="name"
              name="name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="email">Email Address</label>
            <input
              className={styles.input}
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="password">Password</label>
            <input
              className={styles.input}
              id="password"
              name="password"
              type="password"
              placeholder="Create a password"
              required
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              className={styles.input}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              required
            />
          </div>

          <button type="submit" className={styles.registerButton}>
            Create Account
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?{' '}
          <Link href="/Login" className={styles.link}>
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
