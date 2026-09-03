const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";
const resultado = document.getElementById("resultado");


// 1) Encontra o botão que possui id="buscar"
const botaoBuscar = document.getElementById("buscar");

// 2) Liga o clique do botão à função buscarClima
botaoBuscar.addEventListener("click", buscarClima);

// 3) Esta função será executada a cada clique
function buscarClima() {
  console.log("O botão foi clicado!");
}

function buscarClima() {

  // Encontra o input com id="cidade"
  const campoCidade = document.getElementById("cidade");

  // .value pega o que o usuário digitou
  // .trim() remove espaços extras no início/fim
  const cidade = campoCidade.value.trim();

  console.log("Cidade digitada:", cidade);

  if (cidade === "") {
  alert("Digite o nome de uma cidade.");
  return;
}

// 1) Descobre a latitude e a longitude da cidade digitada
const urlBusca =
  `${GEO_URL}?name=${encodeURIComponent(cidade)}` +
  `&count=1&language=pt&format=json`;

fetch(urlBusca)
  .then(resposta => resposta.json())
  .then(dadosCidade => {
    const { latitude, longitude } = dadosCidade.results[0];

    // 2) Usa a latitude e a longitude para consultar o clima
    const urlClima =
      `${CLIMA_URL}?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m` +
      `,wind_speed_10m,weather_code`;

    return fetch(urlClima);
  })




  .then(resposta => resposta.json())
  .then(dadosClima => {
    console.log(dadosClima);
    const temperatura = dadosClima.current.temperature_2m;
    const umidade = dadosClima.current.relative_humidity_2m;
    const vento = dadosClima.current.wind_speed_10m;

    console.log("Temperatura:", temperatura);
    console.log("Umidade:", umidade);
    console.log("Vento:", vento);
              resultado.innerHTML = `
          <div class="card-clima">
            <h2>${cidade}</h2>

            <p>
              Temperatura:
              <strong>${temperatura} °C</strong>
            </p>

            <p>
              Umidade:
              <strong>${umidade}%</strong>
            </p>

            <p>
              Vento:
              <strong>${vento} km/h</strong>
            </p>
          </div>
        `;
  });
    
  
    fetch(url)
    .then(resposta => {

      // Verifica se o servidor respondeu com sucesso
      if (!resposta.ok) {
        throw new Error("Não foi possível consultar a cidade.");
      }

      // Converte o corpo da resposta para JSON
      return resposta.json();
    })
    .then(dados => {


      // Por enquanto, apenas observe o JSON
      console.log(dados);
    })
    .catch(erro => {

      console.error(erro);
    });



  
}

if ('serviceWorker' in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => {console.log('Service Worker registrado com sucesso!');
      })
      .catch((erro) => {console.log('Falha ao registrar o Service Worker:', erro);
      });
  });
}