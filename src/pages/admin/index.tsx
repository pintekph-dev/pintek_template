import DashboardLayout from '@/components/admin/DashboardLayout';
import styles from '@styles/admin/dashboard.module.scss';

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <section className={styles.content}>
        <div className={styles.intro}>
          <h2>Overview</h2>
          <p>Here is a summary of your admin activity.</p>
        </div>

        <div className={styles.stats}>
          <article className={styles.statCard}>
            <span>Total Users</span>
            <strong>1,248</strong>
          </article>
          <article className={styles.statCard}>
            <span>New Orders</span>
            <strong>86</strong>
          </article>
          <article className={styles.statCard}>
            <span>Revenue</span>
            <strong>$12,450</strong>
          </article>
        </div>
      </section>
    </DashboardLayout>
  );
}
