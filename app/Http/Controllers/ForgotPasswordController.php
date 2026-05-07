<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Mail\ResetCodeMail;
use App\Models\PasswordResetCode;
use Illuminate\Support\Facades\Mail;

class ForgotPasswordController extends Controller
{
    public function show()
    {
        return view('auth.forgot-password');
    }

    public function send(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        PasswordResetCode::where('email', $request->email)->delete();

        $code = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        PasswordResetCode::create([
            'email'      => $request->email,
            'code'       => $code,
            'expires_at' => now()->addMinutes(15),
        ]);

        Mail::to($request->email)->send(new ResetCodeMail($code));

        session(['reset_email' => $request->email]);

        return redirect()->route('verify-code.show');
    }
}
