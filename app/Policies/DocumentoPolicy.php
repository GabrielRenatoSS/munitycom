<?php

namespace App\Policies;

use App\Models\Documento;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class DocumentoPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Documento $documento): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can update the model.
     */
    private function podeGerenciar(User $user, Documento $documento): bool
    {
        $ehPatrocinador = Patrocinador::where('documento_id', $documento->id)
            ->whereHas('delegado', fn($q) => $q->where('user_id', $user->id))
            ->exists();

        if ($ehPatrocinador) return true;

        $ehMun = $user->mun->comites()
            ->where('comites.id', $documento->comite_id)
            ->exists();

        if ($ehMun) return true;

        return MembroComite::where('user_id', $user->id)
            ->where('comite_id', $documento->comite_id)
            ->whereRaw('LOWER(delegacao) IN (?)', [['chair', 'mesa', 'mesa diretora']])
            ->exists();
    }

    public function update(User $user, Documento $documento): bool
    {
        return $this->podeGerenciar($user, $documento);
    }

    public function delete(User $user, Documento $documento): bool
    {
        return $this->podeGerenciar($user, $documento);
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Documento $documento): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Documento $documento): bool
    {
        return false;
    }
}
