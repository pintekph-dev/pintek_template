import { useEffect, useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import {
  clearActivityLogs,
  readActivityLogs,
  type ActivityLog,
} from '@/lib/adminActivity';
import styles from '@styles/admin/dashboard.module.scss';

export default function ActivityLogs() {
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [logSearch, setLogSearch] = useState('');

  useEffect(() => {
    const updateLogs = () => setActivityLogs(readActivityLogs());
    updateLogs();
    window.addEventListener('taxhelp-activity-change', updateLogs);
    return () => window.removeEventListener('taxhelp-activity-change', updateLogs);
  }, []);

  function handleClearLogs() {
    if (activityLogs.length === 0) {
      return;
    }

    if (window.confirm('Clear all activity logs?')) {
      clearActivityLogs();
    }
  }

  const filteredLogs = activityLogs.filter((log) =>
    `${log.user} ${log.action} ${log.date}`
      .toLowerCase()
      .includes(logSearch.toLowerCase()),
  );

  return (
    <DashboardLayout title="Activity Logs">
      <section className={styles.content}>
        <div className={styles.intro}>
          <h2>Activity Logs</h2>
          <p>Monitor recent actions performed in the admin panel.</p>
          <button className={styles.clearLogsButton} type="button" onClick={handleClearLogs}>
            Clear Logs
          </button>
          <input
            className={styles.logSearch}
            aria-label="Search activity logs"
            placeholder="Search logs..."
            type="search"
            value={logSearch}
            onChange={(event) => setLogSearch(event.target.value)}
          />
        </div>
        <div className={styles.activityTable}>
          {filteredLogs.length === 0 ? (
            <div className={styles.emptyState}>No activity recorded yet.</div>
          ) : filteredLogs.map((log) => (
            <div className={styles.activityRow} key={`${log.user}-${log.date}`}>
              <strong>{log.user}</strong>
              <span>{log.action}</span>
              <time>{log.date}</time>
            </div>
          ))}
        </div>
      </section>
    </DashboardLayout>
  );
}
