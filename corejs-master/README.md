# corejs
The WRP-created corejs library for creating City of Toronto web apps.

Getting Started
===============
1. Make sure that [npm](https://nodejs.org/en) is installed on your computer. It is best that you have the latest version installed. Otherwise you may run into issues below.
2. Make sure that [git](https://git-scm.com/downloads) is installed on your computer. It is best that you have the latest version installed. Otherwise you may run into issues below.
3. Make sure you are set up to work on on the[city's proxy](docs/cot_proxy_settings.md)
4. Install bower globally by running this on your terminal:

`npm install -g bower`

5. Install gulp command line globally by running this on your terminal:

`npm install gulp-cli -g`

Create a new core-based project
-------------------------------
1. If you haven't already, clone corejs to your local machine:

`git clone https://github.com/CityofToronto/corejs.git`

2. Pull the latest from master, and install/update the node packages:

`cd corejs && git checkout master && git pull && npm install && npm update`

3. Scaffold a new project:

`gulp scaffold -dir /some/path/name_of_new_app`

4. Go to your project directory and install the node packages:

`cd name_of_new_app && npm install`

5. Open your new project in your favorite IDE and edit the bower.json file to REMOVE THE COMMENTS, update the name, description, and authors.

6. Go back to your terminal and install the bower components:

`bower install`

7. Go back to your IDE.

8. Update the package.json file with your app name, version, description, and authors. Customize the eslint settings as you see fit, and set the coreConfig settings based on what your project requires.

9. Update the gulpfile.js file to update the project vars at the top, and customize tasks as required for your project.

10. Finish by customizing the .editorconfig, .env, .gitignore, and readme.md files as you see fit. At this point you should probably set up your project with git and send your first commit to a remote. 

*For AWS integration*

1. Make sure that you add a credentials file to your local machine. See http://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html

2. Update the AWS info in gulpfile.js (bucket, region, etc)

3. Run `gulp deploy:aws --use-proxy` to upload to s3.

Add core to an existing project
-------------------------------

1. Move all source files in the existing project into a src directory (except .gitignore, if it exists).

2. Copy scaffold/.sample_editorconfig into your root project folder as .editorconfig. If it already exists in your project, copy only the contents as you see fit, and customize as required.

3. Copy scaffold/.sample_gitignore into your root project folder as .gitignore. If it already exists in your project, copy only the contents as you see fit, and customize as required.

4. Create an .env file in your root project directory if it does not already exist. Copy over the contents of scaffold/.sample_env as you see fit, and customize as required.

5. Copy scaffold/sample_package.json into your root project folder as package.json. Update the file with your app name, version, description, and authors. Customize the eslint settings as you see fit, and set the coreConfig settings based on what your project requires.

6. Open a terminal in your project directory and run:

`npm install`

7. Copy scaffold/sample_bower.json into your root project folder as bower.json. Edit the file to update the name, description, and authors. Go back to the terminal in your project directory and run:

`bower install`

8. Copy scaffold/sample_gulpfile.js into your root project folder as gulpfile.js. Update as necessary to make it work for your project.

9. Update your html files to use build and inject tags. See scaffold/src/index.html for examples.

Just show me how to install with bower
--------------------------------------

`bower install -S core=https://github.com/CityofToronto/corejs.git`

Usage
=====

Using cot_app
-------------
TODO:

Using CotForm
-------------
TODO:

Using cot_login
---------------
TODO:
