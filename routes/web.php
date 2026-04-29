<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\AwardController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\EdicaoController;
use App\Http\Controllers\MembroComiteController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'authenticate']);
    
    Route::get('forgot-password', [PasswordResetController::class, 'create'])->name('password.request');
    Route::post('forgot-password', [PasswordResetController::class, 'store'])->name('password.email');
    Route::get('reset-password/{token}', [PasswordResetController::class, 'edit'])->name('password.reset');
    Route::post('reset-password', [PasswordResetController::class, 'update'])->name('password.update');
});

Route::middleware('auth')->group(function () {
    
    Route::post('/logout', [LoginController::class, 'logout'])->name('logout');

    Route::get('/feed', function () {
        return Inertia::render('Feed');
    })->name('feed');

    Route::get('/profile/{username}', [UserController::class, 'show'])->name('profile.show');
    Route::delete('/profile', [UserController::class, 'destroy'])->name('profile.destroy');
    
    Route::get('/discover/muns', [UserController::class, 'discoverMuns'])->name('users.discover');

    Route::resource('publications', PublicationController::class);
    Route::resource('awards', AwardController::class);

    Route::post('/followers/toggle', [FollowerController::class, 'toggle'])->name('followers.toggle');
    Route::delete('/followers/remove', [FollowerController::class, 'removeFollower'])->name('followers.remove');

    Route::post('/interests/toggle', [InterestController::class, 'toggle'])->name('interests.toggle');

    Route::get('/users/search', [UserController::class, 'search'])->name('users.search');

    Route::post('/posts/{post}/like', [LikeController::class, 'toggle'])->name('posts.like');
    
    Route::get('/edicoes/create', [EdicaoController::class, 'create'])->name('edicoes.create');
    Route::post('/edicoes', [EdicaoController::class, 'store'])->name('edicoes.store');
    Route::get('/edicoes/{username?}', [EdicaoController::class, 'index'])->name('edicoes.index');
    Route::get('/{edicao}/detalhes', [EdicaoController::class, 'show'])->name('edicoes.show');
    Route::get('/{edicao}/edit', [EdicaoController::class, 'edit'])->name('edicoes.edit');
    Route::put('/{edicao}', [EdicaoController::class, 'update'])->name('edicoes.update');
    Route::delete('/{edicao}', [EdicaoController::class, 'destroy'])->name('edicoes.destroy');

    Route::get('/comites/{comite}/membros', [MembroComiteController::class, 'index'])->name('comites.membros.index');
    Route::post('/comites/{comite}/membros', [MembroComiteController::class, 'store'])->name('membros.store');
    Route::put('/membros/{membro}', [MembroComiteController::class, 'update'])->name('membros.update');
    Route::delete('/membros/{membro}', [MembroComiteController::class, 'destroy'])->name('membros.destroy');

    Route::prefix('users/{user}')->group(function () {
        Route::get('/following', [FollowerController::class, 'following'])->name('users.following');
        Route::get('/followers', [FollowerController::class, 'followers'])->name('users.followers');
        Route::get('/friends', [FollowerController::class, 'friends'])->name('users.friends');
    });
});