<?php

namespace App\Http\Controllers;

use App\Models\Spotted;
use Illuminate\Http\Request;

class SpottedController extends Controller
{
    public function create()
    {
        $user = Auth::user();

        return Inertia::render('Spotted/Create', [
            'can_anonimo' => $user->progresso >= 4,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        if ($request->anonimo && $user->progresso < 4) {
            abort(403);
        }

        $dados = $request->validate([
            'tipo'            => 'required|boolean',
            'mensagem'        => 'required|string|max:255',
            'destinatario_id' => 'required|exists:membro_comites,id',
            'comite_id'       => 'required|exists:comites,id',
            'anonimo'         => 'nullable|boolean',
        ]);

        $remetente = MembroComite::where('user_id', $user->id)
            ->where('comite_id', $dados['comite_id'])
            ->firstOrFail();

        $dados['anonimo']      = $request->boolean('anonimo', false);
        $dados['remetente_id'] = $remetente->id;

        Spotted::create($dados);

        return redirect()->back()->with('success', 'Spotted enviado!');
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
