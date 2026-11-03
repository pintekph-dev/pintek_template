import DashboardLayout from '@/components/admin/DashboardLayout';
import styles from '@styles/admin/dashboard.module.scss';

const filingActivity = [
  { month: 'Jan', filings: 42 },
  { month: 'Feb', filings: 58 },
  { month: 'Mar', filings: 76 },
  { month: 'Apr', filings: 64 },
  { month: 'May', filings: 88 },
  { month: 'Jun', filings: 70 },
];

const financialSummary = {
  subscriptionRevenue: 12450,
  subscriptionExpenses: 4200,
};

const subscriptionBreakdown = [
  { label: 'Premium', value: 45, className: styles.premiumSlice },
  { label: 'Standard', value: 35, className: styles.standardSlice },
  { label: 'Free', value: 20, className: styles.freeSlice },
];

export default function AdminDashboard() {
  const netProfit =
    financialSummary.subscriptionRevenue - financialSummary.subscriptionExpenses;
  const isProfitable = netProfit > 0;
  const totalFilings = filingActivity.reduce((total, item) => total + item.filings, 0);
  const firstMonthFilings = filingActivity[0].filings;
  const latestMonthFilings = filingActivity[filingActivity.length - 1].filings;
  const trendPercentage = Math.round(
    ((latestMonthFilings - firstMonthFilings) / firstMonthFilings) * 100,
  );
  const minimumFilings = Math.min(...filingActivity.map((item) => item.filings));
  const maximumFilings = Math.max(...filingActivity.map((item) => item.filings));
  const chartPoints = filingActivity
    .map((item, index) => {
      const x = 10 + (index * 220) / (filingActivity.length - 1);
      const y =
        85 -
        ((item.filings - minimumFilings) / (maximumFilings - minimumFilings)) * 65;

      return `${x},${y}`;
    })
    .join(' ');

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
            <span>Subscription Revenue</span>
            <strong>₱{financialSummary.subscriptionRevenue.toLocaleString()}</strong>
          </article>
        </div>

        <section className={styles.profitSummary}>
          <div>
            <h3>Subscription Profit Summary</h3>
            <p>Track profit from TaxHelp subscriptions only.</p>
          </div>
          <span className={isProfitable ? styles.profitStatus : styles.lossStatus}>
            {isProfitable ? 'Profitable' : 'Loss'}
          </span>
          <div className={styles.financialValues}>
            <div>
              <span>Subscription Revenue</span>
              <strong>₱{financialSummary.subscriptionRevenue.toLocaleString()}</strong>
            </div>
            <div>
              <span>Subscription Expenses</span>
              <strong>₱{financialSummary.subscriptionExpenses.toLocaleString()}</strong>
            </div>
            <div>
              <span>Net Profit</span>
              <strong>₱{netProfit.toLocaleString()}</strong>
            </div>
          </div>
        </section>

        <section className={styles.tracker}>
          <div className={styles.trackerHeader}>
            <div>
              <h3>Tax Filing Activity</h3>
              <p>Submitted filings for the last six months.</p>
            </div>
            <strong className={styles.trendUp}>
              ↗ {trendPercentage}% trend
            </strong>
          </div>

          <div className={styles.trendChart} aria-label="Tax filing activity trend">
            <svg
              className={styles.trendGraph}
              viewBox="0 0 240 100"
              role="img"
              aria-label="Tax filing activity is trending upward"
            >
              <polyline
                className={styles.trendLine}
                points={chartPoints}
              />
              {filingActivity.map((item, index) => {
                const x = 10 + (index * 220) / (filingActivity.length - 1);
                const y =
                  85 -
                  ((item.filings - minimumFilings) /
                    (maximumFilings - minimumFilings)) *
                    65;

                return (
                  <circle
                    className={styles.trendPoint}
                    cx={x}
                    cy={y}
                    key={item.month}
                    r="3"
                  />
                );
              })}
            </svg>
            <div className={styles.trendSummary}>
              <strong>{totalFilings} filings</strong>
              <span>
                {filingActivity[0].month} to {filingActivity[filingActivity.length - 1].month} activity
                {trendPercentage >= 0 ? ' increased' : ' decreased'} by {Math.abs(trendPercentage)}%
              </span>
            </div>
          </div>
          <div className={styles.monthlyValues}>
            {filingActivity.map((item) => (
              <div className={styles.monthValue} key={item.month}>
                <span>{item.month}</span>
                <strong>{item.filings}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.subscriptionChart}>
          <div>
            <h3>Subscription Breakdown</h3>
            <p>Current TaxHelp users by subscription plan.</p>
          </div>
          <div className={styles.pieContent}>
            <div className={styles.pieChart} aria-label="Subscription breakdown pie chart" />
            <div className={styles.chartLegend}>
              {subscriptionBreakdown.map((item) => (
                <div className={styles.legendItem} key={item.label}>
                  <span className={`${styles.legendDot} ${item.className}`} />
                  <span>{item.label}</span>
                  <strong>{item.value}%</strong>
                </div>
              ))}
            </div>
          </div>
        </section>
      </section>
    </DashboardLayout>
  );
}
