const fs = require("fs");
const xlsx = require("node-xlsx");
var request = require("request");

var program = require("commander");
const inquirer = require("inquirer");
const pkg = require("../package.json");
// const handleExcelToJson = require("./index");

program.version(pkg.version, "-v, --version").parse(process.argv);

let fileUrlInput;

const promptList = [
  {
    type: "input",
    name: "fileUrlInput",
    message: "请输入文件地址：",
    default: "test_user", // 默认值
  },
];

// url地址是用户传入的地址

//下载线上excel表格
var fileUrl =
  "https://files.shimonote.com/shimo-export/hLNz43XZCHfmkEs2.xlsx?auth_key=1642995095-HQItQuJtYrTYdBtu-0-19da4243d12c3fb19b2625385e89a890&response-content-disposition=attachment%3B+filename%3D%22Announcement%2520Text.xlsx%22%3B+filename%2A%3DUTF-8%27%27Announcement%2520Text.xlsx";
var filename = "./excel/test.xlsx"; //文件名

function downloadFile(uri, filename, callback) {
  var stream = fs.createWriteStream(filename);
  request(uri).pipe(stream).on("close", callback);
}

const excelData = xlsx.parse("./excel/test.xlsx");
// excel数据
// 最终数据
let finalArr = [];

function handelExcel() {
  // excel的第一个sheet
  const excelSheet = excelData[0].data;
  // 表头
  const columns = excelSheet[0];
  // 表头对应的key
  const columnsObj = {
    id: "序号",
    title: "标题",
    content: "内容",
    btnName: "按钮名字",
    btnLink: "链接",
  };
  let JSONKey = [];
  // 设置JSON key值
  columns.forEach((item) => {
    for (key in columnsObj) {
      const itemKey = columnsObj[key];
      itemKey === item ? JSONKey.push(key) : "";
    }
  });
  // 表内容
  const jsonData = excelSheet.slice(1);
  jsonData.forEach((lineItem) => {
    let arrItem = {};
    lineItem.forEach((item, index) =>
      Object.assign(arrItem, {
        [JSONKey[index]]: item
          .toString()
          .replace(/\r/g, "")
          .replace(/\n/g, "\\n"),
      })
    );
    finalArr.push(arrItem);
  });
}

function generatJSON(fileName, data) {
  fs.writeFile(fileName, data, "utf-8", function (err) {
    if (err) {
      console.log("errr");
    } else {
      console.log("success");
    }
  });
}

function handleExcelToJson() {
  //下载表格
  // downloadFile(fileUrl, filename, function () {
  //   console.log(filename + "下载完毕");
  // });
  handelExcel();
  generatJSON("./data/data.json", JSON.stringify(finalArr, null, "\t"));
}

// inquirer.prompt(promptList).then((answers) => {
//   console.log(answers); // 返回的结果
//   handleExcelToJson();
// });
handleExcelToJson();
