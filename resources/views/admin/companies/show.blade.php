@extends('admin.layout')

@section('title', 'Company Details')

@section('content')
<div class="space-y-6">
    <div class="flex items-center justify-between">
        <h2 class="text-2xl font-bold text-white">{{ $company->company_name }}</h2>
        <div class="flex items-center gap-4">
            <a href="{{ route('admin.companies.edit', $company) }}" 
               class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Edit
            </a>
            @if($company->is_enabled)
                <form method="POST" action="{{ route('admin.companies.disable', $company) }}" class="inline">
                    @csrf
                    <button type="submit" 
                            onclick="return confirm('Are you sure you want to disable this company? All users will be logged out.')"
                            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
                        Disable Company
                    </button>
                </form>
            @else
                <form method="POST" action="{{ route('admin.companies.enable', $company) }}" class="inline">
                    @csrf
                    <button type="submit" class="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg">
                        Enable Company
                    </button>
                </form>
            @endif
        </div>
    </div>

    <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Company Information</h3>
        <dl class="grid grid-cols-2 gap-4">
            <div>
                <dt class="text-sm text-gray-400">Company Name</dt>
                <dd class="text-white">{{ $company->company_name }}</dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Email</dt>
                <dd class="text-white">{{ $company->business_email }}</dd>
            </div>
            @if($company->registration_number)
            <div>
                <dt class="text-sm text-gray-400">Registration Number</dt>
                <dd class="text-white">{{ $company->registration_number }}</dd>
            </div>
            @endif
            @if($company->location)
            <div>
                <dt class="text-sm text-gray-400">Location</dt>
                <dd class="text-white">{{ $company->location }}</dd>
            </div>
            @endif
            @if($company->website)
            <div>
                <dt class="text-sm text-gray-400">Website</dt>
                <dd class="text-white">
                    <a href="{{ $company->website }}" target="_blank" class="text-blue-500 hover:text-blue-400">
                        {{ $company->website }}
                    </a>
                </dd>
            </div>
            @endif
            <div>
                <dt class="text-sm text-gray-400">Status</dt>
                <dd>
                    @if($company->is_enabled)
                        <span class="px-2 py-1 bg-green-500 text-white text-xs rounded">Active</span>
                    @else
                        <span class="px-2 py-1 bg-red-500 text-white text-xs rounded">Disabled</span>
                    @endif
                </dd>
            </div>
            <div>
                <dt class="text-sm text-gray-400">Created At</dt>
                <dd class="text-white">{{ $company->created_at->format('M d, Y') }}</dd>
            </div>
        </dl>
    </div>

    <!-- Users -->
    <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Users ({{ $company->users->count() }})</h3>
        @if($company->users->count() > 0)
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-gray-400 text-sm border-b border-gray-700">
                        <th class="pb-3">Name</th>
                        <th class="pb-3">Email</th>
                        <th class="pb-3">Role</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($company->users as $user)
                    <tr class="border-b border-gray-700">
                        <td class="py-3 text-white">{{ $user->name }}</td>
                        <td class="py-3 text-gray-400">{{ $user->email }}</td>
                        <td class="py-3 text-gray-400">{{ $user->role?->role_name ?? 'N/A' }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @else
        <p class="text-gray-400">No users in this company yet.</p>
        @endif
    </div>

    <!-- Projects -->
    <div class="bg-gray-800 rounded-lg p-6">
        <h3 class="text-lg font-semibold text-white mb-4">Projects ({{ $company->projects->count() }})</h3>
        @if($company->projects->count() > 0)
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-gray-400 text-sm border-b border-gray-700">
                        <th class="pb-3">Project Name</th>
                        <th class="pb-3">Status</th>
                        <th class="pb-3">Created</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($company->projects as $project)
                    <tr class="border-b border-gray-700">
                        <td class="py-3 text-white">{{ $project->name ?? 'N/A' }}</td>
                        <td class="py-3 text-gray-400">{{ $project->status?->status_name ?? 'N/A' }}</td>
                        <td class="py-3 text-gray-400">{{ $project->created_at->format('M d, Y') }}</td>
                    </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
        @else
        <p class="text-gray-400">No projects in this company yet.</p>
        @endif
    </div>
</div>
@endsection

