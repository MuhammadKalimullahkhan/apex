@extends('admin.layout')

@section('title', 'Companies Management')

@section('content')
<div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">Companies</h2>
        <a href="{{ route('admin.companies.create') }}" 
           class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Add Company
        </a>
    </div>

    <!-- Companies Table -->
    <div class="bg-gray-800 rounded-lg overflow-hidden">
        <table class="w-full">
            <thead class="bg-gray-900">
                <tr>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Company</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Email</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Users</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Projects</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                    <th class="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-700">
                @forelse($companies as $company)
                <tr class="hover:bg-gray-750">
                    <td class="px-6 py-4 text-white">{{ $company->company_name }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ $company->business_email }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ $company->users_count }}</td>
                    <td class="px-6 py-4 text-gray-400">{{ $company->projects_count }}</td>
                    <td class="px-6 py-4">
                        @if($company->is_enabled)
                            <span class="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                        @else
                            <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">Disabled</span>
                        @endif
                    </td>
                    <td class="px-6 py-4">
                        <div class="flex items-center gap-2">
                            <a href="{{ route('admin.companies.show', $company) }}" 
                               class="text-blue-500 hover:text-blue-400">
                                View
                            </a>
                            <a href="{{ route('admin.companies.edit', $company) }}" 
                               class="text-gray-400 hover:text-gray-300">
                                Edit
                            </a>
                            @if($company->is_enabled)
                                <form method="POST" action="{{ route('admin.companies.disable', $company) }}" class="inline">
                                    @csrf
                                    <button type="submit" 
                                            onclick="return confirm('Are you sure you want to disable this company?')"
                                            class="text-red-500 hover:text-red-400">
                                        Disable
                                    </button>
                                </form>
                            @else
                                <form method="POST" action="{{ route('admin.companies.enable', $company) }}" class="inline">
                                    @csrf
                                    <button type="submit" class="text-green-500 hover:text-green-400">
                                        Enable
                                    </button>
                                </form>
                            @endif
                        </div>
                    </td>
                </tr>
                @empty
                <tr>
                    <td colspan="6" class="px-6 py-8 text-center text-gray-400">
                        No companies found. Create your first company.
                    </td>
                </tr>
                @endforelse
            </tbody>
        </table>

        <!-- Pagination -->
        @if($companies->hasPages())
        <div class="px-6 py-4 border-t border-gray-700">
            {{ $companies->links() }}
        </div>
        @endif
    </div>
</div>
@endsection

