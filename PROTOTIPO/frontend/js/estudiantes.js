document.addEventListener('DOMContentLoaded', function () {
    fetch('/usuario/estudiantes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
    })
        .then(response => response.json())
        .then(data => {
            mostrarResultado(data.body); // Usamos el campo `body` del objeto
        })
        .catch(error => console.error('Error:', error));
});

function mostrarResultado(estudiantes) {
    const estudiantesList = document.getElementById('estudiantesList');
    estudiantesList.innerHTML = ''; // Limpiar contenido previo

    if (estudiantes && estudiantes.length > 0) {
        // Crear la tabla
        const tabla = document.createElement('table');
        tabla.className = 'tabla-estudiantes';

        // Crear encabezado de la tabla
        const thead = document.createElement('thead');
        thead.innerHTML = `
            <tr>
                <th>Nombre</th>
                <th>Apellido</th>
                <th>Curso</th>
                <th>Paralelo</th>
                <th>Puntaje</th>
            </tr>
        `;
        tabla.appendChild(thead);

        // Crear cuerpo de la tabla
        const tbody = document.createElement('tbody');
        
        estudiantes.forEach(estudiante => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${estudiante.nombre}</td>
                <td>${estudiante.apellido}</td>
                <td>${estudiante.curso}</td>
                <td>${estudiante.paralelo}</td>
                <td>${estudiante.puntaje}</td>
            `;
            tbody.appendChild(tr);
        });

        tabla.appendChild(tbody);
        estudiantesList.appendChild(tabla);
    } else {
        // Mostrar un mensaje si no hay estudiantes
        estudiantesList.innerHTML = '<p>No se encontraron estudiantes.</p>';
    }
}