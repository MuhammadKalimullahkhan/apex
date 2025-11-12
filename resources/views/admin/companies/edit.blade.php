@extends('admin.layout')

@section('title', 'Edit Company')

@section('content')
<div class="max-w-2xl">
    <h2 class="text-2xl font-bold text-white mb-6">Edit Company</h2>

    <form method="POST" action="{{ route('admin.companies.update', $company) }}" class="bg-gray-800 rounded-lg p-6 space-y-6">
        @csrf
        @method('PUT')

        <div>
            <label for="company_name" class="block text-sm font-medium text-gray-300 mb-2">
                Company Name <span class="text-red-500">*</span>
            </label>
            <input type="text" 
                   id="company_name" 
                   name="company_name" 
                   value="{{ old('company_name', $company->company_name) }}"
                   class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                   required>
            @error('company_name')
                <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="business_email" class="block text-sm font-medium text-gray-300 mb-2">
                Business Email <span class="text-red-500">*</span>
            </label>
            <input type="email" 
                   id="business_email" 
                   name="business_email" 
                   value="{{ old('business_email', $company->business_email) }}"
                   class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                   required>
            @error('business_email')
                <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="registration_number" class="block text-sm font-medium text-gray-300 mb-2">
                Registration Number
            </label>
            <input type="text" 
                   id="registration_number" 
                   name="registration_number" 
                   value="{{ old('registration_number', $company->registration_number) }}"
                   class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            @error('registration_number')
                <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="location" class="block text-sm font-medium text-gray-300 mb-2">
                Location
            </label>
            <input type="text" 
                   id="location" 
                   name="location" 
                   value="{{ old('location', $company->location) }}"
                   class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            @error('location')
                <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="website" class="block text-sm font-medium text-gray-300 mb-2">
                Website
            </label>
            <input type="url" 
                   id="website" 
                   name="website" 
                   value="{{ old('website', $company->website) }}"
                   class="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
            @error('website')
                <p class="mt-1 text-sm text-red-500">{{ $message }}</p>
            @enderror
        </div>

        <div class="flex items-center">
            <input type="checkbox" 
                   id="is_enabled" 
                   name="is_enabled" 
                   value="1"
                   {{ old('is_enabled', $company->is_enabled) ? 'checked' : '' }}
                   class="w-4 h-4 bg-gray-700 border-gray-600 rounded">
            <label for="is_enabled" class="ml-2 text-sm text-gray-300">
                Company is enabled
            </label>
        </div>

        <div class="flex items-center gap-4">
            <button type="submit" 
                    class="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg">
                Update Company
            </button>
            <a href="{{ route('admin.companies.index') }}" 
               class="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg">
                Cancel
            </a>
        </div>
    </form>
</div>
@endsection

