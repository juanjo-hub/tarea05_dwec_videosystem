"use strict";

/* VideoSystemForms.js  (DWEC06) Generación y validación de los 3 formularios de la práctica.*/

class VideoSystemForms {

    /**Muestra retroalimentación visual sobre un campo del formulario.
     * Pinta el borde de verde o rojo y muestra el mensaje correspondiente.*/
    static showFeedback(campo, esValido, mensaje) {
        if (!campo) return;

        // Limpiamos las clases de validación previas
        campo.classList.remove('is-valid', 'is-invalid');

        //Añadimos la clase que corresponda según sea válido o no
        if (esValido) {
            campo.classList.add('is-valid');
        } else {
            campo.classList.add('is-invalid');
        }

        //Buscamos el contenedor (form-group) que envuelve al campo
        const contenedor = campo.closest('.form-group') || campo.parentElement;
        if (!contenedor) return;

        // Dentro del contenedor, buscamos los divs de mensaje verde y rojo
        const divValido = contenedor.querySelector('.valid-feedback');
        const divInvalido = contenedor.querySelector('.invalid-feedback');

        //Mostramos u ocultamos el mensaje verde
        if (divValido) {
            divValido.classList.toggle('d-block', esValido);
            divValido.classList.toggle('d-none', !esValido);
        }

        //Mostramos u ocultamos el mensaje rojo
        if (divInvalido) {
            divInvalido.classList.toggle('d-block', !esValido);
            divInvalido.classList.toggle('d-none', esValido);
            if (mensaje && !esValido) divInvalido.textContent = mensaje;
        }
    }

    /*Limpia toda la retroalimentación de un formulario. Quita los bordes verdes/rojos y oculta todos los mensajes*/
    static resetFeedback(formulario) {
        for (const campo of formulario.querySelectorAll('.is-valid, .is-invalid')) {
            campo.classList.remove('is-valid', 'is-invalid');
        }
        for (const divMensaje of formulario.querySelectorAll('.valid-feedback, .invalid-feedback')) {
            divMensaje.classList.remove('d-block');
            divMensaje.classList.add('d-none');
        }
    }

    /* Validación en línea genérica: se asocia al evento change de los campos
     * Cuando el usuario cambia el valor de un campo, comprueba si es válido y muestra el feedback correspondiente*/
    static defaultCheckElement(evento) {
        const campo = evento.currentTarget;
        if (typeof campo.value === 'string') campo.value = campo.value.trim();
        VideoSystemForms.showFeedback(campo, campo.checkValidity());
    }


