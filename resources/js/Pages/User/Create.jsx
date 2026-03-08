//formulário de cadastro aqui

/*não entendo nada de react e inertia.js (oq, pelo visto, é pra usar)
    mas pra funcionar, é pra ter isso aqui
    good luck
*/

import { useForm } from '@inertiajs/react';

//ele manda pra function Create do UserController (backend)
export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        username: '',
        tipo: '',
        foto: '',
        estado: '',
        pais: '',
        cidade: '',
        //deixei o nome dos campos name como tem que ser pra ir pro back igual do BD
    });

    function submit(e) {
        e.preventDefault();
        post('/users');
    }

    return (
        <div> 
            //aqui tu faz o form
            
        </div>
    );
}

//me dá um feedback se isso aqui fez sentido, pq não entendo NADA de react