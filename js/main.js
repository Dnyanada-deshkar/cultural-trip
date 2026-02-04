document.getElementById("tripForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const days = document.getElementById("days").value;
  const budget = document.getElementById("budget").value;
  const interests = [...document.querySelectorAll("input[type=checkbox]:checked")]
                    .map(i => i.value);

  const tripData = { city, days, budget, interests };

  localStorage.setItem("tripData", JSON.stringify(tripData));
  window.location.href = "pages/plan.html";
});
