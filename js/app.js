/** CONSTANTES IMPORTANTES */
var containerPalavra = "div#palavra";
var containerDica = "div#dica";
var containerTimer = "div#timer";
var containerTeclado = "div#container-teclado";
var containerForca = "div#forca";

/** BINDS DE EVENTOS **/
$("#botaoComecar").focus().on('click', onClickComecar);
$(document).on('click', containerTeclado + ' button', onClickTeclado);

/** VARIÁVEIS GLOBAIS **/
var palavraAtual = null;
var quantidadeErros = 0;
var timer = false;
var milisegundosInicio = 0;
var palavras = [
    new Palavra("razonete", "Ferramenta e representação gráfica em forma de \"T\" bastante utilizada por contadores."),
    new Palavra("caixa", "Denominação legal de uma conta que registra o valor dos recursos imediatamente disponíveis."),
    new Palavra("ativo circulante", "Agrupa dinheiro e tudo o que será transformado em dinheiro rapidamente."),
    new Palavra("partidas dobradas", "É o sistema-padrão usado em empresas e outras organizações para registrar transações financeiras; \"Tudo que é debitado em um lugar, é creditado em outro."),
    new Palavra("imobilizado", "Bens e direitos de natureza permanente que serão utilizados para a manutenção das atividades normais da empresa, servindo a sua estrutura."),
    new Palavra("curto prazo", "Todos os bens e direitos realizáveis em moeda e as obrigações com vencimento até o término do exercício social (ano) seguinte."),
    new Palavra("princípio da entidade", "Reconhece o Patrimônio como objeto da Contabilidade."),
    new Palavra("ato administrativo", "Todo o ato lícito, que tenha por fim imediato adquirir, resguardar, transferir, modificar ou extinguir direitos."),
    new Palavra("resultado", "Diferença entre o valor das receitas e o valor das despesas."),
    new Palavra("auditoria", "Confirmação dos registros e demonstrações contábeis; verificação da exatidão e dos documentos que deram origem aos dados contidos nas demonstrações contábeis, através do exame minucioso dos registros contábeis dos quais se originaram."),
    new Palavra("direitos", "Valores que a empresa tem a receber de terceiros."),
    new Palavra("saldo", "Valor da diferença entre a soma dos débitos e a soma dos créditos dos respectivos Razonetes."),
    new Palavra("patrimonio", "Conjunto de bens, direitos e obrigações vinculado a uma pessoa ou a uma entidade.")
];

/*-----------------------------------------------------------------------------------------------------------------*
 ------------------------------------------------ EVENTOS ----------------------------------------------------------*
 -------------------------------------------------------------------------------------------------------------------*/

/**
 * Evento para o clique do botão Começar.
 * @return void
 */
function onClickComecar() {
    $("div#descricaoJogo").fadeOut(1000, function () {
        shuffle(palavras);
        criaPalavraEscondida(getProximaPalavra());
        $("div.jogo").fadeIn(1000);
    });

    milisegundosInicio = Date.now();
}

/**
 * Evento para o clique de qualquer letra do teclado.
 * @return void
 */
function onClickTeclado() {
    var botaoClicado = $(this);

    /** Inicia o timer de 10 segundos, caso já não esteja iniciado. */
    if (timer === false) {
        timer = new Timer();
        timer.setOnExpire(onExpireTimer);
        timer.iniciaTimer();
    }

    /** Efetua o processamento do clique para o botão do teclado pressionado pelo usuário */
    processaClique(botaoClicado);

    /** Verifica se o jogo chegou ao fim após a ação do usuário */
    verificaTermino();
}

/**
 * Evento chamado ao acabar o tempo do timer.
 * @return void
 */
function onExpireTimer() {
    quantidadeErros++;
    $(containerForca).addClass('estagio-' + (quantidadeErros + 1));
    timer.resetaTimer();
    verificaTermino();
}

/**
 * Evento chamado ao terminar o game, seja via timer ou erros.
 * @return void
 */
function onTerminoJogoByErro() {
    $(containerDica).html('<h3>Fim de jogo! você acertou ' + getTotalPalavrasAcertadas() + ' de ' + palavras.length + ' palavras</h3><h3><small>Seu tempo foi de ' + getTempoTotalExtenso() + '.</small></h3>');
    bloqueiaTeclado();
    timer.paraTimer();
    getTempoTotalExtenso();
}

function onTerminoJogoByCompleting() {
    $(containerDica).html('<h1>Parabéns!</h1><h3>Você acertou todas as palavras!</h3><h3><small>Seu tempo foi de ' + getTempoTotalExtenso() + '.</small></h3>');
    bloqueiaTeclado();
    timer.paraTimer();
}

/**
 * Evento chamado ao acertar uma palavra.
 * @return void
 */
function onAcertoPalavra() {
    resetaEstagioForca();
    criaPalavraEscondida(getProximaPalavra());
    resetaTeclado();
    timer.paraTimer();
}

/**
 * Evento chamado ao clicar em um botão cuja letra tenha sua correspondente na palavra atual.
 * @param  Object botaoClicado
 * @return void
 */
function onClickLetraCorreta(botaoClicado) {
    botaoClicado.addClass("correta");
    botaoClicado.prop('disabled', true);
    timer.resetaTimer();
}

