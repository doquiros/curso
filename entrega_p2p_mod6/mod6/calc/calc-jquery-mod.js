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
var ops = [
    /* 0*/{type: 1, symbol: "+", keybinding: "+", name: "suma"},
    /* 1*/{type: 1, symbol: "&minus;", keybinding: "-", name: "resta"},
    /* 2*/{type: 1, symbol: "&#xd7;", keybinding: "*", name: "por"},
    /* 3*/{type: 1, symbol: "&#xf7;", keybinding: "/", name: "entre"},
    /* 4*/{type: 1, symbol: "x<sup>y</sup>", keybinding: "^", name: "elevado"},
    /* 5*/{type: 0, symbol: "x<sup>2</sup>", keybinding: "", name: "cuadrado"},
    /* 6*/{type: 0, symbol: "1/x", keybinding: "", name: "inversa"},
    /* 7*/{type: 0, symbol: "&radic;x", keybinding: "", name: "raiz"},
    /* 8*/{type: 0, symbol: "parte_entera(x)", keybinding: "", name: "entera"},
    /* 9*/{type: 0, symbol: "2<sup>n</sup>", keybinding: "", name: "potencia2"},
    /*10*/{type: 0, symbol: "!n", keybinding: "!", name: "factorial"},
    /*11*/{type: 2, symbol: "&sum;", keybinding: "", name: "sumatorio"},
    /*11*/{type: 2, symbol: "&prod;", keybinding: "", name: "producto"},
    /*12*/{type: 3, symbol: "ToM", keybinding: "", name: "ToMem"},
    /*12*/{type: 3, symbol: "FromM", keybinding: "", name: "FromMem"},
];

function key2idx(s){ return ops.findIndex(function(element){ return element.keybinding === s}); }
function show_value(value)	{ $("#num").val(value.toString()); }
function clear_input()	{ $("#num").val("0"); }
function historial(msg) { $("#historial").append(msg); }
function factorial(x) { return x===0? 1 : (x * factorial(x - 1));}
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
            $("#num").val(val);
        }
        if(k === "," && (acc === "0" || next_op !== -1))
        {
            e.preventDefault();
            val += k;
            $("#num").val(val);
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
            $("#num").val(val);
        }
        else if(k === "." && (!cur_value.includes(".")))
        {
            e.preventDefault();
            val = val === ""? "0." : val + k;
            $("#num").val(val);
        }
        else if(k  === "Backspace")
        {
            e.preventDefault();
            val = val.substring(0, val.length - 1);
            $("#num").val(val);
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
    switch(do_op)
    {
        case -1: //asignacion
            acc = +operando;
            break;
        case 0: //suma
            historial(acc + " + " + operando);	
            val = +acc + +operando;			    
            break;
        case 1: //resta
            historial(acc + " - " + operando);
            val = +acc - +operando;
            break;
        case 2:  //producto
            historial(acc + " * " + operando);
            val = +acc * +operando;
            break;
        case 3:  //division
            historial(acc + " / " + operando);
            val = +acc / +operando;
            break;
        case 4:  //potenciacion
            historial(acc + "<sup>" + operando + "</sup>");
            val = (+acc) ** (+operando);
            break;
        case 5: //cuadrado
            historial(operando + "<sup>2</sup>");
            val = (+operando) ** 2;
            break;
        case 6: //inversa
            historial("1/" + operando);
            val = 1 / (+operando);
            break;
        case 7: //raiz
            historial("&radic;"+ operando);
            val = Math.sqrt(+operando);
            break;
        case 8: //parte entera
            historial("entero("+ operando + ")");
            val = (+operando >= 0)? Math.floor(operando) : Math.ceil(operando);
            break;
        case 9://2^n
            historial("2<sup>" + operando + "</sup>");
            val = 2 ** (+operando);
            break;
        case 10: //!n
            if(operando === 0)
            {
                historial("0!");
                val = 1;
            }
            else if(operando < 0)
            {
                historial("CUIDADO! El factorial es solo para numeros positivos.<br>");
                historial("!(" + operando + ")");
                val = 0;
            }
            else 
            {
                if(operando.includes("."))
                    operando = Math.floor(operando);

                historial(operando + "!");
                val = factorial((+operando));
            }
            break;
        case 11: //sumatorio
            historial("&sum;(" + operando + ")");
            val = 0;
            operando.split(",").forEach(function(element){val += +element});
            break;
        case 12: //producto
            historial("&prod;(" + operando + ")");
            val = 1;
            operando.split(",").forEach(function(element){val *= +element});
            break;
        case 13: //ToM
            historial("ToM(" + operando + ")");
            mem = +operando;
            break;
        case 14: //FromM
            historial("FromM() = " + mem)
            val = mem;
            break;
        default:
            historial("Error: operacion desconocida");
            return;
    }
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
        num = $("num");
        createButtons("#un-op-buttons", 0, "un-op");
        createButtons("#bin-op-buttons", 1, "bin-op");
        createButtons("#csv-op-buttons", 2, "csv-op");
        createButtons("#mem-op-buttons", 3, "mem-op");
                
        bindKeys();
    }
);
