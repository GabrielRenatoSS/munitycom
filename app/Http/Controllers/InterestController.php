<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

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
            return response()->json(['error' => 'Ação não permitida.'], 403);
        }

        $exists = DB::table('interests')
            ->where('delegate_id', $user->id)
            ->where('mun_id', $mun->id)
            ->exists();

        if ($exists) {
            DB::table('interests')
                ->where('delegate_id', $user->id)
                ->where('mun_id', $mun->id)
                ->delete();
        } else {
            DB::table('interests')->insert([
                'delegate_id' => $user->id,
                'mun_id'      => $mun->id,
                'created_at'  => now(),
                'updated_at'  => now(),
            ]);
        }

        return response()->json(['ok' => true]);
    }
}
