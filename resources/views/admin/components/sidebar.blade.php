<aside class="w-64 bg-gray-900 border-r border-gray-800">
    <div class="p-6">
        <h2 class="text-lg font-bold text-white mb-6">Super Admin</h2>
        
        <nav class="space-y-2">
            <a href="{{ route('admin.dashboard') }}" 
               class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg {{ request()->routeIs('admin.dashboard') ? 'bg-gray-800 text-white' : '' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                </svg>
                Dashboard
            </a>

            <a href="{{ route('admin.companies.index') }}" 
               class="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 rounded-lg {{ request()->routeIs('admin.companies.*') ? 'bg-gray-800 text-white' : '' }}">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
                </svg>
                Companies
            </a>
        </nav>
    </div>
</aside>

