<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void {
        $users = [
            [
                'name'       => 'Gabriel Renato de Souza Silveira',
                'email'      => 'gabolinosouzasilveira@gmail.com',
                'password'   => Hash::make('password123'),
                'username'   => 'gabrielrenato',
                'tipo'       => 0,
                'progresso'  => 0,
                'cidade'     => 'Taquaruçu do Sul',
                'estado'     => 'RS',
                'pais'       => 'Brasil',
                'bloqueio'   => false,
            ],
            [
                'name'       => 'IFFarMUNDI',
                'email'      => 'iffarmundi@gmail.com',
                'password'   => Hash::make('password123'),
                'username'   => 'iffarmundi',
                'tipo'       => 1,
                'progresso'  => 0,
                'cidade'     => 'Frederico Westphalen',
                'estado'     => 'RS',
                'pais'       => 'Brasil',
                'bloqueio'   => false,
            ],
            [
                'name'       => 'Administrador',
                'email'      => 'munitycom.social@gmail.com',
                'password'   => Hash::make('password123'),
                'username'   => 'munitycom',
                'tipo'       => 2,
                'progresso'  => 0,
                'cidade'     => 'Porto Alegre',
                'estado'     => 'RS',
                'pais'       => 'Brasil',
                'bloqueio'   => false,
            ],
        ];

        foreach ($users as $user) {
            User::firstOrCreate(
                ['email' => $user['email']],
                $user
            );
        }
    }
}
