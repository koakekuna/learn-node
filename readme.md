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
  ```javascript
  exports.homePage = (res, req) => {
    res.render('index');
  }
  ```
- in `app.js`
  - we require the storeController at the top, and add the homePage method to the route
  ```javascript
  const = storeController = require('../controllers/homePage');
  router.get('/', storeController.homePage);
  ```
  ## Lesson 8 - Middleware and Error Handling
  - middleware allows us to run code after the request but before the response actually happens
    - e.g. user authentication
      - a request is made when a user signs in
      - bodyParser makes the data available on the req object
      `req.body.email = "  wes@wesBOS.com  ";`
      - emailNormalize prepares/validates data
      `req.body.email = req.body.email.trim().toLowerCase();`
      - authorizeUser looks up user and checks the password
      `req.user = { name: 'Wes', email: 'wes@wesbos.com'}`
      `req.user.email; // "wes@wesbos.com"`
      - valid - displayProfile and render template
      `res.render('account', { user: req.user })`
      - invalid - flash error and redirect to login page
      `res.flash('error', 'Invalid Login');`
      `res.redirect('/login')`
- middleware can have a `next();` method which is used to say, "I'm done with this middleware, pass it on to the next function down the line"
- e.g. myMiddleware completes and continues to homePage
`router.get('/', storeController.myMiddleware, storeController.homePage);`
- in `app.js`
  - anytime we see `app.use` we are using global middleware
  - so even before we expose any of our routes, we're running all this middleware
    - we have a public folder filled with static assets, so anytime anyone asks for any of these images, express doesn't even have to think about if it's a route or not
    `app.use(express.static(path.join(__dirname, 'public')));`
    - takes the raw request and turns them into usable properties on the `req.body`
    `app.use(bodyParser.json());`
    `app.use(bodyParser.urlencoded({ extended: false }))`
    - populate `req.cookies` with any cookies that came along with the request
    `app.use(cookieParser());`
    - sessions all us to store data on visitors from request to request
    ```javascript
    app.use(session({
      secret: process.env.SECRET,
      key: process.env.KEY,
      resave: false,
      saveUninitialized: false,
      store: new MongoStore({ mongooseConnection: mongoose.connection })
    }));
    ```
  - Passport JS handles our logins
  ```javascript
  app.use(passport.initialize());
  app.use(passport.session());
  ```
  - pass variables to our templates and all requests
  ```javascript
  app.use((req, res, next) => {
    res.locals.h = helpers
    res.locals.flashes = req.flash();
    res.locals.user = req.user || null;
    res.locals.currentPath = req.path;
    next();
  });
  ```
  - then we finally handle our own routes
  `app.use('/', routes);`
  - and if that didn't work, 404 them and forward to error handler
  `app.use(errorHandlers.notFound)`
- error handlers are safety nets to catch stuff after trying our routes, but before sending the response

## Lesson 9 - Creating our Store Model
- models is where are data is going to be stored
- mongoDB can be a loose database, meaning you do not need to specify what your data will look like ahead of time, but by default it is strict
- in _new_ file ./models/Store.js
  - mongoDB is the database and mongoose is the package that we use to interface
  `const mongoose = require('mongoose');`
  - we set the mongoose promise to be the global promise to use ES6's async/await
  `mongoose.Promise = global.Promise;`
  - we use slugs to turn our urls into url-friendly-names
  `const slug = require('slugs');`
  - we create a new schema
  ```javascript
  const storeSchema = new mongoose.Schema({
    // can accept an object with multiple parameters
    name: {
      type: String, 
      // do data normalization as close to the model as possible
      trim: true,
      // instead of true, pass a better user error message
      required: 'Please enter a store Name!'
    },
    slug: String,
    description: {
      type: String,
      trim: true
    },
    // we'll pass multiple strings in an Array
    tags: [String]
  });
  ```
  - finally we export the schema with `module.exports` since it's the main thing we're exporting
  `module.exports = mongoose.model('Store', storeSchema);`
- in `start.js`
  - we import all our models
    - only need to import once and MongoDB will know about the models throughout the entire application
  `require('./models/Store');`
- back in `Store.js`
  - we need to "slugify" our store name before we save, but only if the name has been modified
  ```javascript
  storeSchema.pre('save', function(next) {
    if (!this.isModified('name')) {
      next(); // skip it
      return; // stop this function from running
    }
    this.slug = slug(this.name);
    next();
  })
  ```

