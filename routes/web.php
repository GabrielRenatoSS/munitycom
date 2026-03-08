<?php

use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::resource('users', UserController::class);

Route::get('/', function () {
    return Inertia::render('Welcome');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login');
})->name('login');

Route::post('/login', [LoginController::class, 'authenticate']);

Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');

Route::get('reset-password/{token}', [PasswordResetController::class, 'edit'])->name('password.reset');
Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.update');

Route::middleware('auth')->group(function () {
    Route::get('/feed', function () {
        return Inertia::render('Feed');
    })->name('feed');

    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::get('/profile/{id}', [UserController::class, 'show'])->name('profile.show');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');

    Route::resource('publications', PublicationController::class);

    Route::resource('awards', AwardController::class);
});