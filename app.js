const express = require('express');
const cors = require("cors")
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const app = express();
const mongoose = require('mongoose');
const PORT = process.env.PORT || 5000;
const {MONGOURI} = require('./keys')



mongoose.connect(MONGOURI);
mongoose.connection.on('connected',()=>{
    console.log("Connected to mongoose");
})

mongoose.connection.on('error',(err)=>{
    console.log("Error while Connecting to mongoose",err);
})


// const options = {
//     definition: {
//       openapi: '3.0.0',
//       info: {
//         title: 'BlogPost API',
//         version: '1.0.0',
//         description:'A simple express BlogPost API'
//       },
//       servers:[{
//                     url: "http://localhost:5000"
//                 },{
//                     url:"https://blogpost514.herokuapp.com/"
//                 }],
//     },
//     components: {
//         securitySchemes: {
//           jwt: {
//             type: "http",
//             scheme: "bearer",
//             in: "header",
//             bearerFormat: "JWT"
//           },
//         }
//       }
//       ,
//       security: [{
//         jwt: []
//       }],
//     apis: ['./routes/*.js'], // files containing annotations as above
//   };
// const specs = swaggerJsDoc(options);
// app.use("/api-docs",swaggerUI.serve,swaggerUI.setup(specs))

const swaggerSpec = swaggerJsDoc({
    definition: {
              openapi: '3.0.0',
              info: {
                title: 'BlogPost API',
                version: '1.0.0',
                description:'A simple express BlogPost API'
              },
              servers:[{
                            url: "http://localhost:5000"
                        },{
                            url:"https://blogpost514.herokuapp.com/"
                        }],
            },
     components: {
        securitySchemes: {
          jwt: {
            type: 'apiKey',
            scheme: 'Bearer',
            in: 'header',
            bearerFormat: 'JWT',
            description: 'Please get a awt by signing in for the protected content'
          },
        }
      }
      ,
      security: [{
        jwt: []
      }],
      apis: ['./routes/*.js'], // files containing annotations as above,
    swagger: "2.0",
  });
  
  app.use('/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));


require('./models/user')
require('./models/blog')
app.use(cors())
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/blog'))


app.listen(PORT,()=>{
    console.log("server is running on ",PORT)
})