function showTODOes(files) {
    var listTODO = parseTODOes(files);
    ifImportant(listTODO);
    printTODOes(listTODO);
}

function importantTODOes(files) {
    var listTODO = parseTODOes(files);
    ifImportant(listTODO);
    var todo_important = listTODO.filter(todo => todo.importance > 0);
    printTODOes(todo_important);
}

function userTODOes(files, userName) {
    var listTODO = parseTODOes(files);
    ifImportant(listTODO);
    var todo_user = [];
    for (const todo of listTODO) {
        var str = todo.author.toLowerCase();
        if (str.startsWith(userName.toLowerCase()))
            todo_user.push(todo);
    }
    printTODOes(todo_user);
}

function sortTODOes(files, arg) {
    var listTODO = parseTODOes(files);
    ifImportant(listTODO);
    switch (arg) {
        case 'importance':
            listTODO.sort((a,b) => b.importance > a.importance);
            printTODOes(listTODO);
            break;
        
        case 'user':
            listTODO.sort((a, b) => {
                var user1 = a.author.trim() || String.fromCharCode(Number.MAX_SAFE_INTEGER),
                    user2 = b.author.trim() || String.fromCharCode(Number.MAX_SAFE_INTEGER);
                if (!user1)
                    return -1;
                if (!user2)
                    return 1;
                if (user1 == user2)
                    return 0;
                return user1.toLowerCase() > user2.toLowerCase() ? 1 : -1;
            });
            printTODOes(listTODO);
            break;
        case 'date':
            listTODO.sort((a, b) => {
                var date1 = new Date(a.date.trim() || '1970-01-01'),
                    date2 = new Date(b.date.trim() || '1970-01-01');
                if (date1 < date2)
                    return 1;
                if (date1 > date2)
                    return -1;
                return 0;
            });
            printTODOes(listTODO);
            break;
    }
}

function dateTODOes(files, date) {
    var listTODO = parseTODOes(files);
    ifImportant(listTODO);
    var todo_by_date = [];
    for (const todo of listTODO) {
        if (Date.parse(todo.date) >= date) {
            todo_by_date.push(todo);
        }
    }
    printTODOes(todo_by_date);
}

function printTODOes(todoes) {
    var authors = todoes.map(val => val.author);
    var comments = todoes.map(val => val.comment);
    var dates = todoes.map(val => val.date);
    var fileNames = todoes.map(val => val.fileName);
    //longest
    var longestAuth = authors.reduce(maxLength, 0);
    var longestDate = dates.reduce(maxLength, 0);
    var longestComment = comments.reduce(maxLength, 0);
    var longestFileName = fileNames.reduce(maxLength, 0);

    if (longestAuth > 10)
        longestAuth = 10;
    else if (longestAuth < 4)
        longestAuth = 4;
    if (longestDate > 10)
        longestDate = 10;
    else if (longestDate < 4)
        longestDate = 4;
    if (longestComment > 50)
        longestComment = 50;
    else if (longestComment < 7)
        longestComment = 7;
    if (longestFileName > 15)
        longestFileName = 15;
    else if (longestFileName < 8)
        longestFileName = 8;

    var userHead = "user" + ' '.repeat(longestAuth - 4);
    var dateHead = "date" + ' '.repeat(longestDate - 4);
    var commentHead = "comment" + ' '.repeat(longestComment - 7);
    var fileNameHead = "fileName"+' '.repeat(longestFileName - 8);

    var result = [];
    result.push("  !  |  " + userHead + "  |  " + dateHead + "  |  " + commentHead + "  |  " + fileNameHead + "  ");
    result.push('-'.repeat(25 + longestAuth + longestDate + longestComment + longestFileName));


    for (var todo of todoes) {
        //author
        if (todo.author.length > longestAuth) {
            var str = todo.author.slice(0, longestAuth - 1) + '\u2026';
            todo.author = str;
        }
        else {
            var str = todo.author + ' '.repeat(longestAuth - todo.author.length);
            todo.author = str;
        }
        //dates
        if (todo.date.length > longestDate) {
            var str = todo.date.slice(0, longestDate - 1) + '\u2026';
            todo.date = str;
        }
        else {
            var str = todo.date + ' '.repeat(longestDate - todo.date.length);
            todo.date = str;
        }
        //comment
        if (todo.comment.length > longestComment) {
            var str = todo.comment.slice(0, longestComment - 1) + '\u2026';
            todo.comment = str;
        }
        else {
            var str = todo.comment + ' '.repeat(longestComment - todo.comment.length);
            todo.comment = str;
        }
        //fileName
        if (todo.fileName.length > longestFileName){
            var str = todo.fileName.slice(0, longestFileName - 1) + '\u2026';
            todo.fileName = str;
        }
        else{
            var str = todo.fileName + ' '.repeat(longestFileName - todo.fileName.length);
            todo.fileName = str;
        }
        //print
        if (todo.importance>0){
            result.push("  !  |  " + todo.author + "  |  " + todo.date + "  |  " + todo.comment + "  |  " + todo.fileName + "  ");
        }
        else{
            result.push("     |  " + todo.author + "  |  " + todo.date + "  |  " + todo.comment + "  |  " + todo.fileName + "  ");
        }
    }
    if (todoes.length != 0)
        result.push('-'.repeat(25 + longestAuth + longestDate + longestComment + longestFileName));
    console.log(result.join('\n'));
}

function ifImportant(todoes) {
    for (var todo of todoes) {
        todo.importance = (todo.comment.match(/!/g) || []).length;
    }
}

function maxLength(prev, current) {
    if (current.length > prev)
        return current.length;
    else
        return prev;
}

/**
 * Парсит комментарии TODO
 * @param {строка} text Контент
 */
function parseTODOes(files) {
    const pattern = /\/\/ TODO (([^;\n]*);[ ]?([^;\n]*);[ \n]?(.+)|(.+))/gmi;
    let m;
    var mas = [];
    files.forEach(element => {
        while ((m = pattern.exec(element.content)) !== null) {
            var TODO = {
                importance: 0,
                author: m[2] || ' ',
                date: m[3] || ' ',
                comment: m[4] || m[5] || ' ',
                fileName: element.file,
            };
            mas.push(TODO);
        }
    });

    return mas;
}

module.exports = {
    showTODOes,
    importantTODOes,
    userTODOes,
    sortTODOes,
    dateTODOes,
}