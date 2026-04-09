$(document).ready(function () {

    // =========================================
    // 1. ABRIR MODAL PARA NUEVO REGISTRO
    // =========================================
    $('.btn-primary').on('click', function () {
        $('#formAlumno')[0].reset();
        $('#opcion').val('1');
        $('#modalTitulo').text('Registrar Nuevo Alumno');
        $('#password').attr('required', true);
        $('#modalAlumno').fadeIn();
    });

    // =========================================
    // 2. CERRAR MODAL
    // =========================================
    $('.btn-cerrar-modal').on('click', function () {
        $('#modalAlumno').fadeOut();
    });

    // =========================================
    // 3. GUARDAR (CREAR / EDITAR)
    // =========================================
    $('#formAlumno').submit(function (e) {
        e.preventDefault();

        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: $(this).serialize(),

            success: function (respuesta) {
                if (respuesta.exito) {
                    $('#modalAlumno').fadeOut();

                    Swal.fire({
                        icon: 'success',
                        title: '¡Éxito!',
                        text: respuesta.mensaje
                    }).then(() => {
                        cargarAlumnos(); 
                    });

                } else {
                    Swal.fire('Error', respuesta.mensaje, 'error');
                }
            },
            error: function () {
                Swal.fire('Error', 'Problema con el servidor', 'error');
            }
        });
    });

    // =========================================
    // 4. ELIMINAR
    // =========================================
    $(document).on('click', '.fa-trash', function () {
        let fila = $(this).closest('tr');
        let idAlumno = fila.find('td:eq(0)').text();

        Swal.fire({
            title: '¿Eliminar Alumno?',
            text: "No podrás revertir esto",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar'
        }).then((result) => {
            if (result.isConfirmed) {
                $.ajax({
                    url: "php/crud_alumnos.php",
                    type: "POST",
                    dataType: "json",
                    data: { opcion: 3, id_alumno: idAlumno },

                    success: function (respuesta) {
                        if (respuesta.exito) {
                            fila.remove();
                            Swal.fire('Eliminado', respuesta.mensaje, 'success');
                        }
                    }
                });
            }
        });
    });

    // =========================================
    // 5. EDITAR (CARGAR DATOS EN MODAL)
    // =========================================
    $(document).on('click', '.fa-pen-to-square', function () {
        let fila = $(this).closest('tr');

        let idAlumno = fila.find('td:eq(0)').text();
        let nombres = fila.find('td:eq(1)').text();
        let apellidos = fila.find('td:eq(2)').text();
        let dni = fila.find('td:eq(3)').text();
        let fecha = fila.find('td:eq(4)').text();
        let celular = fila.find('td:eq(5)').text();
        let correo = fila.find('td:eq(6)').text();
        let estado = fila.find('td:eq(7)').text();

        $('#id_alumno').val(idAlumno);
        $('#opcion').val('2');
        
        $('#dni').val(dni);
        $('#nombres').val(nombres);
        $('#apellidos').val(apellidos);
        $('#fecha_nac').val(fecha);
        $('#celular').val(celular);
        $('#correo').val(correo);
        $('#estado').val(estado);

        $('#modalTitulo').text('Editar Alumno');

        $('#password').removeAttr('required');

        $('#modalAlumno').fadeIn();
    });

    // =========================================
    // 6. CARGAR TABLA DESDE MYSQL
    // =========================================
    function cargarAlumnos() {
        $.ajax({
            url: "php/crud_alumnos.php",
            type: "POST",
            dataType: "json",
            data: { opcion: 4 },

            success: function (data) {
                let tbody = $('#tablaAlumnos');
                tbody.empty();

                $.each(data, function (index, alumno) {

                    let fila = `
                    <tr>
                        <td>${alumno.ID_ALUMNO}</td>
                        <td>${alumno.NOMBRES}</td>
                        <td>${alumno.APELLIDOS}</td>
                        <td>${alumno.DNI_ALUMNO}</td>
                        <td>${alumno.FECHA_NACIMIENTO}</td>
                        <td>${alumno.CELULAR}</td>
                        <td>${alumno.CORREO}</td>
                        <td>
                            <span class="status-badge ${
                                alumno.ESTADO === 'Activo' ? 'status-active' :
                                alumno.ESTADO === 'Inactivo' ? 'status-inactive' :
                                'status-process'
                            }">
                                ${alumno.ESTADO}
                            </span>
                        </td>
                        <td class="action-icons">
                            <i class="fa-solid fa-pen-to-square"></i>
                            <i class="fa-solid fa-trash"></i>
                        </td>
                    </tr>
                    `;

                    tbody.append(fila);
                });
            },
            error: function () {
                console.log("Error al cargar alumnos");
            }
        });
    }

    // =========================================
    // INICIAR CARGA AUTOMÁTICA
    // =========================================
    cargarAlumnos();

});
