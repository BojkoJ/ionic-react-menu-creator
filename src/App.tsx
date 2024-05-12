import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import {
	IonApp,
	IonContent,
	IonHeader,
	IonTitle,
	IonToolbar,
	setupIonicReact,
} from "@ionic/react";
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "./theme/variables.css";
import ShoppingList from "./components/ShoppingList";
import MealInput from "./components/MealInput";

const App: React.FC = () => {
	setupIonicReact();

	return (
		<IonApp>
			<IonHeader>
				<IonToolbar>
					<IonTitle style={{ textAlign: "center" }}>
						Tvoření jídelníčku BOJ0043
					</IonTitle>
				</IonToolbar>
			</IonHeader>
			<IonContent>
				<Router>
					<Switch>
						<Route exact path='/' component={MealPlan} />
						<Route
							path='/shopping-cart/:day'
							component={ShoppingList}
						/>
						<Route component={NotFound} />
					</Switch>
				</Router>
			</IonContent>
		</IonApp>
	);
};

const MealPlan: React.FC = () => {
	return (
		<>
			<MealInput day='pondělí' />
			<MealInput day='úterý' />
			<MealInput day='středa' />
			<MealInput day='čtvrtek' />
			<MealInput day='pátek' />
			<MealInput day='sobota' />
			<MealInput day='neděle' />
		</>
	);
};

const NotFound: React.FC = () => {
	return <div>Stránka nenalezena</div>;
};

export default App;