    /* FORMULARIO 1 – CREAR PRODUCCIÓN*/
    static buildCreateProductionForm({ categorias, actores, directores }) {

        // Preparamos las opciones <option> para cada <select>
        const opcionesCategorias = categorias
            .filter(categoria => categoria.name !== 'Default')
            .map(categoria => `<option value="${categoria.name}">${categoria.name}</option>`)
            .join('');

        const opcionesDirectores = directores
            .map(director => `<option value="${director.toString()}">${director.toString()}</option>`)
            .join('');

        const opcionesActores = actores
            .map(actor => `<option value="${actor.toString()}">${actor.toString()}</option>`)
            .join('');

        return `
        <form name="fNewProduction" novalidate class="vs-form vs-form-3col">
            <h2 class="form-title"><i class="fas fa-plus-circle"></i> Nueva producción</h2>

            <!-- Tipo de producción ocupa las 3 columnas -->
            <div class="form-group form-group-full">
                <label class="form-label">Tipo de producción *</label>
                <div class="radio-row">
                    <label class="radio-pill">
                        <input type="radio" name="prodType" value="Movie" required checked>
                        <span><i class="fas fa-video"></i> Película</span>
                    </label>
                    <label class="radio-pill">
                        <input type="radio" name="prodType" value="Serie" required>
                        <span><i class="fas fa-tv"></i> Serie</span>
                    </label>
                </div>
                <div class="invalid-feedback d-none">Debes elegir un tipo de producción.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <!-- Fila: Título | Fecha | Nacionalidad -->
            <div class="form-group">
                <label class="form-label" for="npTitle">Título *</label>
                <input type="text" id="npTitle" name="npTitle" class="form-control"
                       required minlength="2" maxlength="80" placeholder="Ej. El Padrino">
                <div class="invalid-feedback d-none">Obligatorio (2-80 caracteres) y único.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="npDate">Fecha de publicación *</label>
                <input type="date" id="npDate" name="npDate" class="form-control"
                       required min="1900-01-01" max="${new Date().toISOString().split('T')[0]}">
                <div class="invalid-feedback d-none">Fecha válida (1900 – hoy).</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="npNat">Nacionalidad</label>
                <input type="text" id="npNat" name="npNat" class="form-control"
                       maxlength="40" placeholder="Ej. USA">
                <div class="invalid-feedback d-none">Nacionalidad no válida.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <!-- Fila: Director | Duración/Temporadas | URL imagen -->
            <div class="form-group">
                <label class="form-label" for="npDirector">Director *</label>
                <select id="npDirector" name="npDirector" class="form-control" required>
                    <option value="">-- Selecciona --</option>
                    ${opcionesDirectores}
                </select>
                <div class="invalid-feedback d-none">Selecciona un director.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group" data-only="Movie">
                <label class="form-label" for="npDuration">Duración (min) *</label>
                <input type="number" id="npDuration" name="npDuration" class="form-control"
                       min="1" max="600" step="1" placeholder="Ej. 120">
                <div class="invalid-feedback d-none">Entre 1 y 600 minutos.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group" data-only="Serie" style="display:none;">
                <label class="form-label" for="npSeasons">Temporadas *</label>
                <input type="number" id="npSeasons" name="npSeasons" class="form-control"
                       min="1" max="50" step="1" placeholder="Ej. 5">
                <div class="invalid-feedback d-none">Entre 1 y 50 temporadas.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group">
                <label class="form-label" for="npImage">URL imagen</label>
                <input type="url" id="npImage" name="npImage" class="form-control"
                       placeholder="https://...jpg" pattern="https?://.+\\.(jpg|jpeg|png|gif|webp)(\\?.*)?$">
                <div class="invalid-feedback d-none">URL de imagen válida (jpg, png, gif, webp).</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <!-- Fila: Sinopsis (2 cols) + Mapa (1 col) -->
            <div class="form-group np-sinopsis">
                <label class="form-label" for="npSynopsis">Sinopsis</label>
                <textarea id="npSynopsis" name="npSynopsis" class="form-control"
                          rows="4" maxlength="500" placeholder="Breve sinopsis..."></textarea>
                <div class="invalid-feedback d-none">Sinopsis no válida.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group np-mapa">
                <label class="form-label">
                    <i class="fas fa-map-marker-alt"></i> Localización <small>(opcional)</small>
                </label>
                <!-- DWEC07 - Punto 12: Geocoder con Nominatim/OSM -->
                <div class="np-geocoder">
                    <input type="text" id="npAddress" class="form-control"
                           placeholder="Buscar dirección..." autocomplete="off">
                    <button type="button" id="npSearchBtn" class="btn-secondary np-search-btn"
                            title="Buscar dirección">
                        <i class="fas fa-search"></i>
                    </button>
                </div>
                <div id="npAddressResults" class="np-address-results"></div>
                <div id="np-map" style="height:140px; border:1px solid #3d2858; border-radius:6px; margin-bottom:0.4rem;"></div>
                <div style="display:flex; gap:0.8rem; font-size:0.78rem; color:#cfcfcf;">
                    <span>Lat: <strong id="np-lat-display">—</strong></span>
                    <span>Lng: <strong id="np-lng-display">—</strong></span>
                </div>
                <input type="hidden" id="npLat" name="npLat" value="">
                <input type="hidden" id="npLng" name="npLng" value="">
            </div>

            <!-- Fila: Categorías | Casting (2 cols) -->
            <div class="form-group">
                <label class="form-label" for="npCategories">Categorías * <small>(Ctrl)</small></label>
                <select id="npCategories" name="npCategories" class="form-control" multiple required size="4">
                    ${opcionesCategorias}
                </select>
                <div class="invalid-feedback d-none">Selecciona al menos una.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group np-casting">
                <label class="form-label" for="npActors">Casting * <small>(Ctrl)</small></label>
                <select id="npActors" name="npActors" class="form-control" multiple required size="4">
                    ${opcionesActores}
                </select>
                <div class="invalid-feedback d-none">Selecciona al menos un actor.</div>
                <div class="valid-feedback d-none">Correcto.</div>
                <div id="npActorRoles" class="role-list"></div>
            </div>

            <!-- Botones -->
            <div class="form-actions">
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> Crear producción
                </button>
                <button type="reset" class="btn-secondary">
                    <i class="fas fa-undo"></i> Limpiar
                </button>
            </div>
        </form>
        `;
    }

