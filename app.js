const fs = require('fs');
const http = require('http');
const url = require('url');
const mime = require('mime');
const qs = require('querystring');
const mysql = require('mysql');
const port = 3000;

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'departments'
})

conn.connect(err => {
    if (err) throw err;
    console.log('Connected!')
})

http.createServer((req, res) => {
    let filename = 'public' + url.parse(req.url).pathname;
    console.log(filename);
    if (filename === 'public/') filename = 'public/home.html';
    else if (filename === 'public/add') filename = 'public/index.html';
    else if (filename === 'public/list') filename = 'public/list.html';
    else if (filename === 'public/empadd') filename = 'public/empindex.html';
    else if (filename === 'public/emplist') filename = 'public/emplist.html';

    router(req, res, filename)
}).listen(port)

console.log(`Server running on port: ${port}`);
console.log(`Run your app here: http://localhost:${port}`);

function router(req, res, filename) {
    switch (filename) {
        case 'public/save':
            save(req, res);
            break;
        case 'public/listdepts':
            listDepts(req, res);
            break;

        case 'public/delete':
            deleteDepts(req, res);
            break;
        case 'public/update':
            updateDepts(req, res);
            break;
        case 'public/saveemp':
            saveemp(req, res);
            break;
        case 'public/listemps':
            listEmps(req, res);
            break;
        case 'public/deleteemps':
            deleteEmps(req, res);
            break;
        case 'public/updateemp':
            updateEmp(req, res);
            break;
        default:
            fs.readFile(filename, (err, data) => {
                if (err) {
                    res.writeHead(404, { 'content-type': 'text/html' });
                    res.write('404 Not Found');
                    return res.end();
                }
                else {
                    res.writeHead(200, { 'content-type': mime.getType(filename) });
                    res.write(data);
                    return res.end();
                }
            });
            break;
    }
}

let save = (req, res) => {
    let info = '';
    req.on('data', chunks => {
        info += chunks;
    });
    req.on('end', err => {
        if (err) throw err;
        let form = qs.parse(info);
        let cmd = 'INSERT INTO dep_info SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    });
}

let listDepts = (req, res) => {
    let cmd = 'SELECT * FROM dep_info ';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, { 'content-type': 'json' });
        res.write(JSON.stringify(result));
        res.end();
    });
}

let deleteDepts = (req, res) => {
    let id = url.parse(req.url, true).query.depts;
    console.log(id);
    let cmd = 'DELETE FROM dep_info WHERE id = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end();
    });
}

let updateDepts = (req, res) => {
    let info = '';
    req.on('data', chunks => {
        info += chunks;
    });
    req.on('end', err => {
        if (err) throw err;
        let form = qs.parse(info);
        let formToUpdate = {
            name: form.name,
            director: form.director,
            annbud: form.annbud
        };
        let cmd = `UPDATE dep_info SET ? WHERE id = ?`;
        conn.query(cmd, [formToUpdate, form.id], (err, result) => {
            if (err) throw err;
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end();
        });
    });
}

let saveemp = (req, res) => {
    let info = '';
    req.on('data', chunks => {
        info += chunks;
    });
    req.on('end', err => {
        if (err) throw err;
        let form = qs.parse(info);
        let cmd = 'INSERT INTO emp_info SET ?';
        conn.query(cmd, form, (err, result) => {
            if (err) throw err;
            res.writeHead(302, { 'Location': '/' });
            res.end();
        });
    });
}

let listEmps = (req, res) => {
    let cmd = 'SELECT * FROM emp_info ';
    conn.query(cmd, (err, result) => {
        if (err) throw err;
        res.writeHead(200, { 'content-type': 'json' });
        res.write(JSON.stringify(result));
        res.end();
    });
}

let deleteEmps = (req, res) => {
    let id = url.parse(req.url, true).query.emps;
    console.log(id);
    let cmd = 'DELETE FROM emp_info WHERE empid = ?';
    conn.query(cmd, id, (err, result) => {
        if (err) throw err;
        res.writeHead(200, { 'content-type': 'text/html' });
        res.end();
    });
}

let updateEmp = (req, res) => {
    let info = '';
    req.on('data', chunks => {
        info += chunks;
    });
    req.on('end', err => {
        if (err) throw err;
        let form = qs.parse(info);
        let formToUpdate = {
            fname: form.fname,
            category: form.category,
            activity: form.activity,
            depid: form.depid
        };
        let cmd = `UPDATE emp_info SET ? WHERE empid = ?`;
        console.log(form)
        conn.query(cmd, [formToUpdate, form.empid], (err, result) => {
            if (err) throw err;
            res.writeHead(200, { 'content-type': 'text/html' });
            res.end();
        });
    });
}