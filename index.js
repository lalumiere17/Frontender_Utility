const { getAllFilePathsWithExtension, readFile } = require('./fileSystem');
const { readLine } = require('./console');
const { showTODOes} = require('./lib');
const { importantTODOes} = require('./lib');
const { userTODOes} = require('./lib');
const { sortTODOes} = require('./lib');
const { dateTODOes} = require('./lib');
const path = require ('path');

var files = [];
app();

function app () {
    files = getFiles();

    console.log('Please, write your command!');
    readLine(processCommand);
}

function getFiles () {
    const filePaths = getAllFilePathsWithExtension(process.cwd(), 'js'); 
    return filePaths.map(fpath => {
        var file = path.basename(fpath);
        var content = readFile(fpath);
        return {file, content};
    });
}

function processCommand (command) {
    switch (command) {
        case 'exit':
            process.exit(0);
            break;
        case 'show':
            showTODOes(files);
            break;
        case 'important':
            importantTODOes(files);
            break;
        case command.startsWith("user ") ? command : '':
            var userName = command.slice(5);
            userTODOes(files, userName);
            break;
        case 'sort importance':
            var arg = command.slice(5);
            sortTODOes(files, arg);
            break;
        case 'sort user':
            var arg = command.slice(5);
            sortTODOes(files, arg);
            break;
        case 'sort date':
            var arg = command.slice(5);
            sortTODOes(files, arg);
            break;
        case command.startsWith("date ") ? command : '':
            var command_date = command.slice(5);
            var date = new Date(command_date);            
            dateTODOes(files, date);
            break;
        default:
            console.log('wrong command');
            break;
    }
}

// TODO you can do it!