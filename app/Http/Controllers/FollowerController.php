<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use App\Models\User; 
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

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
            Follower::create([
                'follower_id'  => $authId,
                'following_id' => $targetId,
            ]);
        }

        return back();
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

        return back();
    }

    //aliados de conferência
    public function friends(User $user)
    {
        $authId = $user->id;

        return User::whereIn('id', function($query) use ($authId) {
                $query->select('following_id')
                    ->from('followers')
                    ->where('follower_id', $authId)
                    ->whereIn('following_id', function($q) use ($authId) {
                        $q->select('follower_id')
                          ->from('followers')
                          ->where('following_id', $authId);
                    });
            })
            ->paginate(20)
            ->through(fn($u) => $this->formatUser($u));
    }

    //audiências diplomáricas
    public function followers(User $user)
    {
        return $user->followers()
            ->with('follower')
            ->paginate(20)
            ->through(fn($u) => $this->formatUser($u));
    }

    //contatos diplomáticos
    public function following(User $user)
    {
        return $user->following()
            ->paginate(20)
            ->through(fn($u) => $this->formatUser($u));
    }    

    private function formatUser($user)
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'username' => $user->username,
            'foto' => $user->foto ? asset('storage/' . $user->foto) : '/fotos_usuarios/foto.png',
        ];
    }
}