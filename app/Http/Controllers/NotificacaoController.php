<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Notificacao;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class NotificacaoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $notificacoes = Notificacao::where('user_id', $userId)
            ->latest()
            ->paginate(10);

        Notificacao::where('user_id', $userId)
            ->where('leitura', false)
            ->update(['leitura' => true]);

        return Inertia::render('Notificacoes/Index', [
            'notificacoes' => $notificacoes,
        ]);
    }
}
