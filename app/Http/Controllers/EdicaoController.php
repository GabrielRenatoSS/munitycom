<?php

namespace App\Http\Controllers;

use App\Models\Edicao;
use Illuminate\Http\Request;
use App\Models\User; 
use App\Models\Secretariado;
use App\Models\Comite;  
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class EdicaoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, $username = null)
    {
        if ($username) {
            $user = User::where('username', $username)->firstOrFail();
        } elseif (auth()->check()) {
            $user = auth()->user();
        } else {
            return redirect()->route('login');
        }

        $edicoes = Edicao::where('user_id', $user->id)
            ->latest()
            ->get()
            ->map(function ($edicao) {
                return [
                    'id' => $edicao->id,
                    'name' => $edicao->name,
                    'ano' => $edicao->ano,
                    'dt_inicio' => $edicao->dt_inicio ? \Carbon\Carbon::parse($edicao->dt_inicio)->format('d/m/Y') : null,
                    'dt_termino' => $edicao->dt_termino ? \Carbon\Carbon::parse($edicao->dt_termino)->format('d/m/Y') : null,
                ];
            });

        return Inertia::render('Edicao/Index', [
            'mun' => [
                'username' => $user->username,
                'name' => $user->name,
                'is_me' => auth()->id() === $user->id 
            ],
            'edicoes' => $edicoes,
            'can_manage' => auth()->check() && (auth()->id() === $user->id)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Edicao/Create');
    }

    /**
     * Store a newly created resource in storage.
     */

    //cadastra só na tabela edição, para as outras precisa de update
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name'       => 'required|string|max:255',
            'numero'     => 'required|string|max:50',
            'ano'        => 'required|integer',
            'dt_inicio'  => 'required|date',
            'dt_termino' => 'required|date|after_or_equal:dt_inicio',
        ]);

        Edicao::create([
            'user_id'    => auth()->id(),
            'name'       => $validated['name'],
            'numero'     => $validated['numero'],
            'ano'        => $validated['ano'],
            'dt_inicio'  => $validated['dt_inicio'],
            'dt_termino' => $validated['dt_termino'],
        ]);

        return redirect()->route('edicoes.index');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $edicao = Edicao::with([
            'secretariado.user:id,username,foto',
            'comites'                                 
        ])->where('user_id', auth()->id())->findOrFail($id);

        $formattedEdicao = [
            'id' => $edicao->id,
            'name' => $edicao->name,
            'dt_inicio' => $edicao->dt_inicio ? \Carbon\Carbon::parse($edicao->dt_inicio)->format('d/m/Y') : null,
            'dt_termino' => $edicao->dt_termino ? \Carbon\Carbon::parse($edicao->dt_termino)->format('d/m/Y') : null,

            'secretariado' => $edicao->secretariado->map(fn($membro) => [
                'cargo' => $membro->cargo,
                'username' => $membro->user->username,
                'foto' => $membro->user->foto 
                    ? asset('storage/' . $membro->user->foto) 
                    : '/fotos_usuarios/foto.png',
            ]),

            'comites' => $edicao->comites->map(fn($comite) => [
                'id' => $comite->id,
                'name' => $comite->name,
            ]),
        ];

        return Inertia::render('Edicao/Show', [
            'edicao' => $formattedEdicao
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Edicao $edicao)
    {
        if ($edicao->user_id !== auth()->id()) {
            abort(403, 'Ação não autorizada.');
        }

        $edicao->load([
            'secretariado.user:id,name,username,foto', 
            'comites'
        ]);

        return Inertia::render('Edicao/Edit', [
            'edicao' => [
                'id' => $edicao->id,
                'name' => $edicao->name,
                'numero' => $edicao->numero,
                'ano' => $edicao->ano,
                'dt_inicio' => $edicao->dt_inicio, // Formato Y-m-d para o input date
                'dt_termino' => $edicao->dt_termino,
                'secretariado' => $edicao->secretariado->map(fn($s) => [
                    'id' => $s->id,
                    'user_id' => $s->user_id,
                    'cargo' => $s->cargo,
                    'user_username' => $s->user->username,
                    'user_foto' => $s->user->foto ? asset('storage/'.$s->user->foto) : '/fotos_usuarios/foto.png'
                ]),
                'comites' => $edicao->comites->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                ]),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Edicao $edicao)
    {
        if ($edicao->user_id !== auth()->id()) abort(403);

        $validated = $request->validate([
            'name' => 'required|string',
            'numero' => 'required|string',
            'ano' => 'required|integer',
            'dt_inicio' => 'required|date',
            'dt_termino' => 'required|date',
            
            'secretariado' => 'array',
            'secretariado.*.id' => 'nullable|exists:secretariados,id',
            'secretariado.*.username' => 'required|string|exists:users,username',
            'secretariado.*.cargo' => 'required|string',
            
            'comites' => 'array',
            'comites.*.id' => 'nullable|exists:comites,id',
            'comites.*.name' => 'required|string',
        ]);

        try {
            DB::beginTransaction();

            $edicao->update($request->only('name', 'numero', 'ano', 'dt_inicio', 'dt_termino'));
            $idsRecebidosSecretariado = collect($validated['secretariado'])->pluck('id')->filter()->toArray();
            $edicao->secretariado()->whereNotIn('id', $idsRecebidosSecretariado)->delete();

            foreach ($validated['secretariado'] as $item) {
                $user = User::where('username', $item['username'])->first();
                
                $edicao->secretariado()->updateOrCreate(
                    ['id' => $item['id'] ?? null],
                    [
                        'user_id' => $user->id,
                        'cargo'   => $item['cargo']
                    ]
                );
            }

            $idsRecebidosComites = collect($validated['comites'])->pluck('id')->filter()->toArray();

            $edicao->comites()->whereNotIn('id', $idsRecebidosComites)->delete();

            foreach ($validated['comites'] as $item) {
                $edicao->comites()->updateOrCreate(
                    ['id' => $item['id'] ?? null],
                    ['name' => $item['name']]
                );
            }

            DB::commit();
            return redirect()->route('edicoes.index')->with('message', 'Edição sincronizada com sucesso!');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error("Erro no Update de Edição: " . $e->getMessage());
            return back()->withErrors(['error' => 'Falha ao atualizar dados.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Edicao $edicao)
    {
        if ($edicao->user_id !== auth()->id()) {
            abort(403, 'Você não tem permissão para excluir esta edição.');
        }

        $edicao->delete();
        return redirect()->route('edicoes.index');
    }
}
