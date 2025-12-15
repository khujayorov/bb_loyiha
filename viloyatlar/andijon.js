const form = document.getElementById("registerForm");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const email = document.getElementById("email").value.trim();
  const date = document.getElementById("date").value;

  if (!name || !phone || !email || !date) {
    result.style.color = "crimson";
    result.textContent = "Iltimos, barcha maydonlarni to'ldiring.";
    return;
  }

  result.style.color = "green";
  result.textContent = `Rahmat, ${name}! Siz Andijon sayohatiga ro'yxatdan o'tdingiz.`;

  form.reset();
});
