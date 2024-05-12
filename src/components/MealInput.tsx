import React, { useEffect, useState } from "react";
import useShoppingListStore, { DayOfWeek } from "../store";
import { IonButton, IonInput, IonItem, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";

const MealInput: React.FC<{ day: string }> = ({ day }) => {
	const [breakfast, setBreakfast] = useState<string>("");
	const [lunch, setLunch] = useState<string>("");
	const [dinner, setDinner] = useState<string>("");

	const { weekMeals, addMeal } = useShoppingListStore();
	const history = useHistory();

	// Načtení aktuálních dat pro daný den
	const { snídaně, oběd, večeře } = weekMeals[day as DayOfWeek];

	// Nastavení hodnot inputů při prvním načtení a při změně dat v localStorage
	useEffect(() => {
		// Načtení dat z localStorage, pokud nejsou k dispozici ve zkušenostech
		const localStorageData = JSON.parse(
			localStorage.getItem("weekMeals") || "{}"
		);
		const dayData = localStorageData[day as DayOfWeek] || {};

		setBreakfast(dayData.snídaně || snídaně || "");
		setLunch(dayData.oběd || oběd || "");
		setDinner(dayData.večeře || večeře || "");
	}, [day, snídaně, oběd, večeře]);

	const handleSaveMeals = () => {
		// Vytvoření objektu s daty pro tento den
		const dayData = {
			snídaně: breakfast,
			oběd: lunch,
			večeře: dinner,
			ingredience: [],
		};

		// Uložení dat do zustand store
		addMeal(day as DayOfWeek, dayData);
	};

	const dayMappings: { [key: string]: string } = {
		pondělí: "pondeli",
		úterý: "utery",
		středa: "streda",
		čtvrtek: "ctvrtek",
		pátek: "patek",
		sobota: "sobota",
		neděle: "nedele",
	};

	const handleGoToShoppingList = () => {
		const englishDay =
			dayMappings[day.toLowerCase() as keyof typeof dayMappings];
		history.push(`/shopping-cart/${encodeURIComponent(englishDay)}`);
	};

	return (
		<div style={{ marginBottom: "30px" }}>
			<IonItem>
				<IonLabel style={{ fontSize: "30px" }}>{day}</IonLabel>
			</IonItem>
			<IonItem>
				<IonLabel>Snídaně</IonLabel>
				<IonInput
					style={{ marginLeft: "20px" }}
					aria-label='Snídaně'
					value={breakfast}
					onIonChange={(e) => setBreakfast(e.detail.value!)}
				/>
			</IonItem>
			<IonItem>
				<IonLabel>Oběd</IonLabel>
				<IonInput
					style={{ marginLeft: "20px" }}
					aria-label='Oběd'
					value={lunch}
					onIonChange={(e) => setLunch(e.detail.value!)}
				/>
			</IonItem>
			<IonItem>
				<IonLabel>Večeře</IonLabel>
				<IonInput
					style={{ marginLeft: "20px" }}
					aria-label='Večeře'
					value={dinner}
					onIonChange={(e) => setDinner(e.detail.value!)}
				/>
			</IonItem>
			<IonButton onClick={handleSaveMeals}>Uložit jídla</IonButton>
			<IonButton onClick={handleGoToShoppingList}>
				Přejít na nákupní seznam
			</IonButton>
		</div>
	);
};

export default MealInput;
