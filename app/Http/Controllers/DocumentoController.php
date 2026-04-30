<?php

namespace App\Http\Controllers;

use App\Models\Documento;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DocumentoController extends Controller
{

    public function create()
    {
        return Inertia::render('Documento/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $rules = [
            'tipo'      => 'required|integer|between:0,7',
            'conteudo'  => 'required|string',
            'comite_id' => 'required|exists:comites,id',
        ];

        // Patrocinadores/signatários vindos do front (tipos 1,3,4,6)
        if (in_array($request->tipo, [1, 3, 4])) {
            $rules['patrocinadores']   = 'nullable|array';
            $rules['patrocinadores.*'] = 'exists:users,username';
            $rules['signatarios']      = 'nullable|array';
            $rules['signatarios.*']    = 'exists:users,username';
        }

        if ($request->tipo == 6) {
            $rules['signatarios']      = 'nullable|array';
            $rules['signatarios.*']    = 'exists:users,username';
        }

        if ($request->tipo == 0) {
            $rules['brasao'] = 'required|image';
        }

        if ($request->tipo == 7) {
            $rules['foto1'] = 'required|image';
            $rules['foto2'] = 'nullable|image';
            $rules['foto3'] = 'nullable|image';
            $rules['foto4'] = 'nullable|image';
        }

        $validated = $request->validate($rules);

        $data = [
            'tipo'      => $validated['tipo'],
            'conteudo'  => $validated['conteudo'],
            'comite_id' => $validated['comite_id'],
        ];

        if ($request->tipo == 0 && $request->hasFile('brasao')) {
            $data['brasao'] = $request->file('brasao')->store('fotos_brasao', 'public');
        }

        if ($request->tipo == 7) {
            foreach (['foto1', 'foto2', 'foto3', 'foto4'] as $index => $foto) {
                if ($request->hasFile($foto)) {
                    $numero = $index + 1;
                    $data[$foto] = $request->file($foto)->storeAs(
                        'fotos_noticias',
                        "{$numero}_" . time() . '_' . $request->file($foto)->getClientOriginalName(),
                        'public'
                    );
                }
            }
        }

        $documento = Documento::create($data);

        // Tipos 0 e 7: patrocinador é o próprio usuário autenticado
        if (in_array($request->tipo, [0, 7])) {
            $membro = MembroComite::where('user_id', Auth::id())
                ->where('comite_id', $documento->comite_id)
                ->firstOrFail();

            Patrocinador::create([
                'documento_id' => $documento->id,
                'delegado_id'  => $membro->id,
            ]);
        }

        // Tipos 1, 3, 4: patrocinadores e signatários do front
        if (in_array($request->tipo, [1, 3, 4])) {
            foreach ($request->patrocinadores ?? [] as $username) {
                $membro = MembroComite::whereHas('user', fn($q) => $q->where('username', $username))
                    ->where('comite_id', $documento->comite_id)
                    ->firstOrFail();

                Patrocinador::create([
                    'documento_id' => $documento->id,
                    'delegado_id'  => $membro->id,
                ]);
            }
        }

        // Tipos 1, 3, 4 e 6: signatários do front
        if (in_array($request->tipo, [1, 3, 4, 6])) {
            foreach ($request->signatarios ?? [] as $username) {
                $membro = MembroComite::whereHas('user', fn($q) => $q->where('username', $username))
                    ->where('comite_id', $documento->comite_id)
                    ->firstOrFail();

                Signatario::create([
                    'documento_id' => $documento->id,
                    'delegado_id'  => $membro->id,
                ]);
            }
        }

        return redirect()->back()->with('success', 'Documento criado!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Documento $documento)
    {
        $documento->load([
            'patrocinadores.delegado:id,delegacao',
            'signatarios.delegado:id,delegacao',
        ]);

        $patrocinadores = $documento->patrocinadores->isNotEmpty()
            ? $documento->patrocinadores->map(fn($p) => $p->delegado->delegacao)
            : null;

        $signatarios = $documento->signatarios->isNotEmpty()
            ? $documento->signatarios->map(fn($s) => $s->delegado->delegacao)
            : null;

        return Inertia::render('Documentos/Show', [
            'documento' => [
                'tipo'          => $documento->tipo,
                'conteudo'      => $documento->conteudo,
                'brasao' => $documento->brasao ? Storage::url($documento->brasao) : null,
                'foto1'  => $documento->foto1  ? Storage::url($documento->foto1)  : null,
                'foto2'  => $documento->foto2  ? Storage::url($documento->foto2)  : null,
                'foto3'  => $documento->foto3  ? Storage::url($documento->foto3)  : null,
                'foto4'  => $documento->foto4  ? Storage::url($documento->foto4)  : null,
                'patrocinadores' => $patrocinadores,
                'signatarios'   => $signatarios,
            ],
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Documento $documento)
    {
        $this->authorize('update', $documento);

        $documento->load([
            'patrocinadores.delegado:id,delegacao',
            'signatarios.delegado:id,delegacao',
        ]);

        $patrocinadores = $documento->patrocinadores->isNotEmpty()
            ? $documento->patrocinadores->map(fn($p) => $p->delegado->delegacao)
            : null;

        $signatarios = $documento->signatarios->isNotEmpty()
            ? $documento->signatarios->map(fn($s) => $s->delegado->delegacao)
            : null;

        return Inertia::render('Documentos/Edit', [
            'documento' => [
                'id'            => $documento->id,
                'tipo'          => $documento->tipo,
                'conteudo'      => $documento->conteudo,
                'brasao' => $documento->brasao ? Storage::url($documento->brasao) : null,
                'foto1'  => $documento->foto1  ? Storage::url($documento->foto1)  : null,
                'foto2'  => $documento->foto2  ? Storage::url($documento->foto2)  : null,
                'foto3'  => $documento->foto3  ? Storage::url($documento->foto3)  : null,
                'foto4'  => $documento->foto4  ? Storage::url($documento->foto4)  : null,
                'patrocinadores' => $patrocinadores,
                'signatarios'   => $signatarios,
            ],
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Documento $documento)
    {
        $this->authorize('update', $documento);

        $rules = [
            'conteudo' => 'required|string',
        ];

        if (in_array($documento->tipo, [1, 3, 4])) {
            $rules['patrocinadores']   = 'nullable|array';
            $rules['patrocinadores.*'] = 'exists:users,username';
            $rules['signatarios']      = 'nullable|array';
            $rules['signatarios.*']    = 'exists:users,username';
        }

        if ($documento->tipo == 6) {
            $rules['signatarios']      = 'nullable|array';
            $rules['signatarios.*']    = 'exists:users,username';
        }

        if ($documento->tipo == 0) {
            $rules['brasao'] = 'nullable|image';
        }

        if ($documento->tipo == 7) {
            $rules['foto1'] = 'nullable|image';
            $rules['foto2'] = 'nullable|image';
            $rules['foto3'] = 'nullable|image';
            $rules['foto4'] = 'nullable|image';
        }

        $validated = $request->validate($rules);

        $data = ['conteudo' => $validated['conteudo']];

        if ($documento->tipo == 0 && $request->hasFile('brasao')) {
            Storage::disk('public')->delete($documento->brasao);
            $data['brasao'] = $request->file('brasao')->store('fotos_brasao', 'public');
        }

        if ($documento->tipo == 7) {
            foreach (['foto1', 'foto2', 'foto3', 'foto4'] as $index => $foto) {
                if ($request->hasFile($foto)) {
                    // substituiu: apaga a antiga e salva a nova
                    Storage::disk('public')->delete($documento->$foto);
                    $numero = $index + 1;
                    $data[$foto] = $request->file($foto)->storeAs(
                        'fotos_noticias',
                        "{$numero}_" . time() . '_' . $request->file($foto)->getClientOriginalName(),
                        'public'
                    );
                } elseif ($request->input("remover_{$foto}")) {
                    // sinalizou remoção sem substituição: apaga e seta null
                    Storage::disk('public')->delete($documento->$foto);
                    $data[$foto] = null;
                }
                // se não veio nada, mantém como está
            }
        }

        $documento->update($data);

        // Atualiza patrocinadores
        if (in_array($documento->tipo, [1, 3, 4])) {
            $documento->patrocinadores()->delete();

            foreach ($request->patrocinadores ?? [] as $username) {
                $membro = MembroComite::whereHas('user', fn($q) => $q->where('username', $username))
                    ->where('comite_id', $documento->comite_id)
                    ->firstOrFail();

                Patrocinador::create([
                    'documento_id' => $documento->id,
                    'delegado_id'  => $membro->id,
                ]);
            }
        }

        // Atualiza signatários
        if (in_array($documento->tipo, [1, 3, 4, 6])) {
            $documento->signatarios()->delete();

            foreach ($request->signatarios ?? [] as $username) {
                $membro = MembroComite::whereHas('user', fn($q) => $q->where('username', $username))
                    ->where('comite_id', $documento->comite_id)
                    ->firstOrFail();

                Signatario::create([
                    'documento_id' => $documento->id,
                    'delegado_id'  => $membro->id,
                ]);
            }
        }

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Documento $documento)
    {
        $this->authorize('delete', $documento);

        if ($documento->brasao) {
            Storage::disk('public')->delete($documento->brasao);
        }

        foreach (['foto1', 'foto2', 'foto3', 'foto4'] as $foto) {
            if ($documento->$foto) {
                Storage::disk('public')->delete($documento->$foto);
            }
        }

        $documento->delete();

        return redirect()->back();
    }
}
