"use strict";

const MODEL = Symbol('VideoSystemModel');
const VIEW = Symbol('VideoSystemView');

class VideoSystemController {
    constructor(modelVideoSystem, viewVideoSystem) {
        this[MODEL] = modelVideoSystem;
        this[VIEW] = viewVideoSystem;

        // Array para almacenar referencias de ventanas abiertas
        this._openedWindows = [];
        this._firstLoad = true;

        // Enlazar handlers con la vista
        this[VIEW].bindInit(this.handleInit);
        this[VIEW].bindCategoryCards(this.handleShowCategory);
        this[VIEW].bindCategoryMenu(this.handleShowCategory);
        this[VIEW].bindProductionCards(this.handleShowProduction);
        this[VIEW].bindActors(this.handleShowActors);
        this[VIEW].bindDirectors(this.handleShowDirectors);
        this[VIEW].bindPersonClick(this.handleShowPerson);
        this[VIEW].bindBreadcrumbHome(this.handleInit);
        this[VIEW].bindBreadcrumbActors(this.handleShowActors);
        this[VIEW].bindBreadcrumbDirectors(this.handleShowDirectors);
        this[VIEW].bindOpenWindow(this.handleOpenWindow);
        this[VIEW].bindCloseWindows(this.handleCloseWindows);
        this[VIEW].bindMenuToggle();

        // Gestión de history - popstate
        window.addEventListener('popstate', (event) => {
            if (event.state) {
                this._restoreState(event.state);
            } else {
                this.onInit(false); // false = no push history
            }
        });
    }

    /*OBTENER PRODUCCIONES ALEATORIAS */
    _getRandomProductions(count = 3) {
        const allProductions = [];
        for (const prod of this[MODEL].productions) {
            allProductions.push(prod);
        }

        // Barajar (Fisher-Yates)
        for (let i = allProductions.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [allProductions[i], allProductions[j]] = [allProductions[j], allProductions[i]];
        }

        return allProductions.slice(0, count);
    }

    /*BUSCAR PERSONA POR toString() */
    _findActorByKey(key) {
        for (const actor of this[MODEL].actors) {
            if (actor.toString() === key) return actor;
        }
        return null;
    }

    _findDirectorByKey(key) {
        for (const director of this[MODEL].directors) {
            if (director.toString() === key) return director;
        }
        return null;
    }

    _findCategoryByName(name) {
        for (const cat of this[MODEL].categories) {
            if (cat.name === name) return cat;
        }
        return null;
    }

    _findProductionByTitle(title) {
        for (const prod of this[MODEL].productions) {
            if (prod.title === title) return prod;
        }
        return null;
    }

    /* OBTENER DIRECTORES DE PRODUCCIÓN */
    _getDirectorsOfProduction(production) {
        const directors = [];
        for (const director of this[MODEL].directors) {
            try {
                for (const prod of this[MODEL].getProductionsDirector(director)) {
                    if (prod.title === production.title) {
                        directors.push(director);
                        break;
                    }
                }
            } catch (e) { /* ignorar */ }
        }
        return directors;
    }

    /* HISTORY - pushState y restoreState*/
    _pushHistory(state) {
        if (this._firstLoad) {
            history.replaceState(state, null);
            this._firstLoad = false;
        } else {
            history.pushState(state, null);
        }
    }

    _restoreState(state) {
        switch (state.action) {
            case 'init':
                this.onInit(false);
                break;
            case 'category':
                this._showCategory(state.categoryName, false);
                break;
            case 'production':
                this._showProduction(state.productionTitle, false);
                break;
            case 'actors':
                this._showActors(false);
                break;
            case 'directors':
                this._showDirectors(false);
                break;
            case 'actorDetail':
                this._showPerson(state.personKey, 'actor', false);
                break;
            case 'directorDetail':
                this._showPerson(state.personKey, 'director', false);
                break;
        }
    }

    /* EVENTOS (on...) Y HANDLERS (handle...)*/

    // --- INICIO ---
    onInit = (pushHistory = true) => {
        const categories = this[MODEL].categories;
        const randomProductions = this._getRandomProductions(3);
        this[VIEW].init(categories, randomProductions);
        this[VIEW].showCategoriesInMenu(categories);

        if (pushHistory) {
            this._pushHistory({ action: 'init' });
        }
    }

    handleInit = () => {
        this.onInit();
    }

    // CATEGORÍA
    _showCategory = (categoryName, pushHistory = true) => {
        const category = this._findCategoryByName(categoryName);
        if (!category) return;

        const productions = [];
        for (const prod of this[MODEL].getProductionsCategory(category)) {
            productions.push(prod);
        }
        this[VIEW].showProductionsCategory(category, productions);

        if (pushHistory) {
            this._pushHistory({ action: 'category', categoryName: categoryName });
        }
    }

    handleShowCategory = (categoryName) => {
        this._showCategory(categoryName);
    }

