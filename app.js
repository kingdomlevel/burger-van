//////////////////
// Event Handlers
//////////////////

window.document.querySelectorAll("#products .cart-button").forEach(addToCartButton => {
    addToCartButton.addEventListener("click", function () {
        cart.add(this.dataset.name, this.dataset.price, this.dataset.offercode);
    })
});

window.document.getElementById("loyalty-card").addEventListener("change", function () {
    cart.hasLoyaltyCard = this.checked;
    cart.updateCart();
});

let cartView = window.document.getElementById("cart");



///////////////
// Data Classes
///////////////
/**
 *  Model the shopping cart itself; that is, something that can contain "Items" of different values,
 *  and hence has a "cartValue" itself (the total cost to the user)
 */
class Cart {
    constructor() {
        this.contents = [];
        this.total = 0.0;
        this.hasLoyaltyCard = false;
    }

    /**
     * Adds new product to cart; or, if an instance of the product is already in the cart, 
     * increases quantity of this product by one. Calls updateCart() afterwards.
     * @param {string} name Unique name of product we are adding
     * @param {number} price Price of one product
     * @param {string} offerCode Optional product-specific offer code (e.g. "bogof")
     */
    add(name, price, offerCode) {
        let newItem = new Item(name, price, offerCode);
        // look to see if we already have an instance of this item in cart:
        let itemAdded = false;
        this.contents.forEach((existingItem) => {
            if (existingItem.name == newItem.name) {
                // existing item found: increase quantity and
                existingItem.quantity++;
                existingItem.calculateSubTotal();
                itemAdded = true;
            }
        });

        if (!itemAdded) {
            // existing item not found: add new one to cart
            this.contents.push(newItem);
        }

        this.updateCart();
    }

    /**
     * Reduces the quantity of the item we wish to remove by 1. If the quantity is already 1, removes
     * product from the cart entirely. Calls updateCart() afterwards.
     * @param {Item} item The item we want to remove
     */
    remove(item) {
        for (let i=0; i< this.contents.length; i++) {
            let currentItem = this.contents[i];
            if (currentItem.name == item.name) {
                if (currentItem.quantity > 1) {
                    currentItem.quantity--;
                    currentItem.calculateSubTotal();
                } else {
                    this.contents.splice(i, 1);
                }
                this.updateCart();
            }
        }
    }

    /**
     * Removes all items from cart and updates display
     */
    emptyCart() {
        this.contents = [];
        this.total = 0.0;
        this.updateCart();
    }

    /**
     * Works out the total value of products in the cart by adding up individual product sub-totals 
     * and calling applyDiscounts() for entire cart discounts.
     */
    calculateTotal() {
        let cartTotal = 0.0;

        this.contents.forEach((product) => {
            cartTotal += parseFloat(product.subTotal);
        });
        
        this.total = cartTotal.toFixed(2);

        this.applyDiscounts();
    }

    /**
     * Applies cart-wide discounts e.g. loyalty scheme, rewards for spending more, etc.
     */
    applyDiscounts() {
        this.discountApplied = false;

        // 10% off if customer has spent > £20
        if (this.total > 20) {
            let newTotal = this.total * 0.9;
            this.total = newTotal.toFixed(2);
            this.discountApplied  = true;
        }
        
        // 2% off if customer has loyalty card
        if (this.hasLoyaltyCard) {
            let newTotal = this.total * 0.98;
            this.total = newTotal.toFixed(2);
            this.discountApplied = true;
        }
    }

    /**
     * Updates the total of the whole cart and calls displayCart() to reflect any changes on screen.
     */
    updateCart() {
        this.calculateTotal();

        this.displayCart();
    }

