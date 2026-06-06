<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;

Route::get('/teste', function () {
    return response()->json([
        'mensagem' => 'API funcionando 🚀'
    ]);
});
