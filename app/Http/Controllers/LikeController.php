<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use App\Models\Publication;
use App\Models\Notificacao;
use Illuminate\Support\Facades\Auth;

class LikeController extends Controller
{
    public function toggle(Publication $publication)
    {
        $authId = Auth::id();

        $like = Like::where('user_id', $authId)
            ->where('publication_id', $publication->id)
            ->first();

        if ($like) {
            $like->delete();
        } else {
            $like = Like::create([
                'user_id'        => $authId,
                'publication_id' => $publication->id,
            ]);

            if ($publication->user_id !== $authId) {
                Notificacao::create([
                    'user_id' => $publication->user_id,
                    'like_id' => $like->id,
                    'tipo'    => 0,
                    'leitura' => false,
                ]);
            }
        }

        return back();
    } 
}
