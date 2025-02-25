
function recomendedProducts() {
  let clutter = '';
  recitems.forEach(function (item, index) {
    clutter += ` 
    <div class="col-lg-3 col-md-6 col-sm-6" id="${item.id}">
      <div class="card my-2 shadow-0 product-img card-action">
        <a href="#" class="">
          <img src="${item.img}" class="card-img-top rounded-2" style="aspect-ratio: 1 / 1" />
        </a>
        <div class="card-body p-0 pt-2">
          <a href="#!" class="btn btn-light border px-2 pt-2 float-end icon-hover"><i
              class="fas fa-heart fa-lg px-1 text-secondary"></i></a>
          <h5 class="card-title">${item.rate}</h5>
          <p class="card-text mb-0">${item.pname}</p>
          <p class="text-muted">
            Sizes: ${item.size}
          </p>
          <div class="add-btn card-footer d-flex align-items-center pt-3 px-0 pb-0 mb-4">
            <a data-index="${index}" class="add-cart btn btn-outline-primary w-100">Add to cart</a>
          </div>
        </div>
      </div>
    </div>`;

  })
  document.querySelector(".rec-products").innerHTML = clutter;
}

function newSection() {
  let clutter = '';
  let offer = '';
  newProducts.forEach(function (item, index) {

    clutter += `
      <div class="col-lg-3 col-md-6 col-sm-6">
      <div class="card my-2 shadow-0 product-img card-action ">
      <a>
          <img src="${item.img}"
            class="card-img-top rounded-2" style="aspect-ratio: 1 / 1" />
        </a>
        <div class="card-body p-0 pt-3">
          <a href="#!" class="btn btn-light border px-2 pt-2 float-end icon-hover"><i
              class="fas fa-heart fa-lg px-1 text-secondary"></i></a>
          <h5 class="card-title">${item.rate}</h5>
          <p class="card-text mb-0">${item.pname}</p>
          <p class="text-muted">
            Deatails:${item.div}
          </p>

          <div class="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto mb-4">
            <a data-index="${index}" class="add-cart btn btn-outline-primary w-100">Add to cart</a>
          </div>
        </div>
      </div>
    </div>`;
  })

  document.querySelector(".new-products").innerHTML = clutter;

}

var cart = [] // It will store the added elements

function addCart() {

  let add = document.querySelector(".new-products");
  add.addEventListener("click", function (eve) {
    if (eve.target.classList.contains("add-cart")) {
      alert("Product added to the cart")
      cart.push(newProducts[eve.target.dataset.index])
      localStorage.setItem('cart', JSON.stringify(cart));

    }
  })

  // For recomended items
  let addrec = document.querySelector('.rec-products');

  addrec.addEventListener("click", function (eve) {
    if (eve.target.classList.contains("add-cart")) {
      alert("Product added to the cart")
      cart.push(recitems[eve.target.dataset.index])
      localStorage.setItem('cart', JSON.stringify(cart));

    }
  })

  console.log(cart)
}

// Adding recomended products
recomendedProducts()

// Adding new section products
newSection()

// adding cart 
addCart()

