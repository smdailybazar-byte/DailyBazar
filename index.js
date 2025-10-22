(function(){
  const ADMIN_EMAIL = "admin@dailybazar.com";
  const ADMIN_PASS  = "dailybazar123";
  const loginForm = document.getElementById("loginForm");
  const toast = document.getElementById("toast");
  const togglePw = document.getElementById("togglePw");
  const pwInput = document.getElementById("password");
  const emailInput = document.getElementById("email");

  function showToast(msg){
    toast.textContent = msg;
    toast.classList.add("show");
    setTimeout(()=> toast.classList.remove("show"), 2400);
  }

  togglePw.addEventListener("click", function(){
    if(pwInput.type === "password"){ pwInput.type = "text"; togglePw.innerHTML = "👁️"; }
    else { pwInput.type = "password"; togglePw.innerHTML = ""; }
  });

  loginForm.addEventListener("submit", function(e){
    e.preventDefault();
    const email = (emailInput.value || "").trim();
    const pass  = (pwInput.value || "").trim();

    if(email === ADMIN_EMAIL && pass === ADMIN_PASS){
      localStorage.setItem("dailybazar_logged_in", "true");
      // small safety token (not secure server-side; for client-side gate)
      localStorage.setItem("dailybazar_token", btoa(email + ":" + Date.now()));
      showToast("Login successful — redirecting...");
      setTimeout(()=> window.location.href = "./Dashboard/Dashboard.html", 700);
    } else {
      showToast("Invalid email or password");
    }
  });

  // If someone opens index while already logged in, redirect to dashboard
  if(localStorage.getItem("dailybazar_logged_in") === "true"){
    // If already on index.html, go to dashboard
    if(window.location.pathname.endsWith("/index.html") || window.location.pathname.endsWith("/")){
      setTimeout(()=> window.location.href = "./Dashboard/Dashboard.html", 400);
    }
  }
})();
