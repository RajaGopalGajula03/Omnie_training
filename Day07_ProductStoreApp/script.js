let products = [];
let cart = [];


const productContainer = document.getElementById("productContainer");
const cartCount = document.getElementById("cartCount");


const fetchProducts = () =>{
    fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data =>{
        products = data;
        displayProducts(products);
    })
    .catch(err => {
        console.log("Error : ",err)
    })
};

fetchProducts();


const displayProducts = (data) =>{
    productContainer.innerHTML = "";
    console.log(data);
    data.map((product) =>{
        const card = document.createElement("div");
        card.classList.add("card");
        
        card.innerHTML=`
        <img src="${product.image}"/>
        <h4>${product.title}</h4>
        <p>$${product.price}</p>
        <button onclick = "addToCart(${product.id})">Add To Cart</button>
        `;

        productContainer.appendChild(card);
    })
}

const addToCart = (id) =>{
    const product = products.find(p => p.id === id);

    cart.push(product);
    cartCount.innerText = cart.length;
}