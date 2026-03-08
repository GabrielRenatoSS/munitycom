<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //listar
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //cadastro formulário
        return Inertia::render('User/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //gravar dados do cadastro
        $data = $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'username' => 'required|string|unique:users,username',
            'password' => 'required',
            'tipo'     => 'required|integer|in:0,1',
            'pais'     => 'required',
            'estado'   => 'required',
            'cidade'   => 'required',
            'foto'  => 'required|image|max:2048',
        ]);

        $caminhoFoto = $request->file('foto')->store('fotos_usuarios', 'public');
        $data['foto'] = $caminhoFoto;

        $data['password'] = Hash::make($data['password']);
        User::create($data);

        return redirect()->route('login');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $username)
    {
        $user = User::where('username', $username)->firstOrFail();
        
        $seguindo = Follower::where('follower_id', $user->id)->count();
        $seguidores = Follower::where('following_id', $user->id)->count();
        $idsSeguindo = Follower::where('follower_id', $user->id)->pluck('following_id');

        $amigos = Follower::where('follower_id', $user->id)
        ->whereIn('following_id', function($query) use ($user) {
            $query->select('follower_id')
                  ->from('followers')
                  ->where('following_id', $user->id);
        })->count();

        return Inertia::render('User/Show', [
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'username' => $user->username,
                'foto' => $user->foto 
                        ? Storage::url($user->foto) 
                        : '/fotos_usuarios/foto.jpg',
                'ft_perfil' => $user->ft_perfil 
                        ? Storage::url($user->ft_perfil) 
                        : '/fotos_perfis/foto-perfil.png',
                'progresso' => $user->progresso,
                'seguindo' => $seguindo,
                'seguidores' => $seguidores,
                'amigos' => $amigos,
            ],
            'is_own_profile' => auth()->id() === $user->id,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        //formulário de edição
        if (auth()->id() != $id) {
            abort(403, 'Acesso negado');
        }

        $user = User::findOrFail($id);

        return Inertia::render('User/Edit', [
            'name' => $user->name,
            'foto' => $user->foto 
                ? Storage::url($user->foto) 
                : '/fotos_usuarios/foto.jpg',
            'ft_perfil' => $user->ft_perfil 
                ? Storage::url($user->ft_perfil) 
                : '/fotos_perfis/foto-perfil.png',
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        //salvar edição
        $user = User::findOrFail($id);
        $request->validate([
            'name' => 'required|string',
            'foto' => 'nullable|image|max:2048',
            'ft_perfil' => 'nullable|image|max:2048',
        ]);

        $user->name = $request->name;

        if ($request->hasFile('foto')) {
            if ($user->foto) {
                Storage::disk('public')->delete($user->foto);
            }
            $path = $request->file('foto')->store('fotos_usuarios', 'public');
            $user->foto = $path;
        }

        if ($request->hasFile('ft_perfil')) {
            if ($user->ft_perfil) {
                Storage::disk('public')->delete($user->ft_perfil);
            }
            $path = $request->file('ft_perfil')->store('fotos_perfis', 'public');
            $user->ft_perfil = $path;
        }

        $user->save();
        
        return redirect()->route('user.show', $user->id);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $id)
    {
        $user = Auth::user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }
}