/**
 * Evento chamado ao clicar em um botão cuja letra NÃO tenha sua correspondente na palavra atual.
 * @param  Object botaoClicado
 * @return void
 */
function onClickLetraErrada(botaoClicado) {
    botaoClicado.addClass("errada");
    botaoClicado.prop('disabled', true);
    quantidadeErros++;
    $(containerForca).addClass('estagio-' + (quantidadeErros + 1));
    timer.resetaTimer();
}

/*-----------------------------------------------------------------------------------------------------------------*
 ------------------------------------------------ FUNCOES ----------------------------------------------------------*
 -------------------------------------------------------------------------------------------------------------------*/

/**
 * Processa o clique efetuado pelo usuário em uma das letras do teclado.
 * @param  Object botaoClicado 
 * @return void
 */
function processaClique(botaoClicado) {
    var letraSelecionada = botaoClicado.html().toUpperCase();
    var palavra = getPalavraAtual();

    /** Caso a letra ja tenha sido utilizada, nada a ser feito */
    if (botaoClicado.hasClass("errada correta")) {
        return true;
    }

    /** Verifica se a palavra contém a letra informada, é passada uma função de callback para caso a letra existir, alterar na máscara */
    var existe = palavra.verificaExisteLetraInformada(letraSelecionada, function (i) {
        $($(containerPalavra + " span").get(i)).html(letraSelecionada);
    });

    /** Callbacks para quando o botão apertado ter ou não ocorrências de letras na palavra */
    if (existe) {
        onClickLetraCorreta(botaoClicado);
    } else {
        onClickLetraErrada(botaoClicado);
    }
}

/**
 * Verifica se o game terminou, chama as funções de callback necessárias
 * @return void
 */
function verificaTermino() {
    /** Caso houver mais de 6 erros, o jogo termina */
    if (quantidadeErros >= 6) {
        onTerminoJogoByErro();
    } else if (getTotalPalavrasAcertadas() == palavras.length) {
        onTerminoJogoByCompleting();
    } else if (getPalavraAtual().acertouPalavra()) {
        onAcertoPalavra();
    }
}

/** 
 * Bloqueia o teclado
 * @return void
 */
function bloqueiaTeclado() {
    $(containerTeclado + ' button').prop('disabled', true);
}

/**
 * Reseta o teclado para o estado original.
 * @return void
 */
function resetaTeclado() {
    $(containerTeclado + ' button').prop('disabled', false);
    $(containerTeclado + ' button').removeClass('errada correta');
}

/**
 * Retorna o próximo objeto de palavra.
 * @return Palavra
 */
function getProximaPalavra() {
    if (palavraAtual == null) {
        palavraAtual = 0;
    } else if (palavraAtual < palavras.length) {
        palavraAtual++;
    } else {
        return null;
    }
    return getPalavraAtual();
}

/**
 * Retorna o objeto de palavra atual.
 * @return Palavra
 */
function getPalavraAtual() {
    return palavras[palavraAtual];
}

/**
 * Retorna a dica da palavra atual.
 * @return String
 */
function getDicaAtual() {
    return getPalavraAtual().getDica();
}

/**
 * Cria a palavra escondida (mascarada)
 * @param  Palavra Objeto da palavra a ser criada.
 * @return void
 */
function criaPalavraEscondida(palavra) {
    var divPalavra = $(containerPalavra);
    divPalavra.html(palavra.getPalavraMascarada());
    criaDica();
}

/**
 * Cria a dica da palavra atual.
 * @return void
 */
function criaDica() {
    var divDica = $(containerDica);
    divDica.html("<h3>Dica: " + getDicaAtual() + "</h3>");
}

/**
 * Retorna o total de palavras acertadas pelo usuário.
 * @return integer
 */
function getTotalPalavrasAcertadas() {
    var palavrasAcertadas = 0;
    for (var i = 0; i < palavras.length; i++) {
        if (palavras[i].acertouPalavra()) {
            palavrasAcertadas++;
        }
    }
    return palavrasAcertadas;
}

function resetaEstagioForca() {
    $(containerForca).removeClass(function (index, className) {
        return (className.match(/(^|\s)estagio-\d+/g) || []).join(' ');
    });
    $(containerForca).addClass('estagio-1');
    quantidadeErros = 0;
}

function getTempoTotalExtenso() {
    var milisegundosTermino = Date.now();

    var data = new Date();
    data.setTime(milisegundosTermino - milisegundosInicio);

    var minutos = data.getMinutes();
    var segundos = data.getSeconds();

    return minutos + " minutos e " + segundos + " segundos";
}

/*-----------------------------------------------------------------------------------------------------------------*
 ---------------------------------------- FUNÇÕES PRONTAS ----------------------------------------------------------*
 -------------------------------------------------------------------------------------------------------------------*/

/** 
 * Randomiza arrays, usada para modificar a ordem das palavras a cada jogo
 * @param  Array array Array p/ randomizar
 * @return void
 */
function shuffle(array) {
    var currentIndex = array.length,
            temporaryValue, randomIndex;
    // Enquanto existir elementos para randomizar...
    while (0 !== currentIndex) {

        // Pega um dos restantes...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // E troca com o elemento atual.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
}
