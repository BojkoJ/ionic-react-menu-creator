const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const router = express.Router();

// Middleware pro zpracování JSON dat
router.use(bodyParser.json());

router.post("/", (req, res) => {
	try {
		// Získání JSON dat ze žádosti
		const jsonData = JSON.stringify(req.body);

		// Nastavení cesty k souboru
		const filePath = path.join(__dirname, "../../../export/exported.json");

		// Zápis JSON dat do souboru
		fs.writeFileSync(filePath, jsonData);

		// Odeslání úspěšné odpovědi
		res.status(200).json({
			success: true,
			message: "Data byla úspěšně exportována do souboru exported.json",
		});
	} catch (error) {
		console.error("Chyba při exportu JSON dat:", error);
		res.status(500).json({
			success: false,
			message: "Došlo k chybě při exportu JSON dat",
		});
	}
});

module.exports = router;
