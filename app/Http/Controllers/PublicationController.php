<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Models\Award;
use App\Models\Follower;
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

        return Publication::query()
            ->when($request->type === 'following' && $user, function ($query) use ($user) {
                $query->whereIn('user_id', $user->followings()->pluck('related_id'));
            })
            ->with(['user', 'images'])
            ->withCount('likes')
            ->withExists(['likes as is_liked' => function($q) use ($authId) {
                $q->where('user_id', $authId);
            }])
            ->latest()
            ->cursorPaginate(10)
            ->through(function ($post) use ($authId) {
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
                    
                    'likes_count' => $post->likes_count,
                    'is_liked' => $post->is_liked,

                    'can_edit' => $authId === $post->user_id, 
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
            'type' => 'required|integer',
            'mun' => 'nullable|string|max:100',
            'comite' => 'nullable|string|max:100', //ver aqui e no migration os requireds, alterar models e controllers            
            'delegation' => 'nullable|string|max:100',
            'descricao' => 'nullable|string|max:2000',
            'video_file' => 'nullable|mimes:mp4,mov,ogg,qt|max:20480',
            'fixo' => 'required|boolean',    
            'images.*' => 'nullable|image|max:5120',
            'images' => 'max:10',
        ]);

        $publication = Publication::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'mun' => $request->mun,
            'comite' => $request->comite,
            'delegation' => $request->delegation,
            'descricao' => $request->descricao,
            'fixo' => $request->fixo ?? false,
            'video' => null,
        ]);

        if ($request->hasFile('video_file')) {
           $videoPath = $request->file('video_file')->store('videos_publicacoes', 'public');
            $publication->update(['video' => $videoPath]);
        }

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('publications', 'public');

                $publication->images()->create([
                    'path' => $path,
                    'order' => $index
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
        $post = Publication::with(['images', 'user'])
            ->withCount('likes')
            ->withExists(['likes as is_liked' => function($q) {
                $q->where('user_id', auth()->id());
            }])
            ->findOrFail($id);

        $formattedPost = array_filter([
            'id' => $post->id,
            'type' => $post->type,
            'mun' => $post->mun,
            'comite' => $post->comite,
            'delegation' => $post->delegation,
            'descricao' => $post->descricao,
            'video' => $post->video ? asset('storage/' . $post->video) : null,
            
            'username' => $post->user->username,
            'user_foto' => $post->user->foto 
                ? asset('storage/' . $post->user->foto) 
                : '/fotos_usuarios/foto.jpg',
                
            'images' => $post->images->isNotEmpty() 
                ? $post->images->map(fn($img) => asset('storage/' . $img->path)) 
                : null,

            'likes_count' => $post->likes_count,
            'is_liked' => $post->is_liked,
            
            'can_edit' => auth()->check() && auth()->id() === $post->user_id,

        ], function ($value) {
            return !is_null($value);
        });

        return Inertia::render('Publication/Show', [
            'post' => $formattedPost
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //formulário de edição
        $publication = Publication::with('user')->findOrFail($id);

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
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $publication = Publication::findOrFail($id);

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
        return redirect()->route('profile.show', $publication->user_id);
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
}
