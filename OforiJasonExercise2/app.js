const http = require('http');
const fs = require('fs');
// const path = require('path');

// Define port
const PORT = 3000;
const HOST = 'localhost';

// Create server
const server = http.createServer((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html')
    
    let path = './views/';

    if (req.url === '/'){
        path = path + 'index.html';
    }
    else if (req.url === '/contact'){
        path = path + 'contact.html';
    }
    else if (req.url === '/students'){
        path = path + 'students.html';
    }
    else {
        res.statusCode = 404;
        path = path + '404.html';
    }

    fs.readFile(path, (err, data) => {
        if (err) {
            console.log(err)
            res.end('Server Error');
        } else {
            res.write(data);
            res.end(data);
        }
    });
});

// Start server
server.listen(PORT, HOST, () => {
    console.log('Server running on port', PORT);
});
