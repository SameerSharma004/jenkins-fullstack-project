import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Card from "../components/Cards";

export default function Home() {
  const [search, setSearch] = useState("");

  // ✅ Static Categories
  const foodCat = [
    { _id: "1", CategoryName: "Biryani/Rice" },
    { _id: "2", CategoryName: "Kebab" },
    { _id: "3", CategoryName: "Burger" }

  ];

  // ✅ Static Food Items
  const foodItems = [
    {
      _id: "101",
      CategoryName: "Biryani/Rice",
      name: "Veg Biryani",
      img: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      options: [{ half: "150", full: "260" }],
      description: "Made using Indian masalas and Basmati rice."
    },
    {
      _id: "102",
      CategoryName: "Biryani/Rice",
      name: "Chicken Biryani",
      img: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YmlyeWFuaXxlbnwwfHwwfHx8MA%3D%3D",
      options: [{ half: "180", full: "320" }],
      description: "Spicy chicken biryani with basmati rice."
    },
    {
      _id: "201",
      CategoryName: "Kebab",
      name: "Chicken Kebab",
      img: "https://images.unsplash.com/photo-1585238342024-78d387f4a707?q=80&w=600&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      options: [{ half: "200", full: "350" }],
      description: "Succulent grilled chicken marinated with spices."
    },
    {
      _id: "202",
      CategoryName: "Kebab",
      name: "Paneer Tikka",
      img: "https://images.unsplash.com/photo-1666001120694-3ebe8fd207be?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGFuZWVyJTIwdGlra2F8ZW58MHx8MHx8fDA%3D",
      options: [{ half: "180", full: "320" }],
      description: "Grilled paneer cubes in spicy yogurt mix."
    },
    {
      _id: "301",
      CategoryName: "Burger",
      name: "Cheeseburger",
      img: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2hlZXNlYnVyZ2VyfGVufDB8fDB8fHww",
      options: [{ regular: "150", large: "220" }],
      description: "Juicy beef patty topped with cheddar cheese."
    },
    {
      _id: "302",
      CategoryName: "Burger",
      name: "Veggie Burger",
      img: "https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=1000&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8YnVyZ2VyfGVufDB8fDB8fHww",
      options: [{ regular: "140", large: "200" }],
      description: "Healthy veggie patty with fresh vegetables."
    },
  ];

  return (
    <>
      <Navbar search={search} setSearch={setSearch} />

      <div className="container mt-4">
        {foodCat.map((category) => (
          <div key={category._id} className="row mb-4">
            <div className="fs-3 m-3">{category.CategoryName}</div>
            <hr />

            {foodItems
              .filter((item) => item.CategoryName === category.CategoryName)
              .filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase())
              )
              .map((item) => (
                <div key={item._id} className="col-12 col-md-6 col-lg-3 mb-3">
                  <Card foodItems={item} options={item.options[0]} />
                </div>
              ))}

          </div>
        ))}
      </div>

      <Footer />
    </>
  );
}
