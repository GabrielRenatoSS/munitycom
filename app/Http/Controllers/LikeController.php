<?php

namespace App\Http\Controllers;

use App\Models\Like;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LikeController extends Controller
{
    public function toggle(Post $post)
    {
        auth()->user()->likedPosts()->toggle($post->id);
        return back();
    }    
}
