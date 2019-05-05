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

var num, val="", acc = "0", next_op = -1;
var op2optype = [1, 1, 1, 1, 1, 0, 0, 0, 0];

// Para las operaciones binarias se puede usar el teclado:
var symbol2op = {"+":0, "-":1, "*":2, "/":3, "^": 4}
var op2symbol = {0:"+", 1:"-", 2:"*", 3:"/", 4:"^", 5:"^2", 6: "1/x", 7: "sqrt()", 8: "int()"}

function vaciar () { num.value = "";}
function show_acc()	{ $(answer).html(acc.toString()); }
function clear_input()	{ num.value = "0"; }
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
            num.value = k;
        }
        else if((!isNaN(k)))
        {
            e.preventDefault();
            val = val === ""? k : val + k;
            num.value = val;
        }
        else if(k === "." && (!num.value.includes(".")))
        {
            e.preventDefault();
            val = val === ""? "0." : val + k;
            num.value = val;
        }
        else if(k  === "Backspace")
        {
            e.preventDefault();
            val = val.substring(0, val.length - 1);
            num.value = val;
            
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
                        num.blur(0);
                        calcular(symbol2op[k]);
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

$(function()
    {
        num = $("num");
        bindKeys();
    }
);