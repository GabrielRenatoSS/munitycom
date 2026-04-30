<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Documento extends Model
{
    /** @use HasFactory<\Database\Factories\DocumentoFactory> */
    use HasFactory;

    protected $fillable = [
        'tipo',
        'conteudo',
        'comite_id',
        'brasao',
        'foto1',
        'foto2',
        'foto3',
        'foto4',
    ];

    public function comite()
    {
        return $this->belongsTo(Comite::class);
    }

    public function patrocinadores()
    {
        return $this->hasMany(Patrocinador::class);
    }

    public function signatarios()
    {
        return $this->hasMany(Signatario::class);
    }
}
