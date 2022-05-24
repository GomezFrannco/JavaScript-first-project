// OBJECTS
class Product{
    constructor(id, name, picture, price, quantity){
        this.id = id;
        this.nombre = name;
        this.foto = picture;
        this.precio = price;
        this.cantidad = quantity || 1
    }
    SubTotal(){
        return this.cantidad * this.precio 
    }
    Add(value){
        this.cantidad += value
    }
    Reset(){
        this.cantidad = 0
    }
};