<?php

namespace App\Http\Controllers;

use App\Models\Feedback;
use Illuminate\Http\Request;

class FeedbackController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $feedbacks = Feedback::where('leitura', false)
            ->orderBy('id')
            ->paginate(20);

        return Inertia::render('Feedback/Index', [
            'feedbacks' => $feedbacks,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Feedback/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'mensagem' => 'required|string',
        ]);

        Feedback::create([
            'mensagem' => $validated['mensagem'],
            'leitura'  => false,
        ]);

        return redirect()->back();
    }

    public function toggleLeitura(Feedback $feedback)
    {
        $feedback->update(['leitura' => !$feedback->leitura]);

        return redirect()->back();
    }
}
