import { useState } from 'react';
import DashboardLayout from '@/components/admin/DashboardLayout';
import { addActivityLog } from '@/lib/adminActivity';
import styles from '@styles/admin/dashboard.module.scss';

const reportData = {
  'May 2024': {
    revenue: 12450, orders: 398, averageOrder: 31.28, profit: 8250, change: 18.7,
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], trend: [78, 92, 84, 108, 101, 124],
    categories: [['Premium', 55], ['Standard', 45], ['Free', 0]],
    products: [['Premium Plan', 5602, 18.7], ['Standard Plan', 4357, 11.3], ['Tax Filing', 1520, 6.6], ['Free Plan', 0, 0]],
  },
  'April 2024': {
    revenue: 10490, orders: 357, averageOrder: 29.38, profit: 6870, change: 12.4,
    labels: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr'], trend: [65, 74, 82, 77, 89, 104],
    categories: [['Premium', 54], ['Standard', 46], ['Free', 0]],
    products: [['Premium Plan', 4406, 12.1], ['Standard Plan', 3776, 9.8], ['Tax Filing', 1360, 5.2], ['Free Plan', 0, 0]],
  },
  'March 2024': {
    revenue: 9325, orders: 321, averageOrder: 29.05, profit: 6010, change: 8.6,
    labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'], trend: [58, 69, 63, 76, 72, 93],
    categories: [['Premium', 53], ['Standard', 47], ['Free', 0]],
    products: [['Premium Plan', 3730, 8.9], ['Standard Plan', 3450, 7.4], ['Tax Filing', 1245, 4.1], ['Free Plan', 0, 0]],
  },
  'Last 6 months': {
    revenue: 56840, orders: 1832, averageOrder: 31.03, profit: 35940, change: 15.2,
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'], trend: [78, 92, 84, 93, 104, 124],
    categories: [['Premium', 55], ['Standard', 45], ['Free', 0]],
    products: [['Premium Plan', 24480, 15.8], ['Standard Plan', 19820, 13.2], ['Tax Filing', 7360, 7.6], ['Free Plan', 0, 0]],
  },
} as const;

const categoryClasses = [styles.reportPremium, styles.reportStandard, styles.reportFree];

