<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MembroComite;  
use Illuminate\Support\Facades\Auth;
use App\Models\Comite;  
use App\Models\User;
use App\Models\Edicao;
use Inertia\Inertia;

class MembroComiteController extends Controller
{
    public function index(Comite $comite) 
    {
        $comite->load('edicao');
        $canEdit = auth()->check() && ($comite->edicao->user_id === auth()->id());

        $membros = $comite->membros()
            ->with('user:id,username,foto')
            ->get()
            ->map(function ($membro) {
                return [
                    'id' => $membro->id,
                    'delegacao' => $membro->delegacao,
                    'username' => $membro->user->username,
                    'foto' => $membro->user->foto 
                        ? asset('storage/' . $membro->user->foto) 
                        : asset('fotos_usuarios/foto.png'),
                ];
            });

        return Inertia::render('Membros/Index', [
            'comite' => [
                'id' => $comite->id,
                'name' => $comite->name,
                'edicao_name' => $comite->edicao->name
            ],
            'membros' => $membros,
            'can_edit' => $canEdit
        ]);
    }

    public function store(Request $request, Comite $comite)
    {
        $comite->load('edicao');
        if ($comite->edicao->user_id !== auth()->id()) {
            abort(403, 'Você não tem permissão para gerenciar este comitê.');
        }

        $validated = $request->validate([
            'username'  => 'required|string|exists:users,username',
            'delegacao' => 'required|string|max:255',
        ], [
            'username.exists' => 'Usuário não encontrado no sistema.',
        ]);

        $user = User::where('username', $validated['username'])->first();

        $jaCadastrado = $comite->membros()
            ->where('user_id', $user->id)
            ->exists();

        if ($jaCadastrado) {
            return back()->withErrors(['username' => 'Este usuário já é membro deste comitê.']);
        }

        $comite->membros()->create([
            'user_id'   => $user->id,
            'delegacao' => $validated['delegacao']
        ]);

        return back()->with('message', "{$user->name} adicionado como {$validated['delegacao']}!");
    }

    public function update(Request $request, MembroComite $membro)
    {
        if ($membro->comite->edicao->user_id !== auth()->id()) {
            abort(403, 'Ação não autorizada.');
        }

        $validated = $request->validate([
            'username'  => 'required|string|exists:users,username',
            'delegacao' => 'required|string|max:255',
        ]);

        $user = User::where('username', $validated['username'])->first();

        $jaExiste = MembroComite::where('comite_id', $membro->comite_id)
            ->where('user_id', $user->id)
            ->where('id', '!=', $membro->id)
            ->exists();

        if ($jaExiste) {
            return back()->withErrors(['username' => 'Este usuário já está alocado neste comitê.']);
        }

        $membro->update([
            'user_id'   => $user->id,
            'delegacao' => $validated['delegacao']
        ]);

        return back();
    }

    public function destroy(MembroComite $membro)
    {
        $membro->load('comite.edicao');
        
        if ($membro->comite->edicao->user_id !== auth()->id()) {
            abort(403, 'Você não tem permissão para remover este membro.');
        }

        $membro->delete();

        return back();
    }
}
