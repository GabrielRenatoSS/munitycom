<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class InterestController extends Controller
{
    public function toggle(Request $request)
    {
        $request->validate([
            'mun_id' => 'required|exists:users,id',
        ]);

        $user = Auth::user();
        $mun = User::findOrFail($request->mun_id);

        if ($user->tipo !== 0 || $mun->tipo !== 1) {
            return back()->with('error', 'Ação não permitida.');
        }

        $user->interests()->toggle($mun->id);

        return back();
    }
}
