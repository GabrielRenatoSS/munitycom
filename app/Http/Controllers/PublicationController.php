<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Comentario;
use App\Models\Favorito;
use Illuminate\Support\Facades\Storage;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $authId = auth()->id();

        $canFav = $request->user() && (
            $request->user()->tipo === 1 ||
            ($request->user()->tipo === 0 && $request->user()->progresso >= 6)
        );

        return Publication::query()
            ->when($request->type === 'following' && $user, function ($query) use ($user) {
                $query->whereIn('user_id', $user->followings()->pluck('related_id'));
            })
            ->with(['user', 'images'])
            ->withCount(['likes', 'comentarios'])
            ->withExists(['likes as is_liked' => function($q) use ($authId) {
                $q->where('user_id', $authId);
            }])
            ->latest()
            ->cursorPaginate(10)
            ->through(function ($post) use ($authId, $canFav) {
                return array_filter([
                    'id' => $post->id,
                    'type' => $post->type,
                    'descricao' => $post->descricao,
                    'video' => $post->video ? asset('storage/' . $post->video) : null,
                    'images' => $post->images->map(fn($img) => asset('storage/' . $img->path)),
                    
                    'username' => $post->user->username,
                    'user_foto' => $post->user->foto 
                        ? asset('storage/' . $post->user->foto) 
                        : '/fotos_usuarios/foto.png',
                    
                    'likes_count'      => $post->likes_count,
                    'comentarios_count' => $post->comentarios_count,
                    'is_liked' => $post->is_liked,

                    'can_edit' => $authId === $post->user_id, 
                    'can_fav' => $canFav,
                ], fn($v) => !is_null($v));
            });
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //cadastro formulário
        return Inertia::render('Publication/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'type'        => 'required|integer',
            'mun'         => 'nullable|string|max:100',
            'comite'      => 'nullable|string|max:100',
            'delegation'  => 'nullable|string|max:100',
            'descricao'   => 'nullable|string|max:2000',
            'video_file'  => 'nullable|mimes:mp4,mov,ogg,qt|max:20480',
            'fixo'        => 'required|boolean',
            'images.*'    => 'nullable|image|max:5120',
            'images'      => 'max:10',
        ]);

        $user = Auth::user();

        if ($request->type == 5 && !($user->tipo === 1 || $user->progresso === 7)) {
            abort(403);
        }

        if ($request->hasFile('video_file')) {
            $video = $request->file('video_file');
            $getID3 = new \getID3();
            $info = $getID3->analyze($video->getRealPath());
            $duracao = $info['playtime_seconds'] ?? 0;

            if ($duracao > 60) {
                return back()->withErrors(['video_file' => 'O vídeo deve ter no máximo 1 minuto.']);
            }
        }

        $publication = Publication::create([
            'user_id'    => $user->id,
            'type'       => $request->type,
            'mun'        => $request->mun,
            'comite'     => $request->comite,
            'delegation' => $request->delegation,
            'descricao'  => $request->descricao,
            'fixo'       => $request->fixo ?? false,
            'video'      => null,
        ]);

        if ($request->hasFile('video_file')) {
            $videoPath = $request->file('video_file')->store('videos_publicacoes', 'public');
            $publication->update(['video' => $videoPath]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('publications', 'public');
                $publication->images()->create([
                    'path'  => $path,
                    'order' => $index,
                ]);
            }
        }

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $authId = auth()->id();
        $authUser = auth()->user();

        $post = Publication::with(['images', 'user'])
            ->withCount('likes')
            ->withExists(['likes as is_liked' => function($q) use ($authId) {
                $q->where('user_id', $authId);
            }])
            ->findOrFail($id);

        $comentarios = Comentario::with('user')
            ->where('publication_id', $post->id)
            ->latest()
            ->get()
            ->map(function ($comentario) use ($authId, $post) {
                $ehAutor = $authId === $comentario->user_id;
                $ehDonoDaPublicacao = $authId === $post->user_id;
                $dentroDoTempo = $comentario->created_at->diffInMinutes(now()) < 20;

                return [
                    'id'         => $comentario->id,
                    'texto'      => $comentario->texto,
                    'username'   => $comentario->user->username,
                    'user_foto'  => $comentario->user->foto
                        ? asset('storage/' . $comentario->user->foto)
                        : '/fotos_usuarios/foto.jpg',
                    'created_at' => $comentario->created_at->format('d/m/Y H:i'),
                    'can_edit'   => $ehAutor && $dentroDoTempo,
                    'can_delete' => $ehAutor || $ehDonoDaPublicacao,
                ];
            });

        $canComment = $authUser && (
            $authUser->tipo === 1 ||
            ($authUser->tipo === 0 && $authUser->progresso >= 3)
        );

        $formattedPost = array_filter([
            'id'          => $post->id,
            'type'        => $post->type,
            'mun'         => $post->mun,
            'comite'      => $post->comite,
            'delegation'  => $post->delegation,
            'descricao'   => $post->descricao,
            'video'       => $post->video ? asset('storage/' . $post->video) : null,
            'username'    => $post->user->username,
            'user_foto'   => $post->user->foto
                ? asset('storage/' . $post->user->foto)
                : '/fotos_usuarios/foto.jpg',
            'images'      => $post->images->isNotEmpty()
                ? $post->images->map(fn($img) => asset('storage/' . $img->path))
                : null,
            'likes_count' => $post->likes_count,
            'is_liked'    => $post->is_liked,
            'can_edit'    => $authId && $authId === $post->user_id,
        ], fn($value) => !is_null($value));

        return Inertia::render('Publication/Show', [
            'post'        => $formattedPost,
            'comentarios' => $comentarios,
            'can_comment' => $canComment,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //formulário de edição
        $publication = Publication::with(['user', 'images'])->findOrFail($id);

        if ($publication->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Publication/Edit', [
            'publication' => [
                'id' => $publication->id,
                'descricao' => $publication->descricao,
                'type' => $publication->type,
                'comite' => $publication->comite,
                'delegation' => $publication->delegation,
                'mun' => $publication->mun,
                'username' => $publication->user->username,
                'video' => $publication->video ? asset('storage/' . $publication->video) : null,
                'images' => $publication->images->map(fn($img) => asset('storage/' . $img->path)),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::with('user')->findOrFail($id);

        if ($publication->user_id !== auth()->id()) {
            abort(403);
        }

        $validated = $request->validate([
            'descricao' => 'nullable|string|max:2000',
            'comite' => 'nullable|string|max:100',
            'delegation' => 'nullable|string|max:100',
            'mun' => 'nullable|string|max:100',
        ]);

        $publication->update($validated);
        return redirect()->route('profile.show', $publication->user->username);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $publication = Publication::findOrFail($id);

        if ($publication->user_id !== auth()->id()) {
            abort(403);
        }

        $publication->delete();
        return redirect()->back();
    }

    public function toggleFixo(Publication $publication)
    {
        $authId = Auth::id();

        if ($authId !== $publication->user_id) {
            abort(403);
        }

        $user = Auth::user();

        if ($user->tipo !== 1 && ($user->tipo !== 0 || $user->progresso < 5)) {
            abort(403);
        }

        if ($publication->fixo) {
            $publication->update(['fixo' => false]);
        } else {
            Publication::where('user_id', $authId)
                ->where('fixo', true)
                ->update(['fixo' => false]);

            $publication->update(['fixo' => true]);
        }

        return redirect()->back();
    }

    public function toggleFavorito(Publication $publication)
    {
        $user = Auth::user();

        if ($user->tipo !== 1 && ($user->tipo !== 0 || $user->progresso < 6)) {
            abort(403);
        }

        $favorito = Favorito::where('user_id', $user->id)
            ->where('publication_id', $publication->id)
            ->first();

        if ($favorito) {
            $favorito->delete();
        } else {
            Favorito::create([
                'user_id'        => $user->id,
                'publication_id' => $publication->id,
            ]);
        }

        return redirect()->back();
    }

    public function favoritos()
    {
        $user = Auth::user();

        if ($user->tipo !== 1 && ($user->tipo !== 0 || $user->progresso < 6)) {
            abort(403);
        }

        $favoritos = Favorito::with(['publication.images', 'publication.user'])
            ->where('user_id', $user->id)
            ->latest()
            ->paginate(10);

        $favoritos->through(function ($favorito) use ($user) {
            $post = $favorito->publication;
            return array_filter([
                'id'                => $post->id,
                'type'              => $post->type,
                'mun'               => $post->mun,
                'comite'            => $post->comite,
                'delegation'        => $post->delegation,
                'descricao'         => $post->descricao,
                'video'             => $post->video ? asset('storage/' . $post->video) : null,
                'images'            => $post->images->map(fn($img) => asset('storage/' . $img->path)),
                'username'          => $post->user->username,
                'user_foto'         => $post->user->foto
                    ? asset('storage/' . $post->user->foto)
                    : '/fotos_usuarios/foto.jpg',
            ], fn($v) => !is_null($v));
        });

        return Inertia::render('Publication/Favoritos', [
            'favoritos' => $favoritos,
        ]);
    }
}
