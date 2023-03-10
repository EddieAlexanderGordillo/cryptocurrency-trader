const criptoMonedasSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const objBusqueda = {
  moneda: '',
  criptomoneda: '',
};

// crear un promise
const obtenerCriptomonedas = (criptomonedas) =>
  new Promise((resolve) => {
    resolve(criptomonedas);
  });

document.addEventListener('DOMContentLoaded', () => {
  consultarCriptomonedas();
  formulario.addEventListener('submit', submitFormulario);
  criptoMonedasSelect.addEventListener('change', leerValor);
  monedaSelect.addEventListener('change', leerValor);
});
// Consulta la API par aobtener un listado de Criptomoneda
function consultarCriptomonedas() {
  // Ir  AtoPLISTS Y Despues market capp
  const url =
    'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=20&tsym=USD';
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => obtenerCriptomonedas(resultado.Data))
    .then((criptomonedas) => selectCriptomonedas(criptomonedas))
    .catch((error) => console.log(error));
}
// llena el select
function selectCriptomonedas(criptomonedas) {
  criptomonedas.forEach((cripto) => {
    const { FullName, Name } = cripto.CoinInfo;
    const option = document.createElement('option');
    option.value = Name;
    option.textContent = FullName;
    criptoMonedasSelect.appendChild(option);
  });
}

function leerValor(e) {
  objBusqueda[e.target.name] = e.target.value;
  console.log(objBusqueda);
}

function submitFormulario(e) {
  e.preventDefault();
  //   validar
  const { moneda, criptomoneda } = objBusqueda;
  if (moneda === '' || criptomoneda === '') {
    mostrarAlerta('Ambos campos son obligatorios');
    return;
  }
  //   consultar la Api con los resultados
  consultarAPI();
}

function mostrarAlerta(mensaje) {
  const exixteAlerta = document.querySelector('.alerta__eror');
  if (!exixteAlerta) {
    const divMensaje = document.createElement('div');
    divMensaje.classList.add('alerta__error');
    divMensaje.textContent = mensaje;
    formulario.appendChild(divMensaje);
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}

function consultarAPI() {
  const { moneda, criptomoneda } = objBusqueda;
  const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`;
  mostrarSpinner();
  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((cotizacion) => {
      console.log(cotizacion.DISPLAY[criptomoneda][moneda]);
      mostrarCotizacionHtml(cotizacion.DISPLAY[criptomoneda][moneda]);
    });
}

function mostrarCotizacionHtml(cotizacion) {
  limpiarHTML();
  const { PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE } = cotizacion;
  const precio = document.createElement('p');
  precio.classList.add('precio');
  precio.innerHTML = `El Precio es: <span>${PRICE}</span>`;

  const precioAlto = document.createElement('p');
  precioAlto.classList.add('info');
  precioAlto.innerHTML = `El Precio más alto del día: <span>${HIGHDAY}</span>`;

  const precioBajo = document.createElement('p');
  precioBajo.classList.add('info');
  precioBajo.innerHTML = `El Precio más bajo del día: <span>${LOWDAY}</span>`;

  const ultimasHoras = document.createElement('p');
  ultimasHoras.classList.add('info');
  ultimasHoras.innerHTML = `Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span>`;

  const ultimaActualizacion = document.createElement('p');
  ultimaActualizacion.classList.add('info');
  ultimaActualizacion.innerHTML = `Última actualización: <span>${LASTUPDATE}</span>`;

  resultado.appendChild(precio);
  resultado.appendChild(precioAlto);
  resultado.appendChild(precioBajo);
  resultado.appendChild(ultimasHoras);
  resultado.appendChild(ultimaActualizacion);

  formulario.appendChild(resultado);
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function mostrarSpinner() {
  limpiarHTML();
  const divSpinner = document.createElement('div');
  divSpinner.classList.add('spinner');
  divSpinner.innerHTML = `
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    `;
  resultado.appendChild(divSpinner);
}
