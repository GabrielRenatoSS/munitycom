<?php

namespace App\Http\Controllers;

use App\Models\Award;
use Illuminate\Http\Request;
use App\Models\User;
use Inertia\Inertia;

class AwardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Award::whereRaw('1 = 0')->paginate(10);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //cadastro formulário
        return Inertia::render('Award/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'tipo' => 'required|integer',
            'mun' => 'nullable|string|max:100',
            'comite' => 'required|string|max:100',
            'delegation' => 'required|string|max:100',
            'username' => 'nullable|exists:users,username',
        ]);

        $user = auth()->user();

        $awardData = [
            'tipo' => $request->tipo,
            'comite' => $request->comite,
            'delegation' => $request->delegation,
        ];

        if ($user->isMun()) {
            $awardData['user_id'] = User::where('username', $request->username)->first()->id;
            $awardData['mun_id'] = $user->id;
        } else {
            $awardData['user_id'] = $user->id;
            $awardData['mun'] = $request->mun;
        }

        Award::create($awardData);
        return redirect()->route('feed');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $award = Award::with(['user', 'creator'])->findOrFail($id);
        $authId = auth()->id();

        $canEdit = $authId && (
            $authId === $award->user_id || 
            ($award->mun_id && $authId === $award->mun_id)
        );

        $data = [
            'id' => $award->id,
            'name' => $award->name,
            'tipo' => $award->tipo,
            'delegation' => $award->delegation,
            'comite' => $award->comite,
            'user_username' => $award->user->username,
            'user_foto' => $award->user->foto ? asset('storage/' . $award->user->foto) : '/fotos_usuarios/foto.jpg',
            'can_edit' => $canEdit,
        ];

        if ($award->mun_id) {
            $data['mun'] = $award->creator?->name;
        } else {
            $data['mun'] = $award->mun;
        }

        return Inertia::render('Award/Show', ['award' => $data]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //formulário de edição
        $award = Award::findOrFail($id);

        if ($award->user_id !== auth()->id() && $award->mun_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Award/Edit', [
            'award' => [
                'id' => $award->id,
                'name' => $award->name,
                'tipo' => $award->tipo,
                'comite' => $award->comite,
                'delegation' => $award->delegation,
                'mun' => $award->mun,
                'username' => $award->user->username,
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $award = Award::findOrFail($id);
        $user = auth()->user();

        $rules = [
            'name' => 'required|string|max:100',
            'tipo' => 'required|integer',
            'comite' => 'required|string|max:100',
            'delegation' => 'required|string|max:100',
        ];

        if ($user->tipo === 1) {
            $rules['username'] = 'required|exists:users,username';
        } else {
            $rules['mun'] = 'required|string|max:100';
        }

        $validated = $request->validate($rules);

        if ($user->tipo === 1 && $request->has('username')) {
            $novoUsuario = User::where('username', $request->username)->first();
            $award->user_id = $novoUsuario->id;
        }

        $updateData = [
            'name' => $validated['name'],
            'tipo' => $validated['tipo'],
            'comite' => $validated['comite'],
            'delegation' => $validated['delegation'],
        ];

        if (isset($validated['mun'])) {
            $updateData['mun'] = $validated['mun'];
        }
        
        $award->update($updateData);
        return redirect()->route('profile.show', $award->user_id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $award = Award::findOrFail($id);

        if ($award->mun_id !== auth()->id() && $award->user_id !== auth()->id()) {
            abort(403);
        }

        $award->delete();
        return redirect()->back();
    }
}
