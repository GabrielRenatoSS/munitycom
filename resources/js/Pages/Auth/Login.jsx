import { useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        password: '',
        username: '',
        //deixei o nome dos campos name como tem que ser pra ir pro back igual do BD
    });

    function submit(e) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div> 
            //aqui tu faz o form
            
        </div>
    );
}