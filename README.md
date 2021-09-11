# BlogPost API

Blog Post apis to create, fetch, delete, update post along with the Authorization API of SignUp and Signin

---

## Hosted API : https://blogpost514.herokuapp.com/docs

Jump to testing: https://github.com/git/git/blob/master/README#L54

**OR you can run locally by setting up as follows**

## Requirements

For development, you will only need Node.js and a node global package, npm, installed in your environement.

### Node

- #### Node installation on Windows

  Just go on [official Node.js website](https://nodejs.org/) and download the installer.
  Also, be sure to have `git` available in your PATH, `npm` might need it (You can find git [here](https://git-scm.com/)).

- #### Node installation on Ubuntu

  You can install nodejs and npm easily with apt install, just run the following commands.

      $ sudo apt install nodejs
      $ sudo apt install npm

- #### Other Operating Systems
  You can find more information about the installation on the [official Node.js website](https://nodejs.org/) and the [official NPM website](https://npmjs.org/).

If the installation was successful, you should be able to run the following command.

    $ node --version
    v8.11.3

    $ npm --version
    6.1.0

If you need to update `npm`, you can make it using `npm`! Cool right? After running the following command, just open again the command line and be happy.

    $ npm install npm -g

### Installing Dependencies

    $ npm install

## Running the project

    $ nodemon app or node app

#### How to test APIS

## Open http://localhost:5000/docs in browser

You can use the Swagger Frontend for testing the routes that are not protected (/signup, /signin, /allblog, /search/:searchtext, /thatblog/:\_id )

## For testing protected routes (/createblog, /myblog, /update, /delete) use Postman

Generate a auth token by Signin (For getting admin token signin use {email:"admin@admin.admin",password:"admin"})

## API end points

**Url = "http://localhost:5000"** or
**Hosted_Url = "https://blogpost514.herokuapp.com"**

Authorization APIs:

```
1.  route: /signup
    body:
    {
    "name": "name",
    "email": "email",
    "password": "password"

            }

    Header:
    Content-Type: application/json

2.  route: /signin
    body:
    {
    "email":"email"
    "password":"email"
    }
    Header:
    Content-Type: application/json

Blog APIs:

3. route: /createblog
   body:
   {
   "title":"title",
   "content:"content"
   }
   Header:
   Content-Type: application/json
   Authorization: Bearer token
    <!-- generate authorization token by signin -->

4. route: /allblog
   body: No parameter required
   Header:
   Content-Type: application/json

5. route: /myblog
   body: No parameter required
   Header:
   Content-Type: application/json
   Authorization: Bearer token

6. route: /thatblog/{id}
   param: pass blog \_id of the blog
   body: No parameter required
   Header:
   Content-Type: application/json

7. route: /update
   body:
   {
   "title":"title",
   "content:"content",
   "\_id":"id of the post"
   }
   Header:
   Content-Type: application/json
   Authorization: Bearer token

8. route: /delete/{id}
   param: pass blog \_id of the blog
   body: No parameter required
   Header:
   Content-Type: application/json
   Authorization: Bearer token

9. route: /search/{searchtext}
   param: pass searchtext of the blog
   body: No parameter required
   Header:
   Content-Type: application/json
```
