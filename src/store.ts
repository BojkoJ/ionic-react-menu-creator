import { create } from "zustand";

export type DayOfWeek =
	| "pondělí"
	| "úterý"
	| "středa"
	| "čtvrtek"
	| "pátek"
	| "sobota"
	| "neděle";

interface DayMeal {
	snídaně: string;
	oběd: string;
	večeře: string;
	ingredience: string[];
}

// Definujeme objektový typ pro WeekMeals
interface WeekMeals {
	pondělí: DayMeal;
	úterý: DayMeal;
	středa: DayMeal;
	čtvrtek: DayMeal;
	pátek: DayMeal;
	sobota: DayMeal;
	neděle: DayMeal;
}

interface ShoppingListStore {
	weekMeals: WeekMeals;
	addMeal: (day: DayOfWeek, meal: DayMeal) => void;
	addIngredient: (day: DayOfWeek, ingredient: string) => void;
	deleteIngredient: (day: DayOfWeek, ingredientIndex: number) => void;
}

const useShoppingListStore = create<ShoppingListStore>((set) => {
	// Zkusíme načíst data z localStorage
	const savedWeekMeals = localStorage.getItem("weekMeals");
	// Pokud data existují, načteme je a parsujeme je
	const initialWeekMeals = savedWeekMeals ? JSON.parse(savedWeekMeals) : null;

	// Inicializujeme stav weekMeals buď z localStorage nebo prázdným objektem
	const initialData = initialWeekMeals || {
		pondělí: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		úterý: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		středa: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		čtvrtek: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		pátek: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		sobota: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
		neděle: { snídaně: "", oběd: "", večeře: "", ingredience: [] },
	};

	// Vrátíme stav a akce
	return {
		weekMeals: initialData,
		addMeal: (day, meal) => {
			set((state) => {
				const updatedWeekMeals = {
					...state.weekMeals,
					[day]: {
						...state.weekMeals[day],
						...meal,

						// Přidáme existující ingredience do nového jídla, pokud existují
						ingredience:
							meal.ingredience.length > 0
								? meal.ingredience
								: state.weekMeals[day].ingredience,
					},
				};

				localStorage.setItem(
					"weekMeals",
					JSON.stringify(updatedWeekMeals)
				);
				return { weekMeals: updatedWeekMeals };
			});
		},

		addIngredient: (day, ingredient) => {
			set((state) => {
				const updatedMeal = {
					...state.weekMeals[day],

					ingredience: [
						...state.weekMeals[day].ingredience,
						ingredient,
					],
				};

				const updatedWeekMeals = {
					...state.weekMeals,
					[day]: updatedMeal,
				};

				localStorage.setItem(
					"weekMeals",
					JSON.stringify(updatedWeekMeals)
				);

				return { weekMeals: updatedWeekMeals };
			});
		},
		deleteIngredient: (day, ingredientIndex) => {
			set((state) => {
				const updatedIngredients = state.weekMeals[
					day
				].ingredience.filter((_, index) => index !== ingredientIndex);

				const updatedMeal = {
					...state.weekMeals[day],
					ingredience: updatedIngredients,
				};

				const updatedWeekMeals = {
					...state.weekMeals,
					[day]: updatedMeal,
				};

				localStorage.setItem(
					"weekMeals",
					JSON.stringify(updatedWeekMeals)
				);

				return { weekMeals: updatedWeekMeals };
			});
		},
	};
});

export default useShoppingListStore;
