<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comite extends Model
{
    protected $fillable = [
        'name',
        'edicao_id',
    ];

    public function edicao() {
        return $this->belongsTo(Edicao::class);
    }

    public function membros() {
        return $this->hasMany(MembroComite::class);
    }

    public function documentos()
    {
        return $this->hasMany(Documento::class);
    }

    public function spotteds()
    {
        return $this->hasMany(Spotted::class);
    }
}
