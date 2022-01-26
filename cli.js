const http = require("http");
const fs = require("fs");
// 这个文件可以 把资料存放到file文件夹下
http
  .createServer(function (request, response) {
    response.setHeader("Access-Control-Allow-Origin", "*");
    // 下面的这个意思是放到这个路径下，避免放到根目录
    console.log(request.body);
    request.pipe(
      fs.createWriteStream("./file" + request.url, {
        //    encoding:'binary' // 行
        //    encoding:'base64' // 行
        encoding: "utf8", // 不知道为什么，这里怎么设置都不影响，
      })
    );
    response.end(`${request.url} done!`);
  })
  .listen(3000);
