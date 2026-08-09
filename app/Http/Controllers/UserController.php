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
use App\Models\Award;
use App\Models\Spotted;
use App\Models\Edicao;
use App\Models\Documento;
use App\Models\MembroComite;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
       $users = User::whereIn('tipo', [0, 1])
            ->orderBy('id')
            ->select(['id', 'name', 'username', 'email', 'foto', 'bloqueio', 'created_at'])
            ->paginate(20);

        return Inertia::render('User/Index', [
            'users' => $users,
        ]);
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
            'foto'  => 'required|image|max:5120',
        ]);

        $caminhoFoto = $request->file('foto')->store('fotos_usuarios', config('filesystems.default'));
        $data['foto'] = $caminhoFoto;

        $data['bloqueio'] = false;
        $data['progresso'] = 0;

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

        $authUser = auth()->user();
        $canFix = $authUser && $isOwnProfile && (
            $authUser->tipo === 1 ||
            ($authUser->tipo === 0 && $authUser->progresso >= 5)
        );

        $canFav = $authUser && (
            $authUser->tipo === 1 ||
            ($authUser->tipo === 0 && $authUser->progresso >= 6)
        );

        $canComment = $authUser && (
            $authUser->tipo == 1 ||
            ($authUser->progresso >= 3)
        );

        if ($user->tipo === 0) {

            $postsQuery = Publication::with(['images', 'user'])
                ->where('user_id', $user->id)
                ->when($request->has('type'), function ($q) use ($request) {
                    if (is_numeric($request->type) && $request->type >= 0 && $request->type <= 8) {
                        return $q->where('type', $request->type);
                    }
                    return $q->where('id', 0);
                })
                ->withCount(['likes', 'comentarios'])
                ->withExists(['likes as is_liked' => function ($q) {
                    $q->where('user_id', auth()->id());
                }])
                ->withExists(['favoritos as is_favoritado' => function ($q) {
                    $q->where('user_id', auth()->id());
                }]);

            if (!$request->has('type')) {
                $postsQuery->orderByDesc('fixo')->latest();
            } else {
                $postsQuery->latest();
            }

            $posts = $postsQuery->paginate(10, ['*'], 'posts_page')
                ->withQueryString()
                ->through(function ($post) use ($authId, $canFix, $canFav, $canComment) {
                    return array_filter([
                        'id'                => $post->id,
                        'type'              => $post->type,
                        'mun'               => $post->mun,
                        'comite'            => $post->comite,
                        'delegation'        => $post->delegation,
                        'descricao'         => $post->descricao,
                        'video' => $post->video ? Storage::url($post->video) : null,
                        'images' => $post->images->map(fn($img) => Storage::url($img->path)),
                        'can_edit'          => $authId === $post->user_id,
                        'can_fix'           => $canFix,
                        'can_fav'           => $canFav,
                        'can_comment'       => $canComment,
                        'fixo'              => $post->fixo,
                        'likes_count'       => $post->likes_count,
                        'comentarios_count' => $post->comentarios_count,
                        'is_liked'          => (bool) $post->is_liked,
                        'is_favoritado'     => (bool) $post->is_favoritado,
                        'user_foto' => $post->user->foto 
                            ? Storage::url($post->user->foto) 
                            : Storage::url('fotos_usuarios/foto.jpg'),
                        'name'       => $post->user->name,
                        'username'   => $post->user->username,
                        'created_at' => $post->created_at->format('d/m/Y'),
                    ], fn($v) => !is_null($v));
                });

            $awards = Award::with(['user', 'creator'])
                ->where('user_id', $user->id)
                ->where(function ($q) use ($request) {
                    if ($request->type == 6) return;
                    $q->where('id', 0);
                })
                ->latest()
                ->paginate(10, ['*'], 'awards_page')
                ->withQueryString()
                ->through(function ($award) use ($authId) {
                    return [
                        'id'         => $award->id,
                        'name'       => $award->name,
                        'tipo'       => 6,
                        'mun'          => $award->mun_id ? $award->creator?->name : $award->mun,
                        'delegation' => $award->delegation,
                        'user_username' => $award->user->name,
                        'user_foto' => $award->user->foto 
                            ? Storage::url($award->user->foto) 
                            : Storage::url('fotos_usuarios/foto.jpg'),
                        'comite'     => $award->comite,
                        'can_edit'   => $authId && ($authId === $award->user_id || ($award->mun_id && $authId === $award->mun_id)),
                    ];
                });

            $spotteds = null;

            if ($request->input('type') == 7) {
                $spottedQuery = Spotted::with([
                        'destinatario:id,delegacao,user_id',
                        'comite:id,name',
                        'remetente:id,delegacao,user_id',
                        'remetente.user:id,username',
                        'destinatario.user:id,username',
                    ])
                    ->where('destinatario_id', function ($q) use ($user) {
                        $q->select('id')
                        ->from('membro_comites')
                        ->where('user_id', $user->id);
                    });

                if (!$isOwnProfile) {
                    $spottedQuery->where(function ($q) use ($authId) {
                        $q->where('tipo', 0)
                        ->orWhere(function ($q2) use ($authId) {
                            $q2->where('tipo', 1)
                                ->whereIn('remetente_id', function ($q3) use ($authId) {
                                    $q3->select('id')
                                        ->from('membro_comites')
                                        ->where('user_id', $authId);
                                });
                        });
                    });
                }

                $spotteds = $spottedQuery->latest()
                    ->paginate(10, ['*'], 'spotteds_page')
                    ->withQueryString()
                    ->through(function ($spotted) {
                        return [
                            'id'           => $spotted->id,
                            'mensagem'     => $spotted->mensagem,
                            'tipo'         => $spotted->tipo,
                            'anonimo'      => $spotted->anonimo,
                            'comite'       => $spotted->comite?->name,
                            'remetente'    => $spotted->anonimo ? "Anônimo" : $spotted->remetente?->delegacao,
                            'destinatario' => $spotted->destinatario?->delegacao,
                            'remetente_foto' => $spotted->anonimo 
                                ? Storage::url('fotos_usuarios/foto.jpg') 
                                : ($spotted->remetente?->user?->foto 
                                    ? Storage::url($spotted->remetente->user->foto) 
                                    : Storage::url('fotos_usuarios/foto.jpg')),
                            'remetente_username' => $spotted->anonimo ? "Anônimo" : $spotted->remetente?->user?->username,
                            'destinatario_username' => $spotted->destinatario?->user?->username,
                            'card_type' => 'spotted',
                        ];
                    });
            }

            $interests = $user->interests()
                ->latest()
                ->limit(6)
                ->get()
                ->map(fn($mun) => [
                    'id'       => $mun->id,
                    'name'     => $mun->name,
                    'username' => $mun->username,
                    'foto' => $mun->foto 
                        ? Storage::url($mun->foto) 
                        : Storage::url('fotos_usuarios/foto.jpg'),
                ]);

            return Inertia::render('User/Show', [
                'user' => [
                    'id'           => $user->id,
                    'name'         => $user->name,
                    'username'     => $user->username,
                    'tipo'         => $user->tipo,
                    'foto' => $user->foto 
                        ? Storage::url($user->foto) 
                        : Storage::url('fotos_usuarios/foto.jpg'),
                    'ft_perfil' => $user->ft_perfil 
                        ? Storage::url($user->ft_perfil) 
                        : Storage::url('fotos_perfis/foto-perfil.png'),
                    'progresso'    => $user->progresso,
                    'seguindo'     => $seguindo,
                    'seguidores'   => $seguidores,
                    'amigos'       => $amigos,
                    'is_following' => $isFollowing,
                ],
                'posts'          => $posts,
                'awards'         => $awards,
                'spotteds'       => $spotteds,
                'interests'      => $interests,
                'filters'        => $request->only('type'),
                'is_own_profile' => $isOwnProfile,
            ]);
        }

        // ─── PERFIL DE MUN (tipo 1) ───────────────────────────────────────────────

        $edicoes = Edicao::where('user_id', $user->id)
            ->with(['comites' => function ($q) use ($authId, $user) {
                if ($authId && $authId !== $user->id) {
                    $q->whereHas('membros', fn($m) => $m->where('user_id', $authId));
                }
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

        $edicaoId = $request->input('edicao_id');
        $comiteId = $request->input('comite_id');

        $posts = null;
        $documents = null;

        if (!$comiteId) {
            $postsQuery = Publication::with(['images', 'user'])
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
                ->withCount(['likes', 'comentarios'])
                ->withExists(['likes as is_liked' => function ($q) {
                    $q->where('user_id', auth()->id());
                }])
                ->withExists(['favoritos as is_favoritado' => function ($q) {
                    $q->where('user_id', auth()->id());
                }]);

            if (!$edicaoId) {
                $postsQuery->orderByDesc('fixo')->latest();
            } else {
                $postsQuery->latest();
            }

            $posts = $postsQuery->paginate(10, ['*'], 'posts_page')
                ->withQueryString()
                ->through(function ($post) use ($authId, $canFix, $canFav, $canComment) {
                    return array_filter([
                        'id'                => $post->id,
                        'type'              => $post->type,
                        'mun'               => $post->mun,
                        'comite'            => $post->comite,
                        'delegation'        => $post->delegation,
                        'descricao'         => $post->descricao,
                        'video' => $post->video ? Storage::url($post->video) : null,
                        'images' => $post->images->map(fn($img) => Storage::url($img->path)),
                        'can_edit'          => $authId === $post->user_id,
                        'can_fix'           => $canFix,
                        'can_fav'           => $canFav,
                        'can_comment'       => $canComment,
                        'fixo'              => $post->fixo,
                        'likes_count'       => $post->likes_count,
                        'comentarios_count' => $post->comentarios_count,
                        'is_liked' => (bool) $post->is_liked,
                        'is_favoritado' => (bool) $post->is_favoritado,
                        'user_foto' => $post->user->foto 
    ? Storage::url($post->user->foto) 
    : Storage::url('fotos_usuarios/foto.jpg'),
                        'name'       => $post->user->name,
                        'username'   => $post->user->username,
                        'created_at' => $post->created_at->format('d/m/Y'),
                    ], fn($v) => !is_null($v));
                });
        } else {
            $comiteModel = \App\Models\Comite::find($comiteId);

            $membros = $comiteModel
                ? $comiteModel->membros()
                    ->with('user:id,username,foto')
                    ->get()
                    ->map(fn($m) => [
                        'id'        => $m->id,
                        'delegacao' => $m->delegacao,
                        'username'  => $m->user->username,
                        'foto' => $m->user->foto 
                            ? Storage::url($m->user->foto) 
                            : Storage::url('fotos_usuarios/foto.jpg'),
                    ])
                : collect();

            $documents = Documento::with([
                    'patrocinadores.delegado:id,user_id,delegacao',
                    'patrocinadores.delegado.user:id,username,foto',  // ← adicionar
                    'signatarios.delegado:id,delegacao',
                ])
                ->where('comite_id', $comiteId)
                ->latest()
                ->paginate(10, ['*'], 'documents_page')
                ->withQueryString()
                ->through(function ($documento) use ($authId, $user) {

                    $primeiroPatr = $documento->patrocinadores->first()?->delegado;

                    $ehPatrocinador = $documento->patrocinadores
                        ->contains(fn($p) => $p->delegado?->user_id === $authId);

                    $ehMun = $authId === $user->id;

                    $ehChairOuMesa = MembroComite::where('user_id', $authId)
                        ->where('comite_id', $documento->comite_id)
                        ->whereIn(\DB::raw('LOWER(delegacao)'), ['chair', 'mesa', 'mesa diretora'])
                        ->exists();

                    return [
                        'id'              => $documento->id,
                        'tipo'            => $documento->tipo,
                        'conteudo'        => $documento->conteudo,
                        'brasao'          => $documento->brasao ? Storage::url($documento->brasao) : null,
                        'foto1'           => $documento->foto1  ? Storage::url($documento->foto1)  : null,
                        'foto2'           => $documento->foto2  ? Storage::url($documento->foto2)  : null,
                        'foto3'           => $documento->foto3  ? Storage::url($documento->foto3)  : null,
                        'foto4'           => $documento->foto4  ? Storage::url($documento->foto4)  : null,
                        'patrocinadores'  => $documento->patrocinadores->isNotEmpty()
                            ? $documento->patrocinadores->map(fn($p) => $p->delegado?->delegacao)
                            : null,
                        'signatarios'     => $documento->signatarios->isNotEmpty()
                            ? $documento->signatarios->map(fn($s) => $s->delegado?->delegacao)
                            : null,
                        'is_own_document' => $authId && ($ehPatrocinador || $ehMun || $ehChairOuMesa),
                        'autor_foto' => $primeiroPatr?->user?->foto
                            ? Storage::url($primeiroPatr->user->foto)
                            : Storage::url('fotos_usuarios/foto.jpg'),
                        'autor_username'  => $primeiroPatr?->user?->username,
                        'autor_delegacao' => $primeiroPatr?->delegacao,
                    ];
                });
        }

        return Inertia::render('User/Show', [
            'user' => [
                'id'           => $user->id,
                'name'         => $user->name,
                'username'     => $user->username,
                'tipo'         => $user->tipo,
                'foto' => $user->foto 
                    ? Storage::url($user->foto) 
                    : Storage::url('fotos_usuarios/foto.jpg'),
                'ft_perfil' => $user->ft_perfil 
                    ? Storage::url($user->ft_perfil) 
                    : Storage::url('fotos_perfis/foto-perfil.png'),
                'progresso'    => $user->progresso,
                'seguindo'     => $seguindo,
                'seguidores'   => $seguidores,
                'amigos'       => $amigos,
                'is_following' => $isFollowing,
            ],
            'posts'          => $posts,
            'documents'      => $documents,
            'spotteds'       => null,
            'edicoes'        => $edicoes,
            'membros'        => $membros ?? null,
            'comite'         => isset($comiteModel) && $comiteModel ? [
                'id'   => $comiteModel->id,
                'name' => $comiteModel->name,
            ] : null,
            'can_edit'       => $isOwnProfile,
            'filters' => array_merge(
                $request->only(['edicao_id', 'comite_id']),
                $request->only('type')
            ),
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
            $path = $request->file('foto')->store('fotos_usuarios', config('filesystems.default'));
            $user->foto = $path;
        }

        if ($request->hasFile('ft_perfil')) {
            if ($user->ft_perfil) {
                Storage::disk('public')->delete($user->ft_perfil);
            }
            $path = $request->file('ft_perfil')->store('fotos_perfis', config('filesystems.default'));
            $user->ft_perfil = $path;
        }

        $user->save();
        
        return redirect()->route('profile.show', $user->username);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
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
        if (!$request->expectsJson()) {
            return redirect('/feed');
        }

        $term = $request->query('q');
        $auth = auth()->user();
        $authUserId = $auth->id;

        $users = User::query()
            ->when($term, function ($query) use ($term) {
                $query->where('name', 'LIKE', "%{$term}%")
                    ->orWhere('username', 'LIKE', "%{$term}%");
            })
            ->whereIn('tipo', [0, 1])
            ->select(['id', 'name', 'username', 'email', 'foto', 'tipo', 'bloqueio', 'created_at'])
            ->withExists(['followers as is_following' => function ($query) use ($authUserId) {
                $query->where('follower_id', $authUserId);
            }])
            ->withExists(['interests as is_interested' => function ($query) use ($authUserId) {
                $query->where('delegate_id', $authUserId);
            }])
            ->limit(10)
            ->get()
            ->map(function ($user) use ($auth) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'username' => $user->username,
                    'foto' => $user->foto 
                        ? Storage::url($user->foto) 
                        : Storage::url('fotos_usuarios/foto.jpg'),
                    'is_following' => $user->is_following,
                    'is_interested' => ($auth->tipo === 0 && $user->tipo === 1)
                        ? (bool) $user->is_interested
                        : null,
                    'created_at' => $user->created_at,
                    'bloqueio' => (bool)$user->bloqueio,
                    'email' => $user->email,
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
            ->map(function ($mun) use ($user) {
                return [
                    'id'           => $mun->id,
                    'name'         => $mun->name,
                    'username'     => $mun->username,
                    'foto' => $mun->foto 
                        ? Storage::url($mun->foto) 
                        : Storage::url('fotos_usuarios/foto.jpg'),
                    'cidade'       => $mun->cidade,
                    'is_following' => false,
                    'is_interested' => DB::table('interests')
                        ->where('delegate_id', $user->id)
                        ->where('mun_id', $mun->id)
                        ->exists(),
                ];
            });

        return response()->json($muns);
    }

    public function discoverPage()
    {
        return Inertia::render('DiscoverMuns');
    }

    public function toggleBloqueio(User $user)
    {
        $user->update(['bloqueio' => !$user->bloqueio]);
        return response()->json(['bloqueio' => $user->bloqueio]);
    }

    public function ranking()
    {
        $authId = Auth::id();
        $authUser = Auth::user();

        //arrumar
        if ($authUser->progresso < 0) {
            abort(403);
        }

        // Top 100 delegados com pelo menos 1 prêmio
        $top100 = User::where('tipo', 0)
            ->withCount(['awards' => fn($q) => $q->where('tipo', 0)])
            ->having('awards_count', '>', 0)
            ->orderByDesc('awards_count')
            ->orderBy('id')
            ->limit(100)
            ->get();

        $ranking = $top100->map(fn($user, $index) => [
            'posicao'      => $index + 1,
            'name'         => $user->name,
            'username'     => $user->username,
            'foto' => $user->foto 
                ? Storage::url($user->foto) 
                : Storage::url('fotos_usuarios/foto.jpg'),
            'awards_count' => $user->awards_count,
        ]);

        // Card do usuário logado — posição global entre todos os delegados
        $todos = User::where('tipo', 0)
            ->withCount(['awards' => fn($q) => $q->where('tipo', 0)])
            ->orderByDesc('awards_count')
            ->orderBy('id')
            ->get();

        $posicaoIndex = $todos->search(fn($u) => $u->id === $authId);
        $userAuth = $posicaoIndex !== false ? $todos[$posicaoIndex] : null;

        $authCard = $userAuth ? [
            'posicao'      => $posicaoIndex + 1,
            'name'         => $userAuth->name,
            'username'     => $userAuth->username,
            'foto' => $userAuth->foto 
                ? Storage::url($userAuth->foto) 
                : Storage::url('fotos_usuarios/foto.jpg'),
            'awards_count' => $userAuth->awards_count,
        ] : null;

        return Inertia::render('User/Ranking', [
            'ranking'  => $ranking->values(),
            'authCard' => $authCard,
        ]);
    }
}
