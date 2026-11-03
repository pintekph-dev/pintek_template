import { useState } from 'react';
import type { FormEvent } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { addActivityLog } from '@/lib/adminActivity';
import styles from '@styles/admin/dashboard.module.scss';

const permissions = ['View dashboard', 'Manage users', 'Manage subscriptions', 'Manage settings'];

type Role = {
  name: string;
  description: string;
  permissions: string[];
};

const initialRoles: Role[] = [
  { name: 'Admin', description: 'Full access to the admin panel.', permissions },
  { name: 'Staff', description: 'Manage users and subscriptions.', permissions: ['View dashboard', 'Manage users', 'Manage subscriptions'] },
  { name: 'Viewer', description: 'View dashboard information only.', permissions: ['View dashboard'] },
];

const rolesStorageKey = 'taxhelp-roles';
const accountsStorageKey = 'taxhelp-account-roles';

type Account = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const initialAccounts: Account[] = [
  { id: 1, name: 'Maria Santos', email: 'maria@example.com', role: 'Admin' },
  { id: 2, name: 'Juan Dela Cruz', email: 'juan@example.com', role: 'Staff' },
  { id: 3, name: 'Ana Reyes', email: 'ana@example.com', role: 'Viewer' },
];

function isRole(value: unknown): value is Role {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const role = value as Role;
  return (
    typeof role.name === 'string' &&
    typeof role.description === 'string' &&
    Array.isArray(role.permissions) &&
    role.permissions.every((permission) => typeof permission === 'string')
  );
}