## Lesson 10 - Saving Stores and Using Mixins
- in `index.js`
  - create a route for an Add page
  `router.get('/', store.controller.addStore)`
- in `storeController.js`
  - add a new controller
  ```javascript
  exports.addStore = (req, res) => {
    res.render('editStore', { title: 'Add Store', });
  }
  ```
  - name the view 'editStore' instead of 'addStore', since we'll use the same template for both the Edit Store page and Add Store page
  - pass in a page title 'Add Store'
- in `editStore.pug`
  - import the base page layout from `layout.pug`
  `extends layout`
  - select the main body section
  `block content`
  - `h2= title` and `h2 #{title}` are the same thing
    - title variable was imported from the controller and is in our locals
- a PUG mixin is like a function where you pass in some data and it returns some HTML
- in `_storeForm.pug`
  - underscore in the file name to keep similar conventions to sass
  - add a mixin named storeForm
  `mixin storeForm(store = {})`
  - for adding a store, the default will be an empty object, but when we need to edit the store, a store name will be passed in
  - 
- in `editStore.pug`
  - import the mixin
  `include mixins/_storeForm`
  - use the mixin with a plus sign (+)
  `+storeForm()`
- in `editStore.pug`
  - use a dash (-) to use javascript
  `- const choices = ['Wifi', 'Open Late', 'Family Friendly', 'Vegetarian', 'Licensed'];`
  - use for loops
  `each choice in choices`
- two form methods "POST" and "GET" 
  - "POST" sends the data invisibly, useful for passwords
  - "GET" sends the data through the URL

## Lesson 11 - Using Async Await
- in `storeController.js`
  - import mongoose
  `const mongoose = require('mongoose');`
  - import the Store schema, which rather than importing the schema directly from the file, we've already imported it once in `start.js`, so we can simply reference it off the mongoose variable (a concept called singleton). We export this specific model 'Store' at the bottom of our `Store.js` file
  `const Store = mongoose.model('Store');`
  - create a new store
  ```javascript
  exports.createStore = (req, res) => {
    const store = new Store(req.body);
  }
  ```
  - what if someone posts additional data in the request?
    - since we're using a strict schema in our model in `models/store.js`, only the defined data will be picked up. Anything else will get thrown away.
  - save a store, which will fire off a connection to the MongoDB database, save that data, and then come back to us with either the store itself or an error saying what happened
  `store.save();`
- 3 ways to deal with asynchronous data
  - callbacks, which is the old way and has a lot of syntax and can create christmas tree code or callback hell
  ```javascript
  store.save(function(err, store) {
    if(!err) {
      console.log('It worked!');
      res.redirect('/');
    }
  })
  ```
  - promises, which you use `.then()` and `.throw()` and is great because you can chain these things on and on, as long as they return a promise from each of the thens
  ```javascript
  store
    .save()
    .then(store => {
      return Store.find()
    })
    .then(stores => {
      res.render('storeList', { stores: stores })
    })
    .catch(err => {
      throw Error(err);
    })
  console.log('It worked!');
  ```
  - async await, which you directly tell the parent function it will have some awaits, and then it will wait to complete the awaited function before moving on to the next line
  ```javascript
  exports.createStore = async (req, rest) => {
    const store = new Store(req.body);
    await store.save();
    console.log('It worked!');
  }
  ```
- in `errorHandlers.js`
  - in order to avoid `try{} catch(e) {}` with async await in each controller , we use some middleware to wrap the function in
  - this will catch the error, and call `next()`, which will run the next function in `app.js`
  ```javascript
  exports.catchErrors = (fn) => {
    return function(req, res, next) {
      return fn(req, res, next).catch(next);
    }
  }
  ```
- in `index.js`
  - import the catchErrors handler with ES6 object de-structuring, which will only import that specific method from `errorHandlers.js`
  `const { catchErrors } = require('../handlers/errorHandlers');`
  - wrap the controller with the catchErrors
  `router.post('/', catchErrors(storeController.createStore));`

