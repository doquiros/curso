/* Asociamos un numero a cada operacion:
 * suma: 0
 * resta: 1
 * producto: 2
 * division: 3
 * potenciacion: 4
 * cuadrado: 5
 * inversa: 6
 * raiz: 7
 * parte entera: 8
 * 2 elevado a N: 9
 * factorial: 10
 * sumatorio: 11
 * sumatorio: 12
 * 
 * Y otro numero para el tipo de operacion:
 * unaria: 0
 * binaria: 1
 * csv: 2
 *
 * Usamos un array con la siguiente estructura:
 * - cada elemento corresponde a una operacion, y el indice el numero mostrado en la lista de arriba.
 * - cada elemento contiene los siguientes campos:
 *   - type: tipo de operacion como se muestra mas arriba.
 *   - symbol: el symbolo que aparece en el botón asociado
 *   - keybinding: tecla asociada, si la tiene. Si no la tiene vale ""
 *   - name: el nombre de la operacion. Damos este valor al atributo id del boton.
 * 
 */
var max_buttons_per_row = 3;
var num, val="", acc = "0", next_op = -1, newVal=1, enabledNoCsv = true;


function key2idx(s){ return ops.findIndex(function(element){ return element.keybinding === s}); }
function show_value(value)	{ $("#num").html(value.toString()); }
function clear_input()	{ $("#num").html("0"); }
function historial(msg) { $("#historial").append(msg + "<br>"); }
function fact(x) { return x===0? 1 : (x * fact(x - 1));}

function suma(a, b) { ret = (+a) + (+b); historial((+a)+ "+" + (+b) + " = " + ret); return ret;}
function resta(a, b) { ret = (+a) - (+b); historial((+a) + "-" + (+b) + " = " + ret); return ret;}
function por(a, b) { ret = (+a) * (+b); historial((+a) + "+" + (+b) + " = " + ret); return ret;}
function entre(a, b) { ret = (+a) / (+b); historial((+a) + "/" + (+b) + " = " + ret); return ret;}
function elevado(a, b) { ret = (+a) ** (+b); historial((+a) + "^" + (+b) + " = " + ret); return ret;}
function cuadrado(a, b) { ret = (+a) ** 2; historial((+a) + "^2 = " + ret); return ret;}
function inversa(a, b) { ret = 1 / (+a); historial("1 / " + (+a) + " = " + ret); return ret;}
function raiz(a, b) { ret = Math.sqrt((+a)); historial("&radic;" + (+a) + " = " + ret); return ret;}
function parte_entera(a, b) { ret = ret > 0? Math.floor((+a)): Math.ceil((+a)); historial("&radic;" + (+a) + " = " + ret); return ret;}
function potencia2(a, b) { ret = 2 ** (+a); historial("2^" + (+a) + " = " + ret); return ret;}
function factorial(a, b) {
    if((+a) < 0)
        historial("Cuidado: no exister el factorial de un numero negativo!") 
    ret = (+a) < 0? 0 : factorial((+a));

    historial((+a) + "! = " + ret);
    return ret;
}
function sumatorio(a, b) { 
    ret = 0;
    operando.split(",").forEach(function(element){ret += +element}); 
    historial("&sum;(" + a + ") = " + ret);
    return ret;
}
function producto(a, b) { 
    ret = 1;
    operando.split(",").forEach(function(element){ret *= +element}); 
    historial("&prod;(" + a + ") = " + ret); return ret;
}
function ToMem(a, b) { $("#mem").html(a); historial("ToMem(" + a + ")"); return a;}
function FromMem(a, b) { ret = $("#mem").html(); historial("FromMem() = " + ret); return ret;}

var ops = [
    /* 0*/{type: 1, symbol: "+", keybinding: "+", name: "suma", func: suma},
    /* 1*/{type: 1, symbol: "&minus;", keybinding: "-", name: "resta", func: resta},
    /* 2*/{type: 1, symbol: "&#xd7;", keybinding: "*", name: "por", func: por},
    /* 3*/{type: 1, symbol: "&#xf7;", keybinding: "/", name: "entre", func: entre},
    /* 4*/{type: 1, symbol: "x<sup>y</sup>", keybinding: "^", name: "elevado", func: elevado},
    /* 5*/{type: 0, symbol: "x<sup>2</sup>", keybinding: "", name: "cuadrado", func: cuadrado},
    /* 6*/{type: 0, symbol: "1/x", keybinding: "", name: "inversa", func: inversa},
    /* 7*/{type: 0, symbol: "&radic;x", keybinding: "", name: "raiz", func: raiz},
    /* 8*/{type: 0, symbol: "parte_entera(x)", keybinding: "", name: "entera", func: parte_entera},
    /* 9*/{type: 0, symbol: "2<sup>n</sup>", keybinding: "", name: "potencia2", func: potencia2},
    /*10*/{type: 0, symbol: "!n", keybinding: "!", name: "factorial", func: factorial},
    /*11*/{type: 2, symbol: "&sum;", keybinding: "", name: "sumatorio", func: sumatorio},
    /*12*/{type: 2, symbol: "&prod;", keybinding: "", name: "producto", func: producto},
    /*13*/{type: 3, symbol: "ToM", keybinding: "", name: "ToMem", func: ToMem},
    /*14*/{type: 3, symbol: "FromM", keybinding: "", name: "FromMem", func: FromMem},
];

