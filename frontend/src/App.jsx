import { useEffect, useState } from "react";
import "./App.css";

const API = "http://localhost:8081/api/queue";

function App() {
  const [page, setPage] = useState("customer");

  const [queue, setQueue] = useState([]);
  const [loading, setLoading] = useState(true);

  // Customer states
  const [customerName, setCustomerName] = useState("");
  const [ticket, setTicket] = useState(null);
  const [joining, setJoining] = useState(false);
  const [message, setMessage] = useState("");

  // Admin states
  const [actionMessage, setActionMessage] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch queue
  const fetchQueue = async () => {
    try {
      const response = await fetch(API);

      if (!response.ok) {
        throw new Error("Failed to fetch queue");
      }

      const data = await response.json();

      setQueue(data);
      setLoading(false);

      // Update customer's live ticket
      if (ticket) {
        const updatedTicket = data.find(
          (customer) => customer.id === ticket.id
        );

        if (updatedTicket) {
          setTicket(updatedTicket);
        }
      }
    } catch (error) {
      console.error("Error fetching queue:", error);
      setLoading(false);
    }
  };

  // Automatically refresh every 5 seconds
  useEffect(() => {
    fetchQueue();

    const interval = setInterval(fetchQueue, 5000);

    return () => clearInterval(interval);
  }, [ticket?.id]);

  // Customer joins queue
  const handleJoinQueue = async (e) => {
    e.preventDefault();

    const name = customerName.trim();

    if (!name) {
      setMessage("Please enter your name.");
      return;
    }

    if (name.length > 30) {
      setMessage("Name cannot exceed 30 characters.");
      return;
    }

    if (!/^[a-zA-Z ]+$/.test(name)) {
      setMessage("Please enter a valid name using letters only.");
      return;
    }

    try {
      setJoining(true);
      setMessage("");

      const response = await fetch(`${API}/join`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerName: name,
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to join queue");
      }

      const data = await response.json();

      setTicket(data);
      setCustomerName("");
      setMessage("Successfully joined the queue!");

      await fetchQueue();
    } catch (error) {
      console.error(error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  // Admin actions with all three confirmations
  const handleAction = async (endpoint) => {

    // Confirmation before calling next customer
    if (endpoint === "call-next") {
      const confirmed = window.confirm(
        "Are you sure you want to call the next customer?"
      );

      if (!confirmed) return;
    }

    // Confirmation before skipping customer
    if (endpoint === "skip-next") {
      const confirmed = window.confirm(
        "Are you sure you want to skip the next customer?"
      );

      if (!confirmed) return;
    }

    // Confirmation before completing service
    if (endpoint === "complete") {
      const confirmed = window.confirm(
        "Are you sure you want to mark the current service as completed?"
      );

      if (!confirmed) return;
    }

    try {
      setActionLoading(true);
      setActionMessage("Processing action...");

      const response = await fetch(`${API}/${endpoint}`, {
        method: "POST",
      });

      if (!response.ok) {
        setActionMessage("Action failed. Please try again.");
        return;
      }

      await fetchQueue();

      if (endpoint === "call-next") {
        setActionMessage("Next customer called successfully!");
      } else if (endpoint === "skip-next") {
        setActionMessage("Customer skipped successfully!");
      } else if (endpoint === "complete") {
        setActionMessage("Service completed successfully!");
      }

      setTimeout(() => {
        setActionMessage("");
      }, 3000);

    } catch (error) {
      console.error(error);
      setActionMessage("Unable to connect to the server.");
    } finally {
      setActionLoading(false);
    }
  };

  // Queue calculations
  const waiting = queue.filter(
    (c) => c.status === "WAITING"
  );

  const serving = queue.filter(
    (c) => c.status === "SERVING"
  );

  const completed = queue.filter(
    (c) => c.status === "COMPLETED"
  );

  const skipped = queue.filter(
    (c) => c.status === "SKIPPED"
  );

  // Show only customers whose service is not yet completed
  // Completed customers remain in the database and statistics.
  const activeQueue = queue.filter(
    (c) => c.status !== "COMPLETED"
  );

  return (
    <div className="app-container">

      {/* HEADER */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">Q</div>

          <div>
            <h1>QueueLess</h1>
            <p>Smart Queue Management</p>
          </div>
        </div>

        <nav className="navigation">

          <button
            className={page === "customer" ? "nav-active" : ""}
            onClick={() => setPage("customer")}
          >
            Customer Portal
          </button>

          <button
            className={page === "admin" ? "nav-active" : ""}
            onClick={() => setPage("admin")}
          >
            Admin Dashboard
          </button>

        </nav>

      </header>

      <main className="main-content">

        {/* CUSTOMER PORTAL */}

        {page === "customer" ? (

          <>

            <section className="welcome-section">

              <span className="eyebrow">
                SMART QUEUE EXPERIENCE
              </span>

              <h2>Welcome to QueueLess</h2>

              <p>
                Join the queue digitally, track your position
                and save valuable time.
              </p>

            </section>

            {!ticket ? (

              <section className="join-card">

                <div className="card-icon">🎟️</div>

                <h2>Join the Queue</h2>

                <p>
                  Enter your name to generate your digital
                  appointment ticket.
                </p>

                <form onSubmit={handleJoinQueue}>

                  <label>Your Name</label>

                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={customerName}
                    onChange={(e) => {
                      setCustomerName(e.target.value);
                      setMessage("");
                    }}
                  />

                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={joining}
                  >
                    {joining ? "Joining..." : "Join Queue →"}
                  </button>

                </form>

                {message && (
                  <p className="customer-message">
                    {message}
                  </p>
                )}

              </section>

            ) : (

              /* DIGITAL TICKET */

              <section className="digital-ticket">

                <div className="ticket-top">

                  <div>
                    <h2>QueueLess</h2>
                    <p>APPOINTMENT TICKET</p>
                  </div>

                  <span className="ticket-icon">🎫</span>

                </div>

                <div className="ticket-divider"></div>

                <p className="ticket-label">
                  YOUR TOKEN NUMBER
                </p>

                <h1 className="ticket-number">
                  #{ticket.tokenNumber}
                </h1>

                <span
                  className={`status ${ticket.status.toLowerCase()}`}
                >
                  {ticket.status}
                </span>

                <div className="ticket-divider"></div>

                <div className="ticket-details">

                  <div>
                    <span>Customer Name</span>
                    <strong>{ticket.customerName}</strong>
                  </div>

                  <div>
                    <span>Queue Position</span>

                    <strong>
                      {ticket.status === "WAITING"
                        ? ticket.queuePosition ?? "-"
                        : "-"}
                    </strong>
                  </div>

                  <div>
                    <span>Estimated Waiting Time</span>

                    <strong>
                      {ticket.estimatedWaitMinutes ?? 0} minutes
                    </strong>
                  </div>

                </div>

                {ticket.status === "COMPLETED" && (
                  <p className="ticket-message">
                    Your service has been completed. Thank you!
                  </p>
                )}

                {ticket.status === "SKIPPED" && (
                  <p className="ticket-message">
                    Your token has been skipped.
                    Please contact the administrator.
                  </p>
                )}

                {ticket.status === "SERVING" && (
                  <p className="ticket-message">
                    It is your turn! Please proceed to the service counter.
                  </p>
                )}

                <div className="ticket-divider"></div>

                <p className="ticket-footer">
                  Please keep this ticket until your service is completed.
                </p>

                <button
                  className="primary-btn"
                  onClick={() => {
                    setTicket(null);
                    setMessage("");
                  }}
                >
                  Join Another Queue
                </button>

              </section>

            )}

          </>

        ) : (

          /* ADMIN DASHBOARD */

          <>

            <section className="dashboard-heading">

              <div>
                <span className="eyebrow">
                  ADMINISTRATION
                </span>

                <h2>Dashboard Overview</h2>

                <p>
                  Monitor customers and manage queue activity.
                </p>
              </div>

              <span className="live-indicator">
                <span></span>
                Live Updates
              </span>

            </section>

            {loading ? (

              <div className="loading-box">
                Loading Dashboard...
              </div>

            ) : (

              <>

                {/* STATISTICS */}

                <section className="stats-grid">

                  <div className="stat-card">
                    <div className="stat-icon purple">👥</div>
                    <p>Total Customers</p>
                    <h2>{queue.length}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon orange">⏳</div>
                    <p>Waiting</p>
                    <h2>{waiting.length}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon blue">🔔</div>
                    <p>Currently Serving</p>
                    <h2>{serving.length}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon green">✓</div>
                    <p>Completed</p>
                    <h2>{completed.length}</h2>
                  </div>

                  <div className="stat-card">
                    <div className="stat-icon red">↗</div>
                    <p>Skipped</p>
                    <h2>{skipped.length}</h2>
                  </div>

                </section>

                {/* QUEUE CONTROLS */}

                <section className="admin-panel">

                  <div className="section-heading">

                    <div>
                      <h2>Queue Controls</h2>
                      <p>Manage the current customer queue.</p>
                    </div>

                  </div>

                  <div className="admin-buttons">

                    <button
                      className="call-btn"
                      onClick={() => handleAction("call-next")}
                      disabled={
                        waiting.length === 0 || actionLoading
                      }
                    >
                      📢 Call Next Customer
                    </button>

                    <button
                      className="skip-btn"
                      onClick={() => handleAction("skip-next")}
                      disabled={
                        waiting.length === 0 || actionLoading
                      }
                    >
                      ⏭ Skip Customer
                    </button>

                    <button
                      className="complete-btn"
                      onClick={() => handleAction("complete")}
                      disabled={
                        serving.length === 0 || actionLoading
                      }
                    >
                      ✓ Complete Service
                    </button>

                  </div>

                  {actionMessage && (
                    <p className="action-message">
                      {actionMessage}
                    </p>
                  )}

                  {waiting.length === 0 && (
                    <p className="availability-message">
                      No customers are currently waiting.
                    </p>
                  )}

                  {serving.length === 0 && (
                    <p className="availability-message">
                      No customer is currently being served.
                    </p>
                  )}

                </section>

                {/* CUSTOMER QUEUE TABLE */}

                <section className="queue-section">

                  <div className="section-heading">

                    <div>
                      <h2>Customer Queue</h2>
                      <p>
                        Real-time overview of customers in the active queue.
                      </p>
                    </div>

                    <span className="customer-count">
                      {activeQueue.length} Active Customers
                    </span>

                  </div>

                  <div className="table-container">

                    <table>

                      <thead>
                        <tr>
                          <th>Token</th>
                          <th>Customer</th>
                          <th>Status</th>
                          <th>Position</th>
                          <th>Estimated Wait</th>
                        </tr>
                      </thead>

                      <tbody>

                        {activeQueue.length === 0 ? (

                          <tr>
                            <td colSpan="5" className="empty-table">
                              No active customers in the queue.
                            </td>
                          </tr>

                        ) : (

                          activeQueue.map((customer) => (

                            <tr key={customer.id}>

                              <td className="token-cell">
                                #{customer.tokenNumber}
                              </td>

                              <td>
                                {customer.customerName}
                              </td>

                              <td>
                                <span
                                  className={`status ${customer.status.toLowerCase()}`}
                                >
                                  {customer.status}
                                </span>
                              </td>

                              <td>
                                {customer.status === "WAITING"
                                  ? customer.queuePosition ?? "-"
                                  : "-"}
                              </td>

                              <td>
                                {customer.estimatedWaitMinutes ?? 0} min
                              </td>

                            </tr>

                          ))

                        )}

                      </tbody>

                    </table>

                  </div>

                </section>

              </>

            )}

          </>

        )}

      </main>

      <footer className="footer">
        <p>QueueLess © 2026 | Smart Queue Management System</p>
      </footer>

    </div>
  );
}

export default App;