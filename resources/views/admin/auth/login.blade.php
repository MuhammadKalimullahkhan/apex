<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Super Admin Login - {{ config('app.name') }}</title>

    <link rel="preconnect" href="https://fonts.bunny.net">
    <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />

    @vite(['resources/css/app.css'])

    <style>
        body {
            min-height: 100vh;
            background-color: oklch(0.145 0 0);
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body class="font-sans antialiased">
    <div class="w-full max-w-md">
        <div class="bg-gray-800 rounded-lg p-8 shadow-lg">
            <h1 class="text-2xl font-bold text-white mb-2 text-center">Super Admin</h1>
            <p class="text-gray-400 text-center mb-6">Sign in to your account</p>

            @if($errors->any())
                <div class="mb-4 p-4 bg-red-500 text-white rounded-lg">
                    @foreach($errors->all() as $error)
                        <p>{{ $error }}</p>
                    @endforeach
                </div>
            @endif

            <form method="POST" action="{{ route('admin.login') }}" class="space-y-4">
                @csrf

                <div>
                    <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
                        Email
                    </label>
                    <input type="email"
                           id="email"
                           name="email"
                           value="{{ old('email') }}"
                           required
                           autofocus
                           class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div>
                    <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
                        Password
                    </label>
                    <input type="password"
                           id="password"
                           name="password"
                           required
                           class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>

                <div class="flex items-center">
                    <input type="checkbox" id="remember" name="remember" class="w-4 h-4 bg-gray-700 border-gray-600 rounded">
                    <label for="remember" class="ml-2 text-sm text-gray-300">
                        Remember me
                    </label>
                </div>

                <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-medium">
                    Sign In
                </button>
            </form>
        </div>
    </div>
</body>
</html>

