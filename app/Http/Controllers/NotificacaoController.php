<?php

namespace App\Http\Controllers;

use App\Models\Notificacao;
use Illuminate\Support\Facades\Auth;

class NotificacaoController extends Controller
{
    public function index()
    {
        $userId = Auth::id();

        $notificacoes = Notificacao::where('user_id', $userId)
            ->with([
                'like.user:id,username,foto',
                'comentario.user:id,username,foto',
                'follower.follower:id,username,foto',
                'spotted.remetente.user:id,username,foto',
            ])
            ->latest()
            ->paginate(10);

        $items = collect($notificacoes->items())->map(function ($n) use ($userId) {
            $remetente = match ((int) $n->tipo) {
                0 => $n->like?->user,
                1 => $n->comentario?->user,
                2 => $n->follower?->follower,
                3 => $n->spotted?->remetente?->user,
                default => null,
            };

            $result = [
                'id'        => $n->id,
                'tipo'      => $n->tipo,
                'leitura'   => $n->leitura,
                'remetente' => $remetente
                    ? ['id' => $remetente->id, 'username' => $remetente->username, 'foto' => $remetente->foto]
                    : null,
            ];

            if ((int) $n->tipo === 2 && $remetente) {
                $jaSegue = \App\Models\Follower::where('follower_id', $userId)
                    ->where('following_id', $remetente->id)
                    ->exists();
                $result['follower'] = ['ja_segue_de_volta' => $jaSegue];
            }

            if ((int) $n->tipo === 1) {
                $result['comentario'] = ['texto' => $n->comentario?->texto];
            }

            if ((int) $n->tipo === 3) {
                $result['spotted'] = [
                    'mensagem' => $n->spotted?->mensagem,
                    'anonimo'  => (bool) $n->spotted?->anonimo,
                ];
            }

            return $result;
        });

        return response()->json([
            'notificacoes' => array_merge($notificacoes->toArray(), ['data' => $items]),
        ]);
    }
}
