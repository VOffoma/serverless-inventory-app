# serverless-inventory-app

This application will allow for the following actions: 

* Add a single product to the inventory
* Add products in bulk within the range of 2 to 100 products 
* Get all products in the inventory
* Update a product 
* Delete a product 

# TODO items

The application should store product items and each product item has an attachment image. Each product item contains the following fields:

* `productId` (string) - a unique id for an item
* `userId` (string) - unique id for the user attached to the product
* `productName` (string) - name of a product item (e.g. "xyz leave-in conditioner")
* `addedAt` (string) - date and time at which the product was added to the inventory
* `mass_g` (number) - the mass of the product in grams.
* `quantity` (number) - the number of product item instance available.
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Product item