    //PRODUCCIÓN
    _showProduction = (productionTitle, pushHistory = true) => {
        const production = this._findProductionByTitle(productionTitle);
        if (!production) return;

        const cast = [];
        for (const item of this[MODEL].getCast(production)) {
            cast.push(item);
        }

        const directors = this._getDirectorsOfProduction(production);

        this[VIEW].showProductionDetail(production, cast, directors);

        if (pushHistory) {
            this._pushHistory({ action: 'production', productionTitle: productionTitle });
        }
    }

    handleShowProduction = (productionTitle) => {
        this._showProduction(productionTitle);
    }

    //ACTORE
    _showActors = (pushHistory = true) => {
        const actors = [];
        for (const actor of this[MODEL].actors) {
            actors.push(actor);
        }
        this[VIEW].showActorsList(actors);

        if (pushHistory) {
            this._pushHistory({ action: 'actors' });
        }
    }

    handleShowActors = () => {
        this._showActors();
    }

    //DIRECTORES
    _showDirectors = (pushHistory = true) => {
        const directors = [];
        for (const director of this[MODEL].directors) {
            directors.push(director);
        }
        this[VIEW].showDirectorsList(directors);

        if (pushHistory) {
            this._pushHistory({ action: 'directors' });
        }
    }

    handleShowDirectors = () => {
        this._showDirectors();
    }

    //DETALLE PERSONA
    _showPerson = (personKey, type, pushHistory = true) => {
        if (type === 'actor') {
            const actor = this._findActorByKey(personKey);
            if (!actor) return;

            const productions = [];
            try {
                for (const item of this[MODEL].getProductionsActor(actor)) {
                    productions.push(item);
                }
            } catch (e) { /* ignorar */ }

            this[VIEW].showActorDetail(actor, productions);

            if (pushHistory) {
                this._pushHistory({ action: 'actorDetail', personKey: personKey });
            }
        } else if (type === 'director') {
            const director = this._findDirectorByKey(personKey);
            if (!director) return;

            const productions = [];
            try {
                for (const prod of this[MODEL].getProductionsDirector(director)) {
                    productions.push(prod);
                }
            } catch (e) { /* ignorar */ }

            this[VIEW].showDirectorDetail(director, productions);

            if (pushHistory) {
                this._pushHistory({ action: 'directorDetail', personKey: personKey });
            }
        }
    }

    handleShowPerson = (personKey, type) => {
        this._showPerson(personKey, type);
    }

    //ABRIR VENTANA NUEVA
    handleOpenWindow = (type, identifier) => {
        const newWindow = window.open(
            'auxPage.html',
            '_blank',
            'width=800,height=600,top=200,left=200,titlebar=yes,toolbar=no,menubar=no,location=no'
        );

        if (newWindow) {
            this._openedWindows.push(newWindow);

            newWindow.addEventListener('load', () => {
                const auxContent = newWindow.document.getElementById('aux-content');
                if (!auxContent) return;

                if (type === 'production') {
                    const production = this._findProductionByTitle(identifier);
                    if (!production) return;

                    const cast = [];
                    for (const item of this[MODEL].getCast(production)) {
                        cast.push(item);
                    }
                    const directors = this._getDirectorsOfProduction(production);

                    const typeIcon = production instanceof Movie ? 'fa-video' : 'fa-tv';
                    const typeName = production instanceof Movie ? 'Película' : 'Serie';

                    let resourceHtml = '';
                    if (production instanceof Movie && production._resource) {
                        resourceHtml = `<p><strong>Duración:</strong> ${production._resource.duration} min</p>`;
                    }

                    let seasonsHtml = '';
                    if (production instanceof Serie && production._seasons) {
                        seasonsHtml = `<p><strong>Temporadas:</strong> ${production._seasons}</p>`;
                    }

                    auxContent.innerHTML = `
                        <div style="max-width:700px;margin:30px auto;padding:20px;background:#161b22;border-radius:14px;border:1px solid #30363d;color:#e6edf3;font-family:Segoe UI,sans-serif;">
                            <h2 style="color:#e94560;margin-bottom:15px;"><i class="fas ${typeIcon}"></i> ${production.title}</h2>
                            <p><strong>Tipo:</strong> ${typeName}</p>
                            <p><strong>Año:</strong> ${production._publication.getFullYear()}</p>
                            <p><strong>Nacionalidad:</strong> ${production._nationality || 'N/A'}</p>
                            ${resourceHtml}
                            ${seasonsHtml}
                            <p style="font-style:italic;color:#a0a8b4;margin-top:10px;">${production._synopsis || 'Sin sinopsis'}</p>
                            <h3 style="color:#e94560;margin-top:20px;">Directores</h3>
                            <p>${directors.length > 0 ? directors.map(d => d.toString()).join(', ') : 'Sin directores'}</p>
                            <h3 style="color:#e94560;margin-top:20px;">Reparto</h3>
                            <p>${cast.length > 0 ? cast.map(c => c.actor.toString() + ' (' + c.role + ')').join(', ') : 'Sin actores'}</p>
                        </div>
                    `;

                } else if (type === 'actor') {
                    const actor = this._findActorByKey(identifier);
                    if (!actor) return;

                    const productions = [];
                    try {
                        for (const item of this[MODEL].getProductionsActor(actor)) {
                            productions.push(item);
                        }
                    } catch (e) { /* ignorar */ }

                    auxContent.innerHTML = `
                        <div style="max-width:700px;margin:30px auto;padding:20px;background:#161b22;border-radius:14px;border:1px solid #30363d;color:#e6edf3;font-family:Segoe UI,sans-serif;">
                            <h2 style="color:#e94560;margin-bottom:15px;"><i class="fas fa-user"></i> ${actor.name} ${actor.lastname1} ${actor.lastname2 || ''}</h2>
                            <p><strong>Nacimiento:</strong> ${actor.born.toLocaleDateString('es-ES')}</p>
                            <h3 style="color:#e94560;margin-top:20px;">Producciones</h3>
                            <p>${productions.length > 0 ? productions.map(i => i.production.title + ' (' + i.role + ')').join(', ') : 'Sin producciones'}</p>
                        </div>
                    `;

                } else if (type === 'director') {
                    const director = this._findDirectorByKey(identifier);
                    if (!director) return;

                    const productions = [];
                    try {
                        for (const prod of this[MODEL].getProductionsDirector(director)) {
                            productions.push(prod);
                        }
                    } catch (e) { /* ignorar */ }

                    auxContent.innerHTML = `
                        <div style="max-width:700px;margin:30px auto;padding:20px;background:#161b22;border-radius:14px;border:1px solid #30363d;color:#e6edf3;font-family:Segoe UI,sans-serif;">
                            <h2 style="color:#e94560;margin-bottom:15px;"><i class="fas fa-user-tie"></i> ${director.name} ${director.lastname1} ${director.lastname2 || ''}</h2>
                            <p><strong>Nacimiento:</strong> ${director.born.toLocaleDateString('es-ES')}</p>
                            <h3 style="color:#e94560;margin-top:20px;">Producciones dirigidas</h3>
                            <p>${productions.length > 0 ? productions.map(p => p.title).join(', ') : 'Sin producciones'}</p>
                        </div>
                    `;
                }
            });

            this[VIEW].showToast('Ventana abierta correctamente');
        }
    }

