<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PublicationImage extends Model
{
    use HasFactory;

    protected $fillable = [
        'publication_id',
        'path',
        'order'
    ];

    public function publication() {
        return $this->belongsTo(Publication::class);
    }
}
