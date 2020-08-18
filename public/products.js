const productsSection = document.querySelector('#products');
const cartDialog = document.querySelector('#dialog');
const cartButton = document.querySelector('#cart-button');
const lineItemsList = document.querySelector('#line-items');

const cart = [];

const addToCart = event => {
  const theButtonThatGotClicked = event.currentTarget;
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset
    .priceid;

  if (!cart[priceId]) {
    cart[priceId] = 1;
  } else {
    cart[priceId] += 1;
  }
};

const subtractFromCart = event => {
  const theButtonThatGotClicked = event.currentTarget;
  const priceId = theButtonThatGotClicked.closest('[data-priceid]').dataset
    .priceid;
  cart[priceId] -= 1;
};
/*

  }
  


  
  Bonus points if you can figure out how to keep this number from going below zero.
  Next, you need a function to render a line item in the cart.  Let's call it renderLineItem,
  and have it take a priceId as an argument.  Start by calling .find on the products array 
  to find the product with a matching price_id.  Store the result in a const called product.
  
  We are going to put some buttons inside the line item, so let's make this function return a fragment.
  Declare a const called html and store a string of html inside, namely a list item with a data-priceid
  attribute equal to the function's priceId. Inside the list items place two spans, the first of which 
  should contain the name of the product and the quantity associated with this priceId in the cart object.
  The second span should contain two buttons, the first of which should have a "+" sign as its textContent
  and a class of "add", and the second of which should have a "-" as its textContent and a class of "subtract".
  Convert this html to a fragment.  Query the fragment for the add button and subtract button and add 
  click event listeners to each so that the addToCart and substractFromCart functions run accordingly.  
  Don't forget to return the fragment.
  
  Add the bottom of addToCart and subtractFromCart, console log the cart object to see if it is working
  as expected when it runs (only addToCart can run so far, since we aren't displaying the subtract 
  button anywhere yet). If the cart is incrementing as expected, declare a function called renderCart 
  and call it from the bottom of each of these functions.
  renderCart is what will display the cart in the upper righthand corner.  Inside the function, 
  set the cartDialog's open property to true.  You may recall that only "open" dialogs
  are visible.  Call Object.keys on the cart object to store a list of its price_ids in a const called
  priceIds.  Then map over this array, passing in the renderLineItem as a callback argument. 
  Store the mapped array in a const called lineItems.  Then set the lineItemsList's innerHTML to and empty
  string and prepend in all the lineItems using the ...spread operator.  
  If everything is working correctly, the DOM should now update to increment and decrement the line items
  of the cart on the screen.
  Finally, clicking the cartButton should open or close the cartDialog.  
  Declare a function called toggleCart, which sets the cartDialog's open attribute 
  to the opposite of whatever it currently is.  Add an event listener to the 
  cartButton so this function runs whenever it is clicked.
*/

function handleButtonClick(event) {
  console.log(`You clicked ${event.currentTarget.innerText}`);
}

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

fetchProducts();
