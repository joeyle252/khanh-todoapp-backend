
// todo
// 1. read all the commands from terminal
// 2. do something based on the commands 

const fs = require("fs")
const chalk = require("chalk")
const yargs = require("yargs")

let id = 0;


function loadData() {
    const buffer = fs.readFileSync("database.json"); //reading the file from our system
    const data = buffer.toString(); // convert buffer to a string
    return JSON.parse(data); //parse string to js object

}
// console.log(loadData())

function saveData(todo) {

    // read the existing data
    let data = loadData() // expect to see a js array of existing data (todos)

    // make some changes
    data.push(todo)

    //save it
    fs.writeFileSync("database.json", JSON.stringify(data))

}
function addTodo(todo, status) {

    saveData({ id: id + 1, todo: todo, status: status })

}
// process.argv => return array of arguments in the command
// if (process.argv[2]=== "add"){
//     addTodo(process.argv[3],process.argv[4])
//     //addTodo(process.argv[3],)
// }else if (process.argv[2] === "list"){
//     const todos = loadData();
//     for(let {todo,status} of todos){
//         console.log(todo,status)
//     }
// }

yargs.command({
    command: "add",
    decription: "add some todo",
    builder: {
        todo: {
            describe: "content of our todo",
            demandOption: true, //is it requitred or not?
            type: "string"
        },
        status: {
            describe: "status of your todo",
            demandOption: false,
            default: "incomplete",
            type: "string"
        }
    },

    handler: function (args) {
        addTodo(args.todo, args.status)
    }
})

yargs.command({
    command: "list",
    decription: "list todos",

    handler: function (args) {
        let todos = loadData();
        if (args._.includes("complete")) {
            const completeTodos = [];
            for (let index = 0; index < todos.length; index++) {
                if (todos[index].status === "complete") {
                    completeTodos.push(todos[index])
                }
            }
            console.log(completeTodos);
        } else if (args._.includes("incomplete")) {
            const incompleteTodos = [];
            for (let index = 0; index < todos.length; index++) {
                if (todos[index].status === "incomplete") {
                    incompleteTodos.push(todos[index])
                }
            }
            console.log(incompleteTodos);
        } else {
            console.log(todos)
        }
    }
})

yargs.command({
    command: "delete",
    decription: "delete todo by id or delete all todos",
    builder: {
        id: {
            describe: "id of todo to delete",
            demandOption: false, //is it requitred or not?
            type: "number"
        },
    },

    handler: function (args) {
    if (args.id){
        let todos = loadData();
        const newTodos = todos.filter((item, index) => {
            if (item.id === args.id) {
                return false
            }
            return true
        })
        fs.writeFileSync("database.json", JSON.stringify(newTodos))
        console.log(newTodos)
    } else if(args._.includes("all")){
        fs.writeFileSync("database.json", JSON.stringify([]))
        console.log([])
    }      
    }
})

yargs.command({
    command: "toggle",
    decription: "toggle todo status by id",
    builder: {
        id: {
            describe: "id of todo to toggle",
            demandOption: true, //is it requitred or not?
            type: "number"
        },
    },

    handler: function (args) {
        let todos = loadData();
        const newTodos = todos.map((todo, index) => {
            if (todo.id === args.id) {
                return {
                    ...todo,
                    status: todo.status==="complete"?"incomplete":"complete",
                }
            }
            return todo
        })
        fs.writeFileSync("database.json", JSON.stringify(newTodos))
        console.log(newTodos)
    }
})

yargs.parse();