// var http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => res.sendFile(`${__dirname}/index.html`));

app.post("/", (req, res) => {
  const { crypto, fiat } = req.body;

  request(
    `https://apiv2.bitcoinaverage.com/indices/global/ticker/${crypto}${fiat}`,
    (error, response, body) => {
      console.log("error:", error); // Print the error if one occurred
      const bodyParse = JSON.parse(body);
      console.log(bodyParse.last);

      res.write(`<p>Current date : ${bodyParse.display_timestamp} </p>`);
      res.write(
        `<h1>The chosen currency is ${crypto} on ${fiat} course ${
          bodyParse.last
        }</h1>`
      );
      res.send();
    }
  );
});

app.get("/converter", (req, res) =>
  res.sendFile(`${__dirname}/converter.html`)
);

app.post("/converter", (req, res) => {
  const { crypto, fiat, amount } = req.body;
  console.log(crypto, fiat, amount);

  const option = {
    url: "https://apiv2.bitcoinaverage.com/convert/global",
    method: "GET",
    qs: {
      from: crypto,
      to: fiat,
      amount
    }
  };

  request(option, (error, response, body) => {
    console.log(error);
    const bodyParse = JSON.parse(body);
    res.write(
      `<h1>${amount} ${crypto} na ${fiat} kurs wynosi ${bodyParse.price}</h1>`
    );
    res.send();
  });
});

app.listen(8080, () => console.log(`Example app listening on port ${8080}!`));
