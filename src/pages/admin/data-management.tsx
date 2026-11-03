import { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { addActivityLog } from '@/lib/adminActivity';
import styles from '@styles/admin/dashboard.module.scss';

const subscriptions = [
  { plan: 'Premium', users: 1, revenue: '₱5,602.00' },
  { plan: 'Standard', users: 1, revenue: '₱4,357.00' },
  { plan: 'Free', users: 1, revenue: '₱0.00' },
];

export default function DataManagement() {
  const router = useRouter();
  const [showSubscriptions, setShowSubscriptions] = useState(false);

  function viewUsers() {
    addActivityLog('Viewed user accounts from Data Management');
    router.push('/admin/users');
  }

  function viewSubscriptions() {
    setShowSubscriptions((current) => !current);
    addActivityLog('Viewed subscriptions from Data Management');
  }

  function downloadBackup() {
    const backup = {
      exportedAt: new Date().toISOString(),
      users: JSON.parse(window.localStorage.getItem('taxhelp-account-roles') || '[]'),
      roles: JSON.parse(window.localStorage.getItem('taxhelp-roles') || '[]'),
      activityLogs: JSON.parse(window.localStorage.getItem('taxhelp-activity-logs') || '[]'),
      generatedReports: JSON.parse(window.localStorage.getItem('taxhelp-generated-report') || 'null'),
    };
    const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `taxhelp-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
    addActivityLog('Exported system backup from Data Management');
  }

  return (
    <DashboardLayout title="Data Management">
      <section className={styles.content}>
        <div className={styles.intro}>
          <h2>Data Management</h2>
          <p>Manage and export the information used by your admin panel.</p>
        </div>
        <div className={styles.managementGrid}>
          <article className={styles.managementCard}>
            <h3>User Accounts</h3>
            <p>Manage registered TaxHelp accounts.</p>
            <button className={styles.primaryButton} type="button" onClick={viewUsers}>
              View users
            </button>
          </article>
          <article className={styles.managementCard}>
            <h3>Subscriptions</h3>
            <p>Review plans and subscription status.</p>
            <button className={styles.primaryButton} type="button" onClick={viewSubscriptions}>
              {showSubscriptions ? 'Hide subscriptions' : 'View subscriptions'}
            </button>
          </article>
          <article className={styles.managementCard}>
            <h3>System Backup</h3>
            <p>Download a backup of admin data.</p>
            <button className={styles.primaryButton} type="button" onClick={downloadBackup}>
              Export data
            </button>
          </article>
        </div>
        {showSubscriptions && (
          <div className={styles.subscriptionData}>
            {subscriptions.map((subscription) => (
              <div className={styles.subscriptionDataRow} key={subscription.plan}>
                <strong>{subscription.plan}</strong>
                <span>{subscription.users} account</span>
                <span>{subscription.revenue}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}
