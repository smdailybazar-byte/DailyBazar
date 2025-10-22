document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  // ✅ Replace with your real admin credentials
  const ADMIN_EMAIL = "admin@dailybazar.com";
  const ADMIN_PASS = "12345";

  if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
    localStorage.setItem("isLoggedIn", "true");
    window.location.href = "./Dashboard/Dashboard.html";
  } else {
    alert("❌ Invalid email or password!");
  }
});

// Optional: prevent dashboard access without login
if (window.location.pathname.includes("Dashboard") && localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html";
}
