const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const router = express.Router();

// Middleware pro zpracování XML dat
router.use(bodyParser.text({ type: "application/xml" }));

router.post("/", (req, res) => {
	try {
		// Získání XML dat ze žádosti
		const xmlData = req.body;

		// Nastavení cesty k souboru
		const filePath = path.join(__dirname, "../../../export/exported.xml");

		// Zápis XML dat do souboru
		fs.writeFileSync(filePath, xmlData);

		// Odeslání úspěšné odpovědi
		res.status(200).send(
			"XML data byla úspěšně exportována do souboru exported.xml"
		);
	} catch (error) {
		console.error("Chyba při exportu XML dat:", error);
		res.status(500).send("Došlo k chybě při exportu XML dat");
	}
});

module.exports = router;
