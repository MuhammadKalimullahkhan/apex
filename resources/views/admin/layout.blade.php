<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }} - Super Admin</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    <!-- Vite -->
    @vite(['resources/css/app.css'])

    <style>
        @layer components {
            .admin-container {
                min-height: 100vh;
                background-color: oklch(0.145 0 0);
            }
        }
    </style>
</head>
<body class="font-sans antialiased admin-container">
    <div class="flex h-screen">
        <!-- Sidebar -->
        @include('admin.components.sidebar')

        <!-- Main Content -->
        <main class="flex-1 overflow-auto">
            <!-- Header -->
            <header class="sticky top-0 z-50 bg-gray-900 border-b border-gray-800">
                <div class="flex items-center justify-between px-8 py-4">
                    <h1 class="text-xl font-semibold text-white">@yield('title', 'Dashboard')</h1>
                    <div class="flex items-center gap-4">
                        <a href="{{ route('dashboard') }}" class="text-gray-400 hover:text-white text-sm">
                            Back to App
                        </a>
                        <form method="POST" action="{{ route('admin.logout') }}">
                            @csrf
                            <button type="submit" class="text-gray-400 hover:text-white text-sm">
                                Logout
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <!-- Content Area -->
            <div class="p-8">
                <!-- Flash Messages -->
                @if(session('success'))
                    <div class="mb-4 p-4 bg-green-500 text-white rounded-lg">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-4 p-4 bg-red-500 text-white rounded-lg">
                        {{ session('error') }}
                    </div>
                @endif

                @if($errors->any())
                    <div class="mb-4 p-4 bg-red-500 text-white rounded-lg">
                        <ul class="list-disc list-inside">
                            @foreach($errors->all() as $error)
                                <li>{{ $error }}</li>
                            @endforeach
                        </ul>
                    </div>
                @endif

                @yield('content')
            </div>
        </main>
    </div>
</body>
</html>