    /** Inicializa los event listeners del formulario de crear producción.*/
    static initCreateProductionForm(formulario, opciones) {
        const { titulosExistentes, alEnviar } = opciones;

        /* --- Cambio dinámico de campos según el tipo Movie/Serie --- */
        const botonesRadio = formulario.querySelectorAll('input[name="prodType"]');

        const actualizarCamposDinamicos = () => {
            const tipoSeleccionado = formulario.prodType.value;

            for (const grupo of formulario.querySelectorAll('[data-only]')) {
                const esVisible = grupo.dataset.only === tipoSeleccionado;
                grupo.style.display = esVisible ? '' : 'none';

                for (const campo of grupo.querySelectorAll('input')) {
                    if (esVisible) {
                        campo.setAttribute('required', '');
                    } else {
                        campo.removeAttribute('required');
                        campo.value = '';
                        campo.classList.remove('is-valid', 'is-invalid');
                    }
                }
            }
        };

        for (const radio of botonesRadio) {
            radio.addEventListener('change', actualizarCamposDinamicos);
        }
        actualizarCamposDinamicos();

        /*Validación personalizada del título: que sea único */
        const campoTitulo = formulario.npTitle;

        campoTitulo.addEventListener('change', () => {
            campoTitulo.value = campoTitulo.value.trim();

            if (campoTitulo.value && titulosExistentes.includes(campoTitulo.value)) {
                campoTitulo.setCustomValidity('Ya existe una producción con ese título.');
                VideoSystemForms.showFeedback(campoTitulo, false, 'Ya existe una producción con ese título.');
            } else {
                campoTitulo.setCustomValidity('');
                VideoSystemForms.showFeedback(campoTitulo, campoTitulo.checkValidity());
            }
        });

        /*Inputs de rol dinámicos según actores seleccionados */
        const selectActores = formulario.npActors;
        const contenedorRoles = formulario.querySelector('#npActorRoles');

        const actualizarInputsDeRol = () => {
            contenedorRoles.innerHTML = '';

            for (const opcion of selectActores.selectedOptions) {
                const fila = document.createElement('div');
                fila.classList.add('role-item');
                fila.innerHTML = `
                    <span class="role-actor"><i class="fas fa-user"></i> ${opcion.value}</span>
                    <input type="text" class="form-control role-input"
                           data-actor="${opcion.value}"
                           placeholder="Rol / personaje (opcional)" maxlength="60">
                `;
                contenedorRoles.append(fila);
            }
        };

        selectActores.addEventListener('change', actualizarInputsDeRol);

        /*Validación en línea para todos los campos*/
        for (const campo of formulario.querySelectorAll('input, select, textarea')) {
            if (campo.type !== 'radio' && campo.name !== 'npActors') {
                campo.addEventListener('change', VideoSystemForms.defaultCheckElement);
            }
        }

        /* Envío del formulario (submit)*/
        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            let formularioValido = true;
            let primerCampoInvalido = null;

            for (const campo of formulario.querySelectorAll('input, select, textarea')) {
                const grupo = campo.closest('[data-only]');
                if (grupo && grupo.style.display === 'none') continue;

                if (typeof campo.value === 'string') campo.value = campo.value.trim();

                if (!campo.checkValidity()) {
                    VideoSystemForms.showFeedback(campo, false);
                    if (!primerCampoInvalido) primerCampoInvalido = campo;
                    formularioValido = false;
                } else {
                    VideoSystemForms.showFeedback(campo, true);
                }
            }

            if (!formularioValido) {
                if (primerCampoInvalido) primerCampoInvalido.focus();
                return;
            }

            // Recogemos los datos del formulario
            const categoriasSeleccionadas = Array.from(formulario.npCategories.selectedOptions)
                .map(opcion => opcion.value);

            const actoresSeleccionados = Array.from(formulario.npActors.selectedOptions)
                .map(opcion => opcion.value);

            const roles = {};
            for (const inputRol of contenedorRoles.querySelectorAll('.role-input')) {
                roles[inputRol.dataset.actor] = inputRol.value.trim() || 'Sin especificar';
            }

            const datos = {
                type: formulario.prodType.value,
                title: formulario.npTitle.value.trim(),
                publication: new Date(formulario.npDate.value),
                nationality: formulario.npNat.value.trim(),
                synopsis: formulario.npSynopsis.value.trim(),
                image: formulario.npImage.value.trim(),
                director: formulario.npDirector.value,
                categories: categoriasSeleccionadas,
                actors: actoresSeleccionados,
                roles: roles,
            };

            if (datos.type === 'Movie') {
                datos.duration = parseInt(formulario.npDuration.value, 10);
            } else {
                datos.seasons = parseInt(formulario.npSeasons.value, 10);
            }

            // DWEC07 - Punto 10: recoger coordenadas del mapa picker
            if (formulario.npLat.value && formulario.npLng.value) {
                datos.lat = parseFloat(formulario.npLat.value);
                datos.lng = parseFloat(formulario.npLng.value);
            }

            alEnviar(datos);
        });

        /*botón Limpiar */
        formulario.addEventListener('reset', () => {
            VideoSystemForms.resetFeedback(formulario);
            contenedorRoles.innerHTML = '';
            setTimeout(actualizarCamposDinamicos, 0);
            // Limpiar coordenadas al resetear
            formulario.npLat.value = '';
            formulario.npLng.value = '';
            const latDisplay = document.getElementById('np-lat-display');
            const lngDisplay = document.getElementById('np-lng-display');
            if (latDisplay) latDisplay.textContent = '—';
            if (lngDisplay) lngDisplay.textContent = '—';
            if (marcador) {
                marcador.remove();
                marcador = null;
            }
        });

        //DWEC07 - Punto 10.Inicializar mapa picker
        let marcador = null;

        const mapaInicial = [38.990831799999995, -3.9206173000000004];

        const mapaPicker = L.map('np-map').setView(mapaInicial, 13);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(mapaPicker);

        //Al hacer clic en el mapa se guarda la posición en los inputs ocultos.
        //event.latlng.lat / event.latlng.lng
        mapaPicker.on('click', function (event) {
            const lat = event.latlng.lat;
            const lng = event.latlng.lng;

            formulario.npLat.value = lat;
            formulario.npLng.value = lng;

            document.getElementById('np-lat-display').textContent = lat.toFixed(6);
            document.getElementById('np-lng-display').textContent = lng.toFixed(6);

            if (marcador) {
                marcador.setLatLng([lat, lng]);
            } else {
                marcador = L.marker([lat, lng]).addTo(mapaPicker);
            }
            marcador.bindPopup('Localización seleccionada').openPopup();
        });

        //DWEC07 Punto 12.Geocoder con Nominatim
        //Al pulsar el botón de búsqueda construimos la URL con searchParams
        const inputDireccion = document.getElementById('npAddress');
        const botonBuscar = document.getElementById('npSearchBtn');
        const contenedorResultados = document.getElementById('npAddressResults');

        // Función auxiliar que coloca un resultado en el mapa
        const seleccionarResultado = (lat, lng, displayName) => {
            // Mover vista y marcador
            mapaPicker.setView([lat, lng], 14);
            if (marcador) {
                marcador.setLatLng([lat, lng]);
            } else {
                marcador = L.marker([lat, lng]).addTo(mapaPicker);
            }
            marcador.bindPopup(displayName).openPopup();

            // Actualizar inputs ocultos y display
            formulario.npLat.value = lat;
            formulario.npLng.value = lng;
            document.getElementById('np-lat-display').textContent = parseFloat(lat).toFixed(6);
            document.getElementById('np-lng-display').textContent = parseFloat(lng).toFixed(6);
        };

        const buscarDireccion = () => {
            const consulta = inputDireccion.value.trim();
            if (!consulta) return;

            //Construye URL con URL + searchParams
            const url = new URL('https://nominatim.openstreetmap.org/search');
            url.searchParams.append('format', 'json');
            url.searchParams.append('limit', 5);
            url.searchParams.append('q', consulta);

            contenedorResultados.innerHTML = '<p class="np-loading"><i class="fas fa-spinner fa-spin"></i> Buscando...</p>';

            fetch(url, { method: 'get' })
                .then((response) => response.json())
                .then((data) => {
                    contenedorResultados.replaceChildren();
                    if (data.length === 0) {
                        contenedorResultados.innerHTML = '<p class="np-empty">No se encontraron resultados.</p>';
                        return;
                    }
                    //Mostrar lista de resultados clicables
                    const lista = document.createElement('ul');
                    lista.classList.add('np-results-list');
                    data.forEach((direccion) => {
                        const item = document.createElement('li');
                        item.classList.add('np-result-item');
                        item.dataset.lat = direccion.lat;
                        item.dataset.lon = direccion.lon;
                        item.innerHTML = `<i class="fas fa-map-pin"></i> ${direccion.display_name}`;
                        item.addEventListener('click', () => {
                            seleccionarResultado(direccion.lat, direccion.lon, direccion.display_name);
                            // Marcar visualmente el seleccionado
                            lista.querySelectorAll('.np-result-item').forEach(li => li.classList.remove('active'));
                            item.classList.add('active');
                        });
                        lista.append(item);
                    });
                    contenedorResultados.append(lista);

                    //Recalcular tamaño del mapa por si seguía oculto
                    setTimeout(() => mapaPicker.invalidateSize(), 100);
                })
                .catch(() => {
                    contenedorResultados.innerHTML = '<p class="np-error"><i class="fas fa-exclamation-circle"></i> No se ha podido conectar con el servidor de mapas.</p>';
                });
        };

        botonBuscar.addEventListener('click', buscarDireccion);

        //Permitir buscar también pulsando Enter en el input (sin enviar el formulario)
        inputDireccion.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                buscarDireccion();
            }
        });
    }


    /* FORMULARIO 2 – ELIMINAR PRODUCCIÓN */
    static buildDeleteProductionForm({ producciones }) {
        const opcionesProducciones = producciones
            .map(produccion => `<option value="${produccion.title}">${produccion.toString()}</option>`)
            .join('');

        return `
        <form name="fDelProduction" novalidate class="vs-form">
            <h2 class="form-title"><i class="fas fa-trash"></i> Eliminar producción</h2>
            <p class="form-warning">
                <i class="fas fa-exclamation-triangle"></i>
                Al eliminar una producción se desligará automáticamente
                de sus categorías, actores y directores. Esta acción no se puede deshacer.
            </p>

            <div class="form-group form-group-full">
                <label class="form-label" for="dpTitle">Producción a eliminar *</label>
                <select id="dpTitle" name="dpTitle" class="form-control" required>
                    <option value="">-- Selecciona una producción --</option>
                    ${opcionesProducciones}
                </select>
                <div class="invalid-feedback d-none">Debes seleccionar una producción.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-group form-group-full">
                <label class="checkbox-row">
                    <input type="checkbox" id="dpConfirm" name="dpConfirm" required>
                    <span>Confirmo que quiero eliminar esta producción.</span>
                </label>
                <div class="invalid-feedback d-none">Debes confirmar la eliminación.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-danger">
                    <i class="fas fa-trash"></i> Eliminar
                </button>
                <button type="reset" class="btn-secondary">
                    <i class="fas fa-undo"></i> Limpiar
                </button>
            </div>
        </form>
        `;
    }

    /*Inicializa los event listeners del formulario*/
    static initDeleteProductionForm(formulario, opciones) {
        const { alEnviar, tituloPreseleccionado } = opciones;

        if (tituloPreseleccionado) {
            formulario.dpTitle.value = tituloPreseleccionado;
        }

        for (const campo of formulario.querySelectorAll('select, input')) {
            campo.addEventListener('change', (evento) => {
                const campoActual = evento.currentTarget;
                if (campoActual.type === 'checkbox') {
                    VideoSystemForms.showFeedback(campoActual, campoActual.checked);
                } else {
                    VideoSystemForms.defaultCheckElement(evento);
                }
            });
        }

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            let formularioValido = true;
            let primerCampoInvalido = null;

            if (!formulario.dpTitle.checkValidity()) {
                VideoSystemForms.showFeedback(formulario.dpTitle, false);
                primerCampoInvalido = formulario.dpTitle;
                formularioValido = false;
            } else {
                VideoSystemForms.showFeedback(formulario.dpTitle, true);
            }

            if (!formulario.dpConfirm.checked) {
                VideoSystemForms.showFeedback(formulario.dpConfirm, false);
                if (!primerCampoInvalido) primerCampoInvalido = formulario.dpConfirm;
                formularioValido = false;
            } else {
                VideoSystemForms.showFeedback(formulario.dpConfirm, true);
            }

            if (!formularioValido) {
                if (primerCampoInvalido) primerCampoInvalido.focus();
                return;
            }

            alEnviar({ title: formulario.dpTitle.value });
        });

        formulario.addEventListener('reset', () => {
            VideoSystemForms.resetFeedback(formulario);
        });
    }


    /* FORMULARIO 3 – ASIGNAR / DESASIGNAR REPARTO Y DIRECTOR*/
    static buildCastForm({ producciones, tituloPreseleccionado }) {
        const opcionesProducciones = producciones
            .map(produccion => {
                const seleccionada = (produccion.title === tituloPreseleccionado) ? 'selected' : '';
                return `<option value="${produccion.title}" ${seleccionada}>${produccion.toString()}</option>`;
            })
            .join('');

        return `
        <form name="fCast" novalidate class="vs-form">
            <h2 class="form-title"><i class="fas fa-user-edit"></i> Gestionar reparto</h2>

            <div class="form-group form-group-full">
                <label class="form-label" for="cfProduction">Producción *</label>
                <select id="cfProduction" name="cfProduction" class="form-control" required>
                    <option value="">-- Selecciona una producción --</option>
                    ${opcionesProducciones}
                </select>
                <div class="invalid-feedback d-none">Debes seleccionar una producción.</div>
                <div class="valid-feedback d-none">Correcto.</div>
            </div>

            <div id="cfDirectorSection" class="cast-section form-group-full" style="display:none;">
                <h3><i class="fas fa-megaphone"></i> Director</h3>
                <div class="form-group">
                    <label class="form-label" for="cfDirector">Director asignado</label>
                    <select id="cfDirector" name="cfDirector" class="form-control">
                        <option value="">-- Sin director --</option>
                    </select>
                    <small class="form-hint">Cambia el director o selecciona "Sin director" para desasignar.</small>
                </div>
            </div>

            <div id="cfActorsSection" class="cast-section form-group-full" style="display:none;">
                <h3><i class="fas fa-users"></i> Actores</h3>
                <p class="form-hint">Marca los actores que deben formar parte del reparto e indica su rol.</p>
                <div id="cfActorsList" class="actors-checklist"></div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn-primary">
                    <i class="fas fa-save"></i> Aplicar cambios
                </button>
                <button type="reset" class="btn-secondary">
                    <i class="fas fa-undo"></i> Restablecer
                </button>
            </div>
        </form>
        `;
    }

    /*Inicializa los event listeners del formulario*/
    static initCastForm(formulario, opciones) {
        const { todosLosActores, todosLosDirectores, obtenerEstadoProduccion,
                alEnviar, tituloPreseleccionado } = opciones;

        const seccionDirector = formulario.querySelector('#cfDirectorSection');
        const seccionActores = formulario.querySelector('#cfActorsSection');
        const selectDirector = formulario.cfDirector;
        const listaActores = formulario.querySelector('#cfActorsList');

        //Rellenamos el select de directores
        for (const director of todosLosDirectores) {
            const opcion = document.createElement('option');
            opcion.value = director.toString();
            opcion.textContent = director.toString();
            selectDirector.append(opcion);
        }

        //Renderiza la checklist de actores para una producción
        const renderizarActores = (estadoProduccion) => {
            listaActores.innerHTML = '';

            const actoresActuales = new Map();
            for (const item of estadoProduccion.cast) {
                actoresActuales.set(item.actor, item.role);
            }

            for (const actor of todosLosActores) {
                const nombreActor = actor.toString();
                const estaAsignado = actoresActuales.has(nombreActor);
                const rolActual = actoresActuales.get(nombreActor) || '';

                const item = document.createElement('div');
                item.classList.add('actor-check-item');
                item.innerHTML = `
                    <label class="checkbox-row">
                        <input type="checkbox" class="cf-actor-check"
                               value="${nombreActor}" ${estaAsignado ? 'checked' : ''}>
                        <span><i class="fas fa-user"></i> ${nombreActor}</span>
                    </label>
                    <input type="text" class="form-control cf-actor-role"
                           data-actor="${nombreActor}" placeholder="Rol / personaje"
                           maxlength="60" value="${rolActual.replace(/"/g, '&quot;')}"
                           ${estaAsignado ? '' : 'disabled'}>
                `;
                listaActores.append(item);
            }

            listaActores.addEventListener('change', (evento) => {
                if (evento.target.classList.contains('cf-actor-check')) {
                    const inputRol = evento.target.closest('.actor-check-item')
                        .querySelector('.cf-actor-role');
                    inputRol.disabled = !evento.target.checked;
                    if (!evento.target.checked) inputRol.value = '';
                }
            });
        };

        //Carga los datos de una producción en el formulario
        const cargarDatosProduccion = (titulo) => {
            if (!titulo) {
                seccionDirector.style.display = 'none';
                seccionActores.style.display = 'none';
                return;
            }
            const estado = obtenerEstadoProduccion(titulo);
            selectDirector.value = estado.directorKey || '';
            seccionDirector.style.display = '';
            seccionActores.style.display = '';
            renderizarActores(estado);
        };

        formulario.cfProduction.addEventListener('change', (evento) => {
            VideoSystemForms.defaultCheckElement(evento);
            cargarDatosProduccion(formulario.cfProduction.value);
        });

        if (tituloPreseleccionado) {
            VideoSystemForms.showFeedback(formulario.cfProduction, true);
            cargarDatosProduccion(tituloPreseleccionado);
        }

        formulario.addEventListener('submit', (evento) => {
            evento.preventDefault();
            evento.stopPropagation();

            if (!formulario.cfProduction.checkValidity()) {
                VideoSystemForms.showFeedback(formulario.cfProduction, false);
                formulario.cfProduction.focus();
                return;
            }
            VideoSystemForms.showFeedback(formulario.cfProduction, true);

            const actoresDeseados = [];
            for (const checkbox of listaActores.querySelectorAll('.cf-actor-check')) {
                if (checkbox.checked) {
                    const inputRol = listaActores.querySelector(
                        `.cf-actor-role[data-actor="${checkbox.value}"]`
                    );
                    actoresDeseados.push({
                        actor: checkbox.value,
                        role: (inputRol.value.trim() || 'Sin especificar'),
                    });
                }
            }

            alEnviar({
                title: formulario.cfProduction.value,
                directorKey: selectDirector.value || null,
                actors: actoresDeseados,
            });
        });

        formulario.addEventListener('reset', () => {
            VideoSystemForms.resetFeedback(formulario);
            setTimeout(() => cargarDatosProduccion(formulario.cfProduction.value), 0);
        });
    }
}
