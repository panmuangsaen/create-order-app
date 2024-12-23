import React, { useState } from "react";
import "./App.css"; // You can customize the CSS here
import axios from "axios";

function App() {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [bidderJobs, setBidderJobs] = useState({
    activeBidderJobs: [],
    completedBidderJobs: [],
    failedBidderJobs: [],
    waitingBidderJobs: []});
  const [orderJobs, setOrderJobs] = useState({
    activeOrderJobs: [],
    completedOrderJobs: [],
    failedOrderJobs: [],
    waitingOrderJobs: []
  });
  const [users, setUsers] = useState(
    Array.from({ length: 5 }).fill({ online: false })
  );

  const updateBidding = async (body) => {
    setLoading(true);
    try {
      await axios.post("http://localhost:5001/create-bidder", body);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  const receiveOrder = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/create-order"
      );
      // setOrderId(response.data.orderId);
    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to create order");
    } finally {
    }
  };
  const getOrder = async () => {
    const response = await axios.get("http://localhost:5001/get-order");
    setBidderJobs(response.data.bidderJob)
    setOrderJobs(response.data.orderJob)
  };

  return (
    <div className="App">
      <div>
        <div className="button-container">
          <button onClick={getOrder} disabled={loading}>
            {"Log Orders"}
          </button>
        </div>
        <div style={{ display: "flex" }}>
          {users.map((item, i) => (
            <div
              key={`bid-${i}`}
              style={{
                border: "1px solid grey",
                paddingInline: 10,
                paddingBlock: 5,
              }}
            >
              <h3 style={{ textAlign: "center" }}>{`bidder_id`}</h3>
              <p style={{ textAlign: "center" }}>{`status ${
                item?.online ? "(online)" : ""
              }`}</p>
              <div style={{ display: "flex", columnGap: 10 }}>
                <button
                  style={{
                    color: "white",
                    background: "green",
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    updateBidding({ user: `Bidding ${i}`, online: true });
                    setUsers((prev) =>
                      prev.map((x, _i) => (i === _i ? { online: true } : x))
                    );
                  }}
                >
                  online
                </button>
                <button
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    background: "red",
                  }}
                  onClick={() => {
                    updateBidding({ user: `Bidding ${i}`, online: false });
                    setUsers((prev) =>
                      prev.map((x, _i) => (i === _i ? { online: false } : x))
                    );
                  }}
                >
                  offline
                </button>
              </div>
            </div>
          ))}
        </div>
        {/* <div className="button-container">
          <button onClick={updateBidding} disabled={loading}>
            {"Bidder comes online"}
          </button>
        </div> */}
        <br />
        <br />
        <div className="button-container">
          <button onClick={receiveOrder} disabled={loading}>
            {"Receive Order"}
          </button>
        </div>
        <br/>
        <br/>
        <div style={{display:"flex", columnGap:40}}>
        <div>
          <div style={{textAlign:"center", marginBottom:20}}>{"Waiting Bidder Jobs"}</div>
          {bidderJobs.waitingBidderJobs.map((job)=>(
            <div>{job}</div>
          ))}
        </div>
        <div>
          <div style={{textAlign:"center", marginBottom:20}}>{"Completed Bidder Jobs"}</div>
          {bidderJobs.completedBidderJobs.map((job)=>(
            <div>{job}</div>
          ))}
        </div>
        <div>
          <div style={{textAlign:"center", marginBottom:20}}>{"Waiting Order Jobs"}</div>
          {orderJobs.waitingOrderJobs.map((job)=>(
            <div>{job}</div>
          ))}
        </div>
        <div>
          <div style={{textAlign:"center", marginBottom:20}}>{"Completed Order Jobs"}</div>
          {orderJobs.completedOrderJobs.map((job)=>(
            <div>{job}</div>
          ))}
        </div>
        </div>
      </div>
      {/* {orderId && <p>Order ID: {orderId}</p>} */}
    </div>
  );
}

export default App;