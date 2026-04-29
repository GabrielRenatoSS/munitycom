<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = ['name', 'email', 'password', 'username', 'tipo', 'foto', 'estado', 'pais', 'cidade',];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function following(): BelongsToMany {
        return $this->belongsToMany(
            User::class,  
            'followers',  
            'follower_id', 
            'following_id' 
        );
    }

    public function followers(): BelongsToMany {
        return $this->belongsToMany(
            User::class, 
            'followers', 
            'following_id',
            'follower_id'
        );
    }

    public function isFollowing(User $user) {
        return $this->following()->where('following_id', $user->id)->exists();
    }

    public function isMun() {
        return $this->tipo === 1;
    }

    public function interests() {
        return $this->belongsToMany(User::class, 'interests', 'delegate_id', 'mun_id');
    }

    public function likedPosts() {
        return $this->belongsToMany(Publication::class, 'likes');
    }

    public function participacoesSecretariado() {
        return $this->hasMany(Secretariado::class);
    }

    public function participacoesComites() {
        return $this->hasMany(MembroComite::class);
    }

    public function edicoes() {
        return $this->hasMany(Edicao::class);
    }

    // Prêmios que este usuário recebeu
    public function awards() {
        return $this->hasMany(Award::class, 'user_id');
    }

    // Prêmios que esta MUN criou/deu para outros
    public function createdAwards() {
        return $this->hasMany(Award::class, 'mun_id');
    }
}
