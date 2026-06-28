<?php

namespace App\Http\Controllers;

use App\Models\Comentario;
use App\Models\Notificacao;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Publication;

class ComentarioController extends Controller
{
    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        if (Auth::user()->progresso < 3 && Auth::user()->tipo < 1) {
            abort(403);
        }

        $validated = $request->validate([
            'texto'          => 'required|string',
            'publication_id' => 'required|exists:publications,id',
        ]);

        $comentario = Comentario::create([
            'texto'          => $validated['texto'],
            'publication_id' => $validated['publication_id'],
            'user_id'        => Auth::id(),
        ]);

        $post = Publication::find($validated['publication_id']);

        if ($post->user_id !== Auth::id()) {
            Notificacao::create([
                'user_id'       => $post->user_id,
                'comentario_id' => $comentario->id,
                'tipo'          => 1,
                'leitura'       => false,
            ]);
        }

        $user = Auth::user();

        return response()->json([
            'id'         => $comentario->id,
            'texto'      => $comentario->texto,
            'created_at' => $comentario->created_at->diffForHumans(),
            'username'   => $user->username,
            'user_foto' => $user->foto 
                ? Storage::url($user->foto) 
                : Storage::url('fotos_usuarios/foto.jpg'),
            'can_edit'   => true,
            'can_delete' => true,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Comentario $comentario)
    {
        if (Auth::id() !== $comentario->user_id) {
            abort(403);
        }

        if ($comentario->created_at->diffInMinutes(now()) >= 20) {
            abort(403);
        }

        $validated = $request->validate([
            'texto' => 'required|string',
        ]);

        $comentario->update($validated);

        return response()->json([
            'texto' => $comentario->texto,
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Comentario $comentario)
    {
        $ehAutor = Auth::id() === $comentario->user_id;

        $ehDonoDaPublicacao = Publication::where('id', $comentario->publication_id)
            ->where('user_id', Auth::id())
            ->exists();

        if (!$ehAutor && !$ehDonoDaPublicacao) {
            abort(403);
        }

        $comentario->delete();

        return redirect()->back()->with('success', 'Comentário removido!');
    }
}
