<?php

namespace App\Http\Controllers;

use App\Models\Publication;
use Illuminate\Http\Request;

class PublicationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Publication::query()
            ->when($request->user_id, fn($q) => $q->where('user_id', $request->user_id))
            ->latest()
            ->cursorPaginate(10);
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
        $posts = Publication::with('images')->where('user_id', $id)->get();

        $formattedPosts = $posts->map(function ($post) {
            $data = [
                'id' => $post->id,
                'type' => $post->type,
            ];

            if ($post->mun) $data['mun'] = $post->mun;
            if ($post->comite) $data['comite'] = $post->comite;
            if ($post->delegation) $data['delegation'] = $post->delegation;
            if ($post->descricao) $data['descricao'] = $post->descricao;
            if ($post->video) $data['video'] = asset('storage/' . $post->video);
        
            if ($post->images->isNotEmpty()) {
                $data['images'] = $post->images->map(fn($img) => asset('storage/' . $img->path));
            }

            return $data;
        });

        return Inertia::render('User/Show', ['posts' => $formattedPosts]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Publication $publication)
    {
        //formulário de edição
        $publication = Publication::findOrFail($id);

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
                'username' => $publiation->user->username,
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
