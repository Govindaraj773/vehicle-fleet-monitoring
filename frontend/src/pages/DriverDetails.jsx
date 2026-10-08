import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const DriverDetails = () => {
  const { id } = useParams();
  const [driver, setDriver] = useState(null);

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(
          `http://localhost:5000/api/drivers/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const data = await response.json();
        console.log("Fetched API Driver Details:", data);
        setDriver(data.driver || null);
      } catch (error) {
        console.error("Error while fetching driver details:", error);
      }
    };
    fetchDriverDetails();
  }, [id]);

  return (
    <div>
      <h2>Driver Details</h2>
      <h2></h2>
    </div>
  );
};

export default DriverDetails;