## Lesson 12 - Flash Messages
- flashing a message helps with redirects by displaying additional info such as a success or error message
- in `app.js`
  - we import the flash middleware
  `const flash = require('connect-flash');`
  - and make the flashes available
  `app.use(flash());`
  - and store them in our locals too
  `req.locals.flash = req.flash();`
- in `storeController.js` and in our createStore method
  - we use the appropriate flash type and specify the text
  ``req.flash('success', `Successfully created ${store.name}. Care to leave a review?`)``
  - other flash types available - 'warning', 'danger', 'info'
  - we redirect them to a store page
  ``res.render(`/store/${store.slug}`)``
  - since the slug is autogenerated in the model, we await and call `.save()` on the function right away
  `const store = await (new Store(req.body)).save();`
- in `layout.pug` and in the messages block
  - we check first if there's any flashes in locals
  - then we loop over each category, and each message within the category to have a class of `.flash` and `.flash--category`
  - we add a paragraph tag with a class of `.flash__text` and parse the message with a `!=`
    - regular `=` does not parse HTML, so you would end up with `something <strong>happened</strong>`
  ```javascript
  block messages
    if locals.flashes
      .inner
        .flash-messages
          - const categories = Object.keys(locals.flashes)
          each category in categories
            each message in flashes[category]
              .flash(class=`flash--${category}`)
                p.flash__text!= message
                button.flash__remove(onclick="this.parentElement.remove()") &times;
  ```
- whenever you want a quick dump of the data being sent through, just use a pre tag and a helper method dump in the pug file
`pre= h.dump(locals)`
  - the helper function comes from `helpers.js`
  `exports.dump() = (obj) => JSON.stringify(obj, null, 2);`
- flashes only work with sessions, as you have to be able to save data from one request to another
  - otherwise the application is stateless

## Lesson 13 - Querying Our Database for Stores
- need a way to display the stores on the homepage and on the stores page
- in `storeController.js`
  - create a getStores controller method
  ```javascript
  exports.getStores = (req, res) => {
    res.render('stores', { title: 'Stores' });
  }
  ```
- in `index.js`
  - change the controller method for the index to getStores
  `router.get('/', 'storeController.getStores);`
  - create a new controller method for the stores page
  `router.get('/stores', 'storeController.getStores);`
- create a new view `stores.pug` 
  - with a standard layout
  ```pug
  extends layout
  block content
    .inner
      h2= title
  ```
- before we show the stores on the page, we need to query the database for a list of all stores
  - in `index.js` we'll also need to wrap the controller in catchErrors
- in `storeController.js` 
  - we'll async the controller method
  - query the database with Store.find()
  - and make the stores available to our view by passing a stores variable
  ```javascript
  exports.getStores = async (req, res) => {
    const stores = await Store.find();
    res.render('stores', { title: 'Stores', stores: stores })
  }
  ```
- in `stores.pug`
  - now that we have the stores data made available by the controller, display the store in the template
  ```pug
  .stores
    each store in stores
  ```
- create a new mixin called `_storeCard.pug`
  - the mixin will take in a store
  ```pug
  mixin storeCard(store = {})
    .store
  ```
  - it will have a hero with the store's image or default to a generic photo
  ```pug
      .store__hero
        img(src=`/uploads/${store.photo || 'store.png'}`)
  ```
  - add a h2 title and a link to the store
  ```pug
      h2.title
        a(href=`/store/${store.slug}`) #{store.name}
  ```
  - add a store details section and use only trim the description to 25 words max
  ```pug
      .store_details
        p= store.description.split(' ').slice(0, 25).join(' ')
  ```
  - also in the store hero, add in a store actions subsection (eventually will feature like, follow, and remove buttons)
  ```pug
  .store__hero
    .store__actions
      button soon
  ```
- in `stores.pug`
  - import the mixin at the top
  ```pug
  include mixins/_storeCard
  ```
  - use the mixin in each store
  ```pug
  each store in stores
    +storeCard(store)
  ```

