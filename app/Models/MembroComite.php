<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MembroComite extends Model
{
    protected $fillable = [
        'comite_id',
        'user_id',
        'delegacao',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }

    public function comite() {
        return $this->belongsTo(Comite::class);
    }

    public function spottetsEnviados()
    {
        return $this->hasMany(Spotted::class, 'remetente_id');
    }

    public function spottetsRecebidos()
    {
        return $this->hasMany(Spotted::class, 'destinatario_id');
    }
}
