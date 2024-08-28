document.addEventListener('DOMContentLoaded', (event) => {
    const entradaNota = document.getElementById('entradaNota');
    const botonAñadirNota = document.getElementById('botonAñadirNota');
    const listaNotas = document.getElementById('listaNotas');
    const entradaEditarNota = document.getElementById('entradaEditarNota');
    const botonGuardarCambios = document.getElementById('botonGuardarCambios');
    const inputBusqueda = document.getElementById('inputBusqueda');
    const contadorCompletadas = document.querySelector('.contenedor h3');
    let notaAEditar = null;

    // Cargar notas desde localStorage
    const cargarNotas = () => {
        const notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        listaNotas.innerHTML = '';
        notas.forEach(nota => {
            agregarNotaALista(nota.texto, nota.completada);
        });
        actualizarContadorCompletadas();
    };

    // Guardar notas en localStorage
    const guardarNotas = (notas) => {
        localStorage.setItem('JSONnotas', JSON.stringify(notas));
    };

    // Añadir nota a la lista
    const agregarNotaALista = (texto, completada) => {
        const li = document.createElement('li');
        li.className = 'item-lista d-flex justify-content-between align-items-center';
        li.innerHTML = `
            <input type="checkbox" ${completada ? 'checked' : ''}>
            <span class="notas-texto">${texto}</span>
            <div class="btn-group">
                <button class="btn btn-editar btn-sm btn-custom boton-editar">Editar</button>
                <button class="btn btn-eliminar btn-sm btn-custom boton-eliminar">Eliminar</button>
            </div>
        `;

        const checkbox = li.querySelector('input[type="checkbox"]');
        const botonEditar = li.querySelector('.boton-editar');
        const botonEliminar = li.querySelector('.boton-eliminar');
        
        checkbox.addEventListener('change', () => {
            const textoNota = checkbox.nextElementSibling.textContent;
            cambiarEstadoCompletado(textoNota, checkbox.checked);
        });
        botonEditar.addEventListener('click', () => {
            comenzarEdicion(texto);
        });
        botonEliminar.addEventListener('click', () => {
            confirmarEliminacion(texto);
        });
        listaNotas.appendChild(li);
    };

    // Cambiar el estado de completado de una nota
    const cambiarEstadoCompletado = (textoNota, completada) => {
        let notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        notas = notas.map(nota => nota.texto === textoNota ? { ...nota, completada } : nota);
        guardarNotas(notas);
        actualizarContadorCompletadas();
    };

    // Actualizar contador de notas completadas
    const actualizarContadorCompletadas = () => {
        const notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        const completadas = notas.filter(nota => nota.completada).length;
        contadorCompletadas.textContent = `Notas Completadas: ${completadas}`;
    };

    // Empezar a editar una nota
    const comenzarEdicion = (texto) => {
        notaAEditar = texto;
        entradaEditarNota.value = texto;
        $('#modalEditarNota').modal('show');
    };

    // Guardar nota editada
    const guardarEdicionNota = () => {
        const nuevaNota = entradaEditarNota.value.trim();
        if (nuevaNota === '') {
            alert('Error, no se puede guardar el nombre de una nota vacio.');
            return;
        }
        let notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        notas = notas.map(nota => nota.texto === notaAEditar ? { ...nota, texto: nuevaNota } : nota);
        guardarNotas(notas);
        cargarNotas();
        $('#modalEditarNota').modal('hide');
    };

    // Añadir nueva nota
    const añadirNota = () => {
        const textoNota = entradaNota.value.trim();
        if (textoNota === '') {
            alert('Por favor ingrese una nota en el campo.');
            return;
        }
        const notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        notas.push({ texto: textoNota, completada: false });
        guardarNotas(notas);
        agregarNotaALista(textoNota, false);
        entradaNota.value = '';
    };

    // Confirmar eliminación de nota
    const confirmarEliminacion = (textoNota) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta nota?')) {
            eliminarNota(textoNota);
        }
    };

    // Eliminar nota
    const eliminarNota = (textoNota) => {
        let notas = JSON.parse(localStorage.getItem('JSONnotas')) || [];
        notas = notas.filter(nota => nota.texto !== textoNota);
        guardarNotas(notas);
        cargarNotas();
    };

    // Filtrar notas por búsqueda
    const filtrarNotas = () => {
        const textoBusqueda = inputBusqueda.value.toLowerCase();
        const notas = Array.from(listaNotas.children);
        notas.forEach(nota => {
            const textoNota = nota.querySelector('.notas-texto').textContent.toLowerCase();
            if (textoNota.includes(textoBusqueda)) {
                nota.classList.remove('hidden');
            } else {
                nota.classList.add('hidden');
            }
        });
    };

    botonAñadirNota.addEventListener('click', añadirNota);
    entradaNota.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            añadirNota();
        }
    });

    botonGuardarCambios.addEventListener('click', guardarEdicionNota);

    inputBusqueda.addEventListener('input', filtrarNotas);

    // Cargar notas al iniciar
    cargarNotas();
});