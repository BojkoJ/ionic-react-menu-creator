import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
	IonList,
	IonItem,
	IonLabel,
	IonIcon,
	IonButton,
	IonInput,
	IonItemDivider,
	IonContent,
} from "@ionic/react";
import {
	trashOutline,
	add,
	cloudDownloadOutline,
	cloudUploadOutline,
} from "ionicons/icons";
import { parseString, Parser } from "xml2js";

import useShoppingListStore, { DayOfWeek } from "../store";

const ShoppingList: React.FC = () => {
	const location = useLocation();
	const [newItem, setNewItem] = useState<string>("");
	const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>("pondělí");

	const { weekMeals, addIngredient, deleteIngredient, addMeal } =
		useShoppingListStore();
	const dayMeals = weekMeals[dayOfWeek];

	// Mapování anglických názvů dnů na české názvy
	const englishToCzechDayMap: Record<string, DayOfWeek> = {
		pondeli: "pondělí",
		utery: "úterý",
		streda: "středa",
		ctvrtek: "čtvrtek",
		patek: "pátek",
		sobota: "sobota",
		nedele: "neděle",
	};

	useEffect(() => {
		// Získání dne v týdnu z URL
		const urlParts = location.pathname.split("/");
		const englishDayFromUrl = urlParts[urlParts.length - 1]; // Anglický název dne z URL
		const czechDayFromUrl = englishToCzechDayMap[
			englishDayFromUrl
		] as DayOfWeek; // Přetypování na DayOfWeek
		setDayOfWeek(czechDayFromUrl);
	}, [location.pathname]);

	// Arrow funkce pro přidání položky do seznamu
	const handleAddItem = () => {
		// Pokud nová položka není prázdný string podmínka projde
		if (newItem.trim() !== "") {
			// Přidáme lokální stav newItem do globálního stavu items pomocí addItems z custom hooku od Zustandu
			addIngredient(dayOfWeek, newItem.trim());
			// Vymažeme lokální stav newItem
			setNewItem("");
		}
	};

	const handleImportXML = async () => {
		try {
			const fileInput = document.createElement("input");

			fileInput.type = "file";
			fileInput.accept = ".xml";

			fileInput.onchange = async (event: any) => {
				const file = event.target.files[0];

				if (file) {
					const reader = new FileReader();
					reader.readAsText(file);

					reader.onload = async (e) => {
						try {
							const xmlData = e.target?.result as string;

							// Inicializace parseru
							const parser = new Parser();

							// Parsování XML do JSON formátu s použitím inicializovaného parseru
							parseString(
								xmlData,
								{ explicitArray: false },
								(err, result) => {
									if (err) {
										console.error(
											"Chyba při parsování XML:",
											err
										);
									} else {
										// Zpracování načtených dat

										const {
											snídaně,
											oběd,
											večeře,
											ingredience,
										} = result.dayMeals;
										let ingredienceArray: string[] = [];

										if (ingredience && ingredience.item) {
											const items = Array.isArray(
												ingredience.item
											)
												? ingredience.item
												: [ingredience.item];

											ingredienceArray = items.map(
												(item: any) => {
													return item?.trim() || "";
												}
											);
										}

										const dayMeal = {
											snídaně: Array.isArray(snídaně)
												? snídaně[0]
												: snídaně,
											oběd: Array.isArray(oběd)
												? oběd[0]
												: oběd,
											večeře: Array.isArray(večeře)
												? večeře[0]
												: večeře,
											ingredience: ingredienceArray,
										};

										addMeal(dayOfWeek, dayMeal);
									}
								}
							);
						} catch (error) {
							console.error("Chyba při parsování XML:", error);
						}
					};
				}
			};
			fileInput.click();
		} catch (error) {
			console.error("Chyba při importu z XML:", error);
		}
	};

	const handleExportXML = async (dayMeals: {
		snídaně: string;
		oběd: string;
		večeře: string;
		ingredience: string[];
	}) => {
		try {
			// Vytvoření XML řetězce
			let xmlString = "<dayMeals>\n";
			xmlString += `  <snídaně>${dayMeals.snídaně}</snídaně>\n`;
			xmlString += `  <oběd>${dayMeals.oběd}</oběd>\n`;
			xmlString += `  <večeře>${dayMeals.večeře}</večeře>\n`;
			xmlString += "  <ingredience>\n";
			dayMeals.ingredience.forEach((ingredient: string) => {
				xmlString += `    <item>${ingredient}</item>\n`;
			});
			xmlString += "  </ingredience>\n";
			xmlString += "</dayMeals>";

			// Odeslání XML řetězce na server pomocí metody POST
			const response = await fetch(
				"http://localhost:3000/api/export/xml",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/xml",
					},
					body: xmlString,
				}
			);

			// Zpracování odpovědi
			if (response.ok) {
				console.log("XML data byla úspěšně exportována.");
			} else {
				console.error(
					"Chyba při exportu XML dat:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Chyba při exportu XML dat:", error);
		}
	};

	const handleImportJSON = async () => {
		try {
			const fileInput = document.createElement("input");
			fileInput.type = "file";
			fileInput.accept = ".json";

			fileInput.onchange = async (event: any) => {
				const file = event.target.files[0]; // Získáme vybraný soubor

				if (file) {
					const reader = new FileReader();
					reader.readAsText(file); // Přečteme obsah souboru jako text

					reader.onload = async (event) => {
						if (event && event.target) {
							const jsonData = event.target.result;
							const importedData = JSON.parse(jsonData as string);

							// Zde provádíme logiku zpracování a importu dat
							if (importedData && importedData.dayMeals) {
								const { snídaně, oběd, večeře, ingredience } =
									importedData.dayMeals;

								const dayMeal = {
									snídaně: Array.isArray(snídaně)
										? snídaně[0]
										: snídaně,
									oběd: Array.isArray(oběd) ? oběd[0] : oběd,
									večeře: Array.isArray(večeře)
										? večeře[0]
										: večeře,
									ingredience: Array.isArray(ingredience)
										? ingredience
										: [],
								};

								addMeal(dayOfWeek, dayMeal);
							}
						}
					};
				}
			};
			fileInput.click();
		} catch (error) {
			console.error("Chyba při importu z JSON:", error);
		}
	};

	const handleExportJSON = async (dayMeals: {
		snídaně: string;
		oběd: string;
		večeře: string;
		ingredience: string[];
	}) => {
		try {
			// Vytvoření JSON řetězce z dat dayMeals
			const jsonData = JSON.stringify(dayMeals);

			// Odeslání JSON řetězce na server pomocí metody POST
			const response = await fetch(
				"http://localhost:3000/api/export/json",
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: jsonData,
				}
			);

			// Zpracování odpovědi
			if (response.ok) {
				const data = await response.json();
				console.log(data.message);
			} else {
				console.error(
					"Chyba při exportu JSON dat:",
					response.statusText
				);
			}
		} catch (error) {
			console.error("Chyba při exportu JSON dat:", error);
		}
	};

	return (
		<IonContent>
			<IonList style={{ height: "80vh", overflowY: "auto" }}>
				{dayMeals &&
					dayMeals.ingredience.length > 0 &&
					dayMeals.ingredience.map(
						(
							item: string,
							index: number // Kontrola existence dayMeals a dayMeals.ingredience
						) => (
							<IonItem key={index}>
								<IonLabel>{item}</IonLabel>
								<IonButton
									onClick={() =>
										deleteIngredient(dayOfWeek, index)
									}
								>
									<IonIcon
										icon={trashOutline}
										slot='icon-only'
									/>
								</IonButton>
							</IonItem>
						)
					)}
			</IonList>

			<IonItemDivider></IonItemDivider>

			<IonItem
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<IonInput
					aria-label='Položka'
					placeholder='Zadejte položku'
					value={newItem}
					onIonChange={(e) => setNewItem(e.detail.value!)}
				></IonInput>

				<IonButton onClick={handleAddItem}>
					<IonIcon icon={add} slot='start' />
					Přidat
				</IonButton>
			</IonItem>
			<IonItem
				style={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					flexWrap: "wrap",
					height: "120px", // Nastavíme pevnou výšku pro IonItem
				}}
			>
				<IonButton
					style={{ flexBasis: "45%" }} // Nastavíme šířku tlačítek
					onClick={handleImportXML}
				>
					<IonIcon icon={cloudDownloadOutline} slot='start' />Z XML
				</IonButton>

				<IonButton
					style={{ flexBasis: "45%" }} // Nastavíme šířku tlačítek
					onClick={() => handleExportXML(dayMeals)} // Zavolání funkce s argumentem dayMeals
				>
					<IonIcon icon={cloudUploadOutline} slot='start' />
					Do XML
				</IonButton>

				<IonButton
					style={{ flexBasis: "45%" }} // Nastavíme šířku tlačítek
					onClick={handleImportJSON}
				>
					<IonIcon icon={cloudDownloadOutline} slot='start' />Z JSON
				</IonButton>

				<IonButton
					style={{ flexBasis: "45%" }} // Nastavíme šířku tlačítek
					onClick={() => handleExportJSON(dayMeals)}
				>
					<IonIcon icon={cloudUploadOutline} slot='start' />
					Do JSON
				</IonButton>
			</IonItem>
		</IonContent>
	);
};

export default ShoppingList;
