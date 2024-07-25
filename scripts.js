document.addEventListener("DOMContentLoaded", function () {
    const API_URL = "https://cake-shop---cindy.glitch.me";

    // Smooth scroll for nav links (if any)
    const links = document.querySelectorAll("nav a");
    for (const link of links) {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const section = document.querySelector(this.getAttribute("href"));
            section.scrollIntoView({ behavior: "smooth" });
        });
    }

    // Fetch cakes from API
    function fetchCakes() {
        fetch(`${API_URL}/cakes`)
            .then(response => response.json())
            .then(cakes => {
                const cakesList = document.getElementById("cakes");
                cakesList.innerHTML = cakes.map(cake => `
                    <li>
                        <strong>${cake.name}</strong> (ID: ${cake.id}) - €${cake.price.toFixed(2)}
                    </li>
                `).join('');
            })
            .catch(error => console.error("Error fetching cakes:", error));
    }

    // Fetch orders from API
    function fetchOrders() {
        fetch(`${API_URL}/orders`)
            .then(response => response.json())
            .then(orders => {
                const ordersList = document.getElementById("orders");
                ordersList.innerHTML = orders.map(order => `
                    <li data-order-id="${order.id}">
                        <strong>Customer:</strong> ${order.customer} 
                        <strong>Cake ID:</strong> ${order.cakeId}
                        <button class="delete-button">Delete</button>
                    </li>
                `).join('');

                attachDeleteEventListeners(); // Ensure this is called after updating the DOM
            })
            .catch(error => console.error("Error fetching orders:", error));
    }

    function attachDeleteEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(button => {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent triggering other click events
                const orderId = this.parentElement.getAttribute("data-order-id");
                if (confirm("Are you sure you want to delete this order?")) {
                    deleteOrder(orderId);
                }
            });
        });
    }

    function deleteOrder(orderId) {
        fetch(`${API_URL}/orders/${orderId}`, {
            method: "DELETE"
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to delete order.");
                }
                alert("Order deleted successfully.");
                fetchOrders(); // Refresh the orders list after deletion
            })
            .catch(error => {
                console.error("Error deleting order:", error);
                alert("Error deleting order. Please try again.");
            });
    }

    // Handle new order form submission
    document.getElementById("orderForm").addEventListener("submit", function (event) {
        event.preventDefault();

        const customer = document.getElementById("customer").value;
        const cakeId = parseInt(document.getElementById("cakeId").value);
        const errorMessageElement = document.getElementById("error-message");

        if (!customer || !cakeId) {
            errorMessageElement.textContent = "Please provide both customer name and cake ID.";
            return;
        }

        const order = { customer, cakeId };

        fetch(`${API_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(order)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(error => {
                        throw new Error(error.error); // Error handling
                    });
                }
                return response.json();
            })
            .then(data => {
                errorMessageElement.textContent = ""; // Clear error messages
                alert("Order placed: " + data.message); // Success message
                fetchOrders(); // Refresh order list
            })
            .catch(error => {
                console.error("Error placing order:", error);
                errorMessageElement.textContent = error.message; // Display error message
            });
    });

    // Initial fetch to display cakes and orders
    fetchCakes();
    fetchOrders();
});
