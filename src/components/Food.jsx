import { useEffect, useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";

export default function Food({ food: initialFood }) {
  const [eatenQuantity, setEatenQuantity] = useState(100);
  const [food, setFood] = useState(initialFood);
  const [foodInitial, setFoodInitial] = useState(initialFood);
  const { loggedUser } = useContext(UserContext);

  useEffect(() => {
    setFood(initialFood);
    setFoodInitial(initialFood);
  }, [initialFood]);

  function calculateMacros(event) {
    const quantity = Number(event.target.value);
    if (quantity > 0) {
      setEatenQuantity(quantity);

      setFood({
        ...foodInitial,
        protein: (foodInitial.protein * quantity) / 100,
        carbohydrates: (foodInitial.carbohydrates * quantity) / 100,
        fat: (foodInitial.fat * quantity) / 100,
        fiber: (foodInitial.fiber * quantity) / 100,
        calories: (foodInitial.calories * quantity) / 100,
      });
    }
  }

  function trackFoodItem() {
    const trackedItem = {
      userId: loggedUser.userid,
      foodId: food._id,
      details: {
        protein: food.protein,
        carbohydrates: food.carbohydrates,
        fat: food.fat,
        fiber: food.fiber,
        calories: food.calories,
      },
      quantity: eatenQuantity,
    };

    fetch("http://localhost:8000/track", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${loggedUser.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(trackedItem),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  return (
    <div className="food">
      <div className="food-img">
        <img className="food-image" src={food.imageUrl} alt={food.name} />
      </div>

      <h3>
        {food.name} ({food.calories} Kcal for {eatenQuantity}g)
      </h3>

      <div className="nutrient">
        <p className="n-title">Protein</p>
        <p className="n-value">{food.protein}g</p>
      </div>

      <div className="nutrient">
        <p className="n-title">Carbs</p>
        <p className="n-value">{food.carbohydrates}g</p>
      </div>

      <div className="nutrient">
        <p className="n-title">Fat</p>
        <p className="n-value">{food.fat}g</p>
      </div>

      <div className="nutrient">
        <p className="n-title">Fiber</p>
        <p className="n-value">{food.fiber}g</p>
      </div>

      <div className="track-control">
        <input
          type="number"
          value={eatenQuantity}
          onChange={calculateMacros}
          className="inp"
          placeholder="Quantity in Gms"
        />

        <button className="btn" onClick={trackFoodItem}>
          Track
        </button>
      </div>
    </div>
  );
}
