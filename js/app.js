const criptomonedasSelect = document.querySelector('#criptomonedas');

// Crear un Promise
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});



document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();
})

function consultarCriptomonedas() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch ( url )
        .then (respuesta => respuesta.json() )
        .then (resultado => obtenerCriptomonedas(resultado.Data))
        .then ( criptomonedas => selectCriptomonedas(criptomonedas) ) 
};

 function selectCriptomonedas(criptomonedas) {
    criptomonedas.forEach( cripto => {
        const {FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('OPTION');
        option.value = Name;
        option.textContent = FullName;

        criptomonedasSelect.appendChild(option);
    })
 }