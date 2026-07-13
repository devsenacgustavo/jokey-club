/* ==========================================================================
   DADOS DOS CAVALOS
   Para adicionar/remover um cavalo, basta editar esta lista.
   - numero: número do cavalo no páreo
   - nome: nome do cavalo
   - joquei: nome do jóquei
   - odd: cotação (multiplica o valor apostado se o cavalo ganhar)
   - cor: cor da "sedinha" do jóquei (usada na borda do cartão)
   ========================================================================== */
const cavalos = [
  {
    numero: 1,
    nome: "Trovão Negro",
    joquei: "Ricardo Alves",
    odd: 3.5,
    cor: "#2C2C2C",
  },
  {
    numero: 2,
    nome: "Fúria Dourada",
    joquei: "Mariana Costa",
    odd: 2.8,
    cor: "#C89B3C",
  },
  {
    numero: 3,
    nome: "Vento Sul",
    joquei: "Paulo Henrique",
    odd: 5.0,
    cor: "#3E6B8A",
  },
  {
    numero: 4,
    nome: "Relâmpago Azul",
    joquei: "Carla Souza",
    odd: 4.2,
    cor: "#2F5D9C",
  },
  {
    numero: 5,
    nome: "Estrela do Norte",
    joquei: "Fernando Lima",
    odd: 6.5,
    cor: "#6A4C93",
  },
  {
    numero: 6,
    nome: "Coragem Real",
    joquei: "Juliana Prado",
    odd: 3.0,
    cor: "#B3231C",
  },
  {
    numero: 7,
    nome: "Sombra Veloz",
    joquei: "André Martins",
    odd: 7.0,
    cor: "#1B4332",
  },
  {
    numero: 8,
    nome: "Rainha do Turfe",
    joquei: "Beatriz Rocha",
    odd: 4.8,
    cor: "#8A5A44",
  },
];

/* ==========================================================================
   DADOS DAS CADEIRAS
   Fileiras de A a E, com 10 cadeiras cada.
   Algumas cadeiras já começam "ocupadas" para simular uma arquibancada real.
   ========================================================================== */
const fileiras = ["A", "B", "C", "D", "E"];
const cadeirasPorFileira = 10;

// lista de cadeiras que já nascem ocupadas (edite como quiser)
const cadeirasOcupadas = ["A3", "A4", "B7", "C1", "C2", "D9", "E5", "E6"];

/* ==========================================================================
   ESTADO DA APLICAÇÃO
   Guarda o que o cliente já escolheu até agora.
   ========================================================================== */
let cavaloSelecionado = null; // vai guardar o objeto do cavalo escolhido
let cadeiraSelecionada = null; // vai guardar o texto da cadeira, ex: "B5"
let numeroDoBilhete = 1;

/* ==========================================================================
   REFERÊNCIAS AOS ELEMENTOS DO HTML
   ========================================================================== */
const horseGrid = document.getElementById("horse-grid");
const seatMap = document.getElementById("seat-map");

const betHorse = document.getElementById("bet-horse");
const betJockey = document.getElementById("bet-jockey");
const betSeat = document.getElementById("bet-seat");
const betAmount = document.getElementById("bet-amount");
const betPayout = document.getElementById("bet-payout");
const betErro = document.getElementById("bet-erro");
const btnConfirmar = document.getElementById("btn-confirmar");
const betForm = document.getElementById("bet-form");

const ticketList = document.getElementById("ticket-list");
const ticketVazio = document.getElementById("ticket-vazio");

/* ==========================================================================
   CRIAR OS CARTÕES DE CAVALO NA TELA
   ========================================================================== */
function montarCavalos() {
  cavalos.forEach((cavalo) => {
    const card = document.createElement("div");
    card.className = "horse-card";
    card.style.setProperty("--silk-color", cavalo.cor);

    card.innerHTML = `
      <div class="horse-top">
        <span class="horse-number">${cavalo.numero}</span>
        <span class="horse-name">${cavalo.nome}</span>
      </div>
      <p class="horse-jockey">Jóquei: <b>${cavalo.joquei}</b></p>
      <span class="horse-odds">Odd ${cavalo.odd.toFixed(1)}x</span>
    `;

    card.addEventListener("click", () => selecionarCavalo(cavalo, card));
    horseGrid.appendChild(card);
  });
}

function selecionarCavalo(cavalo, cardClicado) {
  cavaloSelecionado = cavalo;

  // remove o destaque de qualquer outro cartão e destaca só o clicado
  document
    .querySelectorAll(".horse-card")
    .forEach((c) => c.classList.remove("selecionado"));
  cardClicado.classList.add("selecionado");

  atualizarBilhete();
}

/* ==========================================================================
   CRIAR O MAPA DE CADEIRAS NA TELA
   ========================================================================== */
