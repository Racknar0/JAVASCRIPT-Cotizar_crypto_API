const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
};

// Crear un Promise
const obtenerCriptomonedas = (criptomonedas) =>
    new Promise((resolve) => {
        resolve(criptomonedas);
    });

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedasSelect.addEventListener('change', leerValor);
    monedaSelect.addEventListener('change', leerValor);
});

async function consultarCriptomonedas() {
    const url =
        'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD';

   /*  fetch(url)
        .then((respuesta) => respuesta.json())
        .then((resultado) => obtenerCriptomonedas(resultado.Data))
        .then((criptomonedas) => selectCriptomonedas(criptomonedas));
 */

    //! Migracion a Async - Await
    try {
        const repuesta = await fetch(url); //!await - URL
        const resultado = await repuesta.json(); //!await - JSON
        const criptomonedas = await obtenerCriptomonedas(resultado.Data);
        selectCriptomonedas(criptomonedas);

    } catch (error) {
        console.log(error);
    }
}

function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach((cripto) => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    });
}

function leerValor(e) {
    objBusqueda[e.target.name] = e.target.value;
}

function submitFormulario(e) {
    e.preventDefault();

    //! validar form
    const { moneda, criptomoneda } = objBusqueda;

    if (moneda === '' || criptomoneda === '') {
        mostrarAlerta('Ambos campos son obligatorios');
        return;
    }

    consultarAPI();

}

function mostrarAlerta(mensaje) {
    const existeError = document.querySelector('.error');

    if (!existeError) {
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('error');

        //!mensaje error
        divMensaje.textContent = mensaje;

        formulario.appendChild(divMensaje);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }
}

async function consultarAPI() {
    const {moneda, criptomoneda} = objBusqueda;

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    mostrarSpinner();

        /* fetch ( url ) 
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarCotizacionHTML (cotizacion.DISPLAY[criptomoneda][moneda]);
        } ) */

        //! Migracion Async - Await
        try {
            const respuesta = await fetch ( url );
            const cotizacion = await respuesta.json();
            setTimeout(() => {
                mostrarCotizacionHTML (cotizacion.DISPLAY[criptomoneda][moneda]);
            }, 2500);

        } catch (error) {
            console.log(error);
        }

}


function mostrarCotizacionHTML ( cotizacion ) {

    limpiarHTML ( );

   const {PRICE , HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion;

   const precio = document.createElement('P');
   precio.classList.add('precio');
   precio.innerHTML = `El precio es: <span>${PRICE}</span>`;

    const precioAlto = document.createElement('P');
    precioAlto.innerHTML = `<p>El precio mas alto del dia: <span>${HIGHDAY}</span>`;

    const precioBajo = document.createElement('P');
    precioBajo.innerHTML = `<p>El precio mas bajo del dia: <span>${LOWDAY}</span>`;

    const ultimasHoras = document.createElement('P');
    ultimasHoras.innerHTML = `<p>Variación ultimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`; 

    const ultimaActualizacion = document.createElement('P');
    ultimaActualizacion.innerHTML = `<p>Última actualización: <span>${LASTUPDATE}</span>`; 



   resultado.appendChild(precio);
   resultado.appendChild(precioAlto);
   resultado.appendChild(precioBajo);
   resultado.appendChild(ultimasHoras);
   resultado.appendChild(ultimaActualizacion);
}


function limpiarHTML ( ) {
    while (resultado.firstChild) {
        resultado.removeChild(resultado.firstElementChild)
    }
};

function mostrarSpinner() {

    limpiarHTML ( );

    const spinner = document.createElement('DIV');
    spinner.classList.add('spinner');

    spinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;

    resultado.appendChild(spinner)
}