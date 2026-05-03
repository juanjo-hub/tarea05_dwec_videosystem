"use strict";

/* VideoSystemApp.js - Arranque del MVC
 * DWEC07 Punto 8. Carga de datos con fetch desde JSON
 */

window.addEventListener('load', () => {

    const model = VideoSystem.getInstance('VideoSystem');
    const view = new VideoSystemView();
    const controller = new VideoSystemController(model, view);

    // DWEC07 Punto 8.Cargar datos iniciales desde el servidor con fetch
    const url = new URL('data/videosystem.json', window.location.href);

    fetch(url, { method: 'get' })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al cargar los datos: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            controller.onLoad(data);
        })
        .catch((error) => {
            console.error('VideoSystem — Error cargando datos:', error);
            view.showToast('Error al cargar los datos de la aplicación.', 'error');
        });
});
