<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Spotted extends Model
{
    /** @use HasFactory<\Database\Factories\SpottedFactory> */
    use HasFactory;

    protected $fillable = [
        'tipo',
        'remetente_id',
        'destinatario_id',
        'comite_id',
        'mensagem',
        'anonimo',
    ];

    public function remetente()
    {
        return $this->belongsTo(MembroComite::class, 'remetente_id');
    }

    public function destinatario()
    {
        return $this->belongsTo(MembroComite::class, 'destinatario_id');
    }

    public function comite()
    {
        return $this->belongsTo(Comite::class);
    }
}