    /**
     * Logic for displaying the breakdown and totals for cart in the HTML.
     */
    displayCart() {
        cartView.innerHTML = "";

        if (this.contents.length === 0) {
            let tr = document.createElement("tr");
            let td = document.createElement("td");
            td.innerHTML = "Cart is empty!";
            tr.appendChild(td);
            cartView.appendChild(tr);
        } else {            
            cartView.appendChild(this.createHeaderRow());

            // create table body:
            this.contents.forEach((product) => {
                let tr = document.createElement("tr");

                // name cell:
                let nameCell = document.createElement("td");
                nameCell.innerHTML = product.name;
                tr.appendChild(nameCell);
                
                // quantity cell (w/ - + buttons)
                let quantityCell = document.createElement("td");
                quantityCell.innerHTML = product.quantity;
                // show - + buttons
                let minusButton = document.createElement("button");
                minusButton.innerHTML = "-";
                minusButton.classList.add("cart-button");
                minusButton.onclick = function(ev) {
                    cart.remove(product)
                };
                quantityCell.appendChild(minusButton);
                let plusButton = document.createElement("button");
                plusButton.innerHTML = "+";
                plusButton.classList.add("cart-button");
                plusButton.onclick = function(ev) {
                    cart.add(product.name, product.price, product.offerCode);
                };
                quantityCell.appendChild(plusButton);
                
                tr.appendChild(quantityCell);
                
                // sub-total cell (w/ "discount" banner where applicable):
                let subTotalCell = document.createElement("td");
                subTotalCell.innerHTML = product.subTotal;
                if (product.discountApplied) {
                    let discountBanner = document.createElement("span");
                    discountBanner.classList.add("discount-banner");
                    discountBanner.innerHTML = "Discount applied!";
                    subTotalCell.appendChild(discountBanner);
                }
                
                tr.appendChild(subTotalCell);

                cartView.appendChild(tr);
            });

            // show total:
            let totalRow = document.createElement("tr");
            totalRow.id = "total-row";
            let totalLabel = document.createElement("td");
            totalLabel.innerHTML = "Total: ";
            totalLabel.colSpan = 2; 
            totalRow.appendChild(totalLabel);
            let totalCell = document.createElement("td");
            totalCell.innerHTML = this.total.toString();
            if (this.discountApplied) {
                let discountBanner = document.createElement("span");
                discountBanner.classList.add("discount-banner");
                discountBanner.innerHTML = "Discount applied!";
                totalCell.appendChild(discountBanner);
            }
            totalRow.appendChild(totalCell);

            cartView.appendChild(totalRow);

        }
    }

    /**
     * Helper method to create cart table's header row when using displayCart().
     */
    createHeaderRow() {
        let headerRow = document.createElement("tr");
        let nameHeader = document.createElement("th");
        nameHeader.innerHTML = "Product";
        headerRow.appendChild(nameHeader);
        let quantityHeader = document.createElement("th");
        quantityHeader.innerHTML = "Quantity";
        headerRow.appendChild(quantityHeader);
        let subTotalHeader = document.createElement("th");
        subTotalHeader.innerHTML = "Sub-Total";
        headerRow.appendChild(subTotalHeader);
        return headerRow;
    }
}

/**
 *  Models an item in the shop; could have been called "Product"
 */
class Item {
    constructor(name, price, offerCode) {
        this.name = name;
        this.price = price;
        this.offerCode = offerCode;
        this.quantity = 1;
        this.subTotal = price;
        this.discountApplied = false;
    }

    /**
     * Calculates the sub-total for this item based on price of one, quantity of items and
     * any item-specific dicounts.
     */
    calculateSubTotal() {        
        let cost = 0.0;
        // apply offers
        switch (this.offerCode) {
            case "bogof": 
                // BOGOF essentially means we pay for (num of items / 2) as long as we always round up
                let quantityToPay = Math.ceil(this.quantity / 2);
                cost =  quantityToPay * this.price;
                this.discountApplied = this.quantity > 1;
                break;
            default:
                // fall thru: no matching offer found.
                cost = this.price * this.quantity;
                this.discountApplied = false;
        }

        this.subTotal = cost.toFixed(2);
    }

}




///////////////////

let cart = new Cart();
cart.updateCart();