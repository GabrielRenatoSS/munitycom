<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Publication extends Model
{
    /** @use HasFactory<\Database\Factories\PublicationFactory> */
    use HasFactory;

    protected $fillable = [
        'type',
        'mun',
        'comite',
        'delegation',
        'descricao',
        'video',
        'fixo',
        'user_id',
    ];

    public function images() {
        return $this->hasMany(PublicationImage::class)->orderBy('order', 'asc');
    }

    public function user() {
        return $this->belongsTo(User::class);
    }
}
