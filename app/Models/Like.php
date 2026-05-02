<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Like extends Model
{
    /** @use HasFactory<\Database\Factories\LikeFactory> */
    use HasFactory;

    protected $fillable = [
        'publication_id',
        'user_id',
    ];

    public function notificacao()
    {
        return $this->hasOne(Notificacao::class);
    }

    public function publication()
    {
        return $this->belongsTo(Publication::class, 'publication_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
