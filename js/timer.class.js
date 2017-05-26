function Timer() {
    var segundos = 10;
    var container = "div#timer";
    var onExpire = function () {
        alert("Acabou o tempo!");
    }
    var timeout = false;
    var segundosPassados = false;

    this.setSegundos = function (seg) {
        if (!isNan(seg)) {
            segundos = seg;
        }
    }

    this.getSegundos = function () {
        return segundos;
    }

    this.setContainer = function (cont) {
        if (container.length > 0) {
            container = container;
        }
    }

    this.getContainer = function () {
        return container;
    }

    this.setOnExpire = function (fnOnExpire) {
        if (typeof fnOnExpire == "function") {
            onExpire = fnOnExpire;
        }
    }

    this.iniciaTimer = function () {
        this.paraTimer();
        $(container).html(segundos + " segundos restantes...");
        timeout = setInterval(onEachSegundo, 1000);
    }

    this.paraTimer = function () {
        if (timeout) {
            clearInterval(timeout);
            timeout = false;
            segundosPassados = false;
            $(container).html("");
        }
    }

    this.resetaTimer = function () {
        this.paraTimer();
        this.iniciaTimer();
    }

    var onEachSegundo = function () {
        if (segundosPassados === false) {
            segundosPassados = 1;
        } else {
            segundosPassados++;
        }

        var segundosRestantes = (segundos - segundosPassados);
        if (segundosRestantes == 0) {
            onExpire();
        } else {
            $(container).html(segundosRestantes + " segundos restantes...");
        }
    }
}
