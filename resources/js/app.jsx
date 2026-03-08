import React from 'react'
import ReactDOM from 'react-dom/client'
import '../css/app.css';

function App() {
    return (
        <div className="bg-red-500 text-white p-10">
            TESTE TAILWIND
        </div>
    )
}
ReactDOM.createRoot(document.getElementById('app')).render(<App />)

//aqui tu vai ter que tirar oq tá e configurar algo sobre a navegação de páginas, mas não sei pq não sei React
