# An example: shopping

## Domain
This example is a web page allowing a user to assemble an order. Back-end data is mocked out with flat JSON data.

## Sub-domains
The example consists of two key sub-domains:
* Select a product (product-listing)
* Compile order (cart)
* Check-out (not implemented)

### Bounded context: Product listing

The product listing context is responsible for the listing of products and selection of products to add to the cart.

### Bounded context: Shopping cart

The shopping cart context is responsible for displaying products which represent an order being prepared

