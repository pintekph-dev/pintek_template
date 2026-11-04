
import scss from '@styles/Dashboard.module.scss';

export default function Page() {
  return (
    <div className={scss.dashboard}>

      <aside className={scss.sidebar}>
        <h2>MY WEBSITE</h2>
        <nav>
          <a href="/">Home</a>
          <a href="/profile">Profile</a>
          <a href="/dashboard">Dashboard</a>
          <a href="/settings">Settings</a>
          <a href="/logout">Logout</a>
        </nav>
      </aside>
      <main className={scss.content}>
        <h1>Welcome!</h1>
        <p>This is the main content area.</p>
      </main>

    </div>
  );
}