function formatPeso(value: number) {
  return `₱${value.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function AdminReports() {
  const [reportPeriod, setReportPeriod] = useState('May 2024');
  const [generatedReport, setGeneratedReport] = useState<string | null>(null);
  const data = reportData[reportPeriod as keyof typeof reportData];
  const categories = data.categories.map(([name, percent], index) => ({
    name,
    percent,
    amount: Math.round(data.revenue * (percent / 100)),
    value: formatPeso(Math.round(data.revenue * (percent / 100))),
    className: categoryClasses[index],
  }));
  const chartPoints = data.trend.map((value, index) => {
    const x = 20 + (index * 600) / (data.trend.length - 1);
    const y = 180 - ((value - Math.min(...data.trend)) / (Math.max(...data.trend) - Math.min(...data.trend))) * 125;
    return `${x},${y}`;
  });
  const chartPath = `M${chartPoints.join(' L')}`;
  const chartArea = `${chartPath} L620 190 L20 190 Z`;

  function generateReport() {
    const generatedAt = new Date().toLocaleString();
    window.localStorage.setItem(
      'taxhelp-generated-report',
      JSON.stringify({ period: reportPeriod, generatedAt }),
    );
    setGeneratedReport(generatedAt);
    addActivityLog(`Created ${reportPeriod} business report`);
  }

  async function downloadReport() {
    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF('portrait', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 16;
    const width = pageWidth - margin * 2;
    const money = (value: number) => `PHP ${value.toLocaleString('en-PH', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
    const card = (x: number, top: number, cardWidth: number, height: number, fill = [255, 255, 255]) => {
      pdf.setFillColor(fill[0], fill[1], fill[2]);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(x, top, cardWidth, height, 3, 3, 'FD');
    };
    const heading = (text: string, x: number, top: number) => {
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(12);
      pdf.text(text, x, top);
    };

    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 34, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(21);
    pdf.text('TaxHelp', margin, 15);
    pdf.setFontSize(13);
    pdf.text(`Business Report - ${reportPeriod}`, margin, 26);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.text(`Generated ${new Date().toLocaleDateString()}`, pageWidth - margin, 25, { align: 'right' });

    let y = 44;
    const gap = 4;
    const kpiWidth = (width - gap * 3) / 4;
    [
      ['Total Revenue', money(data.revenue), `+${data.change}%`],
      ['Orders', data.orders.toLocaleString(), `+${data.change}%`],
      ['Average Order Value', money(data.averageOrder), `+${data.change}%`],
      ['Net Profit', money(data.profit), `+${data.change}%`],
    ].forEach(([label, value, change], index) => {
      const x = margin + index * (kpiWidth + gap);
      card(x, y, kpiWidth, 29);
      pdf.setTextColor(100, 116, 139);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(label, x + 5, y + 8);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(13);
      pdf.text(value, x + 5, y + 18);
      pdf.setTextColor(22, 163, 74);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.text(`${change} vs previous period`, x + 5, y + 25);
    });

    y += 38;
    const columnGap = 6;
    const columnWidth = (width - columnGap) / 2;
    card(margin, y, columnWidth, 76);
    card(margin + columnWidth + columnGap, y, columnWidth, 76);
    heading('Revenue Trend', margin + 6, y + 11);
    heading('Revenue by Category', margin + columnWidth + columnGap + 6, y + 11);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Subscription revenue activity', margin + 6, y + 18);
    const graphX = margin + 8;
    const graphY = y + 27;
    const graphWidth = columnWidth - 16;
    const graphHeight = 32;
    const minTrend = Math.min(...data.trend);
    const maxTrend = Math.max(...data.trend);
    const points = data.trend.map((value, index) => ({
      x: graphX + (index * graphWidth) / (data.trend.length - 1),
      y: graphY + graphHeight - ((value - minTrend) / (maxTrend - minTrend)) * graphHeight,
    }));
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(1.2);
    points.forEach((point, index) => {
      if (index > 0) pdf.line(points[index - 1].x, points[index - 1].y, point.x, point.y);
      pdf.setFillColor(37, 99, 235);
      pdf.circle(point.x, point.y, 1.4, 'F');
    });
    pdf.setDrawColor(226, 232, 240);
    pdf.line(graphX, graphY + graphHeight, graphX + graphWidth, graphY + graphHeight);
    data.labels.forEach((label, index) => pdf.text(label, points[index].x, graphY + graphHeight + 8, { align: 'center' }));

    const categoryX = margin + columnWidth + columnGap;
    categories.forEach((category, index) => {
      const rowY = y + 29 + index * 14;
      const barWidth = (columnWidth - 75) * (category.percent / 50);
      pdf.setFillColor(index === 0 ? 37 : index === 1 ? 20 : 245, index === 0 ? 99 : index === 1 ? 184 : 158, index === 0 ? 235 : index === 1 ? 166 : 11);
      pdf.roundedRect(categoryX + 7, rowY, Math.max(barWidth, 4), 7, 2, 2, 'F');
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(8);
      pdf.text(category.name, categoryX + 7, rowY - 3);
      pdf.text(`${money(category.amount)} (${category.percent}%)`, categoryX + columnWidth - 7, rowY + 5, { align: 'right' });
    });

    y += 86;
    const bottomWidth = (width - columnGap) / 2;
    card(margin, y, bottomWidth, 62);
    card(margin + bottomWidth + columnGap, y, bottomWidth, 62, [239, 246, 255]);
    heading('Top Products', margin + 6, y + 11);
    data.products.forEach(([name, revenue, change], index) => {
      const rowY = y + 23 + index * 9;
      pdf.setTextColor(51, 65, 85);
      pdf.setFontSize(8);
      pdf.text(name, margin + 6, rowY);
      pdf.text(money(revenue), margin + bottomWidth - 30, rowY, { align: 'right' });
      pdf.setTextColor(change < 0 ? 220 : 22, change < 0 ? 38 : 163, change < 0 ? 38 : 74);
      pdf.text(`${change > 0 ? '+' : ''}${change}%`, margin + bottomWidth - 7, rowY, { align: 'right' });
    });
    const summaryX = margin + bottomWidth + columnGap;
    heading('Executive Summary', summaryX + 6, y + 11);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    pdf.setTextColor(30, 64, 175);
    [
      `Revenue reached ${money(data.revenue)} for ${reportPeriod}.`,
      `Premium subscriptions represent ${categories[0].percent}% of revenue.`,
      `Net profit reached ${money(data.profit)}.`,
    ].forEach((summary, index) => pdf.text(`- ${summary}`, summaryX + 7, y + 24 + index * 9));

    pdf.save(`taxhelp-report-${reportPeriod.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    addActivityLog(`Downloaded ${reportPeriod} business report as PDF`);
    return;
    /*
     * Legacy vector export retained below while the screen capture export is verified.
    const margin = 16;
    const contentWidth = pageWidth - margin * 2;
    const drawCard = (x: number, top: number, width: number, height: number, fill = [255, 255, 255]) => {
      pdf.setFillColor(255, 255, 255);
      pdf.setFillColor(fill[0], fill[1], fill[2]);
      pdf.setDrawColor(226, 232, 240);
      pdf.roundedRect(x, top, width, height, 4, 4, 'FD');
    };

    pdf.setFillColor(30, 64, 175);
    pdf.rect(0, 0, pageWidth, 32, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(22);
    pdf.text('TaxHelp', margin, 14);
    pdf.setFontSize(14);
    pdf.text(`Business Report - ${reportPeriod}`, margin, 24);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.text(`Generated ${new Date().toLocaleDateString()}`, pageWidth - margin, 22, { align: 'right' });
    let y = 40;

    const kpiGap = 5;
    const kpiWidth = (contentWidth - kpiGap * 3) / 4;
    [
      ['Total Revenue', formatPeso(data.revenue), `↑ ${data.change}%`],
      ['Orders', data.orders.toLocaleString(), `↑ ${data.change}%`],
      ['Average Order Value', formatPeso(data.averageOrder), `↑ ${data.change}%`],
      ['Net Profit', formatPeso(data.profit), `↑ ${data.change}%`],
    ].forEach(([label, value, change], index) => {
      const x = margin + index * (kpiWidth + kpiGap);
      drawCard(x, y, kpiWidth, 30);
      pdf.setTextColor(100, 116, 139);
      pdf.setFontSize(9);
      pdf.text(label, x + 6, y + 9);
      pdf.setTextColor(15, 23, 42);
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(15);
      pdf.text(value, x + 6, y + 20);
      pdf.setTextColor(22, 163, 74);
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.text(`${change} vs previous period`, x + 6, y + 27);
    });
    y += 38;

    const leftWidth = contentWidth * 0.57;
    const rightX = margin + leftWidth + 7;
    const rightWidth = contentWidth - leftWidth - 7;
    drawCard(margin, y, leftWidth, 66);
    drawCard(rightX, y, rightWidth, 66);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Revenue Trend', margin + 7, y + 11);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    pdf.setTextColor(100, 116, 139);
    pdf.text('Subscription revenue activity', margin + 7, y + 18);
    const graphX = margin + 9;
    const graphY = y + 26;
    const graphWidth = leftWidth - 18;
    const graphHeight = 29;
    const minTrend = Math.min(...data.trend);
    const maxTrend = Math.max(...data.trend);
    const points = data.trend.map((value, index) => ({
      x: graphX + (index * graphWidth) / (data.trend.length - 1),
      y: graphY + graphHeight - ((value - minTrend) / (maxTrend - minTrend)) * graphHeight,
    }));
    pdf.setDrawColor(37, 99, 235);
    pdf.setLineWidth(1.4);
    points.forEach((point, index) => {
      if (index > 0) {
        pdf.line(points[index - 1].x, points[index - 1].y, point.x, point.y);
      }
      pdf.setFillColor(37, 99, 235);
      pdf.circle(point.x, point.y, 1.8, 'F');
    });
    pdf.setDrawColor(226, 232, 240);
    pdf.line(graphX, graphY + graphHeight, graphX + graphWidth, graphY + graphHeight);
    pdf.setTextColor(100, 116, 139);
    pdf.setFontSize(8);
    data.labels.forEach((label, index) => {
      pdf.text(label, points[index].x, graphY + graphHeight + 8, { align: 'center' });
    });

    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Revenue by Category', rightX + 7, y + 11);
    pdf.setFont('helvetica', 'normal');
    categories.forEach((category, index) => {
      const rowY = y + 27 + index * 12;
      const barWidth = (rightWidth - 75) * (category.percent / 50);
      pdf.setFillColor(index === 0 ? 37 : index === 1 ? 20 : 245, index === 0 ? 99 : index === 1 ? 184 : 158, index === 0 ? 235 : index === 1 ? 166 : 11);
      pdf.roundedRect(rightX + 7, rowY, Math.max(barWidth, 5), 7, 2, 2, 'F');
      pdf.setTextColor(71, 85, 105);
      pdf.setFontSize(9);
      pdf.text(category.name, rightX + 7, rowY - 3);
      pdf.text(`${category.value} (${category.percent}%)`, rightX + rightWidth - 7, rowY + 5, { align: 'right' });
    });
    y += 76;

    const bottomGap = 7;
    const bottomWidth = (contentWidth - bottomGap) / 2;
    drawCard(margin, y, bottomWidth, 52);
    pdf.setTextColor(15, 23, 42);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Top Products', margin + 7, y + 11);
    pdf.setFont('helvetica', 'normal');
    data.products.forEach(([name, revenue, change], index) => {
      const rowY = y + 21 + index * 7;
      pdf.setTextColor(51, 65, 85);
      pdf.setFontSize(9);
      pdf.text(name, margin + 7, rowY);
      pdf.text(formatPeso(revenue), margin + bottomWidth - 30, rowY, { align: 'right' });
      pdf.setTextColor(change < 0 ? 220 : 22, change < 0 ? 38 : 163, change < 0 ? 38 : 74);
      pdf.text(`${change > 0 ? '+' : ''}${change}%`, margin + bottomWidth - 7, rowY, { align: 'right' });
    });

    const summaryX = margin + bottomWidth + bottomGap;
    drawCard(summaryX, y, bottomWidth, 52, [239, 246, 255]);
    pdf.setDrawColor(191, 219, 254);
    pdf.setTextColor(30, 64, 175);
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(13);
    pdf.text('Executive Summary', summaryX + 7, y + 11);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(9);
    [
      `Revenue reached ${formatPeso(data.revenue)} for ${reportPeriod}.`,
      `Premium subscriptions represent ${categories[0].percent}% of revenue.`,
      `Net profit reached ${formatPeso(data.profit)}.`,
    ].forEach((summary, index) => pdf.text(`• ${summary}`, summaryX + 8, y + 21 + index * 8));

    pdf.save(`taxhelp-report-${reportPeriod.toLowerCase().replace(/\s+/g, '-')}.pdf`);
    addActivityLog(`Downloaded ${reportPeriod} business report as PDF`);
    */
  }

  return (
    <DashboardLayout title="Reports">
      <section className={styles.content} id="taxhelp-report">
        <div className={styles.reportHeader}>
          <div className={styles.intro}>
            <h2>Business Report - {reportPeriod}</h2>
            <p>Report generated from TaxHelp subscription and filing data.</p>
            {generatedReport && (
              <span className={styles.reportReady}>
                Report ready for {reportPeriod} · {generatedReport}
              </span>
            )}
          </div>
          <div className={styles.reportActions}>
            <select
              className={styles.reportPeriod}
              aria-label="Report period"
              value={reportPeriod}
              onChange={(event) => {
                setReportPeriod(event.target.value);
                addActivityLog(`Changed report period to ${event.target.value}`);
              }}
            >
              <option>May 2024</option>
              <option>April 2024</option>
              <option>March 2024</option>
              <option>Last 6 months</option>
            </select>
            <button className={styles.secondaryButton} type="button" onClick={() => addActivityLog('Shared monthly business report')}>
              Share
            </button>
            <button className={styles.secondaryButton} type="button" onClick={downloadReport}>
              Download
            </button>
            <button className={styles.primaryButton} type="button" onClick={generateReport}>
              Create Report
            </button>
          </div>
        </div>

        <div className={styles.reportKpis}>
          <article className={styles.reportKpi}>
            <span>Total Revenue</span>
            <strong>{formatPeso(data.revenue)}</strong>
            <small className={styles.positive}>+{data.change}% vs previous period</small>
          </article>
          <article className={styles.reportKpi}>
            <span>Orders</span>
            <strong>{data.orders.toLocaleString()}</strong>
            <small className={styles.positive}>+{data.change}% vs previous period</small>
          </article>
          <article className={styles.reportKpi}>
            <span>Average Order Value</span>
            <strong>{formatPeso(data.averageOrder)}</strong>
            <small className={styles.positive}>+{data.change}% vs previous period</small>
          </article>
          <article className={styles.reportKpi}>
            <span>Net Profit</span>
            <strong>{formatPeso(data.profit)}</strong>
            <small className={styles.positive}>+{data.change}% vs previous period</small>
          </article>
        </div>

        <div className={styles.reportMainGrid}>
          <section className={styles.reportPanel}>
            <div className={styles.reportPanelHeader}>
              <div>
                <h3>Revenue Trend</h3>
                <p>Monthly subscription revenue in thousands</p>
              </div>
              <span className={styles.reportBadge}>Last 6 months</span>
            </div>
            <svg className={styles.revenueChart} viewBox="0 0 640 220" role="img" aria-label="Revenue trend chart">
              <path className={styles.chartArea} d={chartArea} />
              <path className={styles.chartPath} d={chartPath} />
              <line className={styles.chartAxis} x1="20" x2="620" y1="190" y2="190" />
              {data.labels.map((month, index) => (
                <text className={styles.chartText} key={month} x={35 + index * 117} y="210">{month}</text>
              ))}
            </svg>
          </section>

          <section className={styles.reportPanel}>
            <div className={styles.reportPanelHeader}>
              <div>
                <h3>Revenue by Category</h3>
                <p>Subscription revenue breakdown</p>
              </div>
            </div>
            <div className={styles.categoryContent}>
              <div
                className={styles.reportDonut}
                style={{ background: `conic-gradient(#2563eb 0 ${categories[0].percent}%, #14b8a6 ${categories[0].percent}% ${categories[0].percent + categories[1].percent}%, #f59e0b ${categories[0].percent + categories[1].percent}% 100%)` }}
              />
              <div className={styles.reportLegend}>
                {categories.map((category) => (
                  <div className={styles.reportLegendItem} key={category.name}>
                    <span className={`${styles.reportLegendDot} ${category.className}`} />
                    <span>{category.name}</span>
                    <strong>{category.value} ({category.percent}%)</strong>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className={styles.reportBottomGrid}>
          <section className={styles.reportPanel}>
            <h3>Top Products</h3>
            <div className={styles.productTable}>
              {data.products.map(([name, revenue, change]) => (
                <div className={styles.productRow} key={name}>
                  <span>{name}</span>
                  <strong>{formatPeso(revenue)}</strong>
                  <small className={change < 0 ? styles.negative : styles.positive}>{change > 0 ? '+' : ''}{change}%</small>
                </div>
              ))}
            </div>
          </section>
          <section className={styles.reportPanel}>
            <h3>Exceptions &amp; Alerts</h3>
            <div className={styles.alertItem}><b className={styles.alertInfo}>i</b><span>Free plan accounts generate no subscription revenue.</span></div>
            <div className={styles.alertItem}><b className={styles.alertInfo}>i</b><span>Premium subscriptions drive {categories[0].percent}% of total revenue.</span></div>
            <div className={styles.alertItem}><b className={styles.alertSuccess}>✓</b><span>Net profit reached {formatPeso(data.profit)}.</span></div>
          </section>
        </div>

        <section className={styles.executiveSummary}>
          <h3>Executive Summary</h3>
          <ul>
            <li>Total subscription revenue reached {formatPeso(data.revenue)} for {reportPeriod}.</li>
            <li>Premium subscriptions remain the strongest revenue category at {categories[0].percent}%.</li>
            <li>Net profit reached {formatPeso(data.profit)} after keeping expenses below revenue.</li>
          </ul>
        </section>
      </section>
    </DashboardLayout>
  );
}
