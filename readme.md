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
  input(type="text" id="lat" name="location[coordinates][1]" value=(store.location && store.location.coordinates[1]) required)
  ```

## Lesson 16 - Geocoding Data with Google Maps
- in `public/javascripts/modules/bling.js`
  - gives us a jQuery type syntax with `$` and we can do stuff like `$('.wrapper').on('click')`
- create a new file `modules/autocomplete.js`
  - create a new function autocomplete and export it
    - even though we don't have ES6 syntax on Node, it is available through webpack
  ```javascript
  function autocomplete (input, latInput, lngInput) {
  }
  export default autocomplete;
  ```
- in `public/javascripts/delicious-app.js`
  - import autocomplete and pass in the selectors for each corresponding field in our form with the Bling syntax
  ```javascript
  import './modules/autocomplete'
  autocomplete( $('#address'), $('#lat'), $('#lng') );
  ```
- back in `autocomplete.js`
  - we'll first check if there's an input, and if not just return the function to skip the function from running
  - create the dropdown for the address field
  - listen for a change to the address field, and set the lat and lng field values accordingly
  - prevent enter key from submitting the form on the address field
  ```javascript
  function autocomplete(input, latInput, lngInput) {
    if (!input) return;
    const dropdown = new google.maps.places.Autocomplete(input);
    dropdown.addListener('place_changed', () => {
      const place = dropdown.getPlace();
      latInput.value = place.geometry.location.lat();
      lngInput.value = place.geometry.location.lng();
    });
    input.on('keydown', (e) => {
      if(e.keyCode === 13) e.preventDefault();
    });
  }
  ```
  ## Lesson 17 - Quick Data Visualization Tip 
  - in MongoDB Compass
    - you can vizualize the location data in the store schema
    - but when you update the address, some defaults in the store schema do not kick in
  - in `storeController.js`
    - set the location's type to default to a point
    ```javascript
    exports.updateStore = async (req, res) => {
      req.body.location.type = 'Point';
    }
    ```

## Lesson 18 - Uploading and Resizing Images with Middleware
- modify store form to allow uploading an image
- add some middleware to upload the file and resize the file
- in `_storeForm.pug`
  - anytime you're uploading files to a server, you need to make sure that the browser will send it as a multipart
  ```pug
  form(action=`/add/${store._id || ''}` method="Post" class="card" enctype="multipart/form-data")
  ```
- in `storeController.js`
  - import Multer, which will handle the upload request, and MulterOptions which will specify where the file will be stored, and what types of files are allowed
  - save the data into memory, since we don't want the original file - only the resized version
  - filter by mimetype and check to see if it's an image. If yes, then continue on, if no then pass an error message
    - `next(null, true)` is a sort of callback premise in node. If you call next and you pass it something as a first value, that means it's an error. If you can next and you pass it null and a second value, that means it worked and the second value that you're passing it is the one that gets passed along.
  ```javascript
  const multer = require('multer');
  const multerOptions = {
    storage: multer.memoryStorage(),
    fileFilter(req, file, next) {
      const isPhoto = file.mimetype.startsWith('image/');
      if(isPhoto) {
        next(null, true);
      } else {
        next({ message: 'That filetype isn\'t allowed!' }, false);
      }
    }
  };
  ```
  - create a controller called upload above createStore, which will be an instance of Multer passed with the multerOptions and will handle only a single field called photo
  ```javascript
  exports.upload = multer(multerOptions).single('photo');
  ```
- in `_storeForm.pug`
  - let's add the field for the image upload above the address field
  - set it accept gifs, pngs, and jpegs, so that the user can select only allowed types (but we still have the server side validation in case)
  - if the store already has a photo, display it with an 200px wide thumbnail
  ```pug
  label(for="photo") Photo
    input(type="file" name="photo" id="photo" accept="image/gif, image/png, image/jpeg")
    if store.photo
      img(src=`/uploads/${store.photo}`, alt=store.name width=200)
  ```
- in `storeController.js`
  - import packages jimp and uuid, which will allow us to resize our photos and create unique identifiers for each image
  ```javascript
  const jimp = require('jimp');
  const uuid = require('uuid');
  ```
  - we'll add a resize method that functions as middleware right below our upload method and checks first to see if there is a file to resize
  ```javascript
  exports.resize = async (req, res, next) => {
    // check if there is no new file to resize
    if( !req.file ) {
      next(); // skip to the next middleware
      return;
    }
  };
  ```
- in `index.js`
  - add in the storeController methods upload and resize to the route before creating the store
  ```javascript
  router.post('/add', 
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.createStore)
    );
  ```
- in `storeController.js`
  - in the resize method, generate a unique id with the correct extension and store it in req.body
  ```javascript
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = ${uuid.v4()}.${extension}
  ```
  - read the file into memory, resize it to 800px width and auto height, and save it in the uploads folder. Finally call next to pass it onto the next function.
  ```javascript
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
  ``` 
- in `models/Store.js`
  - update the model to include photo
  ```javascript
  photo: String
  ```
- add the new upload and resize methods to the route for updating each store
  ```javascript
  router.post('/add/:id', 
    storeController.upload, 
    catchErrors(storeController.resize),
    catchErrors(storeController.updateStore)
    );
  ```

## Lesson 19 - Routing and Templating Single Stores
- in `index.js`
  - create a route for a single store using the store slug and connect it to a controller called getStoreBySlug
  ```javascript
  router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));
  ```
- in `storeController.js`
  - create a new controller called getStoreBySlug
  - query the database to find the store based on the slug
  - if there is no store, then pass it along to error handling
  - render a template called store and pass in a title and store as params
  ```javascript
  exports.getStoreBySlug = async (req, res, next) {
    const store = await Store.findOne({ slug: req.params.slug });
    if(!store) {
      next();
      return;
    }
    res.render("store", { title: store.name, store })
  }
  ```
- create a new view `views/store.pug`
  - display a hero with the store title and image (default to 'store.png' if no images are set)
  - display an inner section with a static Google Map, the address, description, and if there are tags, display them
  - for the map, there is a helper function staticMap found in `helpers.js` that takes in an array with lng and lat values and then converts it into a usable URL for the Maps API. Notice Google Maps expects lng then lat while MongoDB expects lat then lng.
  ```pug
  extends layout

  block content
    .single
      .single__hero
        img.single__image(src=`/uploads/${store.photo || 'store.png' }`, alt=`${store.name}`)
        h2.title.title--single
          a(href=`/stores/${store.slug}`)= store.name
    .single__details.inner
      img.single__map(src=h.staticMap(store.location.coordinates))
      p.single__location= store.location.address
      p= store.description

      if store.tags
        ul.tags
          each tag in store.tags
            li.tag
              a.tag__link(href=`/tags/${tag}`)
                span.tag__text ##{tag}
  ```

  ## Lesson 20 - Using Pre-Save Hooks to make Unique Slugs
  - currently there is no check for unique slugs when saving a new store, so you can create a store with the same name, but it will be unreachable since it will redirect to the first store
  - in `models/Store.js`
    - async the pre save function
    - create a regex that will match the slug name OR a slug name-# and store it in a variable `slugRegEx`
    - search the database for store slugs with the regex and store it in a variable `storesWithSlug`
      - use `this.constructor` since the Store hasn't been created yet. It will be equal to Store by the time the function runs. 
    - if there are stores, then increment the slug by one

    ```javascript
    storeSchema.pre('save', async function(next) {
      if (!this.isModififed('name')) {
        next();
        return;
      }
      this.slug = slug(this.name);
      
      const slugRegEx = new RegExp(`^(${this.slug}((-[0-9]*$)?)$)`, 'i');
      const storesWithSlug = await this.constructor.find({ slug: slugRegEx });
      if(storesWithSlug.length) {
        this.slug = `${this.slug}-${storesWithSlug.length+1}`;
      }
      next();
    });
    ```
## Lesson 21 - Custom MongoDB Aggregations
- tags page needs
  - list of tags and how many stores are in that tag
  - filter stores based on the tag
- to get the list of tags, we we don't want to loop through each store and find if it has tags, because that will become slow if we have a lot of stores. Instead let's offload the heavy lifting of querying to the database
  - use aggregation (kind of like reduce in JavaScript) for complex queries
- in `index.js`
  - create a route for the tags page and another route that will have the tag passed as a param. They'll use a store controller method called getStoresByTag.
  ```javascript
  router.get('/tags', catchErrors(storeController.getStoresByTag);
  router.get('/tags/:tag', catchErrors(storeController.getStoresByTag);
  ```
- in `storeController.js'
  - create `getStoresByTag` and query the database for a list of tags using a method called `getTagsList()`. This isn't a default method of Store, we'll actually create this custom method in the store model.
```javascript
exports.getStoresByTag = async (req, res) => {
  const tags = await Store.getTagsList();
};
```
- in `/models/Store.js`
  - create the static method called `getTagsList` on the store schema
  - important to use a proper function, not arrow notation, since we'll be using `this` as a proxy for the database
  - to calculate aggregate values on the database we use the [aggregate function](https://docs.mongodb.com/manual/reference/method/db.collection.aggregate/)
    - this takes in an array of objects that each function as a [pipeline operator](https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline/), meaning each object will modify the data in sequence. Each pipeline operator is prefixed with `$`.
    - first we'll `$unwind` the database based on `$tags`
      - the `$unwind` operator will take the tags array in our schema, and return a list of stores that contain any of the tags in the array (should be all of the stores except those that don't have any tags).
      - the `$` prefix on tags indicates that this is a field in the MongoDB document
    - then we'll `$group` them based on the `$tags` and we're also going to create a new property called count which will `$sum` all the stores in that tag by just adding 1 to each instance
    - finally we'll `$sort` the most popular stores first based on the highest count
  ```javascript
  storeSchema.statics.getTagsList = function() {
    return this.aggregate([
      { $unwind: '$tags' },
      { $group: { _id: '$tags', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
  };
  ```
- in `storeController.js`
  - render a view called tag and pass in a title called 'Tags' and the tag in the params
  ```javascript
  res.render('tag', { title: 'Tags', tags });
  ```
- in a newly created `/views/tag.pug`
  - add a title and for each tag, display the tag name and count
  ```pug
  extends layout

  block content
    .inner
      h2= title
      ul.tags
        each t in tags
          li.tag
            a.tag__link(href=`/tags/${t._id}`)
              span.tag__text= t._id
              span.tag__count= t.count
  ```
- in `storeController.js`
  - when a tag is selected, we want to rename the title to the tag name, and highlight the selected tag
  - store the tag in the params in a variable and pass it to our template
  ```javascript
  const tag = req.params.tag;
  res.render('tag', { title: 'Tags', tags, tag })
  ```
- in `/views/tag.pug`
  - if there is a tag selected, make the title the tag name, otherwise default to the title "Tags"
  ```pug
  h2 #{tag || title}
  ```
  - add a class of `tag__link--active` onto the link if there is a tag selected
  ```pug
  a.tag__link(href=`/tags/${t._id}` class=(t._id === tag ? 'tag__link--active' : '' ))
  ```
## Lesson 22 - Multiple Query Promises with Async Await
- in `storeController.js`
  - in order to await multiple queries, we need to remove the await on tags and store the promise in a renamed variable called `tagsPromise`
    - this will ultimately run the query for the store and tags simultaneously, instead of awaiting the tags first and then running stores
  - query the database to filter all stores based on the tag in the params and store it in a `storesPromise` variable
  - await multiple promises with `Promise.all()`, which takes an array of promises
  - deconstruct the result into tags and stores variables with ES6 bracket notation
  - pass the stores variable a parameter in our views
    ```javascript
      exports.getStoresByTag = async (req, res) => {
      const tag = req.params.tag;
      const tagsPromise = Store.getTagsList();
      const storesPromise = Store.find({ tags: tag });
      const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);

      res.render('tag', { title: 'Tags', tags, tag, stores })
    };
    ```
- in `tag.pug`
  - add the stores into the view with our storeCard mixin
  ```pug
  extends layout

  include mixins/_storeCard

  block content
    .inner
      h2 #{tag || title}
      ul.tags
        each t in tags
          li.tag
            a.tag__link(href=`/tags/${t._id}` class=(t._id === tag ? 'tag__link--active' : '' ))
              span.tag__text= t._id
              span.tag__count= t.count
      .stores
        each store in stores
          +storeCard(store)
  ```
- in `storeController.js`
  - while each specific tag page is now rendering stores, the main tag page doesn't display anything, but we want it to display all the stores with tags
  - create a new variable called `tagQuery` and then if there is a tag in the params then use that otherwise just check if the store has a tag at all. Pass this to the query for `storesPromise`
  ```javascript
  const tagQuery = tag || { $exists: true };
  const storesPromise = Store.find({ tags: tagQuery });
  ```

## Lesson 23 - Creating User Accounts
- in `index.js`
  - create a route for loging in a user with a new controller called `userController` and method `loginForm`
  ```javascript
  router.get('/login', userController.loginForm)
  ```
- create a new controller `/controllers/userController.js`
  - import Mongoose and connect the login form with a view called 'login' and pass it the same title
  ```javascript
  const mongoose = require('mongoose');

  exports.loginForm = (req, res) => {
    res.render('/login', { title: 'Login' })
  };
  ```
- in `index.js`
  - import the new controller
  ```javascript
  const storeController = require('../controllers/userController');
  ```
- create a new view `/views/login.pug`
  - add the standard layout
  ```pug
  extends layout

  block content
    .inner
  ```
- create a new mixin `/views/mixins/_loginForm.pug`
  - create a basic login form with email, password, and login button
  ```pug
  mixin loginForm()
    form.form(action="/login" method="POST")
      h2 Login
        label(for="email")
        input(type="email" name="email")
        input(type="password" name="password")
        input.button(type="submit" value="Log In")
  ```
- create a new model for users `/models/User.js` to store the login data
  - import Mongoose, the schema, and set ES6 promises
  ```javascript
  const mongoose require('mongoose');
  const Schema = mongoose.Schema;
  mongoose.Promise = global.Promise;
  ```
  - import md5, validator, mongodbErrorhandler, and passportLocalMongoose packages
  ```javascript
  const md5 = require('md5');
  const validator = require('validator');
  const mongodbErrorHandler = require('mongoose-mongodb-errors');
  const passportLocalMongoose = require('passport-local-mongoose');
  ```
  - make the model's schema including email and name and export it
  ```javascript
  const userSchema = new Schema({
    email: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true
      validate: [validator.isEmail, 'Invalid Email Address'],
      required: 'Please supply an email address'
    },
    name: {
      type: String,
      required: 'Please suppoy a name',
      trim: true
    }
  });
  module.exports = mongoose.model('User', userSchema);
  ```
  - add passport and mongodbErrorHandlers
    - Passport.js takes away a lot of the heavy lifting that comes along with managing sessions or creating tokens or logging people in, logging people out.
    - the error handler gives us nice error messages
  ```javascript
  userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });
  userSchema.plugin(mongodbErrorHandler);
  ```
- in `index.js`
  - set up a route for registering a user
  ```javascript
  router.get('/register', userController.registerForm);
  ```
- in `userController.js`
  - set up the registerForm method
  ```javascript
  exports.registerForm = (req, res) => {
    res.render('register', { title: 'Register' });
  };
  ```
- in a newly created `views/register.pug`
  - create the register form
  ```pug
  extends layout

  block content
    .inner
      form.form(action="/register" method="POST")
        h2 Register
        label(for="name") Name
        input(type="text" name="name" required)
        label(for="email") Email
        input(type="email" name="email" required)
        label(for="password") Password
        input(type="password" name="password")
        label(for="password-confirm") Confirm Password
        input(type="password" name="password-confirm")
        input.button(type="sumbit" value="Register")
  ```
- in `userController.js`
  - create a validateRegister middleware to validate the registration data
    - the sanitizeBody helper method comes from `app.js` from the expressValidator package. It will help normalize all the different variations of emails (e.g. w.e.s.bos@gmail.com or wesbos+test@gmail.com).
    - check the body to see if they supplied a name, email, and password and make sure it's not empty
    - these probably won't ever trip, but just in case someone has an old browser or maliciously turns off the html5 validators
    - check to make sure the confirm password field matches the password
    - store the validation errors in a variable called errors
      - if there are errors, flash the errors with the error messages
      - then render the page, make sure the body fields have the body data, and make sure you pass the flash
      - return to stop the function
      - if there aren't errors, then just use `next()`
  ```javascript
  exports.validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That Email is not valid!').notEmpty();
    req.sanitizeBody('email').normalizeEmail({
      remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (error) {
      req.flash('error', errors.map(err => err.msg));
      res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
      return;
    }
    next();
  };
  ```
- in `index.js`
  - finally set the route for posting the register form
  ```javascript
  router.post('/register', userController.validateRegister);
  ```

## Lesson 24 - Saving Registered Users to the Database
- in `index.js`
  - add a new middleware to the post route for registering
  ```javascript
  router.post('/register', 
  userController.validateRegister
  userControoler.register);
  ```
- in `start.js`
  - import our User model into our application
  ```javascript
  require('./models/User');
  ```
- in `userController.js`
  - import the User into our controller as well as a library called Promisify

  - create a new method on exports called register
  - create a new user by passing in email and name properties whose values come from the body of our form
  - register the user by using the `register()` method, which comes from the passport local mongoose package in our Users model
    - problem is it doesn't return a promise, it's callback based, so we'll take it and use promisify
  ```javascript
  const User = mongoose.model('User');
  const promisify = require('es6-promisify');

  exports.register = async (req, res, next) => {
    const user = new User({ email: req.body.email, name: req.body.name });
    const register = promisify(User.register, User);
    await register(user, req.body.password);
    next();
  };
  ```
- in a new controller `/controllers/authController.js`
  - import passport
  - instead of using the typical req, res for middleware, we'll be using some of the stuff provided by passport
  - we use the authenticate method, and pass in a "strategy", in this case we'll be using a local strategy, and pass in a config object that specifies where to redirect and what to flash in case of success or failure
  ```javascript
  const passport = require('passport');

  exports.login = passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    succesFlash: 'You are now logged in!'
  });
  ```
- in `index.js`
  - import the auth controller and use the middleware in the route
  ```javascript
  const authController = require('../controllers/authController');
  router.post('/register', 
  userController.validateRegister,
  userController.register,
  authController.login);
  ```
- in a newly created file `/handlers/passport.js`
  - we need to specify the strategy for passport.js
  - import passport, mongoose, and our User
  - what's going to happen is we're going to log in to passport and it's going to ask what information would you like on each request? In our case, we just want to pass along the User object
  ```javascript
  const passport = require('passport');
  const mongoose = require('mongoose');
  const User = mongoose.model('User');

  passport.use(User.createStrategy());

  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());
  ```
- in `app.js`
  - require our new handler
  ```javascript
  require('./handlers/passport');
  ```

## Lesson 25 - Virtual Fields, Login Logout middleware, and Protecting Routes
- in `authController.js`
  - create a middleware method to logout that will log them out, flash them a message, and then redirect them to home
  ```javascript
  exports.logout = (req, res) => {
    req.logout();
    res.flash('success', 'You are now logged out!');
    res.redirect('/');
  }
  ```
- in `index.js`
  - create a route to handle logging out
  ```javascript
  router.get('/logout', authController.logout);
  ```
  - we have a route for the login page, but nothing for submitting the form. So we'll use the same method that we used for registering
  ```javascript
  router.post('/login', authController.login);
  ```
- a virtual field in mongoose is essentially something that can be generated. For example if you have someone's weight in pounds, but wanted to convert to kilograms, that data could be generated.
- in `User.js`
  - add a virtual field for the gravatar
  - gravatars use a hash of the email, so we'll be using the md5 package we imported to create a hash of the users email
  - we use a proper function so we can reference `this`
  - we return a link containing the hash and specifying a size of 200px
  ```javascript
  userSchema.virtual('gravatar').get(function() {
    const hash = md5(this.email);
    return `https://gravatar.com/avatar/${hash}?s=200`
  });
  ```
- in `authController.js`
  - the user shouldn't be able to add stores if their logged in, so we'll make a middleware to make sure their logged in
  - we'll first check if their logged in with the passport method `isAuthenticated()`, which if they are, then just pass next
  - if not, then we'll flash them an error message, and redirect them to the login page
  ```javascript
  exports.isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
      next();
      return;
    }
    req.flash('error', 'Oops you must be logged in to do that!');
    res.redirect('/login');
  }
  ```
- in `index.js`
  - add the `isLoggedIn` middleware to the add route
  ```javascript
  router.get('/add', authController.isLoggedin, storeController.addStore);
  ```

## Lesson 26 - Created a User Accout Edit Screen
- in `index.js`
  - create a route for our user accout page and make sure their signed in first
  ```javascript
  router.get('/account', authController.isLoggedIn, userController.account);
  ```
- in `userController.js`
  - create a method for displaying an edit account
  ```javascript
  exports.account = (req, res) => {
    res.render('account', { title: 'Edit Your Account' });
  };
  ```
- in a newly created `views/account.pug`
  - create the edit account template complete with an h2 title and form with 
  ```pug
  extends layout

  block content
    .inner
      h2= title
      form(action="/account" method="POST")
        label(for="name") Name
        input(type="text" name="name" value=user.name)
        label(for="email") Email
        input(type="email" name="email" value=user.email)
  ```
- in `index.js`
  - create a route for posting to the account page that will use an update account method that we'll create. It will also use async await so we can wrap it in a catchErrors as well.
  ```javascript
  router.post('/account', catchErrors(userController.updateAccount));
  ```
- in `userController.js`
  - create the updateAccount method
  - stash the data in the body fields in a variable called updates
  - stash the user by awaiting and querying the database using findOneAndUpdate, which will take three parameters
    - the query, which we'll find the user through their user id
    - the updates, which we'll use $set, and that will replace the values of the field 
    - the options, where we'll specify new to return the new user, runValidators which will run all our validators, and context, which is required by mongoose to run the query properly
    - finally we'll flash them a success message and redirect them to 'back', which will just return them to the page they were previously
  ```javascript
  exports.updateAccount = async (req, res) => {
    const updates = {
      name: req.body.name,
      email: req.body.email
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id }
      { $set: updates },
      { new: true, runValidators: true, context: 'query' }
    );
    req.flash('success', 'Updated the profile!');
    res.redirect('back');
  };
  ```

## Lesson 27 - Password Reset Flow
- we need to create a forgot password part of our login form
- in a newly created mixin `/views/mixins/_forgot.pug`
  - create the form with a title and label and input for email
  ```pug
  mixin forgotForm()
    form.form(action="/account/forgot" method="POST")
      h2 I forgot my password!
      label(for="email") Email
      input(type="email" name="email")
      input.button(type="submit" value="Send a Reset")
  ```
- in `login.pug`
  - add our new forgot form below the login form
  ```pug
  extends layout

  include mixins/_loginForm
  include mixins/_forgot

  block content
    .inner
      +loginForm()
      +forgotForm()
  ```
- in `index.js`
  - add a route to handle the password reset
  ```javascript
  router.post('/account/forgot', catchErrors(authController.forgot));
  ```
- in `authController.js`
  - add a new method called forgot
  - first we check if the user has an email address on file. If not, then we flash them an error. Sometimes it's a good idea not to let the user know if they have an account based on their email address (just in case someone is trying to be malicious), so you can use a generic message that just says a password reset has been set to that account.
  - Then we set the reset tokens and expiry on their account
    - there's a module built into Node to generate cryptographically secure random strings, so we'll require "crypto" at the top
    - we'll use method on crypto called randomBytes to generate a hex string, and we'll also set a password expire date by adding an hour to the current time
    - we also need to require mongoose and our model
    - in `User.js` we need to add fields to our users for the token and expiry
    ```javascript
    resetPasswordToken: String,
    resetPasswordExpires: Date
    ```
    - then we'll just `await user.save();`
  - then we will send them an email with the token (but for now since we dont' have email set up, we'll just flash them a link)
  - finally we redirect them to the login page
  ```javascript
  const crypto = require('crypto');
  const mongoose = require('mongoose');
  const User = mongoose.model('User');

  exports.forgot = async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      req.flash('error', 'A password reset has been mailed to this email');
      return res.redirect('/login');
    }

    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordExpires = Date.now() + 360000;
    await user.save();

    const resetURL = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;
    req.flash('success', `You have been emailed a password reset link. ${resetURL}`);

    res.redirect('/login');
  };
  ```
- in `index.js`
  - create a route for a reset token
  ```javascript
  router.get('/account/reset/:token', catchErrors(authController.reset));
  ```
- in `authController.js`
  - create the method on our controller to handle the reset
  - find the user based on their reset token and make sure the token hasn't expired
    - we can do a cool query using `$gt` to check if the current time is greater than the expiration date
  - if the query fails, then flash an error and redirect them to the login page
  - otherwise render a reset page
  ```javascript
  exports.reset = async (req, res) => {
    const user = await User.findOne({ 
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect('/login');
    }
    res.render('reset', { title: 'Reset your Password' });
  };
  ```
- in a new `views/reset.pug`
  - create a reset password form
  ```pug
  extends layout

  block content
    .inner
      form.form(method="POST")
      h2= title
      label(for="password") Password
      input(type="password" name="password")
      label(for="password-confirm") Password Confirm
      input(type="password" name="password-confirm")
      input.button(type="submit" value="Reset Password")
  ```
- in `index.js`
  - create a route for posting the reset form
  - we'll need to create some middleware to confirm and validate the password, and then finally we'll update the account's password
  ```javascript
  router.post('/account/reset/:token', 
  authController.confirmedPasswords, 
  catchErrors(authController.update
  ));
  ```
- in `authController.js`
  - create a new method to confirm the password and password-confirm are the same
  - access a property with a dash by using quotes and brackets
  - if it matches, then pass next
  - if not, flash them an error and redirect them back
  ```javascript
  exports.confirmPasswords = (req, res) => {
    if (req.body.password === req.body['password-confirm']) {
      next();
      return;
    }
    req.flash('error', 'Passwords do not match!');
    res.redirect('back');
  };
  ```
  - create a new method to update the password
  - we want to find the user and use the same query to check the token and expiry, since they could have arrived on the page, but just left it open
  - then we want to update the password
    - setPassword() is given to us from the plugin passport-local-mongoose that we imported in our model `Users.js`
    - but it uses callbacks and not promises, so we'll use promisify and use that method and bind it on the user
    - remember to import promisify at the top of the document
  - then we'll await the promise and pass in the new password in the body
  - next we'll clear the reset token and expiries by setting them to undefined
  - now we actually want to save the user using `save()` from passport and store that promise in an updatedUser variable
  - then we'll await that promise and login using `login()`, also from passport
  - finally we'll flash them a success message and redirect them home
  ```javascript
  const promisify = require('es6-promisify');

  exports.update = async (req, res) => {
    const user = User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      req.flash('error', 'Password reset is invalid or has expired');
      return res.redirect('/login');
    }

    const setPassword = promisify(user.setPassword, user);
    await setPassword(req.body.password);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    const updatedUser = await user.save();
    await req.login(updatedUser);
    req.flash('Success', 'Nice! Your password has been reset! You are now logged in!');
    res.redirect('/');
  }
  ```

## Lesson 28 - Sending Email With Node.js
- use [Mailtrap](https://mailtrap.io) to fake a mail server. So instead of actually sending email to your users, it will just store it in Mailtrap, where you'll be able to quickly see who the emails are being sent to, what they look like, when they've been sent.
- in `variables.env`
  - change the username and password to the mailtrap credentials listed for SMTP
- in a new `handlers/mail.js` file
  - import nodemailer, pug, juice, htmlToText, and promisify packages
  ```javascript
  const nodemailer = require('nodemailer');
  const pug = require('pug');
  const juice = require('juice');
  const htmlToText = require('html-to-text');
  const promisify = require('es6-promisify');
  ```
  - we have nodemailer and we need to create what's called a transport, which is just different ways of sending email, SMTP being the most common. we'll use the `createTransport(`) method provided by nodemailer and pass in a config object which contains fields for host, port, and auth
  ```javascript
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS
    }
  });
  ```
  - when someone asks for a password reset, we're going to make a method called send, which will be asynchronous and take in some options (which will be passed in from the forgot method in the authController).
  - then we'll create a mailOptions object with fields for from, to, subject, html, and text fields
    - 'from' is whatever email you'd like to send it from
    - 'to' will be the email from the user passed in through options
    - html and text will be filled out later
  - next we'll use promisify for the `sendMail()` method on transport, and bind it to transport
  - finally we'll return the sendMail variable using the mailOptions
  ```javascript
  exports.send = async (options) => {
    const mailOptions = {
      from: `Koa Kekuna <kekoaponolani@gmail.com>`
      to: options.user.email
      html: 'This will be filled in later'
      text: 'This will also be filled in later'
    }
    const sendMail = promisify(transport.sendMail, transport);
    return sendMail(mailOptions);
  };
  ```
- in `authController.js`
  - import the mail library
  ```javascript
  const mail = require('../handlers/mail');
  ```
  - then in the forgot method, use the send method from mail right after we generate the resetURL and before we flash them a success message and redirect them to the login page
  - we'll pass in those options now with a config object which will include the user, subject, resetURL, and filename
    - the filename will be used when we try to render out the HTML and look for a document called password-reset.pug
  ```javascript
    await mail.send({
    user,
    subject: 'Password Reset',
    resetURL,
    filename: 'password-reset'
    })
  ```
- in `mail.js`
  - we'll take care of the text and html values in our mailOptions variable by using the packages we imported
  - first we'll create a function called generateHTML and that will take in two things, the filename and options (which will default to an empty object)
    - we don't use `exports.generateHTML` because this function not needed anywhere else outside the file, so we just use a regular `const`
  - then we create a variable called html, and we use the pug library to use the `renderFile()`, which will take name of the file we're looking for
    - whenever you pass a function reference to something on your disk, you don't actually know where you are in the folder system, because of course we're in a handlers folder. But this renderFile folder, it's in a totally different folder. And it gets a little bit mixed up. So what we can use is a special variable `__dirname`, which is available to us in any file.
  - next we need to inline our CSS into our html by using the juice library;
  ```javascript
  const generateHTML = (filename, options = {}) => {
    const html = pug.renderFile(`${__dirname}/../views/email/${filename}.pug`, options);
    const inlined = juice(html);
    return inlined;
  };
  ```
  - then in our send method we create html and text variables
  - html will be generated using our generateHTML method
  - text will be genereated by the htmlToText library
  ```javascript
  exports.send = async (options) {
    const html = generateHTML(options.filename, options);
    const text = htmlToText.fromString(html);
    
    const mailOptions = {
      to: `Koa Kekuna <kekoaponolani@gmail.com>`,
      from: options.user.mail,
      subject: options.subject,
      html,
      text
    }
    const sendMail = promisifiy(transport.sendMail, transport);
    return sendMail(mailOptions);
  }
  ```

## Lesson 29 - Locking down our application with User Permissions
- we want to be able to set an author property on our stores that is linked to one of the users in our database
- in `Store.js`
  - add a new author field to the schema. the type is going to be an Object Id, which is the unique id given to each user. ref is how we reference the desired model. finally we'll make it required and have an error message.
  ```javascript
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: 'You must supply an author'
  }
  ```
- in `storeController.js`
  - in our createStore method, we're going to set the author on the `req.body` to be the id from the user that is creating the store.
  ```javascript
  exports.createStore = async (req, res) => {
    req.body.author = req.user._id;
    const store = await (new Store(req.body)).save();
    req.flash('success', `Successfully created ${store.name}. Care to leave a review?`);
    res.redirect(`/store/${store.slug}`);
  };
  ```
  - in our getStoreBySlug method, we'll use the `.populate()` method to have the database return not only the user's user_id, but all fields for the user
  ```javascript
  exports.getStoreBySlug = async (req, res, next) => {
    const store = await Store.findOne({ slug: req.params.slug }).populate('author');
  };
  ```
  - in our editStore method, we need to stop users from editing stores that they did not create. Kake a helper function called confirmOwner that will take in a store and user, and if the store's author does not equal the stores user, throw an error
    - `.equals()` is a method to compare Object Id's
  ```javascript
  const confirmOwner = (store, user) => {
    if (!store.author.equals(user._id)) {
      throw Error('You must own a store in order to edit it!');
    }
  }
  exports.editStore = async(req, res) => {
    const store = await Store.findOne({ _id: req.params.id });
    confirmOwner(store, req.user);
    res.render('editStore', { title: `Edit ${store.name}`, store });
  };
  ```
- in `_storeCard.pug`
  - we need to selectively show the pencil edit icon for the store based on if the user can edit them or not
  - since there may be people not logged in, and therefore no user, an error will be thrown, so we must check if there is a user first
  ```pug
  .store__actions
    if user && store.author.equals(user._id)
      .store__action.store__action--edit
        a(href=`/stores/${store._id}/edit`)
          != h.icon('pencil')
  ```
## Lesson 30 - Loading Sample Data
- in `package.json`
  - we have a script called "sample", which will run `./data/load-sample-data.js`
  - we also have script called "blowitallaway", which will delete all data
- in `load-sample-data.json`
  - not actually part of our application, so have to manually import parts
  - it will read the dummy data (e.g. stores.json), store it, and then create objects
  - comment out the Reviews parts, since we don't have that functionality yet
- in the terminal
  - run `npm run sample` to generate the sample data - 16 stores with 3 authors (and eventually 41 reviews)
- look in the Readme for the email and passwords of the authors

## Lesson 31 - JSON endpoints and creating MongoDB Indexes
- indexes support efficient execution of queries. MongoDB will sort of pre-scan the contents, making it MUCH faster at completing queries. So if in your application, you know you're going to be querying something often, it's worth it to index it.
- we already have `_id` indexed by default, and in our users model, we have email indexed as well, which most likely a plugin indexed for us
- in `models/Store.js`
  - we want to index the name and description of the store, so we can easily search for it
  - we also specify how we would like it to be indexed as - in our case text
  ```js
  storeSchema.index({
    name: 'text',
    description: 'text'
  });
  ```
- in `index.js`
  - make a new section for dealing with our API
  - create a new route to `/api/search` with a method on our store controller called searchStores
  ```js
  router.get('/api/search', catchErrors(storeController.searchStores));
  ```
- in `storeController.js`
  - create the async method searchStores
  - `req.query` will return all the queries being passed along via the URL, and we're looking for what's stored in q - `?q=store`
  - we want to search through all the stores using `Store.find()` and await the results
  - to filter the stores, we'll use a MongoDB text operator `$text`, which will perform a text on any fields indexed with a text index
    - there are several options we pass through, but we'll want to include `$search`, to pass in our query `req.query.q`
  - we also want to sort our results, based on how relevant the results are, through a field called "score"
  - we'll add a second argument to `Store.find()`, which will be an object, and we're going to tell it to project (which in MongoDB means add a field) a "score". The score is going to made up of the metadata via an operator `$meta`, and the only metadata currently in MongoDB is "textScore".
  - to actually sort the results, we'll chain a `.sort()` onto `Store.find()`, and use the same parameters as before
  - finally we'll limit the results to the top 5 results
  ```js
  exports.searchStores = async (req, res) => {
    const stores = await Store
    // first find stores that match
    .find({
      $text: {
        $search: req.query.q
      }
    }, {
      score: { $meta: 'textScore' }
    })
    // then sort them
    .sort({
      score: { $meta: 'textScore' }
    })
    // limit to only 5 results
    .limit(5);
    res.json(stores);
  };
  ```

## Lesson 32 - Creating an Ajax Search Interface
- if we inspect the HTML search bar, we have an input with a class of `search__input` and a hidden div with a class of `search_results`
- in a new file `public/javascripts/modules/typeAhead.js`
  - import a library called axios
  - create a function called typeAhead, which will take in the search box, and will be exported from the file
  ```js
  const axios = require('axios');

  function typeAhead(search) {
    console.log(search);
  }

  export default typeAhead;
  ```
- in `public/javascripts/delicious-app.js`
  - import typeAhead
  - run the function and pass it the contents of the search box
  ```js
  import typeAhead from './modules/typeAhead'

  typeAhead( $(.search) );
  ```