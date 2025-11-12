<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Financial Report</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        .summary { margin-bottom: 20px; }
        .summary-grid { display: table; width: 100%; margin-bottom: 20px; }
        .summary-row { display: table-row; }
        .summary-card { display: table-cell; border: 1px solid #ddd; padding: 15px; text-align: center; width: 25%; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 12px; color: #666; }
        .summary-card .value { font-size: 18px; font-weight: bold; }
        .section { margin-bottom: 25px; }
        .section-title { font-size: 16px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #333; padding-bottom: 5px; }
        table { width: 100%; border-collapse: collapse; margin-bottom: 15px; }
        table th, table td { padding: 6px; text-align: left; border: 1px solid #ddd; }
        table th { background-color: #f5f5f5; font-weight: bold; }
        .profit { color: #28a745; }
        .loss { color: #dc3545; }
        .footer { margin-top: 40px; text-align: center; color: #666; font-size: 10px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Financial Report</h1>
        <p>{{ now()->format('F j, Y') }}</p>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-row">
                <div class="summary-card">
                    <h3>Total Expenses</h3>
                    <div class="value loss">${{ number_format($summary['total_expenses'], 2) }}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Revenue</h3>
                    <div class="value profit">${{ number_format($summary['total_revenue'], 2) }}</div>
                </div>
                <div class="summary-card">
                    <h3>Net Profit</h3>
                    <div class="value {{ $summary['net_profit'] >= 0 ? 'profit' : 'loss' }}">
                        ${{ number_format($summary['net_profit'], 2) }}
                    </div>
                </div>
                <div class="summary-card">
                    <h3>Profit Margin</h3>
                    <div class="value">{{ number_format($summary['profit_margin'], 2) }}%</div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Monthly Trend (Last 6 Months)</div>
        <table>
            <thead>
                <tr>
                    <th>Month</th>
                    <th>Revenue</th>
                    <th>Expenses</th>
                    <th>Profit/Loss</th>
                </tr>
            </thead>
            <tbody>
                @foreach($months as $month)
                <tr>
                    <td>{{ $month['month'] }}</td>
                    <td>${{ number_format($month['invoices'], 2) }}</td>
                    <td>${{ number_format($month['expenses'], 2) }}</td>
                    <td class="{{ $month['profit'] >= 0 ? 'profit' : 'loss' }}">
                        ${{ number_format($month['profit'], 2) }}
                    </td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        Generated on {{ now()->format('F j, Y \a\t g:i A') }} | Apex Wazar Management System
    </div>
</body>
</html>

