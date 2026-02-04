function saveTrip() {
  const trip = JSON.parse(localStorage.getItem("tripData"));
  let trips = JSON.parse(localStorage.getItem("savedTrips")) || [];
  trips.push(trip);
  localStorage.setItem("savedTrips", JSON.stringify(trips));
  
  // Show success message
  const btn = document.getElementById("saveBtn");
  const originalText = btn.textContent;
  btn.textContent = "✓ Saved!";
  btn.style.background = "linear-gradient(45deg, #27ae60, #229954)";
  
  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = "";
  }, 2000);
}

const btn = document.getElementById("saveBtn");
if (btn) btn.addEventListener("click", saveTrip);

const list = document.getElementById("savedTrips");
if (list) {
  const trips = JSON.parse(localStorage.getItem("savedTrips")) || [];
  
  if (trips.length === 0) {
    list.innerHTML = `
      <div class="card" style="text-align: center; grid-column: 1 / -1;">
        <h3>No Saved Trips Yet</h3>
        <p>Start planning your cultural adventure and save your first trip!</p>
        <button onclick="location.href='../index.html'">Plan Your First Trip</button>
      </div>
    `;
  } else {
    trips.forEach((t, i) => {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
        <h3>${t.city}</h3>
        <p><strong>Duration:</strong> ${t.days} days</p>
        <p><strong>Budget:</strong> ${t.budget}</p>
        <p><strong>Interests:</strong> ${t.interests ? t.interests.join(', ') : 'Not specified'}</p>
        <div style="display: flex; gap: 10px; margin-top: 15px;">
          <button onclick="openTrip(${i})" style="flex: 1;">Open</button>
          <button onclick="deleteTrip(${i})" style="flex: 1; background: linear-gradient(45deg, #e74c3c, #c0392b);">Delete</button>
        </div>
      `;
      list.appendChild(div);
    });
  }
}

function openTrip(i) {
  const trips = JSON.parse(localStorage.getItem("savedTrips"));
  localStorage.setItem("tripData", JSON.stringify(trips[i]));
  window.location.href = "plan.html";
}

function deleteTrip(i) {
  let trips = JSON.parse(localStorage.getItem("savedTrips"));
  trips.splice(i, 1);
  localStorage.setItem("savedTrips", JSON.stringify(trips));
  location.reload();
}
