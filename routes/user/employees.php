<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::resource("employees", UserController::class);