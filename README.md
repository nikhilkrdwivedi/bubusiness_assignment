# Book Rental System 
This is basic node application which able to authenticate user and provide protected routes.User able to take books on rent also return. I am using following technologies: 
  - Nodejs
  - Expressjs
  - MongoDB [cloud base mongoDB]
  - Joi (NPM Package)
  - JWT - Json Web Token
  - Bcrypt
  - ES6
  - uuidv4


### Run Following Commands
For package installation:
```sh
$ npm install or  yarn install
```
for running project:
```sh
$ npm start or yarn start
```
##### Note: Please create .env file and paste your mongoDB database DB_CONNECT and TOKEN_SECRET. 
let's take one .env file example[your path or token depends upon your choice] -
###### Please replace with your mongodb url 
- DB_CONNECT = "mongodb+srv://userName:Password@cluster0-fqqyk.mongodb.net/bubusiness_database?retryWrites=true&w=majority"
###### Please replace Token Secret with your random string 
- TOKEN_SECRET = habdBYUCBNBNXBYQTHXBYUASVXUGQSJXBXN

#### Routes:
##### Auth Routes:
- /api/user/register [Post]\
    Body: {  "firstName":"Nikhil",
    "lastName":"Kumar",
    "email":"nikhil.dwivedi@outlook.com",
    "contact":"8847240883",
    "password":"Nikhil123@"
}
- /api/user/login [Post]\
    Body:{
    "contact":"8847240883",
    "password":"Nikhil007@"
}
###### After login, You will get "access_token" pass in headers "access_token" - "Your JWT TOKEN which you get after successfully login"
##### Book Routes:
- /api/book/postBook [Post]\
    Body: {
    "title":"A4 Size Letter",
    "isbn":"kar-78-safy-678-KK",
    "author":"Gopal Krishna"
}
- /api/book/getBooks [Get]\
   Returns whole list of books.
- /api/book/getBook/:isbn
    Returns details of book.
- /api/book/updateBook [Put]\
Body: {
    "active":true,
    "isbn":"kar-78-safy-678-KK"
}
isbn is mandatory here. Rest will update.
- /api/book/deleteBook/:isbn [delete]\
    This route delete book based on isbn get.
##### Rental Routes:
- /api/rental/issueBook [Post]\
    Body: {
    "isbn":"kar-78-safy-678-KK",
    "cardHolder":"c1594ca2-39bb-41a4-a19f-2b7ea97767fb"
}
- /api/rental/returnBook [Put]\
{
    "isbn":"kar-78-safy-678-KK",
    "cardHolder":"c1594ca2-39bb-41a4-a19f-2b7ea97767fb"
}
- /api/rental/getBookHistory [Get]\
Returns whole history rental rental and non-rental books

- /api/rental/getBooksByLoanOrNot/:isIssued [Get]\
isIssued is boolean value i.e. 'true/false'. This route filter records based on isIssued true or fasle. If isIssued equal to true then whole active rental book list will return else which is already return.

#### Thanks for checking my code, feel free to give your valuable suggestions.

#### Nikhil Kumar
[linkedin](https://www.linkedin.com/in/nikhilkrdwivedi/) | nikhil.dwivedi@outlook.com | https://www.codeforcoder.com
