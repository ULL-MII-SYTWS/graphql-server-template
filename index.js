const fs = require("fs")
const util = require("util")
const ins = (e, d=2) => util.inspect(e, {depth: d})

const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const { buildSchema } = require("graphql")
const port = process.argv[2] || 4006;

const csvFilePath = process.argv[3] || 'DMSI-2122.csv'
const data = String(fs.readFileSync('fragment-request.gql'))

const csv=require('csvtojson')
const SchemaStr = String(fs.readFileSync('aluschema.gql', {encoding: "utf8"}))

debugger;
const AluSchema = buildSchema(SchemaStr)

const app = express()

async function main () {
    let classroom=await csv().fromFile(csvFilePath);
    // console.log(typeof classroom);
    fs.writeFileSync('DMSI-2122.json',JSON.stringify(classroom, false, 2))

    function restServer() {
        app.get('/student', function(req, res) {
            res.send(classroom)
        })
    
          app.get('/student/:id', function(req, res) {
            res.send(classroom[req.params.id])
          })
    
          app.get('/search/:name', function(req, res) {
              //console.log(req.params.name)
            let index = classroom.findIndex(s => {
                //console.log(s.Nombre)
                let r = s["Nombre"].toLowerCase().match(req.params.name.toLowerCase())
                //console.log(r)
                return r
            });
            (index !== -1)? 
              res.send(classroom[index]) : `{ message: "not found"}`
          })
    }
    
    const root = {
        students: () => classroom,
        student: ({AluXXXX}) => {
          // write your code here
        },
        /* This console.log proves that parent argument is skipped. See README.md */
        addStudent: (object, args, context, info) => {
          // write your code here
        },
        setMarkdown: ({AluXXXX, markdown}) => {
          // write your code here
        }
    }
      
    app.use(
        '/graphql',
        graphqlHTTP((request, response, next) => ({
          // write your code here
        })),
      );
      
      restServer();
      app.listen(port);
      console.log("Running at port "+port+`. Visit http://localhost:${port}/graphql`)
    }



main();


