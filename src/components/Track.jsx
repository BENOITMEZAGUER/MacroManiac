import Food from "./Food";
import { UserContext } from "../contexts/UserContext";
import { useContext, useState } from "react";

export default function Tracker() {
  const loggedData = useContext(UserContext);
  const [foodItems, setFoodItems] = useState([]);
  const [food, setFood] = useState(null);
  function searchFood(event) {
    if (event.target.value.lenght !== 0) {
      fetch(`http://localhost:5173/foods/${event.target.value}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${loggedData.loggedUser.token}` },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === undefined) {
            setFoodItems(data);
          } else {
            setFoodItems([]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setFoodItems([]);
    }
  }

  return (
    <>
      <section className="big-body-tracker">
        <div className="search">
          <input
            className="search-inp"
            onChange={searchFood}
            type="search"
            placeholder="Search"
          />
        </div>
        {foodItems.length !== 0 ? (
          <div className="search-results">
            {foodItems.map((item) => {
              return (
                <p
                  className="item"
                  onClick={() => {
                    setFood(item);
                  }}
                  key={item._id}
                >
                  {item.name}
                </p>
              );
            })}
          </div>
        ) : null}

        {food !== null ? <Food food={food} /> : null}
      </section>
    </>
  );
}
