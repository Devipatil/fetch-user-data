const API_URL = "https://jsonplaceholder.typicode.com/users";

const userContainer = document.getElementById("user-container");
const reloadBtn = document.getElementById("reloadBtn");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");

// Timeout function to control fetch delay
function fetchWithTimeout(url, options = {}, timeout = 3000) {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Request Timeout")), timeout)
    )
  ]);
}

// Show loading message inside the container
function renderLoading() {
  userContainer.innerHTML = `
    <div class="loading-message">Loading user data...</div>
  `;
  console.log("Fetching user data: Loading message displayed.");
}

// Fetch and display user data
async function fetchUsers() {
  console.log("Fetching user data...");

  errorMsg.classList.add("hidden");
  loadingMsg.classList.add("hidden");

  renderLoading();

  try {
    const response = await fetchWithTimeout(API_URL, {}, 4000); // timeout 4 sec

    if (!response.ok) {
      throw new Error("Failed to fetch data. Status: " + response.status);
    }

    const users = await response.json();
    console.log("Data fetched successfully:", users);

    userContainer.innerHTML = ""; // clear loading

    users.forEach(user => {
      const card = document.createElement("div");
      card.className = "user-card";

      card.innerHTML = `
        <h3>${user.name}</h3>
        <p><strong>Email:</strong>
          <span class="email">${user.email}</span>
        </p>
        <p><strong>Address:</strong> ${user.address.street}, ${user.address.city}</p>
      `;

      userContainer.appendChild(card);
    });

  } catch (error) {
    console.error("Error fetching data:", error);

    userContainer.innerHTML = "";
    errorMsg.textContent = "Unable to load data. Please check your internet connection.";
    errorMsg.classList.remove("hidden");
  }
}

// Reload button event
reloadBtn.addEventListener("click", () => {
  console.log("Reload button clicked");
  fetchUsers();
});

// Initial load
fetchUsers();