function montarCadeiras() {
  fileiras.forEach((fileira) => {
    const linha = document.createElement("div");
    linha.className = "seat-row";

    const rotulo = document.createElement("span");
    rotulo.className = "seat-row-label";
    rotulo.textContent = fileira;
    linha.appendChild(rotulo);

    for (let numero = 1; numero <= cadeirasPorFileira; numero++) {
      const codigoCadeira = fileira + numero; // exemplo: "B5"

      const botaoCadeira = document.createElement("button");
      botaoCadeira.className = "seat";
      botaoCadeira.textContent = numero;
      botaoCadeira.type = "button";

      if (cadeirasOcupadas.includes(codigoCadeira)) {
        botaoCadeira.classList.add("ocupada");
        botaoCadeira.disabled = true;
      } else {
        botaoCadeira.addEventListener("click", () =>
          selecionarCadeira(codigoCadeira, botaoCadeira),
        );
      }

      linha.appendChild(botaoCadeira);
    }

    seatMap.appendChild(linha);
  });
}

function selecionarCadeira(codigoCadeira, botaoClicado) {
  cadeiraSelecionada = codigoCadeira;

  // remove o destaque de qualquer outra cadeira livre e destaca só a clicada
  document
    .querySelectorAll(".seat:not(.ocupada)")
    .forEach((s) => s.classList.remove("selecionada"));
  botaoClicado.classList.add("selecionada");

  atualizarBilhete();
}

/* ==========================================================================
   ATUALIZAR O BILHETE DE APOSTA (painel do lado direito)
   ========================================================================== */
function atualizarBilhete() {
  betHorse.textContent = cavaloSelecionado
    ? `Nº ${cavaloSelecionado.numero} — ${cavaloSelecionado.nome}`
    : "— nenhum selecionado —";

  betJockey.textContent = cavaloSelecionado ? cavaloSelecionado.joquei : "—";

  betSeat.textContent = cadeiraSelecionada
    ? `Fileira ${cadeiraSelecionada[0]}, cadeira ${cadeiraSelecionada.slice(1)}`
    : "— nenhuma selecionada —";

  calcularRetorno();
}

function calcularRetorno() {
  const valor = parseFloat(betAmount.value) || 0;
  const odd = cavaloSelecionado ? cavaloSelecionado.odd : 0;
  const retorno = valor * odd;
  betPayout.textContent = formatarMoeda(retorno);
}

function formatarMoeda(valor) {
  return "R$ " + valor.toFixed(2).replace(".", ",");
}

/* ==========================================================================
   CONFIRMAR A APOSTA
   ========================================================================== */
function confirmarAposta() {
  betErro.textContent = "";

  if (!cavaloSelecionado) {
    betErro.textContent = "Escolha um cavalo antes de confirmar.";
    return;
  }
  if (!cadeiraSelecionada) {
    betErro.textContent = "Escolha uma cadeira antes de confirmar.";
    return;
  }

  const valor = parseFloat(betAmount.value);
  if (!valor || valor <= 0) {
    betErro.textContent = "Digite um valor de aposta válido.";
    return;
  }

  criarTicket(cavaloSelecionado, cadeiraSelecionada, valor);
  marcarCadeiraComoOcupada(cadeiraSelecionada);
  resetarSelecao();
}

function criarTicket(cavalo, cadeira, valor) {
  // some com a mensagem de "nenhuma aposta ainda", se ela existir
  if (ticketVazio) ticketVazio.remove();

  const retorno = valor * cavalo.odd;

  const ticket = document.createElement("div");
  ticket.className = "ticket-card";
  ticket.innerHTML = `
    <h4>Bilhete #${String(numeroDoBilhete).padStart(3, "0")}</h4>
    <p><b>Cavalo:</b> Nº ${cavalo.numero} — ${cavalo.nome}</p>
    <p><b>Jóquei:</b> ${cavalo.joquei}</p>
    <p><b>Cadeira:</b> Fileira ${cadeira[0]}, cadeira ${cadeira.slice(1)}</p>
    <p><b>Valor apostado:</b> ${formatarMoeda(valor)}</p>
    <p><b>Retorno se ganhar:</b> ${formatarMoeda(retorno)}</p>
  `;

  ticketList.appendChild(ticket);
  numeroDoBilhete++;
}

function marcarCadeiraComoOcupada(codigoCadeira) {
  cadeirasOcupadas.push(codigoCadeira);

  // encontra o botão da cadeira pelo texto e pela posição na fileira e a trava
  document.querySelectorAll(".seat.selecionada").forEach((botao) => {
    botao.classList.remove("selecionada");
    botao.classList.add("ocupada");
    botao.disabled = true;
    botao.replaceWith(botao.cloneNode(true)); // remove o evento de clique antigo
  });
}

function resetarSelecao() {
  cavaloSelecionado = null;
  cadeiraSelecionada = null;

  document
    .querySelectorAll(".horse-card")
    .forEach((c) => c.classList.remove("selecionado"));

  betAmount.value = 10;
  atualizarBilhete();
}

/* ==========================================================================
   EVENTOS
   ========================================================================== */
betAmount.addEventListener("input", calcularRetorno);

// prevenir reload do form: tratar submissão do form e chamar confirmarAposta
if (betForm) {
  betForm.addEventListener("submit", (e) => {
    e.preventDefault();
    confirmarAposta();
  });
} else if (btnConfirmar) {
  // fallback: caso o form não exista (compatibilidade), usar o click
  btnConfirmar.addEventListener("click", confirmarAposta);
}

/* ==========================================================================
   INICIALIZAÇÃO
   ========================================================================== */
montarCavalos();
montarCadeiras();
atualizarBilhete();
