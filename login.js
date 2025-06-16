function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username === "teacher" && password === "admin123") {
    localStorage.setItem("loggedIn", true);
    window.location.href = "dashboard.html";
  } else {
    document.getElementById("error").textContent = "Invalid credentials";
  }
}
if (localStorage.getItem("loggedIn")) {
  window.location.href = "dashboard.html";
}
