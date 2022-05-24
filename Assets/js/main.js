// RUN CODE
const JSONPRODUCTS = "Assets/data/products.json"
    $.get(JSONPRODUCTS, function (req, res) { // OBTENEMOS LOS PRODUCTOS
        if (res === "success") {
            for (const generic of req) {
                PRODUCTS.push(new Product(generic.id, generic.nombre, generic.foto, generic.precio, generic.cantidad))
            }
        AddUI(PRODUCTS, "#menu__products") // AGREGAMOS LA INTERFAZ LUEGO DE VALIDAR
        $(".add_icon").click(AddToCart)
        } else {
            $("body").preppend(`<h3>Error 404</h3>`)
        }
    });
$(document).ready(function(){
    SimulateSPA() // SIMULAMOS UNA SINGLE PAGE APLICATION
    
    GetCart(), GetData(), GetPrice()// OBTENEMOS EL CARRITO, LOS DATOS DEL USUARIO Y EL PRECIO (EN CASO DE QUE HAYA)
    
    $(".list").on("click", function() { // SELECTOR DEL NAV
        $(this).siblings().removeClass("active");
        $(this).addClass("active");
    });

    $(".content").click(OpenCard) // ESCUCHAMOS EL CLICK DE LOS METODOS DE PAGO
    $(".radio").click(SetPayment) // ESCUCHAMOS EL CLICK DEL INPUT RADIO
    
    const $select = $("#shipSelect");
    $select.change(FeesSelector); // ESCUCHAMOS EL CAMBIO DEL SELECT 
    $("#checkout").click(FinalCheckout); // ESCUCHAMOS EL CLICK DEL CHECKOUT
    
    UserInfo("#name__btn", "#Name", "#user__name") // TRABAJAMOS LOS INPUT
    UserInfo("#adress__btn", "#Adress", "#user__adress") // TRABAJAMOS LOS INPUT
    UserInfo("#mail__btn", "#Mail", "#user__mail") // TRABAJAMOS LOS INPUT
    UserInfo("#number__btn", "#Number", "#user__number") // TRABAJAMOS LOS INPUT
    
    $(".add__info").click(function () { // ESCUCHAMOS EL CLIC Y TRABAJAMOS LOS DATOS DE LOS INPUTS ANTERIORES
        const node = document.querySelectorAll(".user_data");
        let USERDATA = [];
        for (let i = 0; i < node.length; i++) {
            USERDATA.push(node[i].innerText);
        };
        RemoveLocalStorage("userData");
        SetLocalStorage("userData", USERDATA);
    })

});