    // CERRAR TODAS LAS VENTANA
    handleCloseWindows = () => {
        let closedCount = 0;
        for (const win of this._openedWindows) {
            if (win && !win.closed) {
                win.close();
                closedCount++;
            }
        }
        this._openedWindows = [];
        this[VIEW].showToast(`Se han cerrado ${closedCount} ventana(s)`);
    }

    /* CARGA INICIAL DE DATOS (onLoad) */
    onLoad(data) {
        const system = this[MODEL];

        // Categorías
        for (const catData of data.categories) {
            const cat = system.createCategory(catData.name, catData.description);
            if (!system._categories.has(cat.name)) {
                system.addCategory(cat);
            }
        }

        // Actores
        for (const actData of data.actors) {
            const actor = system.createPerson(actData.name, actData.lastname1, actData.born, actData.lastname2 || '', actData.picture || '');
            if (!system._actors.has(actor.toString())) {
                system.addActor(actor);
            }
        }

        // Directores
        for (const dirData of data.directors) {
            const director = system.createPerson(dirData.name, dirData.lastname1, dirData.born, dirData.lastname2 || '', dirData.picture || '');
            if (!system._directors.has(director.toString())) {
                system.addDirector(director);
            }
        }

        // Producciones
        for (const prodData of data.productions) {
            let production;
            if (prodData.type === 'Movie') {
                const resource = prodData.resource ? new Resource(prodData.resource.duration, prodData.resource.link) : null;
                production = new Movie(prodData.title, prodData.publication, prodData.nationality, prodData.synopsis, prodData.image, resource);
            } else {
                production = new Serie(prodData.title, prodData.publication, prodData.nationality, prodData.synopsis, prodData.image, [], [], prodData.seasons || 0);
            }
            if (!system._productions.has(production.title)) {
                system.addProduction(production);
            }
        }

        // Asignar categorías
        for (const assign of data.categoryAssignments) {
            const cat = this._findCategoryByName(assign.category);
            const prod = this._findProductionByTitle(assign.production);
            if (cat && prod) {
                try {
                    system.assignCategory(cat, prod);
                } catch (e) { /* ya asignada */ }
            }
        }

        // Asignar directores
        for (const assign of data.directorAssignments) {
            const director = this._findDirectorByKey(assign.director);
            const prod = this._findProductionByTitle(assign.production);
            if (director && prod) {
                try {
                    system.assignDirector(director, prod);
                } catch (e) { /* ignorar */ }
            }
        }

        // Asignar actores
        for (const assign of data.actorAssignments) {
            const actor = this._findActorByKey(assign.actor);
            const prod = this._findProductionByTitle(assign.production);
            if (actor && prod) {
                try {
                    system.assignActor(actor, prod, assign.role);
                } catch (e) { /* ignorar */ }
            }
        }

        // Usuarios
        for (const userData of data.users) {
            try {
                const user = system.createUser(userData.username, userData.email, userData.password);
                if (!system._users.has(user.username)) {
                    system.addUser(user);
                }
            } catch (e) { /* ignorar */ }
        }

        // Re-renderizar inicio
        this.onInit();
    }
}
