<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Models\Publication;
use App\Models\User;
use App\Models\Follower;

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
    public function show(string $username, Request $request)
    {
        $user = User::where('username', $username)->firstOrFail();
        $authId = auth()->id();
        $isOwnProfile = $authId === $user->id;

        $isFollowing = !$isOwnProfile && $authId
            ? Follower::where('follower_id', $authId)->where('following_id', $user->id)->exists()
            : false;

        $seguindo = Follower::where('follower_id', $user->id)->count();
        $seguidores = Follower::where('following_id', $user->id)->count();
        $amigos = Follower::where('follower_id', $user->id)
            ->whereIn('following_id', function ($query) use ($user) {
                $query->select('follower_id')->from('followers')->where('following_id', $user->id);
            })->count();

        if ($user->tipo === 0) {

            $posts = Publication::with('images')
                ->where('user_id', $user->id)
                ->when($request->has('type'), function ($q) use ($request) {
                    if (is_numeric($request->type) && $request->type >= 0 && $request->type <= 5) {
                        return $q->where('type', $request->type);
                    }
                    return $q->where('id', 0);
                })
                ->withCount('likes')
                ->withExists(['likes as is_liked' => function ($q) {
                    $q->where('user_id', auth()->id());
                }])
                ->latest()
                ->paginate(10, ['*'], 'posts_page')
                ->withQueryString()
                ->through(function ($post) use ($authId) {
                    return array_filter([
                        'id'          => $post->id,
                        'type'        => $post->type,
                        'mun'         => $post->mun,
                        'comite'      => $post->comite,
                        'delegation'  => $post->delegation,
                        'descricao'   => $post->descricao,
                        'video'       => $post->video ? asset('storage/' . $post->video) : null,
                        'images'      => $post->images->map(fn($img) => asset('storage/' . $img->path)),
                        'can_edit'    => $authId === $post->user_id,
                    ], fn($v) => !is_null($v));
                });

            $awards = Award::with(['user', 'creator'])
                ->where('user_id', $user->id)
                ->when($request->has('type'), function ($q) use ($request) {
                    if ($request->type == 6) {
                        return $q;
                    }
                    return $q->where('id', 0);
                })
                ->latest()
                ->paginate(10, ['*'], 'awards_page')
                ->withQueryString()
                ->through(function ($award) use ($authId) {
                    return [
                        'id'         => $award->id,
                        'name'       => $award->name,
                        'tipo'       => 6,
                        'mun_name'   => $award->mun_id ? $award->creator?->name : $award->mun,
                        'delegation' => $award->delegation,
                        'comite'     => $award->comite,
                        'can_edit'   => $authId && ($authId === $award->user_id || ($award->mun_id && $authId === $award->mun_id)),
                    ];
                });

            $interests = $user->interests()
                ->latest()
                ->limit(6)
                ->get()
                ->map(fn($mun) => [
                    'id'       => $mun->id,
                    'name'     => $mun->name,
                    'username' => $mun->username,
                    'foto'     => $mun->foto ? asset('storage/' . $mun->foto) : '/fotos_usuarios/foto.jpg',
                ]);

            return Inertia::render('User/Show', [
                'user' => [
                    'id'          => $user->id,
                    'name'        => $user->name,
                    'username'    => $user->username,
                    'tipo'        => $user->tipo,
                    'foto'        => $user->foto ? Storage::url($user->foto) : '/fotos_usuarios/foto.jpg',
                    'ft_perfil'   => $user->ft_perfil ? Storage::url($user->ft_perfil) : '/fotos_perfis/foto-perfil.png',
                    'progresso'   => $user->progresso,
                    'seguindo'    => $seguindo,
                    'seguidores'  => $seguidores,
                    'amigos'      => $amigos,
                    'is_following' => $isFollowing,
                ],
                'posts'          => $posts,
                'awards'         => $awards,
                'interests'      => $interests,
                'filters'        => $request->only('type'),
                'is_own_profile' => $isOwnProfile,
            ]);
        }

        // ─── PERFIL DE MUN (tipo 1) ───────────────────────────────────────────────

        // Edições da MUN com seus comitês
        // Se o usuário logado não for a própria MUN, filtra apenas
        // os comitês em que ele é membro; caso contrário retorna todos.
        $edicoes = Edicao::where('user_id', $user->id)
            ->with(['comites' => function ($q) use ($authId, $user) {
                if ($authId && $authId !== $user->id) {
                    // Delegado logado: só os comitês em que participa
                    $q->whereHas('membros', fn($m) => $m->where('user_id', $authId));
                }
                // A própria MUN (ou visitante não logado): todos os comitês
            }])
            ->latest()
            ->get()
            ->map(fn($edicao) => [
                'id'         => $edicao->id,
                'name'       => $edicao->name,
                'ano'        => $edicao->ano,
                'dt_inicio'  => $edicao->dt_inicio  ? \Carbon\Carbon::parse($edicao->dt_inicio)->format('d/m/Y')  : null,
                'dt_termino' => $edicao->dt_termino ? \Carbon\Carbon::parse($edicao->dt_termino)->format('d/m/Y') : null,
                'comites'    => $edicao->comites->map(fn($c) => [
                    'id'   => $c->id,
                    'name' => $c->name,
                ]),
            ]);

        // Posts da MUN filtrados por edição
        // Quando um comitê está selecionado, não carrega posts (seção de documentos — TODO)
        $edicaoId = $request->input('edicao_id');
        $comiteId = $request->input('comite_id');

        $posts = null;

        if (!$comiteId) {
            $posts = Publication::with('images')
                ->where('user_id', $user->id)
                ->when($edicaoId, function ($q) use ($edicaoId, $user) {
                    $ano = Edicao::where('id', $edicaoId)
                        ->where('user_id', $user->id)
                        ->value('ano');

                    if ($ano) {
                        $q->whereYear('created_at', $ano);
                    } else {
                        $q->where('id', 0);
                    }
                })
                ->withCount('likes')
                ->withExists(['likes as is_liked' => function ($q) {
                    $q->where('user_id', auth()->id());
                }])
                ->latest()
                ->paginate(10, ['*'], 'posts_page')
                ->withQueryString()
                ->through(function ($post) use ($authId) {
                    return array_filter([
                        'id'         => $post->id,
                        'type'       => $post->type,
                        'mun'        => $post->mun,
                        'comite'     => $post->comite,
                        'delegation' => $post->delegation,
                        'descricao'  => $post->descricao,
                        'video'      => $post->video ? asset('storage/' . $post->video) : null,
                        'images'     => $post->images->map(fn($img) => asset('storage/' . $img->path)),
                        'can_edit'   => $authId === $post->user_id,
                    ], fn($v) => !is_null($v));
                });
        }

        // TODO: quando $comiteId estiver presente, carregar documentos do comitê aqui

        return Inertia::render('User/Show', [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'username'     => $user->username,
                'tipo'         => $user->tipo,
                'foto'         => $user->foto ? Storage::url($user->foto) : '/fotos_usuarios/foto.jpg',
                'ft_perfil'    => $user->ft_perfil ? Storage::url($user->ft_perfil) : '/fotos_perfis/foto-perfil.png',
                'progresso'    => $user->progresso,
                'seguindo'     => $seguindo,
                'seguidores'   => $seguidores,
                'amigos'       => $amigos,
                'is_following' => $isFollowing,
            ],
            'posts'    => $posts,      // null quando comitê selecionado — front oculta a seção
            'documents' => null,       // TODO: preencher quando implementar documentos de comitê
            'edicoes'  => $edicoes,
            'filters'  => $request->only(['edicao_id', 'comite_id']),
            'is_own_profile' => $isOwnProfile,
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
        
        return redirect()->route('user.show', $user->username);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $user = Auth::user();
        Auth::logout();
        $user->delete();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function search(Request $request)
    {
        $term = $request->query('q');
        $auth = auth()->user();
        $authUserId = $auth->id;

        $users = User::query()
            ->when($term, function ($query) use ($term) {
                $query->where('name', 'LIKE', "%{$term}%")
                    ->orWhere('username', 'LIKE', "%{$term}%");
            })
            ->select(['id', 'name', 'username', 'foto'])
            ->withExists(['followers as is_following' => function ($query) use ($authUserId) {
                $query->where('follower_id', $authUserId);
            }])
            ->withExists(['interests as is_interested' => function ($query) use ($authUserId) {
                $query->where('delegate_id', $authUserId);
            }])
            ->limit(10)
            ->get()
            ->map(function ($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'foto' => $user->foto 
                        ? asset('storage/' . $user->foto) 
                        : '/fotos_usuarios/foto.jpg',
                    'is_following' => $user->is_following,
                    'is_interested' => ($auth->tipo === 0 && $user->tipo === 1)
                        ? $user->is_interested 
                        : null,
                ];
            });

        return response()->json($users);
    }

    public function discoverMuns(Request $request)
    {
        $user = Auth::user();

        if ($user->tipo !== 0) {
            abort(403, 'Apenas delegados podem descobrir novas MUNs.');
        }

        $followingIds = Follower::where('follower_id', $user->id)
            ->pluck('following_id');

        $muns = User::query()
            ->where('tipo', 1)
            ->whereNotIn('id', $followingIds)
            ->inRandomOrder()
            ->limit(10)
            ->get()
            ->map(function ($mun) {
                return [
                    'id' => $mun->id,
                    'name' => $mun->name,
                    'username' => $mun->username,
                    'foto' => $mun->foto ? asset('storage/' . $mun->foto) : '/fotos_usuarios/foto.png',
                    'cidade' => $mun->cidade,
                    'is_following' => false, // Por definição da query, ele não segue nenhum destes
                ];
            });

        return response()->json($muns);
    }
}
