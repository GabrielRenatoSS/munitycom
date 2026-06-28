<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Notificacao;

class FollowerController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'following_id' => 'required|exists:users,id',
        ]);

        $authId = Auth::id();
        $targetId = $request->following_id;

        if ($authId == $targetId) {
            return back();
        }

        $follow = Follower::where('follower_id', $authId)
            ->where('following_id', $targetId)
            ->first();

        if ($follow) {
            $follow->delete();
        } else {
            $follow = Follower::create([
                'follower_id'  => $authId,
                'following_id' => $targetId,
            ]);

            $userSeguido = User::find($targetId);
            $this->atualizarProgresso($userSeguido);

            Notificacao::create([
                'user_id'     => $targetId,
                'follower_id' => $follow->id,
                'like_id'     => null,
                'tipo'        => 2,
                'leitura'     => false,
            ]);
        }

        return response()->json(['following' => !$follow]);
    }

    private function atualizarProgresso(User $user): void
    {
        if ($user->tipo !== 0) return;
    
        $seguidores = Follower::where('following_id', $user->id)->count();

        $novoProgresso = match(true) {
            $seguidores >= 10000 => 7,
            $seguidores >= 1000  => 6,
            $seguidores >= 500   => 5,
            $seguidores >= 200   => 4,
            $seguidores >= 100   => 3,
            $seguidores >= 50    => 2,
            $seguidores >= 10    => 1,
            default              => 0,
        };

        if ($novoProgresso > $user->progresso) {
            $user->update(['progresso' => $novoProgresso]);

            Notificacao::create([
                'user_id' => $user->id,
                'tipo'    => 4,
                'leitura' => false,
            ]);
        }
    }

    public function removeFollower(Request $request)
    {
        $request->validate([
            'follower_id' => 'required|exists:users,id',
        ]);

        $authId = Auth::id();
        $targetId = $request->follower_id;

        Follower::where('follower_id', $targetId)
            ->where('following_id', $authId)
            ->delete();

        return response()->json(['ok' => true]);
    }

    // audiências diplomáticas — quem te segue
    public function followers(User $user)
    {
        $authId = Auth::id();

        return Follower::where('following_id', $user->id)
            ->with('follower')
            ->paginate(20)
            ->through(fn($f) => $this->formatUser($f->follower, $authId));
    }

    // contatos diplomáticos — quem você segue
    public function following(User $user)
    {
        $authId = Auth::id();

        return Follower::where('follower_id', $user->id)
            ->with('following')
            ->paginate(20)
            ->through(fn($f) => $this->formatUser($f->following, $authId));
    }

    // aliados de conferência — seguimento mútuo
    public function friends(User $user)
    {
        $authId = Auth::id();
        $userId = $user->id;

        return User::whereIn('id', function($query) use ($userId) {
                $query->select('following_id')
                    ->from('followers')
                    ->where('follower_id', $userId)
                    ->whereIn('following_id', function($q) use ($userId) {
                        $q->select('follower_id')
                          ->from('followers')
                          ->where('following_id', $userId);
                    });
            })
            ->paginate(20)
            ->through(fn($u) => $this->formatUser($u, $authId));
    }

    private function formatUser(User $user, int $authId)
    {
        return [
            'id'           => $user->id,
            'name'         => $user->name,
            'username'     => $user->username,
            'foto' => $user->foto 
                ? Storage::url($user->foto) 
                : Storage::url('fotos_usuarios/foto.jpg'),
            'is_following' => Follower::where('follower_id', $authId)
                                ->where('following_id', $user->id)
                                ->exists(),
        ];
    }
}
