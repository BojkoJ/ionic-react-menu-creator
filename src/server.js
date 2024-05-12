const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Povolení CORS
app.use(cors());

// Middleware pro zpracování JSON dat
app.use(express.json());

// Přesměrování na soubor xml.js pro export XML
app.use("/api/export/xml", require(path.join(__dirname, "api/export/xml.js")));

app.use(
	"/api/export/json",
	require(path.join(__dirname, "api/export/json.js"))
);

// Spuštění serveru
app.listen(PORT, () => {
	console.log(`Server běží na portu ${PORT}`);
});
