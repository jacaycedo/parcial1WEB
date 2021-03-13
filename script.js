dataTot = [];
favoritos = [];
async function fecthJson()
{
    fetch('https://gist.githubusercontent.com/jhonatan89/719f8a95a8dce961597f04b3ce37f97b/raw/4b7f1ac723a14b372ba6899ce63dbd7c2679e345/products-ecommerce')
  .then(response => response.json())
  .then(data => 
    {
        dataTot = data;
      primerRender(data);
    })
}

function backBasic()
{
    primerRender(dataTot);
}

function primerRender(data)
{

    items = data["items"];
    body = document.body;
    main = document.getElementsByTagName("Main")[0]
    main.innerHTML = "";

    for (let i in items)
    {
        info = items[i];

        let tag = document.createElement("div");
        tag.classList.add("card");
        tag.classList.add("cajaProd");

        let foto = document.createElement("img");
        foto.classList.add("img");
        foto.src  = info["picture"];
        if(foto.addEventListener)
        {
            foto.addEventListener('click', function()
            {
                renderProd(items[i]);
            });
        }
         else if(foto.attachEvent)
        {
            foto.attachEvent('onclick',function()
            {
                renderProd(items[i]);
            });
        }

        let precio = document.createElement("p")
        precio.classList.add("precio")
        ajuste = String(info["price"]["amount"]).split(".")[1] ? String(info["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )+"."+String(info["price"]["amount"]).split(".")[1] : String(info["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )
        precio.innerHTML = info["price"]["currency"]  + " " +  ajuste;
        
        let titulo = document.createElement("p");
        titulo.classList.add("tituloProd");
        titulo.innerHTML = info["title"];

        let loc = document.createElement("p");
        loc.classList.add("localizacion");
        loc.innerHTML = info["location"];

        if(Boolean(info["free_shipping"]))
        {
            let free = document.createElement("svg");
            free.classList.add("envioGratis");
            tag.appendChild(free);
        }
        tag.appendChild(foto);
        tag.appendChild(precio);
        tag.appendChild(titulo);
        tag.append(loc)
        main.appendChild(tag);
    }
}
function renderProd(datosProd)
{
    main = document.getElementsByTagName("Main")[0]
    main.innerHTML = ""
    
    let bread = document.createElement("p");
    bread.classList.add("breadCrumb")
    let str = ""
    let comp = String(datosProd["categories"]).split(",");
    
    for (let i in comp)
    {
        str += comp[i]
        if( i < comp.length-1)
        {
            str += " > "
        }
    }
    bread.innerHTML = str;


    let tag = document.createElement("div");
    tag.classList.add("card");
    tag.classList.add("cartaDetalle");

    let foto = document.createElement("img");
    foto.classList.add("imgDetalle");
    foto.src  = datosProd["picture"];
    tag.appendChild(foto)
    
    let estado = document.createElement("p");
    estado.classList.add("estadoDetalle")
    estado.innerHTML = datosProd["condition"] + " | " + datosProd["sold_quantity"] + " vendidos"
    tag.appendChild(estado)

    let tit = document.createElement("p");
    tit.classList.add("tituloDetalle")
    tit.innerHTML = datosProd["title"]
    tag.appendChild(tit)

    let precio = document.createElement("p")
    precio.classList.add("precioDetalle")
    ajuste = String(datosProd["price"]["amount"]).split(".")[1] ? String(datosProd["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )+"."+String(datosProd["price"]["amount"]).split(".")[1] : String(datosProd["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )
    precio.innerHTML = datosProd["price"]["currency"]  + " " +  ajuste;
    tag.appendChild(precio);

    let des = document.createElement("p");
    des.classList.add("descripcionTitDetalle");
    des.innerHTML = "Descripción del producto";
    tag.appendChild(des);

    let detalle = document.createElement("p");
    detalle.classList.add("descripcionDetalle");
    detalle.innerHTML = datosProd["description"];
    tag.appendChild(detalle);

    let btnComprar = document.createElement("button");
    btnComprar.classList.add("btnComprar");
    btnComprar.classList.add("btn")
    btnComprar.setAttribute("data-toggle", "modal")
    btnComprar.setAttribute("data-target", "#exampleModal")

    btnComprar.innerHTML = "<p class = txtBut >Comprar </p>";
    
    tag.appendChild(btnComprar);


    let btnFav = document.createElement("button");
    btnFav.classList.add("btnFav");
    let srt = favoritos.includes(datosProd)? "Retirar de favoritos" : "Añadir a favoritos"
    btnFav.innerHTML = "<p class = txtBut > "+ srt + "</p>";
    btnFav.onclick = function()
    {
        pushFavs(datosProd);
    }
    tag.appendChild(btnFav);
  
    let modal = document.createElement("div");
    modal.classList.add("modal");
    modal.classList.add("fade");
    modal.id = "exampleModal";
    modal.tabIndex = "-1";
    modal.role = "dialog"
    modal.setAttribute("aria-labelledby", "exampleModalLabel")
    modal.setAttribute("aria-hidden", "true")
    modal.innerHTML = internModal(datosProd["title"])

    main.appendChild(modal)
    main.appendChild(bread);
    main.appendChild(tag);
    
}

function renderFavoritos()
{
    main = document.getElementsByTagName("Main")[0]
    main.innerHTML = "";

    let bread = document.createElement("p");
    bread.classList.add("favoritos")
    bread.innerHTML = "Favoritos"

    let tag = document.createElement("div");
    tag.classList.add("card");
    tag.classList.add("cajaElim");

    let check = document.createElement("input")
    check.type = "checkbox"
    check.classList.add("check")
    check.classList.add("todo")
    check.addEventListener('change', function()
    {
        allSelected();
        btnPressedFav() 
    })
    tag.appendChild(check)

    let btnBorrar = document.createElement("button")
    btnBorrar.classList.add("btnBorrar")
    btnBorrar.id= "btnBorrar"
    btnBorrar.innerHTML = "<p class = txtBorrar> Eliminar </p>"
    btnBorrar.disabled = true;
    btnBorrar.onclick = deleteSelected;
    tag.appendChild(btnBorrar)

    main.appendChild(tag);

    for (let i in favoritos)
    {
        let tag = document.createElement("div");
        tag.classList.add("card");
        tag.classList.add("cajaProd");
        tag.dataset.item = favoritos[i]["id"];

        let check = document.createElement("input")
        check.type = "checkbox"
        check.classList.add("checkElem")
        check.classList.add("unitario")
        check.addEventListener('change', btnPressedFav);

        tag.appendChild(check)

        let foto = document.createElement("img");
        foto.classList.add("imgFav");
        foto.src  = favoritos[i]["picture"];
        tag.appendChild(foto)

        let precio = document.createElement("p")
        precio.classList.add("precio")
        ajuste = String(favoritos[i]["price"]["amount"]).split(".")[1] ? String(favoritos[i]["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )+"."+String(favoritos[i]["price"]["amount"]).split(".")[1] : String(favoritos[i]["price"]["amount"]).split(".")[0].split( /(?=(?:...)*$)/ )
        precio.innerHTML = favoritos[i]["price"]["currency"]  + " " +  ajuste;
        tag.appendChild(precio)
        
        let titulo = document.createElement("p");
        titulo.classList.add("tituloProd");
        titulo.innerHTML = favoritos[i]["title"];
        tag.appendChild(titulo)

        if(Boolean(favoritos[i]["free_shipping"]))
        {
            let free = document.createElement("svg");
            free.classList.add("envioGratis");
            tag.appendChild(free);
        }

        let btnVer = document.createElement("button")
        btnVer.classList.add("btnVerFav")
        btnVer.innerHTML = "<p class = txtBorrar> Ver articulo </p>"  
        btnVer.onclick = function()
        {
            renderProd(favoritos[i]);
        }
        tag.appendChild(btnVer)

        main.appendChild(tag)
    }
    main.appendChild(bread);
}

function btnPressedFav()
{
    let ck = document.getElementsByClassName("unitario")
    let btn = document.getElementById("btnBorrar")
    let todos = false;
    for (let i = 0 ; i < ck["length"] ; i++)
    {   
        todos = ck[i].checked | todos;
    }
    btn.disabled = !todos;

}
function pushFavs(fav)
{
    for( let i in favoritos)
    {
        if(favoritos[i]["id"] == fav["id"])
        {
            favoritos.splice(i,1);
            renderProd(fav);
            return;
        }
    }
    favoritos.push(fav);
    renderProd(fav);
}
function allSelected()
{
    let ck = document.getElementsByClassName("unitario")
    for (let i = 0 ; i < ck["length"] ; i++)
    {   
        ck[i].checked = true;
    }
}
function deleteSelected()
{
    let ck = document.getElementsByClassName("unitario")
    for (let i = 0 ; i < ck["length"] ; i++)
    {   
        if(ck[i].checked)
        {
            favoritos = favoritos.filter(func =>{ return func['id'] != ck[i].parentElement.dataset.item });
        }
    }
    renderFavoritos();
}

function filtrarCategoria()
{
    let valores = document.getElementById("categoria").value;
    filtrado = dataTot["items"].filter(func => {
        return (func["categories"].includes(valores));
    })
    if(filtrado.length > 0)
    {
        items = []
        items["items"] = (filtrado)
        primerRender(items)
    }
    else
    {
        main = document.getElementsByTagName("Main")[0]
        alert = document.createElement('div')
        alert.classList.add("alert")
        alert.classList.add("alert-warning")
        alert.style.position = 'relative';
        alert.style.top = "130px";
        alert.innerHTML = "No hay elementos en dicha categoría!, Intenta de nuevo!"
        main.prepend(alert);
    }
}

function internModal(txt)
{
    return`
    <div class="modal-dialog">
      <div class="modal-body">
      <p class= "tituloModal">
      ${txt}
      </p>
      <p class= "carritoModal">
      Añadido al carrito de compras
      </p>
      
        <button type="button" class="btnModal btn" data-dismiss="modal">Close</button>
      </div>
  </div>
    `
}


fecthJson();