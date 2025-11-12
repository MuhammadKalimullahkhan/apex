<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Project Report - {{ $project['name'] }}</title>
    <style>
        body { font-family: DejaVu Sans, Arial, sans-serif; font-size: 11px; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .header h1 { margin: 0; font-size: 24px; }
        .project-info { margin-bottom: 20px; }
        .info-row { margin-bottom: 8px; }
        .info-label { font-weight: bold; display: inline-block; width: 120px; }
        .summary { margin-bottom: 20px; }
        .summary-grid { display: table; width: 100%; margin-bottom: 20px; }
        .summary-row { display: table-row; }
        .summary-card { display: table-cell; border: 1px solid #ddd; padding: 15px; text-align: center; width: 16.66%; }
        .summary-card h3 { margin: 0 0 10px 0; font-size: 11px; color: #666; }
        .summary-card .value { font-size: 16px; font-weight: bold; }
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
        <h1>Project Report</h1>
        <p>{{ now()->format('F j, Y') }}</p>
    </div>

    <div class="project-info">
        <h2>{{ $project['name'] }}</h2>
        <div class="info-row">
            <span class="info-label">Project ID:</span> {{ $project['project_id'] }}
        </div>
        <div class="info-row">
            <span class="info-label">Client:</span> {{ $project['client'] }}
        </div>
        <div class="info-row">
            <span class="info-label">Manager:</span> {{ $project['manager'] }}
        </div>
        <div class="info-row">
            <span class="info-label">Status:</span> {{ $project['status'] }}
        </div>
        <div class="info-row">
            <span class="info-label">Start Date:</span> {{ $project['start_date'] }}
        </div>
        @if($project['end_date'])
        <div class="info-row">
            <span class="info-label">End Date:</span> {{ $project['end_date'] }}
        </div>
        @endif
        <div class="info-row">
            <span class="info-label">Description:</span> {{ $project['description'] ?? 'N/A' }}
        </div>
    </div>

    <div class="summary">
        <div class="summary-grid">
            <div class="summary-row">
                <div class="summary-card">
                    <h3>Total Tasks</h3>
                    <div class="value">{{ $stats['total_tasks'] }}</div>
                </div>
                <div class="summary-card">
                    <h3>Completed Tasks</h3>
                    <div class="value">{{ $stats['completed_tasks'] }}</div>
                </div>
                <div class="summary-card">
                    <h3>Completion Rate</h3>
                    <div class="value">{{ $stats['completion_rate'] }}%</div>
                </div>
                <div class="summary-card">
                    <h3>Total Expenses</h3>
                    <div class="value loss">${{ number_format($stats['total_expenses'], 2) }}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Invoices</h3>
                    <div class="value profit">${{ number_format($stats['total_invoices'], 2) }}</div>
                </div>
                <div class="summary-card">
                    <h3>Net Profit</h3>
                    <div class="value {{ $stats['net_profit'] >= 0 ? 'profit' : 'loss' }}">
                        ${{ number_format($stats['net_profit'], 2) }}
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="section">
        <div class="section-title">Tasks by Status</div>
        <table>
            <thead>
                <tr>
                    <th>Status</th>
                    <th>Count</th>
                </tr>
            </thead>
            <tbody>
                @foreach($tasksByStatus as $status => $count)
                <tr>
                    <td>{{ $status }}</td>
                    <td>{{ $count }}</td>
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

