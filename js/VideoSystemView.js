"use strict";

class VideoSystemView {
    constructor() {
        this.main = document.getElementById('main-content');
        this.menu = document.getElementById('nav-menu');
        this.categoriesMenu = null; // se creará dinámicamente
    }

    /* HELPER: renderizar imagen con fallback a icono */
    _renderImage(src, fallbackIcon, alt = '') {
        // Si no hay src o parece un placeholder tipo "inception.jpg" (sin ruta ni http), mostramos el icono directamente
        const isValidSrc = src && (src.startsWith('http') || src.startsWith('img/') || src.startsWith('./') || src.startsWith('/'));

        if (!isValidSrc) {
            return `<i class="fas ${fallbackIcon}"></i>`;
        }

        // Escapamos comillas simples para el onerror inline
        const safeIcon = fallbackIcon.replace(/'/g, "\\'");
        return `<img src="${src}" alt="${alt}" onerror="this.outerHTML='<i class=\\'fas ${safeIcon}\\'></i>'">`;
    }

    /* INIT - Página de inicio */
    init(categories, randomProductions) {
        this.main.replaceChildren();

        // Breadcrumb
        this.main.insertAdjacentHTML('afterbegin', `
            <div class="breadcrumb"><a href="#" class="breadcrumb-home">Inicio</a></div>
        `);

        // Título de categorías
        this.main.insertAdjacentHTML('beforeend', `
            <h2 class="section-title"><i class="fas fa-layer-group"></i> Categorías</h2>
        `);

        // Grid de categorías
        const catGrid = document.createElement('div');
        catGrid.classList.add('cards-grid');
        catGrid.id = 'categories-grid';

        // Mapa de iconos por nombre de categoría (los no mapeados usan 'fa-film' por defecto)
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

        // Título de producciones aleatorias
        this.main.insertAdjacentHTML('beforeend', `
            <div class="random-section">
                <h2 class="section-title"><i class="fas fa-dice"></i> Producciones destacadas</h2>
            </div>
        `);

        // Grid de producciones aleatorias
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

    /* MENÚ - Crear menú de categorías */
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

    /* PRODUCCIONES DE UNA CATEGORÍA*/
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

        // Sección directores
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

        // Sección actores (casting)
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

    /* LISTADO DE ACTORES */
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

    /* LISTADO DE DIRECTORES */
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

    /* FICHA DE ACTOR */
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

    /* FICHA DE DIRECTOR */
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

    /* BIND METHODS (enlazar handlers de la vista)*/

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

    // Click en categoría (grid central)
    bindCategoryCards(handler) {
        this.main.addEventListener('click', (event) => {
            const card = event.target.closest('.card[data-category]');
            if (card) {
                event.preventDefault();
                handler(card.dataset.category);
            }
        });
    }

    // Click en categoría (menú nav)
    bindCategoryMenu(handler) {
        document.getElementById('nav-menu').addEventListener('click', (event) => {
            const link = event.target.closest('.nav-cat-link');
            if (link) {
                event.preventDefault();
                handler(link.dataset.category);
            }
        });
    }

    // Click en producción
    bindProductionCards(handler) {
        this.main.addEventListener('click', (event) => {
            // Primero comprobamos chips (dentro de fichas de actores/directores)
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
            }
        });
    }

    // Listado de actores
    bindActors(handler) {
        document.getElementById('nav-actors').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    // Listado de directores
    bindDirectors(handler) {
        document.getElementById('nav-directors').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    // Click en persona (actor/director) desde cualquier ficha
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

    // Breadcrumb inicio
    bindBreadcrumbHome(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-home');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    // Breadcrumb actores
    bindBreadcrumbActors(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-actors');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    // Breadcrumb directores
    bindBreadcrumbDirectors(handler) {
        this.main.addEventListener('click', (event) => {
            const link = event.target.closest('.breadcrumb-directors');
            if (link) {
                event.preventDefault();
                handler();
            }
        });
    }

    // Abrir en ventana nueva
    bindOpenWindow(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-open-window');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.type, btn.dataset.title || btn.dataset.person);
            }
        });
    }

    // Cerrar todas las ventanas
    bindCloseWindows(handler) {
        document.getElementById('nav-close-windows').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    // Menú hamburguesa (responsive)
    bindMenuToggle() {
        document.getElementById('hamburger-menu').addEventListener('click', () => {
            document.getElementById('nav-menu').classList.toggle('show');
        });
    }

    /* TOAST NOTIFICATION */
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

    /* ============================================================
     *  MODAL Y FORMULARIOS (DWEC06)
     * ============================================================ */

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
        this.openModal(html);
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
        this.openModal(html);
        const form = document.forms.fCast;
        VideoSystemForms.initCastForm(form, {
            todosLosActores: allActors,
            todosLosDirectores: allDirectors,
            obtenerEstadoProduccion: getProductionState,
            alEnviar: onSubmit,
            tituloPreseleccionado: preselectedTitle,
        });
    }

    /* ---------- Bindings de los nuevos elementos UI ---------- */

    // FAB "Nueva producción"
    bindCreateProduction(handler) {
        document.getElementById('fab-new-production').addEventListener('click', (event) => {
            event.preventDefault();
            handler();
        });
    }

    // Botón "Eliminar" dentro de la ficha de producción
    bindDeleteProduction(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-delete-prod');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.title);
            }
        });
    }

    // Botón "Gestionar reparto" dentro de la ficha de producción
    bindCastProduction(handler) {
        this.main.addEventListener('click', (event) => {
            const btn = event.target.closest('.btn-cast-prod');
            if (btn) {
                event.preventDefault();
                handler(btn.dataset.title);
            }
        });
    }

    // Cerrar modal (botón X, click en el overlay, tecla Escape)
    bindModalClose() {
        const modal = document.getElementById('modal');
        modal.addEventListener('click', (event) => {
            // Si se hace clic en el botón X o en cualquier elemento dentro de él
            if (event.target.closest('.modal-close')) {
                this.closeModal();
                return;
            }
            // Si se hace clic en el overlay (fondo oscuro)
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
}
