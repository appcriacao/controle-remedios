
function login() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      localStorage.setItem('email', email);
      window.location.href = 'app.html';
    } else {
      alert(data.error);
    }
  });
}

function registrar() {
  const email = document.getElementById('email').value;
  const senha = document.getElementById('senha').value;

  fetch('http://localhost:3000/api/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, senha })
  })
  .then(res => res.json())
  .then(data => {
    if (data.sucesso) {
      alert('Registrado com sucesso!');
    } else {
      alert(data.error);
    }
  });
}
