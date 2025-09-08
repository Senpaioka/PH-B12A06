"use strict"

/* DOM */
const category = document.getElementById('category_list');
const trees = document.getElementById('tree_collection');
const loader = document.getElementById('loading-off');
const cart = document.getElementById('cart');
const total_sum = document.getElementById('total_price');
const x = document.getElementById("modalTitle")


/* functionality */

// category
const getCategory = async function(){
    try {
        const response = await fetch('https://openapi.programming-hero.com/api/categories');

        if (!response.ok){
            throw new Error(`Something Went Wrong ${response.statusText}`);
        }

        const data = await response.json()
        data.categories.forEach((item) => {
            category.innerHTML += `<li class="inter-mid text-base text-[var(--color-font-dark)] hover:text-white hover:bg-[var(--color-primary)] hover:rounded-sm duration-200 p-2 cursor-pointer" data-id='${item.id}'>${item.category_name}</li>`
        })

        category.addEventListener('click', (event) => {
            if (event.target.tagName === 'LI'){
                document.querySelectorAll('#category_list li').forEach(li => {
                    li.classList.remove('active')
                })
                event.target.classList.add('active')
                const category_id = event.target.dataset.id
                if (category_id){
                    getTrees(`https://openapi.programming-hero.com/api/category/${category_id}`)
                }else {
                    getTrees('https://openapi.programming-hero.com/api/plants')
                }
            }
        })
    }
    catch(error) {
        console.error(`Fetching error ${error}`)
    }
}

getCategory()

// tree column
const getTrees = async function(url){
    try {
        // loader on
        loader.style.display = 'block';
        trees.innerHTML = '';

        const response = await fetch(url);
        if (!response.ok){
            throw new Error(`Something Went Wrong ${response.statusText}`);
        }
        const data = await response.json()
        window.currentPlants = data.plants;

        // loader off
        loader.style.display = 'none';

        data.plants.forEach(info => {
           trees.innerHTML += `
            <div class="tree__variant bg-white rounded-md p-3">
                <img class="w-full h-auto rounded-md" src="${info.image}" alt="${info.name}">
                <h3 class="plant__title inter-semi text-sm text-[var(--color-font-dark)] py-3 cursor-pointer" data-name="${info.name}" data-image="${info.image}" data-category="${info.category}" data-price="${info.price}" data-description="${info.description}">${info.name}</h3>
                <p class="inter-reg text-xs text-[var(--color-font-dark)]">${info.description}</p>
                <div class="flex justify-between items-center gap-4 mt-3">
                    <span class="geist-semi text-sm text-[var(--color-primary)] bg-[var(--color-bg-main)] rounded-full p-3">${info.category}</span>
                    <h4 class="inter-semi text-sm text-[var(--color-font-dark)]">৳${info.price}</h4>
                </div>
                <button type="submit" class="cart__btn btn w-full btn-neutral bg-[var(--color-primary)] text-white hover:bg-[var(--color-font-dark)] hover:text-white duration-300 text-[16px] rounded-full border-none inter-reg my-4" data-id="${info.id}">Add to Cart</button>
            </div>
           `
        })


        // Add event listener for plant titles (event delegation)
        trees.addEventListener("click", (event) => {
        if (event.target.classList.contains("plant__title")) {
                        
            const name = event.target.dataset.name;
            const image = event.target.dataset.image;
            const category = event.target.dataset.category;
            const price = event.target.dataset.price;
            const description = event.target.dataset.description;
            // console.log(name)
            // const description = event.target.dataset.description;

            // Fill modal content
            document.getElementById("modalTitle").innerText = name;
            document.getElementById("modalImage").src = image;
            document.getElementById("modalCategory").innerText = `Category: ${category}`;
            document.getElementById("modalPrice").innerText = `Price: ৳${price}`;
            document.getElementById("modalDescription").innerText = `Description: ${description}`;

            // Show modal
            document.getElementById("plantModal").showModal();
        }
        });

    }
    catch(error) {
        console.error(`Fetching error ${error}`)
    }
}

getTrees('https://openapi.programming-hero.com/api/plants')



// add to cart 
const treeList = [];
let total = 0; 

trees.addEventListener("click", (event) => {
  if (event.target.classList.contains("cart__btn")) {
    const id = Number(event.target.dataset.id);
    const selected_plant = window.currentPlants.find((item) => item.id === id);

    // check cart
    const existingItem = cart.querySelector(`[data-cart-id="${id}"]`);

    if (!existingItem) {
      treeList.push(selected_plant);

      cart.innerHTML += `
        <div class="cart__item flex justify-between items-center bg-[var(--color-bg-main)] rounded-md p-3 my-4" data-cart-id="${selected_plant.id}">
          <div class="cart__text">
            <h5 class="inter-semi text-sm text-[var(--color-font-dark)]">${selected_plant.name}</h5>
            <p class="inter-reg text-base text-gray-500">
              ৳${selected_plant.price} x <span class="quantity">1</span>
            </p>
          </div>
          <button class="remove text-gray-500 cursor-pointer hover:text-red-500 duration-300 inter-reg text-xl">x</button>
        </div>
      `;

      total += selected_plant.price;
      total_sum.innerText = `৳${total}`;
    } 
    else {
      const quantity = existingItem.querySelector(".quantity");
      quantity.innerText = Number(quantity.innerText) + 1;
      total += selected_plant.price;
    }
    total_sum.innerText = `৳${total}`;
    console.log("Total:", total);
  }
});


// remove cart
cart.addEventListener("click", (event) => {
  if (event.target.tagName === "BUTTON") {
    const cartItem = event.target.closest(".cart__item");

    if (cartItem) {
      cartItem.remove();

        const priceText = cartItem.querySelector("p").innerText; 
        const [price, qty] = priceText.match(/\d+/g).map(Number);
        total -= price * qty;
        total_sum.innerText = `৳${total}`;
    }
  }
});
