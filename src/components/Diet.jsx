import { useEffect, useState, useCallback, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import Header from "./Header";

export default function Diet() {
  const { loggedUser } = useContext(UserContext);
  const [items, setItems] = useState([]);
  const [date, setDate] = useState(new Date());

  const [total, setTotal] = useState({
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFats: 0,
    totalFiber: 0,
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(
          `http://localhost:5173/track/${loggedUser.userid}/${
            date.getMonth() + 1
          }-${date.getDate()}-${date.getFullYear()}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${loggedUser.token}`,
            },
          }
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        setItems(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchItems();
  }, [date, loggedUser.userid, loggedUser.token]);

  const calculateTotal = useCallback(() => {
    const totalCopy = {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFats: 0,
      totalFiber: 0,
    };

    items.forEach((item) => {
      totalCopy.totalCalories += item.details.calories;
      totalCopy.totalProtein += item.details.protein;
      totalCopy.totalCarbs += item.details.carbohydrates;
      totalCopy.totalFats += item.details.fat;
      totalCopy.totalFiber += item.details.fiber;
    });

    setTotal(totalCopy);
  }, [items]);

  useEffect(() => {
    calculateTotal();
  }, [calculateTotal]);

  return (
    <section className="container diet-container">
      <Header />

      <input
        type="date"
        value={date.toISOString().split("T")[0]} // Ensure the input date is properly formatted
        onChange={(event) => setDate(new Date(event.target.value))}
      />

      {items.map((item) => (
        <div className="item" key={item._id}>
          <h3>
            {item.foodId.name} ({item.details.calories} Kcal for {item.quantity}
            g)
          </h3>
          <p>
            Protein {item.details.protein}g, Carbs {item.details.carbohydrates}
            g, Fats {item.details.fat}g, Fiber {item.details.fiber}g
          </p>
        </div>
      ))}

      <div className="item">
        <h3>{total.totalCalories} Kcal</h3>
        <p>
          Protein {total.totalProtein}g, Carbs {total.totalCarbs}g, Fats{" "}
          {total.totalFats}g, Fiber {total.totalFiber}g
        </p>
      </div>
    </section>
  );
}
