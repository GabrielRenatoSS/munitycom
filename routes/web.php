<?php

use App\Http\Controllers\UserController;
use App\Http\Controllers\PublicationController;
use App\Http\Controllers\AwardController;
use App\Http\Controllers\FollowerController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\PasswordResetController;
use App\Http\Controllers\EdicaoController;
use App\Http\Controllers\MembroComiteController;
use App\Http\Controllers\SpottedController;
use App\Http\Controllers\DocumentoController;
use App\Http\Controllers\FeedbackController;
use App\Http\Controllers\NotificacaoController;
use App\Http\Controllers\ComentarioController;
use App\Http\Controllers\LikeController;
use App\Http\Controllers\InterestController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\ResetPasswordController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

Route::middleware('guest')->group(function () {
    Route::get('/login', [LoginController::class, 'create'])->name('login');
    Route::post('/login', [LoginController::class, 'authenticate']);
    
    Route::get('/forgot-password', [ForgotPasswordController::class, 'show'])->name('forgot-password.show');
    Route::post('/forgot-password', [ForgotPasswordController::class, 'send'])->name('forgot-password.send');
    Route::get('/verify-code', [ResetPasswordController::class, 'showCode'])->name('verify-code.show');
    Route::post('/verify-code', [ResetPasswordController::class, 'verifyCode'])->name('verify-code.verify');
    Route::get('/reset-password', [ResetPasswordController::class, 'showReset'])->name('reset-password.show');
    Route::post('/reset-password', [ResetPasswordController::class, 'reset'])->name('reset-password.reset');
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

    Route::post('/spotteds', [SpottedController::class, 'store'])->name('spotteds.store');
    Route::resource('documentos', DocumentoController::class)->except(['index']);

    Route::get('/feedback/create', [FeedbackController::class, 'create'])->name('feedback.create');
    Route::post('/feedback', [FeedbackController::class, 'store'])->name('feedback.store');

    Route::post('/comentarios', [ComentarioController::class, 'store'])->name('comentarios.store');
    Route::delete('/comentarios/{comentario}', [ComentarioController::class, 'destroy'])->name('comentarios.destroy');

    Route::patch('/publications/{publication}/favorito', [PublicationController::class, 'toggleFavorito'])->name('publications.favorito');
    Route::patch('/publications/{publication}/fixo', [PublicationController::class, 'toggleFixo'])->name('publications.fixo');
    Route::get('/ranking', [UserController::class, 'ranking'])->name('users.ranking');
    Route::get('/favoritos', [PublicationController::class, 'favoritos'])->name('publications.favoritos');
    Route::get('/notificacoes', [NotificacaoController::class, 'index'])->name('notificacoes.index');

    Route::middleware('admin')->group(function () {
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        
        Route::patch('/users/{user}/bloqueio', [UserController::class, 'toggleBloqueio'])->name('users.bloqueio');

        Route::patch('/feedback/{feedback}/leitura', [FeedbackController::class, 'toggleLeitura'])->name('feedback.leitura');
        Route::get('/feedback', [FeedbackController::class, 'index'])->name('feedback.index');
        Route::patch('/feedback/{feedback}/leitura', [FeedbackController::class, 'toggleLeitura'])->name('feedback.leitura');
    });
});