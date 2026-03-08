<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Award extends Model
{
    /** @use HasFactory<\Database\Factories\AwardFactory> */
    use HasFactory;

    protected $fillable = [
        'name',
        'tipo',
        'mun',
        'delegation',
        'comite',
        'user_id',
        'mun_id',
    ];

    public function user() {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function creator() {
        return $this->belongsTo(User::class, 'mun_id');
    }
}
