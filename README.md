# serverless-inventory-app

This application has the following features: : 

* Ability to add a single product to the inventory or add products in bulk within the range of 2 to 100 products 
* Ability to get all products in the inventory
* Ability to update or delete a product
* Ability to add image to product
* Auth0 Authentication and Custom authorizer that fetches certificate from Auth0 
* Ability to sort Products by productName. (This required the usage of a localSecondary Index)
* Pagination
* Use of middy cors middleware

Feature in progress: (They were not finished due to time constraints)

* Implement a new endpoint that allows sending full-text search requests to Elasticsearch. (This has been commented out due to gnawing bug)
* Use of secret manager

# Product items

The application stores product items and each product item has an attachment image. Each product item contains the following fields:

* `productId` (string) - a unique id for an item
* `userId` (string) - unique id for the user attached to the product
* `productName` (string) - name of a product item (e.g. "xyz leave-in conditioner")
* `addedAt` (string) - date and time at which the product was added to the inventory
* `mass_g` (number) - the mass of the product in grams.
* `quantity` (number) - the number of product item instance available.
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Product item


# How to run the application

## Backend

This application is purely backend application for now and it currently runs on AWS. To test the application, you will need to use Postman. The repo contains a Postman collection that contains sample requests. 

## Please note

This application requires a user to authenticate and therefore an authentication token has been provided in the variables sections of the Postman Collection. 

If the Token has expired or is not working, Kindy get a new one by running the request called 

```
Get authentication token
```

Also note that because of time constraint, the below specification was not implemented:

```
If you log out from a current user and log in as a different user, the application should not show items created by the first account.
```

The application is currently setup  to have just one user for now but is written in a way to accommodate more users in the future. 

