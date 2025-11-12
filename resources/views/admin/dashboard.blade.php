@extends('admin.layout')

@section('title', 'Dashboard')

@section('content')
<div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="bg-gray-800 rounded-lg p-6">
            <div class="text-gray-400 text-sm mb-2">Total Companies</div>
            <div class="text-3xl font-bold text-white">{{ $stats['total_companies'] }}</div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
            <div class="text-gray-400 text-sm mb-2">Active Companies</div>
            <div class="text-3xl font-bold text-green-500">{{ $stats['active_companies'] }}</div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
            <div class="text-gray-400 text-sm mb-2">Disabled Companies</div>
            <div class="text-3xl font-bold text-red-500">{{ $stats['disabled_companies'] }}</div>
        </div>

        <div class="bg-gray-800 rounded-lg p-6">
            <div class="text-gray-400 text-sm mb-2">Total Users</div>
            <div class="text-3xl font-bold text-white">{{ $stats['total_users'] }}</div>
        </div>
    </div>

    <!-- Recent Companies -->
    @if($stats['recent_companies']->count() > 0)
    <div class="bg-gray-800 rounded-lg p-6">
        <h2 class="text-xl font-semibold text-white mb-4">Recent Companies</h2>
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-gray-400 text-sm">
                        <th class="pb-4">Company Name</th>
                        <th class="pb-4">Email</th>
                        <th class="pb-4">Status</th>
                        <th class="pb-4">Created</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($stats['recent_companies'] as $company)
                    <tr class="border-t border-gray-700">
                        <td class="py-3 text-white">{{ $company->company_name }}</td>
                        <td class="py-3 text-gray-400">{{ $company->business_email }}</td>
                        <td class="py-3">
                            @if($company->is_enabled)
                                <span class="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                            @else
                                <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">Disabled</span>
                            @endif
                        </td>
                        <td class="py-3 text-gray-400">{{ $company->created_at->format('M d, Y') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    </div>
    @endif
</div>
@endsection

