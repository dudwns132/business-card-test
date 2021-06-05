var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (error, filelist) {
        var title = '명함관리';
        var description = '명함 관리 웹사이트에 오신것을 환영합니다.';
        var list = template.list(filelist);
        var html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(html);

      })
    } else {
      fs.readdir('./data', function (error, filelist) {
        var filteredId = path.parse(queryData.id).base;
        fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
          console.log(description.indexOf(':'));
          console.log(description.indexOf('</div>'));
          // console.log(description);
          var title = queryData.id;
          var sanitizedTitle = sanitizeHtml(title);
          var sanitizedDescription = sanitizeHtml(description, {
            allowedTags: ['h1', 'br', 'div']
          });
          // var sanitizedDescription = description;
          var list = template.list(filelist);
          var html = template.html(title, list,
            `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
            `<a href="/create">create</a> 
               <a href="/update?id=${sanitizedTitle}">update</a>
               <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${sanitizedTitle}">
                <input type="submit" value="delete">
               </form>`);
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  } else if (pathname === '/create') {
    fs.readdir('./data', function (error, filelist) {
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.html(title, list,
        `<fieldset>
          <form action="/create_process" method="post"> 
            <p> 이름 : <input type="txt" name="title" placeholder="Name"></p>

            <p> 직장 : <input type="txt" name="oName" placeholder="Office Name"></p>

            <p> 직책 : <input type="txt" name="oPosition" placeholder="Office Position"></p>

            <p> 전화번호 : <input type="txt" name="pNum" placeholder="Phone Number"></p>

            <p> email : <input type="txt" name="email" placeholder="E-mail"></p>

            <p> 주소 :
                <textarea name="address" placeholder="address"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
          </form>
          </fieldset>
          `, '');
      response.writeHead(200);
      response.end(html);
    })
  } else if (pathname === '/create_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;
      var oName = post.oName;
      var oPosition = post.oPosition;
      var pNum = post.pNum;
      var email = post.email;
      var address = post.address;
      var description = `
          <div>직장 : ${oName} </div>
          <div>직책 : ${oPosition} </div>
          <div>전화번호 : ${pNum} </div>
          <div>이메일 : ${email} </div>
          <div>주소 : ${address} </div>`;
      //console.log(test[2]);
      //console.log(post);
      fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
        response.writeHead(302, {
          Location: encodeURI(`/?id=${title}`)
        });
        response.end('success');
      })
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      var filteredId = path.parse(queryData.id).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var test = description.split(' ');
        console.log('aaaaa');
        var list = template.list(filelist);
        var html = template.html(title, list,
          `
             <fieldset>
             <legend>명함 갱신</legend>
             <form action="/update_process" method="post"> 
              <input type="hidden" name="id" value="${title}">
              <p> 이름 : <input type="txt" name="title" placeholder="title" value="${title}"></p>

              <p> 직장 : <input type="txt" name="oName" placeholder="Office Name"></p>

              <p> 직책 : <input type="txt" name="oPosition" placeholder="Office Position"></p>

              <p> 전화번호 : <input type="txt" name="pNum" placeholder="Phone Number"></p>

              <p> 이메일 : <input type="txt" name="email" placeholder="E-mail"></p>

              <p> 주소 : 
                  <textarea name="address" placeholder="description">${description}</textarea>
              </p>
              
              <p>
                  <input type="submit">
              </p>
              </fieldset>
             `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`);
        response.writeHead(200);
        response.end(html);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var title = post.title;
      var oName = post.oName;
      var oPosition = post.oPosition;
      var pNum = post.pNum;
      var email = post.email;
      var address = post.address;
      var description = `
          <div><p>직장 :</p>${oName}</div>
          <div><p>직책 : </p>${oPosition}</div>
          <div><p>전화번호 : </p>${pNum}</div>
          <div><p>이메일 : </p>${email}</div>
          <div><p>주소 : </p>${address}</div>`;
      // var description = post.description;
      // console.log(post);
      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, {
            Location: encodeURI(`/?id=${title}`)
          });
          response.end();
        })
      })
    });
  } else if (pathname === '/delete_process') {
    var body = '';
    request.on('data', function (data) {
      body = body + data;
    });
    request.on('end', function () {
      var post = qs.parse(body);
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function () {
        response.writeHead(302, {
          Location: `/`
        });
        response.end()
      })
    });
  } else {
    response.writeHead(404);
    response.end('Not found');
  }




  // response.end(fs.readFileSync(__dirname + _url));

});
app.listen(3000);