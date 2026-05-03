"use strict";

class VideoSystemView {
    constructor() {
        this.main = document.getElementById('main-content');
        this.menu = document.getElementById('nav-menu');
        this.categoriesMenu = null; // se creadinámicamente
    }

    /* HELPER ,renderizar imagen con fallback a icono */
    _renderImage(src, fallbackIcon, alt = '') {
        // Si no hay src o parece un placeholder tipo "inception.jpg" (sin ruta ni http), mostramos el icono directamente
        const isValidSrc = src && (src.startsWith('http') || src.startsWith('img/') || src.startsWith('./') || src.startsWith('/'));

        if (!isValidSrc) {
            return `<i class="fas ${fallbackIcon}"></i>`;
        }
        const safeIcon = fallbackIcon.replace(/'/g, "\\'");
        return `<img src="${src}" alt="${alt}" onerror="this.outerHTML='<i class=\\'fas ${safeIcon}\\'></i>'">`;
    }

    /* INIT, Página de inicio */
    init(categories, randomProductions) {
        this.main.replaceChildren();

        //Breadcrumb
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb"><a href="#" class="breadcrumb-home">Inicio</a></div>
        `);

        //Título de categorías
        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-layer-group"></i> Categorías</h2>
        `);

        //Grid de categorías
        const catGrid = document.createElement('div');
        catGrid.classList.add('cards-grid');
        catGrid.id = 'categories-grid';

        //Mapa de iconos por nombre de categoría
        const categoryIconMap = {
            'Terror': 'fa-ghost',
            'Ciencia Ficción': 'fa-rocket',
            'Acción': 'fa-explosion',
            'Drama': 'fa-masks-theater',
            'Romance': 'fa-heart',
            'Aventura': 'fa-hat-wizard',
        };

        for (const cat of categories) {
            if (cat.name === 'Default') continue;

            const icon = categoryIconMap[cat.name] || 'fa-film';

            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.category = cat.name;
            card.innerHTML = `
                <div class="card-image category-img">
                    <i class="fas ${icon}"></i>
                </div>
                <div class="card-body">
                    <h3>${cat.name}</h3>
                    <p>${cat.description || 'Explora las producciones de esta categoría'}</p>
                </div>
            `;
            catGrid.append(card);
        }
        this.main.append(catGrid);

        //Título de producciones aleatorias
        this.main.insertAdjacentHTML('beforeend', `
            <div class="random-section">
                <h2 class="section-title"><i class="fas fa-dice"></i> Producciones destacadas</h2>
            </div>
        `);

        //Grid de producciones aleatorias
        const randomGrid = document.createElement('div');
        randomGrid.classList.add('cards-grid');

        for (const prod of randomProductions) {
            const typeIcon = prod instanceof Movie ? 'fa-video' : 'fa-tv';
            const typeName = prod instanceof Movie ? 'Película' : 'Serie';
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.production = prod.title;
            card.innerHTML = `
                <div class="card-image">
                    ${this._renderImage(prod._image, typeIcon, prod.title)}
                </div>
                <div class="card-body">
                    <h3>${prod.title}</h3>
                    <p>${prod._publication.getFullYear()} · ${prod._nationality || 'N/A'}</p>
                    <span class="badge">${typeName}</span>
                </div>
            `;
            randomGrid.append(card);
        }

        this.main.querySelector('.random-section').append(randomGrid);
    }

    /*MENÚ - Crear menú de categorías */
    showCategoriesInMenu(categories) {
        // Eliminar links de categoría previos
        const prevLinks = document.querySelectorAll('.nav-cat-link');
        prevLinks.forEach(link => link.parentElement.remove());

        const initLi = document.getElementById('init').parentElement;
        let lastInserted = initLi;

        for (const cat of categories) {
            if (cat.name === 'Default') continue;

            const li = document.createElement('li');
            const a = document.createElement('a');
            a.classList.add('nav-link', 'nav-cat-link');
            a.href = '#';
            a.textContent = cat.name;
            a.dataset.category = cat.name;
            li.append(a);
            lastInserted.after(li);
            lastInserted = li;
        }
    }

    /*PRODUCCIONES*/
    showProductionsCategory(category, productions) {
        this.main.replaceChildren();

        // Breadcrumb
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>${category.name}</strong>
            </div>
        `);

        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-film"></i> ${category.name}</h2>
        `);

        const grid = document.createElement('div');
        grid.classList.add('cards-grid');

