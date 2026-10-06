class ExportedClaim {
    static async buildClaimPdfBuffer(claimExport) {
        const claim = claimExport?.claim || {};
        const student = claimExport?.student || {};
        const banking = claimExport?.banking || {};
        const moduleInfo = claimExport?.module || {};
        const sessions = Array.isArray(claimExport?.sessions) ? claimExport.sessions : [];
        const sessionsByMonth = new Map();
        const generatedAt = this.escapeHtml(new Date().toLocaleString('en-ZA'));

        for (const session of sessions) {
            const date = session.date ? new Date(session.date) : null;
            const hasValidDate = date && !Number.isNaN(date.getTime());
            const monthKey = hasValidDate
                ? `${date.getFullYear()}-${date.getMonth()}`
                : 'unknown';
            const monthLabel = hasValidDate
                ? date.toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })
                : 'Date not available';

            if (!sessionsByMonth.has(monthKey)) {
                sessionsByMonth.set(monthKey, { label: monthLabel, sessions: [], totalHours: 0 });
            }
            const month = sessionsByMonth.get(monthKey);
            month.sessions.push(session);
            const hours = Number(session.hours ?? 0);
            month.totalHours += Number.isFinite(hours) ? hours : 0;
        }

        const html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <style>
                    :root {
                        --nwu-purple: #1d1d1d;
                        --nwu-navy: #303131;
                        --nwu-light: #F4F4F6;
                        --nwu-border: #E5E7EB;
                        --nwu-text: #353535;
                        --nwu-muted: #7e7f81;
                    }

                    * { box-sizing: border-box; }

                    body {
                        margin: 0;
                        font-family: Arial, Helvetica, sans-serif;
                        color: var(--nwu-text);
                        background: #ffffff;
                    }

                    .page {
                        width: 100%;
                        min-height: 297mm;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                    }
                    .header {
                        background: var(--nwu-purple);
                        color: white;
                        padding: 28px 36px 18px;
                        position: relative;
                    }

                    .header-title {
                        font-size: 28px;
                        font-weight: 700;
                        margin: 0;
                    }

                    .header-subtitle {
                        font-size: 12px;
                        opacity: 0.9;
                        margin-top: 6px;
                        letter-spacing: 0.5px;
                    }

                    .reference-pill {
                        position: absolute;
                        right: 36px;
                        top: 22px;
                        color: #fff;
                        padding: 8px 12px;
                        font-size: 11px;
                        font-weight: bold;
                        letter-spacing: 0.5px;
                    }

                    .status-pill {
                        position: absolute;
                        right: 36px;
                        top: 56px;
                        color: #fff;
                        padding: 6px 10px;
                        font-size: 11px;
                        font-weight: 700;
                    }

                    .content {
                        flex: 1;
                        display: flex;
                        flex-direction: column;
                        padding: 5px 20px 20px 20px;
                    }

                    .summary-grid {
                        display: grid;
                        grid-template-columns: 1.5fr 0.8fr;
                        gap: 20px;
                        margin-top: 18px;
                    }

                    .panel {
                        border: 1px solid var(--nwu-border);
                        border-radius: 5px;
                        overflow: hidden;
                    }

                    .panel-header {
                        background: var(--nwu-navy);
                        color: #fff;
                        padding: 10px 14px;
                        font-size: 12px;
                        font-weight: 700;
                        letter-spacing: 0.4px;
                        text-transform: uppercase;
                    }

                    .key-value { width: 100%; border-collapse: collapse; }
                    .key-value tr:nth-child(even) { background: #f9fafb; }
                    .key-value td {
                        padding: 10px 12px;
                        font-size: 12px;
                        border-bottom: 1px solid var(--nwu-border);
                        vertical-align: top;
                    }

                    .key-value td:first-child {
                        width: 200px;
                        font-weight: 700;
                        color: var(--nwu-navy);
                    }

                    .totals {
                        background: var(--nwu-light);
                        border: 1px solid var(--nwu-border);
                        border-radius: 5px;
                        padding: 18px 16px;
                        min-height: 124px;
                    }

                    .totals h3 {
                        margin: 0 0 14px;
                        color: var(--nwu-navy);
                        font-size: 13px;
                        text-transform: uppercase;
                        letter-spacing: 0.6px;
                    }

                    .total-row {
                        display: flex;
                        justify-content: space-between;
                        font-size: 12px;
                        margin: 8px 0;
                        color: var(--nwu-text);
                    }

                    .total-row strong { color: var(--nwu-navy); }

                    .bank-details {
                        margin-top: 26px;
                    }

                    .bank-details-grid {
                        display: grid;
                        grid-template-columns: repeat(2, minmax(0, 1fr));
                        column-gap: 24px;
                    }

                    .claim-section {
                        border: 1px solid var(--nwu-border);
                        border-radius: 5px;
                        margin-top: 26px;
                    }

                    .sessions-section {
                        break-before: page;
                        page-break-before: always;
                    }

                    .info-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        border: 1px solid var(--nwu-border);
                        border-radius: 5px;
                        overflow: hidden;
                    }

                    .info-table tr:nth-child(even) { background: #f9fafb; }
                    .info-table td {
                        padding: 10px 12px;
                        border-bottom: 1px solid var(--nwu-border);
                        font-size: 12px;
                    }

                    .info-table td:first-child {
                        width: 30%;
                        background: #f3f5f8;
                        font-weight: 700;
                        color: var(--nwu-navy);
                    }

                    .sessions-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 10px;
                        border: 1px solid var(--nwu-border);
                    }

                    .sessions-table th {
                        background: var(--nwu-purple);
                        color: white;
                        text-align: left;
                        padding: 10px 8px;
                        font-size: 11px;
                        font-weight: 700;
                        letter-spacing: 0.3px;
                    }

                    .sessions-table td {
                        padding: 9px 8px;
                        font-size: 11px;
                        border-bottom: 1px solid var(--nwu-border);
                    }

                    .sessions-table tr:nth-child(even) td {
                        background: var(--nwu-light);
                    }

                    .sessions-table .month-row th {
                        background: #e9eaf0;
                        color: var(--nwu-navy);
                        font-size: 11px;
                        text-transform: uppercase;
                    }

                    .sessions-table .month-total td {
                        background: var(--nwu-light);
                        color: var(--nwu-navy);
                        font-weight: 700;
                    }

                    .empty-box {
                        margin-top: 12px;
                        border: 1px solid var(--nwu-border);
                        background: var(--nwu-light);
                        border-radius: 5px;
                        padding: 18px;
                        text-align: center;
                        color: var(--nwu-muted);
                        font-size: 12px;
                    }

                </style>
            </head>
            <body>
                <div class="page">
                    <div class="header">
                        <div class="header-title">NWU Remuneration Claim</div>
                        <div class="header-subtitle">Student Claim Export</div>
                        <div class="reference-pill">${this.escapeHtml(claim.reference_number || 'N/A')}</div>
                        <div class="status-pill">${this.escapeHtml(claim.status || 'Unknown')}</div>
                    </div>

                    <div class="content">
                        <div class="summary-grid">
                            <div class="panel">
                                <div class="panel-header">Claim Summary</div>
                                <table class="key-value">
                                    <tr>
                                        <td>Student</td>
                                        <td>${this.escapeHtml(student.name || 'Unknown')} (${this.escapeHtml(student.student_number || 'N/A')})</td>
                                    </tr>
                                    <tr>
                                        <td>Module</td>
                                        <td>${this.escapeHtml(moduleInfo.code || 'N/A')} - ${this.escapeHtml(moduleInfo.name || 'N/A')}</td>
                                    </tr>
                                    <tr>
                                        <td>Period</td>
                                        <td>${this.escapeHtml(this.formatDate(claim.period_start_date))} - ${this.escapeHtml(this.formatDate(claim.period_end_date))}</td>
                                    </tr>
                                    <tr>
                                        <td>Submitted</td>
                                        <td>${this.escapeHtml(this.formatDateTime(claim.submission_date))}</td>
                                    </tr>
                                    <tr>
                                        <td>Status</td>
                                        <td>${this.escapeHtml(claim.status || 'Unknown')}</td>
                                    </tr>
                                </table>
                            </div>

                            <div class="totals">
                                <h3>Total Values</h3>
                                <div class="total-row"><span>Hours claimed</span><strong>${Number(claim.total_hours_claimed ?? 0).toFixed(2)}</strong></div>
                                <div class="total-row"><span>Hourly rate</span><strong>R ${Number(claim.hourly_rate_applied ?? 0).toFixed(2)}</strong></div>
                                <div class="total-row"><span>Claim amount</span><strong>R ${Number(claim.total_claim_amount ?? 0).toFixed(2)}</strong></div>
                                <div class="total-row"><span>Sessions</span><strong>${sessions.length}</strong></div>
                            </div>
                        </div>

                        <div class="claim-section">
                            <div class="panel-header" style="border-radius: 5px 5px 0 0;">Claim Details</div>
                            <table class="key-value">
                                <tr>
                                    <td>Reference number</td>
                                    <td>${this.escapeHtml(claim.reference_number || 'N/A')}</td>
                                </tr>
                                <tr>
                                    <td>Submission date</td>
                                    <td>${this.escapeHtml(this.formatDateTime(claim.submission_date))}</td>
                                </tr>
                                <tr>
                                    <td>Claim period</td>
                                    <td>${this.escapeHtml(this.formatDate(claim.period_start_date))} - ${this.escapeHtml(this.formatDate(claim.period_end_date))}</td>
                                </tr>
                                <tr>
                                    <td>Student number</td>
                                    <td>${this.escapeHtml(student.student_number || 'N/A')}</td>
                                </tr>
                                <tr>
                                    <td>Student name</td>
                                    <td>${this.escapeHtml(student.name || 'N/A')}</td>
                                </tr>
                                <tr>
                                    <td>Module code</td>
                                    <td>${this.escapeHtml(moduleInfo.code || 'N/A')}</td>
                                </tr>
                                <tr>
                                    <td>Module name</td>
                                    <td>${this.escapeHtml(moduleInfo.name || 'N/A')}</td>
                                </tr>
                            </table>
                        </div>

                        <div class="totals bank-details">
                            <h3>Bank Details</h3>
                            <div class="bank-details-grid">
                                <div class="total-row"><span>Bank</span><strong>${this.escapeHtml(banking.bank || 'Not provided')}</strong></div>
                                <div class="total-row"><span>Account holder</span><strong>${this.escapeHtml(banking.account_holder || student.name || 'Not provided')}</strong></div>
                                <div class="total-row"><span>Account number</span><strong>${this.escapeHtml(banking.account_number || 'Not provided')}</strong></div>
                                <div class="total-row"><span>Account type</span><strong>${this.escapeHtml(banking.account_type || 'Not provided')}</strong></div>
                                <div class="total-row"><span>Branch code</span><strong>${this.escapeHtml(banking.branch_code || 'Not provided')}</strong></div>
                            </div>
                        </div>

                        <div class="claim-section sessions-section">
                            <div class="panel-header" style="border-radius: 5px 5px 0 0;">Sessions</div>
                            ${
                                sessions.length
                                    ? `
                                        <table class="sessions-table">
                                            <thead>
                                                <tr>
                                                    <th style="width: 14%;">Date</th>
                                                    <th style="width: 32%;">Description</th>
                                                    <th style="width: 12%;">Start</th>
                                                    <th style="width: 12%;">End</th>
                                                    <th style="width: 10%;">Hours</th>
                                                    <th style="width: 20%;">Status</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                ${[...sessionsByMonth.values()].map((group) => `
                                                    <tr class="month-row">
                                                        <th colspan="6">${this.escapeHtml(group.label)}</th>
                                                    </tr>
                                                    ${group.sessions.map((session) => `
                                                        <tr>
                                                            <td>${this.escapeHtml(this.formatDate(session.date))}</td>
                                                            <td>${this.escapeHtml(session.description || session.activity_description || session.activity || 'Not provided')}</td>
                                                            <td>${this.escapeHtml(session.start_time || 'N/A')}</td>
                                                            <td>${this.escapeHtml(session.end_time || 'N/A')}</td>
                                                            <td>${this.escapeHtml(Number(session.hours ?? 0).toFixed(2))}</td>
                                                            <td>${this.escapeHtml(session.status || 'Pending')}</td>
                                                        </tr>
                                                    `).join('')}
                                                    <tr class="month-total">
                                                        <td colspan="4">Total for ${this.escapeHtml(group.label)}</td>
                                                        <td>${group.totalHours.toFixed(2)}</td>
                                                        <td></td>
                                                    </tr>
                                                `).join('')}
                                            </tbody>
                                        </table>
                                    `
                                    : `
                                        <div class="empty-box">
                                            No sessions were found for this claim in the selected period.
                                        </div>
                                    `
                            }
                        </div>

                    </div>
                </div>
            </body>
            </html>
        `;

        const { default: puppeteer } = await import('puppeteer');

        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN || '/usr/bin/chromium',
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            displayHeaderFooter: true,
            footerTemplate: `
                <div style="width: 100%; margin: 0 20px; padding-top: 5px; border-top: 1px solid #E5E7EB; color: #7e7f81; font-family: Arial, Helvetica, sans-serif; font-size: 8px; display: flex; justify-content: space-between;">
                    <span>Generated by NWU AACMS Remuneration Export ${generatedAt}</span>
                    <span>Page <span class="pageNumber"></span> of <span class="totalPages"></span></span>
                </div>
            `,
            margin: {
                top: '0',
                right: '0',
                bottom: '14mm',
                left: '0',
            }
        });

        await browser.close();
        return pdfBuffer;
    }

    static escapeHtml(value) {
        return String(value ?? '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    static formatDate(value) {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';

        return date.toLocaleDateString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
        });
    }

    static formatDateTime(value) {
        if (!value) return 'N/A';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return 'N/A';

        return date.toLocaleString('en-ZA', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    }
}

export default ExportedClaim;