function enable_buttons(button_class, enable) {
    $("."+button_class).attr("disabled", !enable);
}
function bindKeys()
{
    // Vamos a usar el teclado para introducir los numeros y las operaciones binarias. 
    // Las unarias tendran que hacerse obligatoriamente pulsando el boton correspondiente con el raton.
    $(document).keydown(function(e){
        k = e.key;
        regex = "^ *$"
        cur_value = val;
        cur_value = cur_value.split(",");
        cur_value = cur_value[cur_value.length - 1];
        if(k === "-" && regex.match(cur_value) !== null && (acc === "0" || next_op !== -1))
        {
            e.preventDefault();
            val += k;
            $("#num").html(val);
        }
        if(k === "," && (acc === "0" || next_op !== -1))
        {
            e.preventDefault();
            val += k;
            $("#num").html(val);
            enable_buttons("un-op", false);
            enable_buttons("bin-op", false);
            enabledNoCsv = false;
        }
        else if((!isNaN(k)) && k !== " ")
        {
            e.preventDefault();
            if(newVal)
                val = k;
            else
                val += k;
            newVal = false;
            $("#num").html(val);
        }
        else if(k === "." && (!cur_value.includes(".")))
        {
            e.preventDefault();
            val = val === ""? "0." : val + k;
            $("#num").html(val);
        }
        else if(k  === "Backspace")
        {
            e.preventDefault();
            val = val.substring(0, val.length - 1);
            $("#num").html(val);
            if(!val.includes(","))
            {
                enable_buttons("un-op", true);
                enable_buttons("bin-op", true);
                enabledNoCsv = true;
            }
        }
        else
        {
            e.preventDefault();
            switch (k){
                case "Enter":
                case "=": // tecla enter: igual
                    num.blur(0);
                    igual();
                    break;
                case "*": // tecla *: suma
                case "+": // tecla +: suma
                case "-": // tecla -: resta
                case "^": // tecla ^: potenciacion
                case "/": // tecla / : division
                    if(enabledNoCsv && !isNaN(val))
                    {
                        $("#num").blur(0);
                        calcular(key2idx(k));
                    }
                    break;
            }
        }
    });
}

function calcular(op)
{
    if(op === -1 && next_op === -1)
    {
        historial("CE<br>")
        clear_input();
        return;
    }
    if(next_op === -1 && val === "")
        operando = acc;
    else
        operando = val;
    if(op === -1)
        do_op = next_op;
    else if(ops[op].type === 1)
        do_op = next_op;
    else
        do_op = op;

    //historial(((do_op > -1)? op2symbol[do_op] : "") + " " + operando);

    //next_op = op;
    //reset_next_op = 1;
    // Cargar nuevo valor, ejecutando la operacion que nos ordenaron:
    if(do_op == -1)
        acc = +operando;
    else
        val = ops[do_op].func(val, acc)

    val = val.toString();
    if(do_op !== -1)
        historial(" = " + val + "<br>");
    //Guardamos la operacion a ejecutar con el siguiente valor introducido
    next_op = -1;
    if(op !== -1 && ops[op].type === 1)
        next_op = op;

    //mostramos el resultado
    show_value(val);
    newVal = true;
    if(op !== -1 && ops[op].type === 2)
    {
        enable_buttons("bin-op", true);
        enable_buttons("un-op", true);
        enabledNoCsv = true;
        //clear_input();
    }
}

function igual() {
    if(next_op !== -1)
    {			
        calcular(-1);
    }
    else
    {
        next_op=0;
        calcular(-1);
        acc = "0";
    }
    next_op = -1;
    enable_buttons("bin-op", true);
    enable_buttons("un-op", true);
    enabledNoCsv = true;
    //clear_input();
    //val = "";
    newVal = true;
}

function createButtons(container, type, button_class){
    
    var op_buttons = $(container).html();
    var num_buttons = 0;
    var grid_areas = "\"";

    ops.forEach(function(element, index){
            if(element.type === type)
            {
                op_buttons += "<button class=\"op " + button_class + "\" onClick=\"calcular("  + index + ")\" id=\"" + element.name + "\" style=\"grid-area: " + element.name + ";\" >" + element.symbol + "</button>";
                if(num_buttons > 0 && ((num_buttons % max_buttons_per_row) === 0))
                    grid_areas += "\" \"";
                grid_areas += element.name + " ";
                num_buttons++;
                $("#"+element.name).css("grid-area", element.name);
            }
        }
    );

    for (var i = 0; (num_buttons + i) % max_buttons_per_row !== 0; i++)
        grid_areas += "empty "
    grid_areas += "\"";
    var op_buttons_style = {
        "grid-template-rows": "repeat("+ Math.ceil(num_buttons/max_buttons_per_row) + ", 1fr)",
        "grid-template-columns": "repeat("+ max_buttons_per_row + ", 1fr)",
        "grid-template-areas": grid_areas
    };
    $(container).css(op_buttons_style);
    $(container).html(op_buttons);
}
$(function()
    {
        var draginitpos;
        var draginitoff;
        num = $("#num");
        createButtons("#un-op-buttons", 0, "un-op");
        createButtons("#bin-op-buttons", 1, "bin-op");
        createButtons("#csv-op-buttons", 2, "csv-op");
        createButtons("#mem-op-buttons", 3, "mem-op");
        
        $("#mem").html("0");
        $( "#num" ).draggable({
            revert: "invalid",
            helper: "clone"
        });
        $( "#mem" ).draggable({
            revert: "invalid",
            helper: "clone"
        });
        $( "#num" ).droppable({
            drop: function(event, ui){
                historial("drop "+$("#mem").html());
                calcular(14);
            }
        });
        $( "#mem" ).droppable({
            drop: function(event, ui){
                historial("drop "+$("#num").html());
                calcular(13);
            }
        });
        bindKeys();
    }
);
