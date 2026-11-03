export type ActivityLog = {
  id: string;
  user: string;
  action: string;
  date: string;
};

const activityStorageKey = 'taxhelp-activity-logs';

export function clearActivityLogs() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(activityStorageKey);
  window.dispatchEvent(new CustomEvent('taxhelp-activity-change'));
}

export function addActivityLog(action: string, user = 'Admin') {
  if (typeof window === 'undefined') {
    return;
  }

  const log: ActivityLog = {
    id: `${Date.now()}-${Math.random()}`,
    user,
    action,
    date: new Date().toLocaleString(),
  };
  const existingLogs = readActivityLogs();
  window.localStorage.setItem(
    activityStorageKey,
    JSON.stringify([log, ...existingLogs].slice(0, 50)),
  );
  window.dispatchEvent(new CustomEvent('taxhelp-activity-change'));
}

export function readActivityLogs(): ActivityLog[] {
  if (typeof window === 'undefined') {
    return [];
  }

  const storedLogs = window.localStorage.getItem(activityStorageKey);
  if (!storedLogs) {
    return [];
  }

  try {
    const logs: unknown = JSON.parse(storedLogs);
    if (!Array.isArray(logs)) {
      return [];
    }
    return logs.filter(
      (log): log is ActivityLog =>
        typeof log === 'object' &&
        log !== null &&
        typeof (log as ActivityLog).id === 'string' &&
        typeof (log as ActivityLog).user === 'string' &&
        typeof (log as ActivityLog).action === 'string' &&
        typeof (log as ActivityLog).date === 'string',
    );
  } catch {
    return [];
  }
}
