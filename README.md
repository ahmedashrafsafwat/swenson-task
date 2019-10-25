# SWEBSON backend Task

## Before running the project!!

please import the data from the `mongodb_exports/dumb/swenson` folder by running the following command

`mongorestore -d swenson --verbose mongodb_exports\dumb\swenson\`

### To run this project you have two ways

1. using Docker by running this commands:

   `docker-compose build`

   then

   `docker-compose up`

   then test by heading over to:

   `http://localhost:3000/signup`

   or

   `http://localhost:3000/login`

2. Run the following comands

run `npm install`

run `npm start` or `nodemon start`

### To run the test file run

`npm test`

### Some query URL examples to test:

`http://localhost:3000/coffee/get/?product_type=large&water_line_compatible=false&pack_size=0`
`http://localhost:3000/coffee/get/?product_type=large&water_line_compatible=false&pack_size=12&coffee_flavor=vanilla`