export default function AdminRoles() {
  const [accountSearch, setAccountSearch] = useState('');
  const [isAddingAccount, setIsAddingAccount] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', email: '', role: 'Viewer' });
  const [roles, setRoles] = useState(() => {
    if (typeof window === 'undefined') {
      return initialRoles;
    }

    const storedRoles = window.localStorage.getItem(rolesStorageKey);
    if (storedRoles) {
      try {
        const parsedRoles = JSON.parse(storedRoles);
        if (Array.isArray(parsedRoles) && parsedRoles.every(isRole)) {
          return parsedRoles;
        }
      } catch {
        window.localStorage.removeItem(rolesStorageKey);
      }
    }
    return initialRoles;
  });
  const [accounts, setAccounts] = useState<Account[]>(() => {
    if (typeof window === 'undefined') {
      return initialAccounts;
    }

    const storedAccounts = window.localStorage.getItem(accountsStorageKey);
    if (storedAccounts) {
      try {
        const parsedAccounts = JSON.parse(storedAccounts);
        if (Array.isArray(parsedAccounts)) {
          return parsedAccounts;
        }
      } catch {
        window.localStorage.removeItem(accountsStorageKey);
      }
    }
    return initialAccounts;
  });

  function togglePermission(roleName: string, permission: string) {
    const role = roles.find((item) => item.name === roleName);
    if (!role) {
      return;
    }

    const hasPermission = role.permissions.includes(permission);
    const nextRoles = roles.map((currentRole) =>
      currentRole.name === roleName
        ? {
            ...currentRole,
            permissions: hasPermission
              ? currentRole.permissions.filter((item) => item !== permission)
              : [...currentRole.permissions, permission],
          }
        : currentRole,
    );

    setRoles(nextRoles);
    window.localStorage.setItem(rolesStorageKey, JSON.stringify(nextRoles));
    addActivityLog(
      `${permission} ${hasPermission ? 'disabled' : 'enabled'} for ${roleName} role`,
    );
  }

  function changeAccountRole(account: Account, nextRole: string) {
    const nextAccounts = accounts.map((currentAccount) =>
      currentAccount.id === account.id
        ? { ...currentAccount, role: nextRole }
        : currentAccount,
    );

    setAccounts(nextAccounts);
    window.localStorage.setItem(accountsStorageKey, JSON.stringify(nextAccounts));
    addActivityLog(`${account.name} role changed from ${account.role} to ${nextRole}`);
  }

  function deleteAccount(account: Account) {
    if (!window.confirm(`Delete ${account.name}'s account?`)) {
      return;
    }

    const nextAccounts = accounts.filter((currentAccount) => currentAccount.id !== account.id);
    setAccounts(nextAccounts);
    window.localStorage.setItem(accountsStorageKey, JSON.stringify(nextAccounts));
    addActivityLog(`${account.name} account deleted`);
  }

  function addAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const name = newAccount.name.trim();
    const email = newAccount.email.trim();

    if (!name || !email || accounts.some((account) => account.email === email)) {
      return;
    }

    const account = { id: Date.now(), name, email, role: newAccount.role };
    const nextAccounts = [...accounts, account];
    setAccounts(nextAccounts);
    window.localStorage.setItem(accountsStorageKey, JSON.stringify(nextAccounts));
    addActivityLog(`${name} account created with ${newAccount.role} role`);
    setNewAccount({ name: '', email: '', role: 'Viewer' });
    setIsAddingAccount(false);
  }

  const filteredAccounts = accounts.filter((account) =>
    `${account.name} ${account.email} ${account.role}`
      .toLowerCase()
      .includes(accountSearch.toLowerCase()),
  );

  return (
    <DashboardLayout title="Roles & Permissions">
      <section className={styles.content}>
        <div className={styles.intro}>
          <h2>Roles &amp; Permissions</h2>
          <p>Control what each admin role can access.</p>
        </div>

        <div className={styles.rolesGrid}>
          {roles.map((role) => (
            <article className={styles.roleCard} key={role.name}>
              <div className={styles.roleHeader}>
                <div>
                  <h3>{role.name}</h3>
                  <p>{role.description}</p>
                </div>
                <span className={styles.permissionCount}>
                  {role.permissions.length}/{permissions.length}
                </span>
              </div>
              <div className={styles.permissionList}>
                {permissions.map((permission) => (
                  <label className={styles.permissionItem} key={permission}>
                    <input
                      checked={role.permissions.includes(permission)}
                      type="checkbox"
                      onChange={() => togglePermission(role.name, permission)}
                    />
                    <span>{permission}</span>
                  </label>
                ))}
              </div>
            </article>
          ))}
        </div>
        <section className={styles.accountRoles}>
          <div className={styles.accountRolesHeader}>
            <div>
              <h3>Account Roles</h3>
              <p>Assign a role to each admin account.</p>
            </div>
            <div className={styles.accountControls}>
              <input
                aria-label="Search accounts"
                placeholder="Search accounts..."
                type="search"
                value={accountSearch}
                onChange={(event) => setAccountSearch(event.target.value)}
              />
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => setIsAddingAccount((current) => !current)}
              >
                {isAddingAccount ? 'Cancel' : 'Add Account'}
              </button>
            </div>
          </div>
          <div className={styles.roleCounts}>
            {roles.map((role) => (
              <span key={role.name}>
                {role.name}: {accounts.filter((account) => account.role === role.name).length}
              </span>
            ))}
          </div>
          {isAddingAccount && (
            <form className={styles.addAccountForm} onSubmit={addAccount}>
              <input
                required
                placeholder="Full name"
                value={newAccount.name}
                onChange={(event) => setNewAccount({ ...newAccount, name: event.target.value })}
              />
              <input
                required
                placeholder="Email address"
                type="email"
                value={newAccount.email}
                onChange={(event) => setNewAccount({ ...newAccount, email: event.target.value })}
              />
              <select
                value={newAccount.role}
                onChange={(event) => setNewAccount({ ...newAccount, role: event.target.value })}
              >
                {roles.map((role) => (
                  <option key={role.name} value={role.name}>{role.name}</option>
                ))}
              </select>
              <button className={styles.primaryButton} type="submit">Save Account</button>
            </form>
          )}
          <div className={styles.accountList}>
            {filteredAccounts.map((account) => (
              <div className={styles.accountRow} key={account.id}>
                <div>
                  <strong>{account.name}</strong>
                  <span>{account.email}</span>
                </div>
                <select
                  aria-label={`Role for ${account.name}`}
                  value={account.role}
                  onChange={(event) => changeAccountRole(account, event.target.value)}
                >
                  {roles.map((role) => (
                    <option key={role.name} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.deleteAccountButton}
                  type="button"
                  onClick={() => deleteAccount(account)}
                >
                  Delete
                </button>
              </div>
            ))}
            {filteredAccounts.length === 0 && (
              <div className={styles.emptyState}>No accounts found.</div>
            )}
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
