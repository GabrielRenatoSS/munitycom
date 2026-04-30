<?php

namespace App\Http\Controllers;

use App\Models\Spotted;
use Illuminate\Http\Request;

class SpottedController extends Controller
{
    public function create()
    {
        return Inertia::render('Spotted/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $dados = $request->validate([
            'tipo'            => 'required|boolean',
            'mensagem'        => 'required|string|max:255',
            'remetente_id'    => 'required|exists:membro_comites,id',
            'destinatario_id' => 'required|exists:membro_comites,id',
            'anonimo'         => 'nullable|boolean',
        ]);

        $dados['anonimo'] = $request->boolean('anonimo', false);
        $spotted = Spotted::create($dados);

        return redirect()->back();
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
