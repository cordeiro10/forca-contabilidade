/** BINDS **/
$("#botaoComecar").on('click', onClickComecar);
$(document).on('click', '.container-teclado button', onClickTeclado);


/** GLOBAL VARIABLES **/
var palavraAtual = null;
var quantidadeErros = 0;
var palavras = [
	{palavra: "razonete", dica: "ferramenta e uma representação gráfica em forma de \"T\" bastante utilizados por contadores.", nrAcertos: 0},
	{palavra: "caixa", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "circulante", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "partidas dobradas", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "imobilizado", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "curto prazo", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "entidade", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "ato administrativo", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "realizavel", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "patrimonio", dica: "Coisa que coiseia as coisas", nrAcertos: 0},
	{palavra: "longo prazo", dica: "Coisa que coiseia as coisas", nrAcertos: 0}
];

/** FUNCTIONS **/
function onClickComecar() {
    $("div#descricaoJogo").fadeOut(1000, function () {
    	criaPalavraEscondida(getProximaPalavra());
    	criaDica();
        $("div.jogo").fadeIn(1000);
    });
}

function onClickTeclado() {
	var botaoClicado = $(this);
	processaClique(botaoClicado);
	verificaTermino();
}

function processaClique(botaoClicado) {
	var letraSelecionada = botaoClicado.html().toUpperCase();
	var matches = 0;
	var palavra = getPalavraAtual().palavra;

	/** Caso a letra ja tenha sido utilizada, nada a ser feito */
	if(botaoClicado.hasClass("errada correta")) {
		return true;
	}

	for(var i = 0; i < palavra.length; i++) {
		if(letraSelecionada == palavra.charAt(i).toUpperCase()) {
			matches++; // Controle de acertos da letra informada na palavra
			palavra.nrAcertos++; // Controle de acertos da palavra em total
			$($("div#palavra span").get(i)).html(letraSelecionada);
		}
	}

	if(matches > 0) {
		botaoClicado.addClass("correta");
	} else {
		botaoClicado.addClass("errada");
	}
}

function verificaTermino() {
}

function getProximaPalavra() {
	if(palavraAtual == null) {
		palavraAtual = 0;
	} else if(palavraAtual < palavras.length) {
		palavraAtual++;
	} else {
		return null;
	}
	return getPalavraAtual().palavra;
}

function getPalavraAtual() {
	return palavras[palavraAtual];
}

function getDicaAtual() {
	return getPalavraAtual().dica;
}

function criaPalavraEscondida(palavra) {
	var divPalavra = $("div#palavra");
	divPalavra.html("");
	for(var i = 0; i < palavra.length; i++) {
		if(palavra.charAt(i) == " ") {
			divPalavra.append("<span class='espaco'>&nbsp;</span>")
		} else {
			divPalavra.append("<span class='letraPalavra'>_ </span>")
		}
	}
}

function criaDica() {
	var divDica = $("div#dica");
	divDica.html("<h3>Dica: "+getPalavraAtual().dica+"</h3>");
}