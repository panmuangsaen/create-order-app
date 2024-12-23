import React, { useEffect, useState } from "react";
import "./App.css"; // You can customize the CSS here
import axios from "axios";
import dayjs from "dayjs";

function App() {
  const [loading, setLoading] = useState(false);
  const [orderJobs, setOrderJobs] = useState({
    active: [],
    completed: [],
    failed: [],
    waiting: [],
  });
  const [bidderJobs, setBiddingJobs] = useState({
    active: [],
    completed: [],
    failed: [],
    waiting: [],
  });
  const [users, setUsers] = useState(
    Array.from({ length: 20 }).fill({ online: false })
  );

  useEffect(() => {
    return () => {
      getOrder();
    };
  }, []);

  const server = async (options) => {
    setLoading(true);
    try {
      const { data } = await axios({ timeout: 2000, ...options });
      return { ...data, isSuccess: true };
    } catch (e) {
      const [, route] = options?.url?.split("5001");
      console.log(`❌ ${options?.method?.toUpperCase()} ${route}`);
      return { isSuccess: false };
    } finally {
      setLoading(false);
    }
  };

  const updateBidding = async (body) => {
    const res = await server({
      method: "post",
      url: "http://localhost:5001/create-bidder",
      data: body,
    });
    await getOrder();

    if (!res?.isSuccess) {
      updateUser(false, body?.index);
    }
  };

  const receiveOrder = async () => {
    const data = await server({
      method: "post",
      url: "http://localhost:5001/create-order",
    });

    if (data) {
      await getOrder();
    }
  };

  const getOrder = async () => {
    const data = await server({
      method: "get",
      url: "http://localhost:5001/get-order",
    });
    const orders = data?.orderJob;
    const bidders = data?.bidderJob;

    setOrderJobs({
      waiting: mappingOrder(orders?.waitingOrderJobs),
      active: [],
      completed: mappingOrder(orders?.completedOrderJobs),
      failed: [],
    });
    setBiddingJobs({
      waiting: mappingBidder(bidders?.waitingBidderJobs),
      active: [],
      completed: mappingBidder(bidders?.completedBidderJobs),
      failed: [],
    });
    bidders?.waitingBidderJobs.forEach((job)=>{
      const id = job.split(" ")[0].split("_")[1]
      console.log(id)
      updateUser(true, id)
    })
  };

  const mappingOrder = (data = []) => {
    return data.map((item) => {
      const [id, name, time] = item?.split(" ");
      return { id, name, timestamp: +time };
    });
  };

  const mappingBidder = (data = []) => {
    return data.map((item) => {
      const [name, time] = item?.split(" ");
      return { name, timestamp: +time };
    });
  };

  const updateUser = (isOnline = false, index = 0) =>
    setUsers((prev) =>
      prev.map((x, _i) => (Number(index) === _i ? { online: isOnline } : x))
    );

  const displayOrders = [
    {
      label: `waiting (${orderJobs.waiting.length})`,
      data: orderJobs.waiting,
      color: "orange",
    },
    {
      label: `active (${orderJobs.active.length})`,
      data: orderJobs.active,
      color: "#4CC9FE",
    },
    {
      label: `completed (${orderJobs.completed.length})`,
      data: orderJobs.completed,
      color: "#5CB338",
    },
    {
      label: `failed (${orderJobs.failed.length})`,
      data: orderJobs.failed,
      color: "red",
      hide: true,
    },
  ];

  const displayBidderLogs = [
    {
      label: `waiting (${bidderJobs.waiting.length})`,
      data: bidderJobs.waiting,
      color: "orange",
    },
    {
      label: `active (${bidderJobs.active.length})`,
      data: bidderJobs.active,
      color: "#4CC9FE",
    },
    {
      label: `completed (${bidderJobs.completed.length})`,
      data: bidderJobs.completed,
      color: "#5CB338",
    },
    {
      label: `failed (${bidderJobs.failed.length})`,
      data: bidderJobs.failed,
      color: "red",
      hide: true,
    },
  ];

  return (
    <div className="App">
      <div style={{ width: "80vw", marginBlock: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <p>{`loading state: ${loading ? "loading..." : "-"}`}</p>
          <button
            style={{ fontWeight: 600, fontSize: 20, background: "#4CC9FE" }}
            onClick={receiveOrder}
          >
            {"Create Order"}
          </button>
        </div>
        <h1>{`Bidders (${users.length})`}</h1>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 10,
          }}
        >
          {users.map((item, i) => (
            <div
              key={`bid-${i}`}
              style={{
                background: "#ddd",
                padding: 5,
                flex: 1,
              }}
            >
              <h3 style={{ textAlign: "center" }}>{`bidder_id: ${i}`}</h3>
              <div
                style={{
                  display: "flex",
                  columnGap: 10,
                  justifyContent: "center",
                }}
              >
                <button
                  disabled={item?.online}
                  style={{
                    color: "white",
                    background: !item?.online ? "green" : undefined,
                    fontWeight: "bold",
                  }}
                  onClick={() => {
                    updateBidding({
                      user: `bidding_${i}`,
                      online: true,
                      index: i,
                    });
                    updateUser(true, i);
                  }}
                >
                  online
                </button>
                <button
                  disabled={!item?.online}
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    background: item?.online ? "red" : undefined,
                  }}
                  onClick={() => {
                    updateBidding({ user: `Bidding ${i}`, online: false });
                    updateUser(false, i);
                  }}
                >
                  offline
                </button>
              </div>
            </div>
          ))}
        </div>
        <br />

        <h1>{`Orders (${Object.values(orderJobs).flat().length})`}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            columnGap: 1,
          }}
        >
          {displayOrders.map((item) => (
            <div
              key={item.label}
              style={{ border: `3px solid ${item.color}`, flex: 1 }}
            >
              <h3 style={{ textAlign: "center", color: item.color }}>
                {item.label}
              </h3>
              {!item.hide &&
                item.data?.map((x, i) => (
                  <p
                    style={{ paddingLeft: 10 }}
                    key={`order-${i}`}
                  >{`order_id_${x?.id}  (${dayjs(x?.timestamp).format(
                    "HH:mm:ss"
                  )})`}</p>
                ))}
            </div>
          ))}
        </div>

        <h1>{`Log bidders (${Object.values(orderJobs).flat().length})`}</h1>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            columnGap: 1,
          }}
        >
          {displayBidderLogs.map((item) => (
            <div
              key={item.label}
              style={{ border: `3px solid ${item.color}`, flex: 1 }}
            >
              <h3 style={{ textAlign: "center", color: item.color }}>
                {item.label}
              </h3>
              {!item.hide &&
                item.data?.map((x, i) => (
                  <p style={{ paddingLeft: 10 }} key={`order-${i}`}>{`${
                    x?.name
                  }  (${dayjs(x?.timestamp).format("HH:mm:ss")})`}</p>
                ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;