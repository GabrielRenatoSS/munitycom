<?php

namespace App\Http\Controllers;

use App\Models\Follower;
use Illuminate\Http\Request;

class FollowerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'following_id' => 'required|exists:users,id',
        ]);

        if (Auth::id() == $request->following_id) {
            return back();
        }

        Follower::firstOrCreate([
            'follower_id'  => Auth::id(),        // Quem está logado
            'following_id' => $request->following_id, // Quem ele quer seguir
        ]);

        return back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Follower $follower)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Follower $follower)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Follower $follower)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        Follower::where('follower_id', Auth::id())
            ->where('following_id', $id)
            ->delete();
        return back();
    }
}
