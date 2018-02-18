[![](http://wes.io/kH9O/wowwwwwwwww.jpg)](https://LearnNode.com)

# Learn Node

Hello! This repo is for tracking and documenting the lessons from Wes Bos's Learn Node course. I also include summaries of lessons learned after each topic.

## Lesson 1 - Getting Setup
- npm install FTW!
- install pug file highlighting for code editor

## Lesson 2 - Setting up Mongo DB
- two ways to setup Mongo:
  - use a DBAAS (database as a service) like mLab.com
    - create a new mongodb deployment
    - pick FREE sandbox option (shared, 0.5GB)
    - copy the connection string from the deployment and paste in variables.env under database
    - create a user with a password in mLab and replace the `<dbuser>` and `<dbpassword>` part of the connection string
  - host it yourself (mac)!
    - get homebrew if you don't have it
    - `brew update`
    - `brew install mongodb`

## Lesson 3 - Starter Files
- Express is a fast, un-opinionated, minimalist web framework for Node.JS
  - doesn't do a lot by itself, so we pick and choose from the Node ecosystem
- in the app.js file, we pull different modules from Node to make our app work
- in the start.js file
  - we import Mongoose, which is how we interface with our database
  - we import our environmental variables, which is stored in a variables.env file, and contains sensitive information like passwords/usernames, API keys, tokens - anything you need to keep safe.
    - it's a .env file because it should never go into a GitHub Repo
  - we connect to our database through Mongoose, enable compatibility with ES6 promises, and watch for errors
  - finally we require the app and kick off the server
- we can check package.json to see the available npm scripts
  - use npm start which will do the following:
    - watch javascript files with Nodemon and kill and restart the server automatically
    - run assets, which will use Webpack to compile Sass into CSS and compile the frontend Javascript into a bundle for us
- in the terminal, the logs coming from the computer have a computer icon, while the logs from Webpack have a box icon

## Lesson 4 - Routing
- Essentially when people go to a URL, you need to do stuff!
  - query the database
  - filter through a list of stores
  - modify that data in some way
  - finally send the data to the user
- Express.js routing
  - in index.js
    - import Express `const express = require('express');`
    - grab the router off of Express `const router = express.Router();`
    - define all your routes
    ```javascript
    router.get('/', (req, res) => {
    res.send('Hey! It Works!');
    });
    ```
    - when somebody visits the URL ('/'), the function is going to give you three things
      - request `req`, which is an object full of information that's coming in
      - response `res`, which is an object full of methods for sending data back to the user
      - next `next`, which will be handled by middleware file
  - in app.js
    - import routes from index.js `const express = require('./routes/index');`
    - then tell Express to use those routes `app.use('/', routes):`
      - can do a separate admin router too `app.use('/admin' adminRoutes);`
    - handles Middleware as well
      - `app.use(bodyParser.json());` and `app.use(bodyParser.urlencoded({ extended: false }));` takes the data in the request, checks the URL, and puts all of the data so we can easily access it through `request.query` or  `request.body`
- two ways to send data to the browser `res.send` and `res.json`
  -  watch for error "Headers are already sent" - probably sent data twice e.g. `res.send` with `res.json`
- data from the url `localhost:7777/?name=wes&age=100` is in the request `req.query.name`
- putting variables in a route `router.get('/reverse/:name')`
- obtaining variables in a route `req.params.name`

## Lesson 5 - Templating
- `res.render` is going to render out a template.
- PUG is very popular templating language in the Node community
  - used to be called Jade
- in `app.js`
  - we set the folder where we keep our PUG files, AKA our Views folder
  - we set the templating engine to be PUG
    - mustache and EJS are other templating engines
- in `index.js`
  - `res.render()` will take two things
    - a name of a template to render out, AKA the View
    - an object whose properties define local variables, AKA locals
      - 
      ```javascript
      res.render('hello', {
        name: 'wes',
        dog: 'ziggy'
      })
      ```
      - can also pass info from the url - `localhost:7777/?dog=ziggy`
      ```javascript
      res.render('hello', {
        name: 'wes',
        dog: req.query.dog
      })
      ```
- PUG basics
  - no tags! just type `p hello!`
  - nest elements by indenting one level
  - `.wrapper` will create automatically assume `<div class="wrapper"></div>`
  - `img(src="dog.jpg" alt="Dog")` for attributes
  - if you don't want a tag `<hello></hello>` , but just want to place text, use a pipe
    - `| hello`
  - if you pass in locals, you can interpolate the variable with `#{}`
    - `p.hello Hello my dogs name is #{dog}`
  - if you want to pass in locals to an attribute, you must use javascript denoted with backticks and ESX template literals `${}`
    -  ``img.dog(src="dog.jpg" alt=`${Dog}`)``
  - if you want to define variables
    - `- const upDog = dog.toUpperCase();`
  - if you want to use JavaScript
    - `p.hello Hello my dogs name is #{dog.toUpperCase()}`
  - emmet works too!
  - we have a `layout.pug` file that we can "extend" a default layout if we want to create a fresh new page
    - simply type `extends layout` to import the layout
  - we also can have different "blocks", which are sections of your website that can be filled in by another template

## Lesson 6 - Template Helpers
- in `helpers.js`
  - contains any helper libraries or data that's needed in every single template
- in `app.js`
  - we import the data from `helpers.js` by requiring it at the top of the file 
    - `const helpers = require('./helpers');`
  - then we add it to our locals
   - `res.locals.h = helpers`
  - which we can then reference in PUG
    - ``title= `${title} | ${h.siteName}` ``
- any sensitive data should still be stored in  `variables.env`

## Lesson 7 - Controllers and the MVC Pattern
- MVC Design Pattern - a way to architect and organize your code
  - Model - manages the data from the database
  - View - templates in the PUG files
  - Controller - 'traffic cop' between Model and View; gets the data from the Model and puts it into the template
- helps in larger applications to avoid messy, hard to test code and increase reusability
- each functional part of the application will have its own controller
- in `storeController.js`
  - we add a homePage method to the global exports variable
    - 
    ```javascript
    exports.homePage = (res, req) => {
      res.render('index');
    }
    ```
- in `app.js`
  - we require the storeController at the top, and add the homePage method to the route
  -
  ```javascript
  const = storeController = require('../controllers/homePage');
  router.get('/', storeController.homePage);
  ```