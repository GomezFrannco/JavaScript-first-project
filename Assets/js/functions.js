// FUNCTIONS
/* --------------------------------------------------------------------------- TOTAL ------------------------------------------------------------------------------------- */
// calcula y muestra el subtotal
function SubtotalUI() {
    let finalPrice = 0;
    const prices = [];
    for (const product of CART) {
        const subtotal = product.SubTotal();
        prices.push(subtotal);
    };
    for (const price of prices) {
        finalPrice += price // finalPrice = finalPrice + Price y por cada vuelta toma el valor del método SubTotal() y lo suma a si mismo
    };
    $("#subtotal__ammount").html(`$${finalPrice}`); // Mostramos el subtotal (UI)
};
// modifica y muestra nuestro total (UI)
function TotalUI() {
    const total = $("#subtotal__ammount").text();
    const tValue = parseInt(total.substring(1));
    $("#total__ammount").html(`$${tValue + deliveryFee}`);
};

/* -------------------------------------------------------------------------- STORAGE ------------------------------------------------------------------------------------ */
// añade contenido JSON al localStorage
const SetLocalStorage = (key, value)=> {localStorage.setItem(key, JSON.stringify(value))};
// obtiene contenido del localStorage
function GetLocalStorage(key) {
    const storage = localStorage.getItem(key);
    return storage
};
// elimina contenido del localStorage
const RemoveLocalStorage = (key)=> {localStorage.removeItem(key)};
// modifica el localStorage en función del carrito
function CartStorage() {
    if (CART.length === 0 ) {
        RemoveLocalStorage("userCart");
    } else {
        SetLocalStorage("userCart",CART);
    };
};
// guarda el precio total de la orden
function savePrice() {
    const sbtotal = parseInt($("#subtotal__ammount").text().substring(1));
    const ttal = parseInt($("#total__ammount").text().substring(1));
    const selected = $("#shipSelect :selected").val();
    SetLocalStorage("ship", selected);
    SetLocalStorage("userAmmount", [sbtotal, deliveryFee, ttal]);
};
// obtenemos el método de pago que seleccionó el usuario y lo mostramos
function GetPayment() {
    if (localStorage["userPayment"]) {
        const payment = JSON.parse(GetLocalStorage("userPayment"))
        $("#payment__selected").text(`${payment.toString()}`)   
    } else {
        $("#payment__selected").text("no Payment method")      
    }
}
// obtenemos el precio del carrito y lo mostramos
function GetPrice() {
    if (localStorage["userAmmount"]){
        const ammount = JSON.parse(GetLocalStorage("userAmmount"));
        $("#subtotal__ammount").text(`$${ammount[0]}`);
        $("#fee__price").text(`$${ammount[1]}`);
        $("#total__ammount").text(`$${ammount[2]}`);
    }
    if (localStorage["ship"]){
        const ship = JSON.parse(GetLocalStorage("ship"));
        $("#shipSelect").val(ship)
    }
};
// comprobamos si el local storage tiene datos guardados por el usuario y, si los tiene, los mostramos en pantalla
function GetData(){
    if (localStorage["userData"]){
        const data = JSON.parse(GetLocalStorage("userData"));
            $("#user__name").text(data[0]);
            $("#user__adress").text(data[1]);
            $("#user__number").text(data[2]);
            $("#user__mail").text(data[3]);
    }
};
// guardamos el método de pago en el localstorage
function SetPayment() {
    const ValueStorage = [];
    const Value = $("#radio__form :checked").val();
    ValueStorage.push(Value);
    SetLocalStorage( "userPayment", ValueStorage);
};
/* ---------------------------------------------------------------------------- DOM -------------------------------------------------------------------------------------- */
// vacía el contenido de un elemento del DOM
const Empty = (id) => {$(id).html(" ")};
// crea una interfaz de productos en el DOM a partir de objetos (UI)
function AddUI(products, id) {
    Empty(id);
    for (const product of products) {
        $(id).append(`  <div class="product__card">
                            <img src="${product.foto}">
                            <div class="product__description">
                                <div class="__description">
                                    <p>${product.nombre}</p>
                                    <span>$${product.precio}</span>  
                                </div> 
                                <img id="${product.id}" class="add_icon" src="Assets/img/add icon.png">    
                            </div>
                        </div>`);
    }
};
// modifica el valor del total segun la seleccion del usuario (UI)
const FeesSelector = () => {
    const value = $("#shipSelect :selected").val();
    if (value != "delivery") {
        deliveryFee = 0;
        TotalUI();
        savePrice();
        Empty("#fee__price") ;
        $("#fee__price").append(`$${deliveryFee}`);
    } else {
        deliveryFee = 250;
        TotalUI();
        savePrice();
        Empty("#fee__price");
        $("#fee__price").append(`$${deliveryFee}`); 
    }
};
// captura el clic del usuario y procesa su selección. Además lo conectamos con otras funciones
function AddToCart(e) {
    const idBtn = e.target.id;
    const exist = CART.find(product => product.id == idBtn);
    if (exist === undefined){
        const selected = PRODUCTS.find(product => product.id == idBtn);
        if (selected.cantidad === 0) {
            selected.Add(1);
            CART.push(selected);
        } else {
            CART.push(selected);
        }
    } else {
        exist.Add(1);
    }
    SetLocalStorage("userCart",CART); // cada vez que clickeamos manda el carrito al localStorage
    QueueUI(CART);
    SubtotalUI();
    TotalUI();
    savePrice();
    $(".grid__products").removeClass("alert");
};
// Con esta función simulamos un SPA con CSS
function SimulateSPA() {  
    $("#user__btn").click(function () {
        document.getElementById("user").classList.remove("hide");
        document.getElementById("order").classList.add("hide");
        document.getElementById("payment").classList.add("hide");
    });
    $("#user__order").click(function () {
        document.getElementById("order").classList.remove("hide");
        document.getElementById("user").classList.add("hide");
        document.getElementById("payment").classList.add("hide");
    });
    
    $("#user__pay").click(function () {
        document.getElementById("payment").classList.remove("hide");
        document.getElementById("user").classList.add("hide");
        document.getElementById("order").classList.add("hide");
    });
};
// animamos las cards de metodo de págo, efecto dropdown
function OpenCard(e){
    const s = e.target.id;
    $(`#${s}`).toggleClass( "expand" );
    if (s == 'paypal'){
        $("#content__paypal").toggleClass("hide_content");
    } else if (s == 'credit'){
        $("#content__credit").toggleClass("hide_content");
    } else if (s == 'debit'){
        $("#content__debit").toggleClass("hide_content");
    } else if (s == 'crypto'){
        $("#content__crypto").toggleClass("hide_content");
    }

}
/* -------------------------------------------------------------------------- CARRITO ------------------------------------------------------------------------------------ */
// quita productos del DOM y modifica el total
function RemoveQueue(order) {
    const btn = order.id;
    RemoveUI(btn);
    for (const product of CART) {
        const productId = product.id;
        const productPrice = product.SubTotal();
        const total = $("#subtotal__ammount").text();
        const tValue = parseInt(total.substring(1));
        if(productId == btn){
            product.Reset();
            $("#subtotal__ammount").html(`$${tValue - productPrice}`);
            TotalUI();
        }
    };
    const indice = CART.findIndex((elemento) => {
        if (elemento.cantidad === 0) {
          return true;  
        }
    });
    CART.splice(indice, 1);
    CartStorage();
    savePrice();
};
// crea la interfaz del carrito (UI)
function QueueUI(products) {
    Empty("#order__queue");
    for (const order of products) {
        if (order.cantidad >= 1){
        $("#order__queue").prepend(`<div id="product_${order.id}" class="order__info">
                                        <img src="${order.foto}"></img>
                                        <div class="product__info">
                                            <div class="info__name-price">
                                                <p class="info__name">${order.nombre}</p>  
                                                <span class="info__price">$${order.precio}</span>
                                            </div>
                                            <div class="product__q_info">
                                                <div class="product__quantity">
                                                    <span class="quantity__info">${order.cantidad}<span>
                                                </div>
                                                <img id="${order.id}" onclick="RemoveQueue(this)" class="product_remove" src="Assets/img/remove icon.png">
                                            </div>
                                        </div>
                                    </div>`);
        }
    }
};
// Recupera el carrito del localStorage
function GetCart() {
    if (localStorage["userCart"]) {
        const getCart = JSON.parse(GetLocalStorage("userCart"));
                for (const product of getCart) {
                    CART.push(new Product(product.id, product.nombre, product.foto, product.precio, product.cantidad));
                    $("#order__queue").prepend(`<div id="product_${product.id}" class="order__info">
                                        <img src="${product.foto}"></img>
                                        <div class="product__info">
                                            <div class="info__name-price">
                                                <p class="info__name">${product.nombre}</p>  
                                                <span class="info__price">$${product.precio}</span>
                                            </div>
                                            <div class="product__q_info">
                                                <div class="product__quantity">
                                                    <span class="quantity__info">${product.cantidad}<span>
                                                </div>
                                                <img id="${product.id}" onclick="RemoveQueue(this)" class="product_remove" src="Assets/img/remove icon.png">
                                            </div>
                                        </div>
                                    </div>`);
          
        }
    }
};
// quita productos del carrito (UI)
const RemoveUI = (id)=>{
    $(`#product_${id}`).fadeOut(320); // animacion
};
/* ------------------------------------------------------------------------- CHECKOUT ------------------------------------------------------------------------------------ */
// genera la confirmación de compra para el usuario (UI)
function FinalCheckout() {
    if (CART.length >= 1) {
        $("body").prepend(` <div id="confirmation">
                                <div id="order__complete">
                                    <p>Order complete, Thanks!</p>
                                </div>
                                <div class="confirmation__card">
                                    <h3>Your Order</h3>
                                    <hr>
                                    <div class="card__info">
                                        <div id="info__order">
                                        </div>
                                        <hr>
                                        <div class="final__total">
                                            <p>Fee</p>
                                            <p>${$("#fee__price").text()}</p>
                                        </div>
                                        <div class="final__total">
                                            <p>Total</p>
                                            <p>${$("#total__ammount").text()}</p>
                                        </div>
                                        <div class="final__total">
                                            <p>Payment:</p>
                                            <p id="payment__selected"></p>
                                        </div>
                                        <hr>
                                        <div id ="order__confirm" class="checkout__btn confirm" onclick="OrderComplete(this)">
                                            <p>Confirm</p>
                                        </div>
                                    </div>
                                    <img class="order__cancel" onclick="Cancel(this)"src="/Assets/img/remove icon.png">
                                </div>
                            </div>`);
        for (const order of CART) {
                $("#info__order").prepend(`<div class="final__card">
                                            <p><b>x${order.cantidad}</b> ${order.nombre}</p>
                                            <p><b>$${order.SubTotal()}</b></p>
                                           </div> `);
        }
    GetPayment()
    } else {
        $(".grid__products").addClass("alert");
    }
}; 
// quita la tarjeta de confirmación de compra (UI)
const Cancel = ()=> {$("#confirmation").fadeOut(400)};
// envia nuestra orden, confirma la compra y elimina el carrito del localStorage
function OrderComplete() {
    if (!localStorage["userPayment"]){
        $("#payment__selected").addClass("alert")
    } else {
        $.post("https://jsonplaceholder.typicode.com/posts",JSON.stringify(CART), function(req, res) {
            if (res === "success") {
                CART.splice(0, CART.length);
                $("#order__complete").addClass("drop");
                RemoveLocalStorage("userCart");
                RemoveLocalStorage("userAmmount")
                $("#confirmation").delay(2500).fadeOut(500);
                $("#payment__selected").remove("alert")
                Empty("#order__queue");
                $("#total__ammount").html("$0");
                $("#subtotal__ammount").html("$0");
                $("#shipSelect").val("takeAway");
                $("#fee__price").html("$0");
            } else {
                $("body").prepend(`<h3>Error 404</h3>`);
            }
        });
    }    
};
/* -------------------------------------------------------------------------- INPUTS ------------------------------------------------------------------------------------- */
// escucha el click y validamos los inputs en el frontend
function UserInfo(btn, inputID, tagID) {
    $(btn).click(function () {
        const node = $(inputID);
        if (node.selector == '#Mail') {
            if (document.getElementById("Mail").value.includes("@" && ".com")) {
                node.removeClass("alert");
                $("#user__mail").text(node.val());
                node.val(''); 
            } else {
                node.addClass("alert");
                node.val("Invalid");
            }
        } else if (node.selector == '#Number') {
            if (node.val() != '') {
                $("#phone").removeClass("alert");
                $("#user__number").text(node.val());
                node.val(''); 
            } else {
                $("#phone").addClass("alert");
            } 
        } else {
            if (node.val() == 'Invalid') {
                node.addClass("alert");
                node.val("Invalid");
            } else if (node.val() == '') {
                node.addClass("alert");
                node.val("Invalid");
            }else {
                node.removeClass("alert");
                $(tagID).text(node.val());
                node.val(''); 
            }  
        }   
    })
};
