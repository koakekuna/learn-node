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