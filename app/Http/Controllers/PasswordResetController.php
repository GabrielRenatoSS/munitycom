<?php

namespace App\Http\Controllers;

use App\Models\PasswordResetCode;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class ResetPasswordController extends Controller
{

    public function showCode()
    {
        if (!session('reset_email')) {
            return redirect()->route('forgot-password.show');
        }

        return view('auth.verify-code');
    }

    public function verifyCode(Request $request)
    {
        $request->validate(['code' => 'required|digits:6']);

        $record = PasswordResetCode::where('email', session('reset_email'))
            ->where('code', $request->code)
            ->first();

        if (!$record || $record->isExpired()) {
            return back()->withErrors(['code' => 'Código inválido ou expirado.']);
        }

        session(['reset_verified' => true]);

        return redirect()->route('reset-password.show');
    }

    public function showReset()
    {
        if (!session('reset_verified')) {
            return redirect()->route('forgot-password.show');
        }

        return view('auth.reset-password');
    }

    public function reset(Request $request)
    {
        $request->validate([
            'password' => 'required|min:8|confirmed',
        ]);

        if (!session('reset_verified') || !session('reset_email')) {
            return redirect()->route('forgot-password.show');
        }

        User::where('email', session('reset_email'))
            ->update(['password' => Hash::make($request->password)]);

        PasswordResetCode::where('email', session('reset_email'))->delete();
        session()->forget(['reset_email', 'reset_verified']);

        return redirect()->route('login')->with('success', 'Senha redefinida com sucesso!');
    }
}