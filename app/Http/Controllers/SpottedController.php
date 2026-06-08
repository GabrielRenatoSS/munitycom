<?php

namespace App\Http\Controllers;

use App\Models\Spotted;
use Illuminate\Http\Request;
use App\Models\MembroComite;
use App\Models\Notificacao;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SpottedController extends Controller
{
    public function create(Request $request)
    {
        $user = Auth::user();

        $request->validate([
            'comite_id' => 'required|exists:comites,id',
        ]);

        $comite = \App\Models\Comite::with('edicao.user')->findOrFail($request->comite_id);

        return Inertia::render('Spotted/Create', [
            'can_anonimo'  => $user->progresso >= 4,
            'comite_id'    => (int) $request->comite_id,
            'edicao_id'    => (int) $comite->edicao->id,  // busca aqui
            'mun_username' => $comite->edicao->user->username,
        ]);
    }
    
    public function store(Request $request)
    {
        $user = Auth::user();
    
        if ($request->anonimo && $user->progresso < 4) {
            abort(403);
        }
    
        $request->validate([
            'username_destinatario' => 'required|string|exists:users,username',
            'mensagem'              => 'required|string|max:255',
            'tipo'                  => 'required|in:0,1',
            'comite_id'             => 'required|integer|exists:comites,id',
            'anonimo'               => 'nullable|in:0,1',
        ]);
    
        $comite = \App\Models\Comite::with('edicao.user')->findOrFail($request->comite_id);
    
        $destinatarioUser = User::where('username', $request->username_destinatario)->firstOrFail();
    
        $destinatarioMembro = MembroComite::where('user_id', $destinatarioUser->id)
            ->where('comite_id', $request->comite_id)
            ->first();
    
        if (!$destinatarioMembro) {
            return back()->withErrors([
                'username_destinatario' => 'Este usuário não é membro do comitê selecionado.',
            ]);
        }
    
        $remetente = MembroComite::where('user_id', $user->id)
            ->where('comite_id', $request->comite_id)
            ->first();
    
        if (!$remetente) {
            return back()->withErrors([
                'username_destinatario' => 'Você não é membro deste comitê.',
            ]);
        }
    
        $spotted = Spotted::create([
            'tipo'            => $request->tipo,
            'mensagem'        => $request->mensagem,
            'destinatario_id' => $destinatarioMembro->id,
            'comite_id'       => $request->comite_id,
            'anonimo'         => $request->boolean('anonimo', false),
            'remetente_id'    => $remetente->id,
        ]);
    
        Notificacao::create([
            'user_id'    => $destinatarioUser->id,
            'spotted_id' => $spotted->id,
            'tipo'       => 3,
            'leitura'    => false,
        ]);
    
        return redirect()->route('profile.show', [
            'username'  => $comite->edicao->user->username,
            'comite_id' => $spotted->comite_id,
            'edicao_id' => $comite->edicao->id,
        ]);
    }

    /**
     * Display the specified resource.
     */
    public function show(Spotted $spotted)
    {
        $spotted->load('destinatario:id,delegacao');

        if (!$spotted->anonimo) {
            $spotted->load('remetente:id,delegacao');
        }

        return Inertia::render('Spotteds/Show', [
            'spotted' => $spotted,
        ]);
    }
}
