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
