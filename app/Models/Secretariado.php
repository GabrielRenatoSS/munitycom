<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Secretariado extends Model
{
    protected $fillable = [
        'cargo',
        'user_id',
        'edicao_id',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function edicao() {
        return $this->belongsTo(Edicao::class);
    }
}