        for (const prod of productions) {
            const typeIcon = prod instanceof Movie ? 'fa-video' : 'fa-tv';
            const typeName = prod instanceof Movie ? 'Película' : 'Serie';
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.production = prod.title;
            card.innerHTML = `
                <div class="card-image">
                    ${this._renderImage(prod._image, typeIcon, prod.title)}
                </div>
                <div class="card-body">
                    <h3>${prod.title}</h3>
                    <p>${prod._publication.getFullYear()} · ${prod._nationality || 'N/A'}</p>
                    <p class="synopsis-preview">${(prod._synopsis || '').substring(0, 80)}${prod._synopsis && prod._synopsis.length > 80 ? '...' : ''}</p>
                    <span class="badge">${typeName}</span>
                </div>
            `;
            grid.append(card);
        }
        this.main.append(grid);
    }

    /*FICHA DE PRODUCCIÓN */
    showProductionDetail(production, cast, directors) {
        this.main.replaceChildren();

        const typeIcon = production instanceof Movie ? 'fa-video' : 'fa-tv';
        const typeName = production instanceof Movie ? 'Película' : 'Serie';

        // Breadcrumb
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>${production.title}</strong>
            </div>
        `);

        const ficha = document.createElement('div');
        ficha.classList.add('ficha-container');

        let seasonsHtml = '';
        if (production instanceof Serie && production._seasons) {
            seasonsHtml = `<p class="ficha-detail"><strong>Temporadas:</strong> ${production._seasons}</p>`;
        }

        let resourceHtml = '';
        if (production instanceof Movie && production._resource) {
            resourceHtml = `<p class="ficha-detail"><strong>Duración:</strong> ${production._resource.duration} min</p>`;
        }

        ficha.innerHTML = `
            <div class="ficha-header">
                <div class="ficha-poster">
                    ${this._renderImage(production._image, typeIcon, production.title)}
                </div>
                <div class="ficha-info">
                    <h2>${production.title}</h2>
                    <p class="ficha-detail"><strong>Tipo:</strong> ${typeName}</p>
                    <p class="ficha-detail"><strong>Año:</strong> ${production._publication.getFullYear()}</p>
                    <p class="ficha-detail"><strong>Nacionalidad:</strong> ${production._nationality || 'N/A'}</p>
                    ${resourceHtml}
                    ${seasonsHtml}
                    <p class="ficha-synopsis">${production._synopsis || 'Sin sinopsis disponible.'}</p>
                    <div class="ficha-actions">
                        <button class="btn-primary btn-open-window" data-type="production" data-title="${production.title}">
                            <i class="fas fa-external-link-alt"></i> Abrir en ventana nueva
                        </button>
                        <button class="btn-secondary btn-cast-prod" data-title="${production.title}">
                            <i class="fas fa-user-edit"></i> Gestionar reparto
                        </button>
                        <button class="btn-delete-icon btn-delete-prod" data-title="${production.title}" title="Eliminar producción">
                            <i class="fas fa-trash"></i>
                        </button>

                    </div>
                </div>
            </div>
        `;

        //Sección directores
        const dirSection = document.createElement('div');
        dirSection.classList.add('ficha-section');
        dirSection.innerHTML = `<h3><i class="fas fa-megaphone"></i> Directores</h3>`;
        const dirList = document.createElement('div');
        dirList.classList.add('people-list');

        for (const dir of directors) {
            const chip = document.createElement('span');
            chip.classList.add('person-chip');
            chip.dataset.person = dir.toString();
            chip.dataset.type = 'director';
            chip.innerHTML = `<i class="fas fa-user-tie"></i> ${dir.toString()}`;
            dirList.append(chip);
        }
        if (dirList.children.length === 0) {
            dirList.innerHTML = '<p style="color:#8b949e;">Sin directores asignados</p>';
        }
        dirSection.append(dirList);
        ficha.append(dirSection);

        //Sección actores
        const castSection = document.createElement('div');
        castSection.classList.add('ficha-section');
        castSection.innerHTML = `<h3><i class="fas fa-users"></i> Reparto</h3>`;
        const castList = document.createElement('div');
        castList.classList.add('people-list');

        for (const item of cast) {
            const chip = document.createElement('span');
            chip.classList.add('person-chip');
            chip.dataset.person = item.actor.toString();
            chip.dataset.type = 'actor';
            chip.innerHTML = `<i class="fas fa-user"></i> ${item.actor.toString()} <em style="color:#8b949e;">(${item.role})</em>`;
            castList.append(chip);
        }
        if (castList.children.length === 0) {
            castList.innerHTML = '<p style="color:#8b949e;">Sin actores asignados</p>';
        }
        castSection.append(castList);
        ficha.append(castSection);

        this.main.append(ficha);
    }

    /*LISTADO DE ACTORES */
    showActorsList(actors) {
        this.main.replaceChildren();

        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>Actores</strong>
            </div>
        `);

        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-users"></i> Actores</h2>
        `);

        const grid = document.createElement('div');
        grid.classList.add('cards-grid');

        for (const actor of actors) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.person = actor.toString();
            card.dataset.type = 'actor';
            card.innerHTML = `
                <div class="card-image">
                    ${this._renderImage(actor.picture, 'fa-user', actor.name)}
                </div>
                <div class="card-body">
                    <h3>${actor.name} ${actor.lastname1}</h3>
                    <p>${actor.lastname2 || ''}</p>
                    <p>Nacimiento: ${actor.born.toLocaleDateString('es-ES')}</p>
                </div>
            `;
            grid.append(card);
        }
        this.main.append(grid);
    }

    /*LISTADO DE DIRECTORES */
    showDirectorsList(directors) {
        this.main.replaceChildren();

        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>Directores</strong>
            </div>
        `);

        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-user-tie"></i> Directores</h2>
        `);

        const grid = document.createElement('div');
        grid.classList.add('cards-grid');

        for (const director of directors) {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.person = director.toString();
            card.dataset.type = 'director';
            card.innerHTML = `
                <div class="card-image">
                    ${this._renderImage(director.picture, 'fa-user-tie', director.name)}
                </div>
                <div class="card-body">
                    <h3>${director.name} ${director.lastname1}</h3>
                    <p>${director.lastname2 || ''}</p>
                    <p>Nacimiento: ${director.born.toLocaleDateString('es-ES')}</p>
                </div>
            `;
            grid.append(card);
        }
        this.main.append(grid);
    }

    /*FICHA DE ACTOR */
    showActorDetail(actor, productions) {
        this.main.replaceChildren();

        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <a href="#" class="breadcrumb-actors">Actores</a>
                <span>&gt;</span>
                <strong>${actor.toString()}</strong>
            </div>
        `);

        const ficha = document.createElement('div');
        ficha.classList.add('ficha-container');
        ficha.innerHTML = `
            <div class="ficha-header">
                <div class="ficha-poster">
                    ${this._renderImage(actor.picture, 'fa-user', actor.name)}
                </div>
                <div class="ficha-info">
                    <h2>${actor.name} ${actor.lastname1} ${actor.lastname2 || ''}</h2>
                    <p class="ficha-detail"><strong>Fecha de nacimiento:</strong> ${actor.born.toLocaleDateString('es-ES')}</p>
                    <p class="ficha-detail"><strong>Foto:</strong> ${actor.picture || 'No disponible'}</p>
                    <button class="btn-primary btn-open-window" data-type="actor" data-person="${actor.toString()}">
                        <i class="fas fa-external-link-alt"></i> Abrir en ventana nueva
                    </button>
                </div>
            </div>
        `;

        const prodSection = document.createElement('div');
        prodSection.classList.add('ficha-section');
        prodSection.innerHTML = `<h3><i class="fas fa-film"></i> Producciones</h3>`;
        const prodList = document.createElement('div');
        prodList.classList.add('productions-list');

        for (const item of productions) {
            const chip = document.createElement('span');
            chip.classList.add('production-chip');
            chip.dataset.production = item.production.title;
            chip.innerHTML = `<i class="fas fa-play-circle"></i> ${item.production.title} <em style="color:#8b949e;">(${item.role})</em>`;
            prodList.append(chip);
        }
        if (prodList.children.length === 0) {
            prodList.innerHTML = '<p style="color:#8b949e;">Sin producciones asignadas</p>';
        }
        prodSection.append(prodList);
        ficha.append(prodSection);

        this.main.append(ficha);
    }

    /*FICHA DE DIRECTOR */
    showDirectorDetail(director, productions) {
        this.main.replaceChildren();

        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <a href="#" class="breadcrumb-directors">Directores</a>
                <span>&gt;</span>
                <strong>${director.toString()}</strong>
            </div>
        `);

        const ficha = document.createElement('div');
        ficha.classList.add('ficha-container');
        ficha.innerHTML = `
            <div class="ficha-header">
                <div class="ficha-poster">
                    ${this._renderImage(director.picture, 'fa-user-tie', director.name)}
                </div>
                <div class="ficha-info">
                    <h2>${director.name} ${director.lastname1} ${director.lastname2 || ''}</h2>
                    <p class="ficha-detail"><strong>Fecha de nacimiento:</strong> ${director.born.toLocaleDateString('es-ES')}</p>
                    <p class="ficha-detail"><strong>Foto:</strong> ${director.picture || 'No disponible'}</p>
                    <button class="btn-primary btn-open-window" data-type="director" data-person="${director.toString()}">
                        <i class="fas fa-external-link-alt"></i> Abrir en ventana nueva
                    </button>
                </div>
            </div>
        `;

        const prodSection = document.createElement('div');
        prodSection.classList.add('ficha-section');
        prodSection.innerHTML = `<h3><i class="fas fa-film"></i> Producciones dirigidas</h3>`;
        const prodList = document.createElement('div');
        prodList.classList.add('productions-list');

        for (const prod of productions) {
            const chip = document.createElement('span');
            chip.classList.add('production-chip');
            chip.dataset.production = prod.title;
            chip.innerHTML = `<i class="fas fa-play-circle"></i> ${prod.title} (${prod._publication.getFullYear()})`;
            prodList.append(chip);
        }
        if (prodList.children.length === 0) {
            prodList.innerHTML = '<p style="color:#8b949e;">Sin producciones asignadas</p>';
        }
        prodSection.append(prodList);
        ficha.append(prodSection);

        this.main.append(ficha);
    }

    /*BIND METHODS (enlazar handlers de la vista)*/

    // Inicio
    bindInit(handler) {
        document.getElementById('init').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
        document.getElementById('logo').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    //Click en categoría (grid central)
    bindCategoryCards(handler) {
        this.main.addEventListener('click', (event) => {
            const card = event.target.closest('.card[data-category]');
            if (card) {
                event.preventDefault();
                handler(card.dataset.category);
            }
        });
    }

    //Click en categoría (menú nav)
    bindCategoryMenu(handler) {
        document.getElementById('nav-menu').addEventListener('click', (event) => {
            const link = event.target.closest('.nav-cat-link');
            if (link) {
                event.preventDefault();
                handler(link.dataset.category);
            }
        });
    }

    //Click en producción
    bindProductionCards(handler) {
        this.main.addEventListener('click', (event) => {
            //Primero comprobamos chips
            const chip = event.target.closest('.production-chip[data-production]');
            if (chip) {
                event.preventDefault();
                handler(chip.dataset.production);
                return;
            }
            // Luego cards de producciones
            const card = event.target.closest('.card[data-production]');
            if (card) {
                event.preventDefault();
                handler(card.dataset.production);
                return;
            }
            // DWEC07 - Punto 13: enlace "Ver ficha" en bocadillo del mapa global
            const popupLink = event.target.closest('.popup-production-link[data-production]');
            if (popupLink) {
                event.preventDefault();
                handler(popupLink.dataset.production);
            }
        });
    }

    //Listado de actores
    bindActors(handler) {
        document.getElementById('nav-actors').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    //Listado de directores
    bindDirectors(handler) {
        document.getElementById('nav-directors').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    //DWEC07 - Punto 13.Enlazar manejador del enlace Mapa del menú
    bindGlobalMap(manejador) {
        document.getElementById('nav-globalmap').addEventListener('click', (event) => {
            event.preventDefault();
            manejador();
        });
    }

    // DWEC07 - Punto 13: Mostrar mapa global con todos los marcadores.
    showGlobalMap(productions) {
        this.main.replaceChildren();

        // Breadcrumb
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>Mapa de localizaciones</strong>
            </div>
        `);

        //Título de sección + contenedor del mapa
        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-map"></i> Mapa de localizaciones</h2>
        `);

        if (productions.length === 0) {
            this.main.insertAdjacentHTML('beforeend', `
                <p style="color:#cfcfcf; margin-top:1rem;">
                    Todavía no hay producciones con localización asignada.
                    Puedes añadir coordenadas al crear una nueva producción.
                </p>
            `);
            return;
        }

        this.main.insertAdjacentHTML('beforeend', `
            <div id="global-map" style="height:500px; border:1px solid #3a2f56; border-radius:8px; margin-top:1rem;"></div>
        `);

        //Centrar el mapa en la primera producción y ajustar zoom para verlas todas
        const primera = productions[0];
        const mapa = L.map('global-map').setView([primera._lat, primera._lng], 2);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(mapa);

        //Por cada producción, un marcador con bocadillo enlazado al título
        const marcadores = [];
        for (const prod of productions) {
            const marker = L.marker([prod._lat, prod._lng]).addTo(mapa);
            // Bocadillo con título y enlace para abrir la ficha (data-production)
            marker.bindPopup(`
                <strong>${prod.title}</strong><br>
                <small>${prod._publication.getFullYear()} · ${prod._nationality || 'N/A'}</small><br>
                <a href="#" class="popup-production-link" data-production="${prod.title}">
                    <i class="fas fa-arrow-right"></i> Ver ficha
                </a>
            `);
            marcadores.push(marker);
        }

        //Ajustar el zoom para que todos los marcadores se vean(fitBounds)
        if (marcadores.length > 1) {
            const grupo = L.featureGroup(marcadores);
            mapa.fitBounds(grupo.getBounds().pad(0.2));
        }

        setTimeout(() => mapa.invalidateSize(), 100);
    }
    bindPersonClick(handler) {
        this.main.addEventListener('click', (event) => {
            const chip = event.target.closest('.person-chip[data-person]');
            if (chip) {
                event.preventDefault();
                handler(chip.dataset.person, chip.dataset.type);
                return;
            }
            const card = event.target.closest('.card[data-person]');
            if (card) {
                event.preventDefault();
                handler(card.dataset.person, card.dataset.type);
            }
        });
    }

    //Breadcrumb inicio
    bindBreadcrumbHome(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-home');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    //Breadcrumb actores
    bindBreadcrumbActors(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-actors');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    //Breadcrumb directores
    bindBreadcrumbDirectors(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-directors');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    //Abrir en ventana nueva
    bindOpenWindow(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-open-window');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.type, btn.dataset.title || btn.dataset.person);
            }
        });
    }

    //Cerrar todas las ventanas
    bindCloseWindows(handler) {
        document.getElementById('nav-close-windows').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    //Menú hamburguesa
    bindMenuToggle() {
        document.getElementById('hamburger-menu').addEventListener('click', () => {
            document.getElementById('nav-menu').classList.toggle('show');
        });
    }

    /*TOAST*/
    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.classList.add('toast', `toast-${type}`);
        toast.textContent = message;
        document.body.append(toast);

        requestAnimationFrame(() => {
            toast.classList.add('show');
        });

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    /*  MODAL Y FORMULARIOS (DWEC06) */
    openModal(innerHTML) {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        body.innerHTML = innerHTML;
        modal.classList.add('show');
        document.body.classList.add('modal-open');
    }

    closeModal() {
        const modal = document.getElementById('modal');
        const body = document.getElementById('modal-body');
        modal.classList.remove('show');
        document.body.classList.remove('modal-open');
        body.innerHTML = '';
    }

    showCreateProductionForm({ categories, actors, directors, existingTitles }, onSubmit) {
        const html = VideoSystemForms.buildCreateProductionForm({
            categorias: categories,
            actores: actors,
            directores: directors,
        });

        // DWEC07 formulario de creación se muestra en modal
        this.openModal(html);
        const form = document.forms.fNewProduction;
        VideoSystemForms.initCreateProductionForm(form, {
            titulosExistentes: existingTitles,
            alEnviar: onSubmit,
        });
    }

    showDeleteProductionForm({ productions, preselectedTitle = null }, onSubmit) {
        const html = VideoSystemForms.buildDeleteProductionForm({
            producciones: productions,
        });
        this.main.replaceChildren();
        this.main.insertAdjacentHTML('afterbegin', html);
        const form = document.forms.fDelProduction;
        VideoSystemForms.initDeleteProductionForm(form, {
            alEnviar: onSubmit,
            tituloPreseleccionado: preselectedTitle,
        });
    }

    showCastForm({ productions, allActors, allDirectors, getProductionState, preselectedTitle = null }, onSubmit) {
        const html = VideoSystemForms.buildCastForm({
            producciones: productions,
            tituloPreseleccionado: preselectedTitle,
        });
        this.main.replaceChildren();
        this.main.insertAdjacentHTML('afterbegin', html);
        const form = document.forms.fCast;
        VideoSystemForms.initCastForm(form, {
            todosLosActores: allActors,
            todosLosDirectores: allDirectors,
            obtenerEstadoProduccion: getProductionState,
            alEnviar: onSubmit,
            tituloPreseleccionado: preselectedTitle,
        });
    }

    /*Bindings de los nuevos elementos UI*/

    // FAB "Nueva producción"
    bindCreateProduction(handler) {
        document.getElementById('fab-new-production').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    //Botón Eliminar en la ficha de producción
    bindDeleteProduction(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-delete-prod');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.title);
            }
        });
    }

    //Botón Gestionar reparto en ficha de producción
    bindCastProduction(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-cast-prod');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.title);
            }
        });
    }

    //DWEC07 Punto 11.Muestra un mapa con un marcador en la ficha de producción
    showProductionMap(title, lat, lng) {
        const ficha = this.main.querySelector('.ficha-container');
        if (!ficha) return;

        //Sección de localización
        const locSection = document.createElement('div');
        locSection.classList.add('ficha-section');
        locSection.innerHTML = `
            <h3><i class="fas fa-map-marker-alt"></i> Localización</h3>
            <div id="ficha-map" style="height:300px; border:1px solid #3a2f56; border-radius:8px;"></div>
        `;
        ficha.append(locSection);

        //Inicializar Leaflet
        const mapa = L.map('ficha-map').setView([lat, lng], 13);

        L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
            maxZoom: 18
        }).addTo(mapa);

        //Marcador con bocadillo
        const marker = L.marker([lat, lng]).addTo(mapa);
        marker.bindPopup(`<strong>${title}</strong><br>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}`).openPopup();

        //Recalcula tamaño por si el contenedor no estaba renderizado aún
        setTimeout(() => mapa.invalidateSize(), 100);
    }

    //DWEC07 - Punto 5.Muestra el botón de favorito en la ficha de producción
    showFavoriteButton(title, esFavorito) {
        const fichaActions = this.main.querySelector('.ficha-actions');
        if (!fichaActions) return;
        // Eliminar botón previo si ya existía (p.ej. al navegar atrás/adelante)
        const prev = fichaActions.querySelector('.btn-favorito');
        if (prev) prev.remove();

        fichaActions.insertAdjacentHTML('beforeend', `
            <button class="btn-favorito ${esFavorito ? 'es-favorito' : ''}"
                    data-title="${title}"
                    title="${esFavorito ? 'Dejar de ser favorita' : 'Hacer favorita'}"
                    aria-label="${esFavorito ? 'Dejar de ser favorita' : 'Hacer favorita'}">
                <i class="${esFavorito ? 'fas' : 'far'} fa-star"></i>
            </button>
        `);
    }

    //DWEC07 Punto 5.Enlaza el manejador al botón de favorito
    bindFavoritoBtn(manejador) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-favorito');
            if (btn) {
                event.preventDefault();
                manejador(btn.dataset.title);
            }
        });
    }


    bindModalClose() {
        const modal = document.getElementById('modal');
        modal.addEventListener('click', (event) => {
            //Si se hace clic en el botón X o en cualquier elemento dentro de él
            if (event.target.closest('.modal-close')) {
                this.closeModal();
                return;
            }
            //Si se hace clic en el overlay fondo oscuro
            if (event.target.matches('.modal-overlay')) {
                this.closeModal();
            }
        });
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                this.closeModal();
            }
        });
    }

    /*AVISO DE USO DE COOKIES (DWEC07  */

    /*
      Muestra un toast fijo en la parte inferior con el aviso de
      uso de cookies. Dispone de 3 botones: Aceptar, Denegar y
      Cerrar (X). Siempre anclad a la parte inferior independientemente del tamaño de pantalla.
      El comportamiento de cada botón lo define el controlador a
      través de bindCookiesMessage().
     */
    showCookiesMessage() {
        // Si ya está en el DOM, no lo duplicamos
        if (document.getElementById('cookies-toast')) return;

        const toast = `
            <div id="cookies-toast" class="cookies-toast" role="alert"
                 aria-live="polite" aria-atomic="true">
                <div class="cookies-toast-inner">
                    <div class="cookies-toast-icon" aria-hidden="true">
                        <i class="fas fa-cookie-bite"></i>
                    </div>
                    <div class="cookies-toast-text">
                        <h4>Aviso de uso de cookies</h4>
                        <p>Este sitio web almacena datos en cookies para activar funciones
                        como la autenticación. Necesitamos tu consentimiento para continuar.</p>
                    </div>
                    <div class="cookies-toast-actions">
                        <button type="button" class="btn-cookie-deny" id="btnDenyCookie">
                            Denegar
                        </button>
                        <button type="button" class="btn-cookie-accept" id="btnAcceptCookie">
                            Aceptar
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', toast);
    }

    /* Elimina el toast del aviso de cookies del DOM con unapequeña animación de salida*/
    hideCookiesMessage() {
        const toast = document.getElementById('cookies-toast');
        if (!toast) return;
        toast.classList.add('closing');
        //speramos a que termine la animación para eliminarlo
        setTimeout(() => toast.remove(), 300);
    }

    /** Muestra el mensaje de que el usuario debe aceptar el uso de cookies para poder seguir navegando. Se invoca cuando el
     usuario pulsa "Denegar" o "Cerrar"*/
    showCookiesDeniedMessage() {
        this.main.replaceChildren();
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="cookies-denied-message">
                <i class="fas fa-ban"></i>
                <strong>Es necesario aceptar el uso de cookies</strong>
                Para utilizar esta web debes aceptar las condiciones.
                Recarga la página y pulsa "Aceptar" en el aviso para seguir navegando.
            </div>
        `);
    }

    /**
     * Enlaza los dos botones del aviso (Aceptar, Denegar) con sus
     * respectivos handlers del controlador.
     * @param {Function} onAccept  Handler al pulsar "Aceptar".
     * @param {Function} onDeny    Handler al pulsar "Denegar".
     */
    bindCookiesMessage(onAccept, onDeny) {
        const btnAccept = document.getElementById('btnAcceptCookie');
        const btnDeny = document.getElementById('btnDenyCookie');

        if (btnAccept) {
            btnAccept.addEventListener('click', (event) => {
                event.preventDefault();
                onAccept();
            });
        }
        if (btnDeny) {
            btnDeny.addEventListener('click', (event) => {
                event.preventDefault();
                onDeny();
            });
        }
    }

    /*AUTENTICACIÓN (DWEC07.Puntos 2, 3 y 4)*/

    /*Muestra en el header el botón "Iniciar sesión" cuando elusuario NO está autenticado*/
    //DWEC07 - Punto 6.Muestra el enlace "Mis favoritos" en el menú*/
    showFavoritesMenu() {
        const item = document.getElementById('nav-favorites-item');
        if (item) item.style.display = '';
    }

    //DWEC07 Punto 6.Oculta el enlace "Mis favoritos" del menú.
    removeFavoritesMenu() {
        const item = document.getElementById('nav-favorites-item');
        if (item) item.style.display = 'none';
    }

    //DWEC07 .Punto 6: Enlaza el manejador al enlace "Mis favoritos".
    bindFavorites(manejador) {
        const enlace = document.getElementById('nav-favorites');
        const clon = enlace.cloneNode(true);
        enlace.parentNode.replaceChild(clon, enlace);
        clon.addEventListener('click', (event) => {
            event.preventDefault();
            manejador();
        });
    }

    // DWEC07 - Punto 6: Muestra la lista de producciones favoritas.
    showFavoritesList(productions) {
        this.main.replaceChildren();

        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb">
                <a href="#" class="breadcrumb-home">Inicio</a>
                <span>&gt;</span>
                <strong>Mis favoritos</strong>
            </div>
        `);

        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-star"></i> Mis favoritos</h2>
        `);

        if (productions.length === 0) {
            this.main.insertAdjacentHTML('beforeend', `
                <p style="color:#cfcfcf; margin-top:1rem;">
                    Todavía no tienes producciones favoritas. Entra en cualquier
                    ficha y pulsa la estrella ⭐ para añadirla.
                </p>
            `);
            return;
        }

        const grid = document.createElement('div');
        grid.classList.add('cards-grid');

        for (const prod of productions) {
            const typeIcon = prod instanceof Movie ? 'fa-video' : 'fa-tv';
            const typeName = prod instanceof Movie ? 'Película' : 'Serie';
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.production = prod.title;
            card.innerHTML = `
                <div class="card-image">
                    ${this._renderImage(prod._image, typeIcon, prod.title)}
                </div>
                <div class="card-body">
                    <h3>${prod.title}</h3>
                    <p>${prod._publication.getFullYear()} · ${prod._nationality || 'N/A'}</p>
                    <span class="badge">${typeName}</span>
                </div>
            `;
            grid.append(card);
        }
        this.main.append(grid);
    }

    //DWEC07 Punto 9.Muestra el botón de backup al iniciar sesión
    showBackupBtn() {
        const btn = document.getElementById('btn-backup');
        if (btn) btn.style.display = '';
    }

    //DWEC07 Punto 9.Oculta el botón de backup al cerrar sesión
    removeBackupBtn() {
        const btn = document.getElementById('btn-backup');
        if (btn) btn.style.display = 'none';
    }

    //DWEC07 Punto 9. Enlaza el manejador al botón de backup
    bindBackupBtn(manejador) {
        const btn = document.getElementById('btn-backup');
        if (!btn) return;
        const clon = btn.cloneNode(true);
        btn.parentNode.replaceChild(clon, btn);
        clon.addEventListener('click', (event) => {
            event.preventDefault();
            manejador();
        });
    }

    showLoginLink() {
        const userArea = document.getElementById('userArea');
        if (!userArea) return;
        userArea.replaceChildren();
        userArea.insertAdjacentHTML('afterbegin', `
            <a id="login-link" href="#" class="btn-login" title="Iniciar sesión">
                <i class="fas fa-user-circle"></i>
                <span>Iniciar sesión</span>
            </a>
        `);
    }

    /**
     * Enlaza el botón "Iniciar sesión" del header con el handler cque abre el formulario en el <main>.
     * @param {Function} handler  Handler a ejecutar al hacer click.
     */
    bindLoginLink(handler) {
        const link = document.getElementById('login-link');
        if (!link) return;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    /*Muestra en el <main> el formulario de login.*/
    showLoginForm() {
        if (!this.main) return;
        this.main.replaceChildren();
        this.main.insertAdjacentHTML('afterbegin', `
            <section class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <div class="login-header-icon" aria-hidden="true">
                            <i class="fas fa-user-lock"></i>
                        </div>
                        <h2>Iniciar sesión</h2>
                        <p>Accede a tu cuenta de VideoSystem</p>
                    </div>
                    <form name="fLogin" class="login-form" novalidate>
                        <div class="form-group">
                            <label for="loginUsername">Usuario</label>
                            <div class="input-wrapper">
                                <i class="fas fa-user input-icon" aria-hidden="true"></i>
                                <input type="text" id="loginUsername" name="username"
                                       placeholder="Tu nombre de usuario"
                                       autocomplete="username"
                                       required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label for="loginPassword">Contraseña</label>
                            <div class="input-wrapper">
                                <i class="fas fa-key input-icon" aria-hidden="true"></i>
                                <input type="password" id="loginPassword" name="password"
                                       placeholder="Tu contraseña"
                                       autocomplete="current-password"
                                       required>
                            </div>
                        </div>
                        <button type="submit" class="btn-submit">
                            <i class="fas fa-sign-in-alt"></i> Acceder
                        </button>
                        <div class="login-hint">
                            Demo: usuario <code>admin</code> · contraseña <code>admin</code>
                        </div>
                    </form>
                </div>
            </section>
        `);
    }

    /**Enlaza el submit del formulario de login con el handler que
     * realiza la validación.
     * @param {Function} handler  Handler a ejecutar al enviar*/
    bindLoginForm(handler) {
        const form = document.forms.fLogin;
        if (!form) return;
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            handler(form.username.value.trim(), form.password.value);
        });
    }

    /*Muestra un mensaje de error sobre el formulario de login indicando que las credenciales son inválidas*/
    showInvalidLoginMessage() {
        const form = document.forms.fLogin;
        if (!form) return;
        //Quita mensaje de error previo si existe
        const previous = form.querySelector('.login-error');
        if (previous) previous.remove();
        //Inserta el nuevo mensaje al inicio del form
        form.insertAdjacentHTML('afterbegin', `
            <div class="login-error" role="alert">
                <i class="fas fa-exclamation-circle"></i>
                Usuario o contraseña incorrectos. Inténtalo de nuevo.
            </div>
        `);
        form.password.value = '';
        form.username.focus();
        form.username.select();
    }

    /**Muestra en el header el avatar + nombre del usuario y el
     * botón "Cerrar sesión" (estado autenticado).
     * @param {string} username  Nombre del usuario autenticado*/
    showAuthUserBadge(username) {
        const userArea = document.getElementById('userArea');
        if (!userArea) return;
        const initial = username ? username.charAt(0).toUpperCase() : '?';
        userArea.replaceChildren();
        userArea.insertAdjacentHTML('afterbegin', `
            <div class="user-authenticated">
                <div class="user-info" title="Hola, ${username}">
                    <div class="user-avatar" aria-hidden="true">${initial}</div>
                    <span class="user-name">${username}</span>
                </div>
                <a id="logout-link" href="#" class="btn-logout" title="Cerrar sesión">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Cerrar sesión</span>
                </a>
            </div>
        `);
    }

    /**Enlaza el botón "Cerrar sesión" del header con el handler
     * que cierra la sesión.
     * @param {Function} handler  Handler a ejecutar al hacer click*/
    bindLogout(handler) {
        const link = document.getElementById('logout-link');
        if (!link) return;
        link.addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }
}