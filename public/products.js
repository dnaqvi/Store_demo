const productsSection = document.querySelector('#products');
// Check out index.html,
// I've added an aside element called #cart to the DOM
// with a #cart-button,
// a dialog element,
// and an unordered list of #line-items
// (there's a little CSS for them as well, but nothing too fancy).

// Select the dialog, button and list and store them in consts called
// cartDialog, cartButton, and lineItemsList.

const cartDialog = document.querySelector('#dialog');
const cartButton = document.querySelector('#cart-button');
const lineItemsList = document.querySelector('#line-items');

// Delare a const called cart and set it equal to an empty object.
// The goal is to populate this cart object with keys that represent
// a product's price_id, and values that represent how many of that
// product are currently in the cart.

const cart = {};

// So a more filled-out cart might look like this:

// {
//   price_abc123: 4,
//   price_xyz789: 1
// }

// Once you have an empty cart object, declare functions called addToCart and subtractFromCart,
// each of which should each take an event as an argument.

function addToCart(event) {
  const theButtonThatGotClicked = event.currentTarget;
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset
    .priceid;
  if (cart[priceId]) {
    // increment the quantity by 1
    cart[priceId] += 1;
  } else {
    // set the quantity equal to 1
    cart[priceId] = 1;
  }
  renderCart();
}

// -- Actually, you can replace the existing handleButtonClick function with addToCart,
// since that's what's supposed to happen when someone clicks the button.
// Make sure you update the event listener on the button in each card. --

// Inside the functions, you will want to take the event's currentTarget,
// and store it in a const called theButtonThatGotClicked.
// Use that to find the closest DOM element with a data-priceid attribute,
// and its dataset.priceid in a const called priceId (see below):

// const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset.priceid

// In the addToCart function, you want to check if the cart object already has
// this priceId as a key (meaning at least one of this product is already in the cart.)
// If there's already one in the cart, increment it by one.
// Otherwise, set it equal to one.

// In the subtractFromCart function, you can assume the priceId is already a key in the cart,
// since we can only subtract something from the cart _if_ it's in the cart.  Access the cart object
// at this key, and decrement the associated quantity by one.

// In other words, if priceId is price_abc123, make the 4 in the cart below go to 3.

// {
//   price_abc123: 4,
//   price_xyz789: 1
// }

function subtractFromCart(event) {
  const theButtonThatGotClicked = event.currentTarget;
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset
    .priceid;
  if (cart[priceId] > 1) {
    cart[priceId] -= 1;
  } else {
    delete cart[priceId];
  }
  renderCart();
}

// Bonus points if you can figure out how to keep this number from going below zero.

// Next, you need a function to render a line item in the cart.  Let's call it renderLineItem,
// and have it take a priceId as an argument.  Start by calling .find on the products array
// to find the product with a matching price_id.  Store the result in a const called product.

const renderLineItem = priceId => {
  const product = products.find(prod => prod.price_id === priceId);
  const html = `
  <li data-priceid="${priceId}"> 
    <span>${product.name}: ${cart[priceId]}</span>
    <span>
      <button class="add">+</button>
      <button class="subtract">-</button>
    </span>
  </li>`;
  const fragment = document.createRange().createContextualFragment(html);
  const addButton = fragment.querySelector('.add');
  const subtractButton = fragment.querySelector('.subtract');
  addButton.addEventListener('click', addToCart);
  subtractButton.addEventListener('click', subtractFromCart);
  return fragment;
};
// We are going to put some buttons inside the line item, so let's make this function return a fragment.
// Declare a const called html and store a string of html inside, namely a list item with a data-priceid
// attribute equal to the function's priceId. Inside the list items place two spans, the first of which
// should contain the name of the product and the quantity associated with this priceId in the cart object.
// The second span should contain two buttons, the first of which should have a "+" sign as its textContent
// and a class of "add", and the second of which should have a "-" as its textContent and a class of "subtract".

// Convert this html to a fragment.  Query the fragment for the add button and subtract button and add
// click event listeners to each so that the addToCart and subtractFromCart functions run accordingly.
// Don't forget to return the fragment.

// Add the bottom of addToCart and subtractFromCart, console log the cart object to see if it is working
// as expected when it runs (only addToCart can run so far, since we aren't displaying the subtract
// button anywhere yet). If the cart is incrementing as expected, declare a function called renderCart
// and call it from the bottom of each of these functions.

const renderCart = () => {
  cartDialog.open = true;
  const priceIds = Object.keys(cart);
  const lineItems = priceIds.map(renderLineItem);
  lineItemsList.innerHTML = '';
  lineItemsList.prepend(...lineItems);
};

// renderCart is what will display the cart in the upper righthand corner.  Inside the function,
// set the cartDialog's open property to true.  You may recall that only "open" dialogs
// are visible.  Call Object.keys on the cart object to store a list of its price_ids in a const called
// priceIds.  Then map over this array, passing in the renderLineItem as a callback argument.
// Store the mapped array in a const called lineItems.  Then set the lineItemsList's innerHTML to an empty
// string and prepend in all the lineItems using the ...spread operator.

// If everything is working correctly, the DOM should now update to increment and decrement the line items
// of the cart on the screen.

// Finally, clicking the cartButton should open or close the cartDialog.
// Declare a function called toggleCart, which sets the cartDialog's open attribute
// to the opposite of whatever it currently is.  Add an event listener to the
// cartButton so this function runs whenever it is clicked.

const toggleCart = () => {
  cartDialog.open = !cartDialog.open;
};

function renderProduct(product) {
  const html = `
  <div class="product" data-priceid="${product.price_id}">
    <h2>${product.name}</h2>
    <img src="${product.image}" alt="${product.name}"/>
    <button>
      Add $<span class="currency">${product.currency}</span> 
      ${(product.price_cents / 100).toFixed(2)}
    </button>
  </div>`;
  const fragment = document.createRange().createContextualFragment(html);
  const button = fragment.querySelector('button');
  button.addEventListener('click', addToCart);
  return fragment;
}

let products = [];

async function fetchProducts() {
  const response = await fetch('/products');
  products = await response.json();
  const fragments = products.map(renderProduct);
  productsSection.innerHTML = '';
  productsSection.prepend(...fragments);
}

cartButton.addEventListener('click', toggleCart);

fetchProducts();
