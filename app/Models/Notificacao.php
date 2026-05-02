<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Notificacao extends Model
{
    protected $fillable = [
        'like_id',
        'user_id',
        'follower_id',
        'leitura',
        'tipo',
        'spotted_id',
        'comentario_id',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function like()
    {
        return $this->belongsTo(Like::class);
    }

    public function comentario()
    {
        return $this->belongsTo(Comentario::class);
    }

    public function follower()
    {
        return $this->belongsTo(Follower::class);
    }

    public function spotted()
    {
        return $this->belongsTo(Spotted::class);
    }
}
