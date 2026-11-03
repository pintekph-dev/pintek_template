import { useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { addActivityLog } from '@/lib/adminActivity';
import styles from '@styles/admin/dashboard.module.scss';

type User = {
  id: number;
  name: string;
  email: string;
  subscriptionPlan: 'Premium' | 'Standard' | 'Free';
  subscriptionStatus: 'Active' | 'Not Active';
};

const users: User[] = [
  {
    id: 1,
    name: 'Maria Santos',
    email: 'maria@example.com',
    subscriptionPlan: 'Premium',
    subscriptionStatus: 'Active',
  },
  {
    id: 2,
    name: 'Juan Dela Cruz',
    email: 'juan@example.com',
    subscriptionPlan: 'Standard',
    subscriptionStatus: 'Active',
  },
  {
    id: 3,
    name: 'Ana Reyes',
    email: 'ana@example.com',
    subscriptionPlan: 'Free',
    subscriptionStatus: 'Not Active',
  },
];

export default function AdminUsers() {
  const [userList, setUserList] = useState(users);

  function handleDelete(id: number) {
    const user = userList.find((currentUser) => currentUser.id === id);
    if (!user || !window.confirm(`Delete ${user.name}'s account?`)) {
      return;
    }

    setUserList((currentUsers) => currentUsers.filter((currentUser) => currentUser.id !== id));
    addActivityLog(`Deleted user account: ${user.name}`);
  }

  function handleEdit(user: User) {
    const name = window.prompt('Edit user name:', user.name);
    const email = window.prompt('Edit user email:', user.email);

    if (!name || !email) {
      return;
    }

    setUserList((currentUsers) =>
      currentUsers.map((currentUser) =>
        currentUser.id === user.id
          ? { ...currentUser, name, email }
          : currentUser,
      ),
    );
    addActivityLog(`Updated user account: ${user.name}`);
  }

  return (
    <DashboardLayout title="Users">
      <section className={styles.content}>
        <div className={styles.intro}>
          <h2>TaxHelp Users</h2>
          <p>View and manage your registered users.</p>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subscription Plan</th>
                <th>Subscription Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span
                      className={
                        user.subscriptionPlan === 'Premium'
                          ? styles.statusPremium
                          : user.subscriptionPlan === 'Standard'
                            ? styles.statusStandard
                            : styles.statusFree
                      }
                    >
                      {user.subscriptionPlan}
                    </span>
                  </td>
                  <td>
                    <span
                      className={
                        user.subscriptionStatus === 'Active'
                          ? styles.statusActive
                          : styles.statusInactive
                      }
                    >
                      <span className={styles.statusDot} />
                      {user.subscriptionStatus}
                    </span>
                  </td>
                  <td className={styles.actions}>
                    <button
                      className={styles.editButton}
                      type="button"
                      onClick={() => handleEdit(user)}
                    >
                      Edit
                    </button>
                    <button
                      className={styles.deleteButton}
                      type="button"
                      onClick={() => handleDelete(user.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </DashboardLayout>
  );
}
