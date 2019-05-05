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
 * 
 * Y otro numero para el tipo de operacion:
 * unaria: 0
 * binaria: 1
 */
var max_buttons_per_row = 3;
var num, val="", acc = "0", next_op = -1;
var ops = [
    {type: 1, symbol: "+", keybinding: "+", name: "suma"},
    {type: 1, symbol: "-", keybinding: "-", name: "resta"},
    {type: 1, symbol: "*", keybinding: "*", name: "por"},
    {type: 1, symbol: "/", keybinding: "/", name: "entre"},
    {type: 1, symbol: "^", keybinding: "^", name: "elevado"},
    {type: 0, symbol: "^2", keybinding: "", name: "cuadrado"},
    {type: 0, symbol: "1/x", keybinding: "", name: "inversa"},
    {type: 0, symbol: "sqrt(x)", keybinding: "", name: "raiz"},
    {type: 0, symbol: "parte_entera(x)", keybinding: "", name: "entera"},
    {type: 0, symbol: "2^x", keybinding: "", name: "potencia2"},
    {type: 0, symbol: "!x", keybinding: "!", name: "factorial"},
];

function symbol2idx(s){ return ops.findIndex(function(element){element.symbol === s});}
function vaciar () { $("#num").val("");}
function show_acc()	{ $(answer).html(acc.toString()); }
function clear_input()	{ $("#num").val("0"); }
function historial(msg) { $(historial).append(msg); }
function bindKeys()
{
    // Vamos a usar el teclado para introducir los numeros y las operaciones binarias. 
    // Las unarias tendran que hacerse obligatoriamente pulsando el boton correspondiente con el raton.
    $(document).keydown(function(e){
        k = e.key;
        if(k === "-" && val === "" && (acc === "0" || next_op !== -1))
        {
            e.preventDefault();
            val = k;
            $("#num").val(k);
        }
        else if((!isNaN(k)))
        {
            e.preventDefault();
            val = val === ""? k : val + k;
            $("#num").val(val);
        }
        else if(k === "." && (!$("#num").val().includes(".")))
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
                    if(!isNaN(val))
                    {
                        $("#num").blur(0);
                        calcular(symbol2idx(k));
                    }
                    break;
            }
        }
    });
}

function calcular(op)
{
    if(next_op === -1 && val === "")
        operando = acc;
    else
        operando = val;
    if(op === -1)
        do_op = next_op;
    else if(op2optype[op] === 1)
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
            acc = +acc + +operando;			    
            break;
        case 1: //resta
            historial(acc + " - " + operando);
            acc = +acc - +operando;
            break;
        case 2:  //producto
            historial(acc + " * " + operando);
            acc = +acc * +operando;
            break;
        case 3:  //division
            historial(acc + " / " + operando);
            acc = +acc / +operando;
            break;
        case 4:  //potenciacion
            historial(acc + "^" + operando);
            acc = (+acc) ** (+operando);
            break;
        case 5: //cuadrado
            historial(operando + "^2");
            acc = (+operando) ** 2;
            break;
        case 6: //inversa
            historial("1/" + operando);
            acc = 1 / (+operando);
            break;
        case 7: //raiz
            historial("sqrt("+ operando + ")");
            acc = Math.sqrt(+operando);
            break;
        case 8: //parte entera
            historial("entero("+ operando + ")");
            acc = (+operando >= 0)? Math.floor(operando) : Math.ceil(operando);
            break;
        default:
            historial("Error: operacion desconocida");
            return;
    }
    acc = acc.toString();
    if(do_op !== -1)
        historial(" = " + acc + "<br>");
    //Guardamos la operacion a ejecutar con el siguiente valor introducido
    if(op2optype[op] === 1)
        next_op = op;

        //mostramos el resultado
    show_acc();
    //limpiamos el valor de entrada
    val = "";
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
    clear_input();
    val = "";
}

function createButtons(){
    var num_un_buttons = 0;
    var num_bin_buttons = 0;
    var un_op_buttons = $("#un-op-buttons").html();
    var bin_op_buttons = $("#bin-op-buttons").html();
    var un_grid_areas = "\"";
    var bin_grid_areas = "\"";
    ops.forEach(function(element, index, array){
            switch(element.type)
            {
                case 0:
                    un_op_buttons += "<button class=\"un-op\" onClick=\"calcular("  + index + ")\" id=\"" + element.name + "\" style=\"grid-area: " + element.name + ";\" >" + element.symbol + "</button>";
                    if(num_un_buttons > 0 && ((num_un_buttons % max_buttons_per_row) === 0))
                        un_grid_areas += "\" \"";
                    un_grid_areas += element.name + " ";
                    num_un_buttons++;
                    break;
                case 1:
                    bin_op_buttons += "<button class=\"bin-op\" onClick=\"calcular("  + index + ")\" id=\"" + element.name + "\" style=\"grid-area: " + element.name + ";\">" + element.symbol + "</button>";
                    if(num_bin_buttons > 0 && ((num_bin_buttons % max_buttons_per_row) === 0))
                        bin_grid_areas += "\" \"";
                    bin_grid_areas += element.name + " ";
                    num_bin_buttons++;
                break;
            }
            $("#"+element.name).css("grid-area", element.name);
        }
    );
    for (var i = 0; (num_un_buttons + i) % max_buttons_per_row !== 0; i++)
        un_grid_areas += "empty "
    un_grid_areas += "\"";
    var un_op_buttons_style = {
        "grid-template-rows": "repeat("+ Math.ceil(num_un_buttons/max_buttons_per_row) + ", 1fr)",
        "grid-template-columns": "repeat("+ max_buttons_per_row + ", 1fr)",
        "grid-template-areas": un_grid_areas
    };
    $("#un-op-buttons").css(un_op_buttons_style);
    $("#un-op-buttons").html(un_op_buttons);
    
    for (var i = 0; (num_bin_buttons + i) % max_buttons_per_row !== 0; i++)
        bin_grid_areas += "empty "
    bin_grid_areas += "\"";
    var bin_op_buttons_style = {
        "grid-template-rows": "repeat("+ Math.ceil(num_bin_buttons/max_buttons_per_row) + ", 1fr)",
        "grid-template-columns": "repeat("+ max_buttons_per_row + ", 1fr)",
        "grid-template-areas": bin_grid_areas
    };
    
    $("#bin-op-buttons").css(bin_op_buttons_style);
    $("#bin-op-buttons").html(bin_op_buttons);
}
$(function()
    {
        num = $("num");
        createButtons();
        bindKeys();
    }
);