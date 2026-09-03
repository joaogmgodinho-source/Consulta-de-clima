const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const CLIMA_URL = "https://api.open-meteo.com/v1/forecast";

const resultado = document.getElementById("resultado");
const botaoBuscar = document.getElementById("buscar");

botaoBuscar.addEventListener("click", buscarClima);

function buscarClima() {
  const campoCidade = document.getElementById("cidade");
  const cidade = campoCidade.value.trim();

  if (cidade === "") {
    resultado.innerHTML = '<p style="color: #d9534f;">Por favor, digite o nome de uma cidade.</p>';
    return;
  }

  // 1. Exibe a mensagem enquanto carrega os dados
  resultado.innerHTML = "<p>Procurando resultados...</p>";

  // 2. Busca a latitude e a longitude da cidade
  const urlBusca = `${GEO_URL}?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`;

  fetch(urlBusca)
    .then(resposta => {
      if (!resposta.ok) {
        throw new Error("Erro na requisição");
      }
      return resposta.json();
    })
    .then(dadosCidade => {
      // Verifica se a API Open-Meteo encontrou a cidade
      if (!dadosCidade.results || dadosCidade.results.length === 0) {
        throw new Error("cidade_nao_encontrada");
      }

      const { latitude, longitude, name } = dadosCidade.results[0];

      // 3. Usa a latitude e longitude para buscar o clima
      const urlClima = `${CLIMA_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;

      return fetch(urlClima)
        .then(resp => resp.json())
        .then(dadosClima => ({ dadosClima, nomeCidade: name }));
    })
    .then(({ dadosClima, nomeCidade }) => {
      const temperatura = dadosClima.current.temperature_2m;
      const umidade = dadosClima.current.relative_humidity_2m;
      const vento = dadosClima.current.wind_speed_10m;

      // 4. Exibe o card com o resultado na tela
      resultado.innerHTML = `
        <div class="card-clima">
          <h2>${nomeCidade}</h2>
          <p>Temperatura: <strong>${temperatura} °C</strong></p>
          <p>Umidade: <strong>${umidade}%</strong></p>
          <p>Vento: <strong>${vento} km/h</strong></p>
        </div>
      `;
    })
    .catch(erro => {
      // 5. Trata a exibição do erro caso a cidade não seja encontrada
      if (erro.message === "cidade_nao_encontrada") {
        resultado.innerHTML = '<p style="color: #d9534f; font-weight: bold;">Cidade não encontrada. Verifique o nome e tente novamente!</p>';
      } else {
        resultado.innerHTML = '<p style="color: #d9534f;">Não foi possível consultar o clima. Tente novamente mais tarde.</p>';
      }
      console.error(erro);
    });
}

// Registro do Service Worker para a PWA
if ('serviceWorker' in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register('./sw.js')
      .then(() => console.log('Service Worker registrado com sucesso!'))
      .catch((erro) => console.log('Falha ao registrar o Service Worker:', erro));
  });
}