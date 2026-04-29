<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Edicao extends Model
{
    /** @use HasFactory<\Database\Factories\EdicaoFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'user_id',
        'numero',
        'ano',
        'dt_inicio',
        'dt_termino',
    ];

    public function secretariado() {
        return $this->hasMany(Secretariado::class);
    }

    public function comites() {
        return $this->hasMany(Comite::class);
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