## Lesson 14 - Creating and Editing Flow for Stores
- in `_storeCard.pug` 
  - create an edit button that links to an edit page for that store
  - we uniquely link to each store through the _id, which is auto generated by MongoDB
  - in `helpers.js` we have an svg helper function `h.icon()`, which makes the SVG code available to customize (can also use [SVG sprites](https://css-tricks.com/svg-sprites-use-better-icon-fonts/)
  - use `!=` to evaluate javascript and output HTML (unsafe for user input)
  ```pug
  .store__actions
    .store__action.store__action--edit
      a(href=`/store/${store._id}/edit`)
        != h.icon('pencil')
  ```
- in `index.js`
  - create a route to handle editing the page
  - use `:` to do a wildcard route
  ```pug
  router.get('/stores/:id/edit', catchErrors(storeController.editStore));
  ```
- in `storeController.js`
  - make a new controller called editStore
  - fine the store given the ID
    - use `findOne()` to query the database based on the ID, which we can find in our params
    - remember to use await, as `findOne()` as with most of the DB functions return a promise
  - render out the edit form so the user can update their store
    - we'll use the same view that we used for the addStore controller, but we'll pass in a store as well to make it available to `_storeForm.pug`
  ```javascript
  exports.editStore = async (req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    res.render('editStore', { title: `Edit ${store.name}`, store: store })
  }
  ```
- in `_storeForm.pug`
  - add the store name and description to the form
  ```pug
  label(for="name") Name
  input(type="text" name="name" value=store.name)
  label(for="description") Description
  textarea(name="description")= store.description
  ```
  - create a tags variable which will hold the store tags or default to an empty array
  ```pug
  const tags = store.tags || []
  ```
  - update the tags by including a checked attribute and using `()` to run some JavaScript
  ```pug
  input(type="checkbox" id=choice value=choice name="tags" checked=(tags.includes(choice)))
  ```
  - update the action attribute on the form to accomodate for both adding and editing the store
  ```pug
  form(action=`/add/${store._id || ''}` method="POST" class="card")
  ```
- in `index.js`
  - create a new route to handle requests to update the store
  ```javascript
  router.post('add/:id', catchErrors(storeController.updateStore));
  ```
- in `storeController.js`
  - create a new controller for updating the store
  - use `findOneAndUpdate(filter, update, options)` to find the store and update it in one function
    - we'll filter by the store id, which is found in our params
    - we'll update it with the new info from the request object
    - we'll provide options to 
      - return the new store (the default option would instead return the old store)
      - run our database validators again (which are only checked upon creation)
    - use `exec()` at the end to make sure we actually run the query
  - flash a success message
  - redirect them to the page  
  ```javascript
  exports.updateStore = async (req, res) => {
    const store = await Store.findOneAndUpdate({ _id: req.params.id }, req.body, {
      new: true,
      runValidators: true
    }).exec();
    req.flash('success', 
    `Successfully updated <strong>${store.name}</strong>. <a href="/store/${store.slug}">View Store ->`</a>
    );
    res.redirect(`/store/${store._id}/edit`);
  }
  ```

## Lesson 15 - Saving Lat and Lng for each store
- in `/models/Store.js`
  - really important before you start storing data to figure out how your data should be stored
  - add a created property
  ```javascript
  created: {
    type: Date,
    default: Date.now
  }
  ```
  - mongoDB has a huge feature set for dealing with stuff that is location based
  - add a location property
  ```javascript
  location: {
    type: {
      type: String,
      default: 'Point'
    },
    coordinates: [{
      type: Number,
      required: 'You must supply coordinates!'
    }],
    address: {
      type: String,
      required: 'You must supply an address!'
    }
  }
  ```
- in `/views/mixins/_storeForm.pug`
  - use `//-` for pug comments
  - add a label and input for the address
    - in `app.js` we have middleware `bodyParser.urlencoded({ extended: true })` that allows us to send nested data without having to do any extra heavy lifting on the client side before we send it, or on the server side as we receive that data. 
    - to avoid error "Cannot read property 'address' of undefined" when we have a store with no location data, we use parentheses to check for the property first
  ```pug
  label(for="address") Address
  input(type="text" id="address" name="location[address]" value=(store.location && store.location.address))
  ```
  - add a label and input for the lng and lat
    - be sure that lng comes first and lat comes second since that's the way MongoDB expects the data to be stored
  ```pug
  label(for="lng") Address Lng
  input(type="text" id="lng" name="location[coordinates][0]" value=(store.location && store.location[coordinates][0]) required)
  label(for="lat") Address Lat
  input(type="text" id="lat" name="location[coordinates][1]" value=(store.location && store.location[coordinates][1]) required)
  ```