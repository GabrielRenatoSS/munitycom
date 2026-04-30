<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Signatario extends Model
{
    protected $fillable = [
        'documento_id',
        'delegado_id',
    ];

    public function delegado()
    {
        return $this->belongsTo(MembroComite::class, 'delegado_id');
    }

    public function documento()
    {
        return $this->belongsTo(Documento::class);
    }
}
