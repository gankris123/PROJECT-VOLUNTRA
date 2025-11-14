function login() {
     const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const message = document.getElementById("message");


    if (email === "" || pass === "") {
        message.textContent = "Please enter both email and password.";
        return;
    
}

if (email === "admin@edu.com" && pass === "1234") {
        message.style.color = "green";
        message.textContent = "Login successful! Redirecting...";
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1200);
    } else {
        message.textContent = "Invalid email or password.";
    }
}
