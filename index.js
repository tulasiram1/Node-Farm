const fs = require("fs");

const http = require("http");

const URL = require("node:url");

const PORT = process.env.PORT || 8080;

const templateReplace = (template, data) => {
  let temp = template.replace(/{%image%}/g, data.image);
  //   //   console.log(temp);
  //   temp = temp.replace("{%image%}", dataObj[i].image);
  temp = temp.replace(/{%productName%}/g, data.productName);
  temp = temp.replace(/{%quantity%}/g, data.quantity);
  temp = temp.replace(/{%price%}/g, data.price);
  temp = temp.replace(/{%from%}/g, data.from);
  temp = temp.replace(/{%nutrients%}/g, data.nutrients);
  temp = temp.replace(/{%quantity%}/g, data.quantity);
  temp = temp.replace(/{%description%}/g, data.description);
  temp = temp.replace(/{%id%}/g, data.id);
  if (!data.organic) temp = temp.replace(/{%organic%}/g, "not-organic");
  return temp;
};

const data = fs.readFileSync("./dev-data/data.json", "utf-8");
const dataObj = JSON.parse(data);
const tempOverview = fs.readFileSync(
  "./templates/template-overview.html",
  "utf-8"
);
const tempCard = fs.readFileSync("./templates/template-card.html", "utf-8");
// console.log(tempCard);
const product = fs.readFileSync("./templates/product.html", "utf-8");

const server = http.createServer((req, res) => {
  const url = URL.parse(req.url, true);
  const path = url.pathname;
  //   console.log(url.query);
  if (path === "/" || path === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const template = dataObj.map((el) => templateReplace(tempCard, el));

    temp = tempOverview.replace("{%productTemplate%}", template);

    res.end(temp);
  } else if (path === "/api") {
    res.writeHead("200", { "Content-type": "application/json" });
    res.end(data);
  } else if (path === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });
    res.end(templateReplace(product, dataObj[url.query.id]));
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>page not found</h1>");
  }
});

server.listen(PORT, "https://tulasi-node-farm.herokuapp.com", () => {
  console.log("listening");
});
