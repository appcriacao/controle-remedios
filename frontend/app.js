
const email = localStorage.getItem('email');
let editandoId = null;

function carregar() {
  fetch('http://localhost:3000/api/remedios?email=' + email)
    .then(res => res.json())
    .then(mostrar);
}

function mostrar(lista) {
  const div = document.getElementById('remedios');
  div.innerHTML = '';
  lista.forEach(r => {
    const dataFim = new Date(r.ultimaCompra);
    dataFim.setDate(dataFim.getDate() + r.duracao * r.caixas);
    const diasRestantes = Math.ceil((dataFim - new Date()) / (1000 * 60 * 60 * 24));
    const aviso = diasRestantes <= 7 ? '⚠️' : '';

    div.innerHTML += `
      <p>
        <b>${r.nome}</b> (restam ${diasRestantes} dias) ${aviso}<br>
        <button onclick="editar('${r.id}', '${r.nome}', ${r.duracao}, ${r.caixas}, '${r.ultimaCompra}')">Editar</button>
        <button onclick="deletar('${r.id}')">Deletar</button>
        <button onclick="alertar('${r.nome}')">WhatsApp</button>
      </p>
    `;
  });
}

function salvar() {
  const nome = document.getElementById('nome').value;
  const duracao = document.getElementById('duracao').value;
  const caixas = document.getElementById('caixas').value;
  const ultimaCompra = document.getElementById('ultimaCompra').value;

  const dados = { email, nome, duracao, caixas, ultimaCompra };

  if (editandoId) {
    fetch('http://localhost:3000/api/remedios/' + editandoId, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(carregar);
    editandoId = null;
  } else {
    fetch('http://localhost:3000/api/remedios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados)
    }).then(carregar);
  }
}

function editar(id, nome, duracao, caixas, ultimaCompra) {
  document.getElementById('nome').value = nome;
  document.getElementById('duracao').value = duracao;
  document.getElementById('caixas').value = caixas;
  document.getElementById('ultimaCompra').value = ultimaCompra;
  editandoId = id;
}

function deletar(id) {
  fetch('http://localhost:3000/api/remedios/' + id + '?email=' + email, { method: 'DELETE' })
    .then(carregar);
}

function alertar(nome) {
  const msg = encodeURIComponent(`Olá! O remédio ${nome} está acabando. Favor comprar mais.`);
  const numero = prompt("Digite o número com DDD (ex: 5599999999999):");
  if (numero) {
    window.open(`https://wa.me/${numero}?text=${msg}`);
  }
}

window.onload = carregar;
