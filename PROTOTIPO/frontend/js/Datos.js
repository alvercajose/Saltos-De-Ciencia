document.getElementById('insertar-usuario').addEventListener('submit', function(event) {
  event.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const apellido = document.getElementById('apellido').value;
  const curso = document.getElementById('curso').value;
  const paralelo = document.getElementById('paralelo').value;
  const puntaje = " ";

  fetch('/usuario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, curso, paralelo, puntaje})
  })
  .then(response => response.json())
  .then(data => mostrarResultado('Ingreso satisfactorio',data))
  .catch(error => console.error('Error:', error));

   // Muestra el modal de Bootstrap
      $('#success-modal').modal('show');
});
     