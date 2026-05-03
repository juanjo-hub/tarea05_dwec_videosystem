"use strict";

const MODEL = Symbol('VideoSystemModel');
const VIEW = Symbol('VideoSystemView');
const USER = Symbol('AuthenticatedUser'); // DWEC07 - Punto 2

class VideoSystemController {
    constructor(modelVideoSystem, viewVideoSystem) {
        this[MODEL] = modelVideoSystem;
        this[VIEW] = viewVideoSystem;
        this[USER] = null; // suario autenticado actual (DWEC07)

        //Array para almacenar referencias de ventanas abiertas
        this._openedWindows = [];
        this._firstLoad = true;

        //DWEC07 Punto 1. Aviso de uso de cookies
        // Si el usuario no ha aceptado previamente el uso de cookies, mostramos el toast al inicio de la aplicación.
        if (getCookie('acceptedCookieMessage') !== 'true') {
            this[VIEW].showCookiesMessage();
            this[VIEW].bindCookiesMessage(
                this.handleAcceptCookies,
                this.handleDenyCookies,
            );
        }

        //Enlazar handlers con la vista
        this[VIEW].bindInit(this.handleInit);
        this[VIEW].bindCategoryCards(this.handleShowCategory);
        this[VIEW].bindCategoryMenu(this.handleShowCategory);
        this[VIEW].bindProductionCards(this.handleShowProduction);
        this[VIEW].bindActors(this.handleShowActors);
        this[VIEW].bindDirectors(this.handleShowDirectors);
        //DWEC07 Punto 13. enlace al mapa global
        this[VIEW].bindGlobalMap(this.handleShowGlobalMap);
        this[VIEW].bindPersonClick(this.handleShowPerson);
        this[VIEW].bindBreadcrumbHome(this.handleInit);
        this[VIEW].bindBreadcrumbActors(this.handleShowActors);
        this[VIEW].bindBreadcrumbDirectors(this.handleShowDirectors);
        this[VIEW].bindOpenWindow(this.handleOpenWindow);
        this[VIEW].bindCloseWindows(this.handleCloseWindows);
        this[VIEW].bindMenuToggle();

        //Bindings de formularios (DWEC06)
        this[VIEW].bindCreateProduction(this.handleOpenCreateProductionForm);
        this[VIEW].bindDeleteProduction(this.handleOpenDeleteProductionForm);
        this[VIEW].bindCastProduction(this.handleOpenCastForm);
        this[VIEW].bindModalClose();

        // DWEC07 Punto 5.Favoritos
        // El bind se registra una vez aquí (igual que los demás binds del constructor) y delega el click al manejador que controla la seguridad.
        this[VIEW].bindFavoritoBtn(this.handleFavorito);


        //Gestión de history
        window.addEventListener('popstate', (event) => {
            if (event.state) {
                this._restoreState(event.state);
            } else {
                this.onInit(false);
            }
        });
    }

    /*OBTENER PRODUCCIONES ALEATORIAS */
    _getRandomProductions(count = 3) {
        const allProductions = [];
        for (const prod of this[MODEL].productions) {
            allProductions.push(prod);
        }

        //Barajar (Fisher-Yates)
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
            case 'favorites':
                this._showFavorites(false);
                break;
            case 'globalMap':
                this._showGlobalMap(false);
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

        // DWEC07 - Punto 5: Si hay usuario autenticado, mostrar el botón de favorito.
        // Patrón del profesor: onOpenSession() muestra elementos extra al autenticarse.
        // Aquí hacemos lo mismo cada vez que se muestra una ficha de producción.
        if (this[USER]) {
            this[VIEW].showFavoriteButton(production.title, isFavorite(production.title));
        }

        // DWEC07 - Punto 11: si la producción tiene coordenadas, mostrar el mapa
        if (production._lat !== undefined && production._lng !== undefined) {
            this[VIEW].showProductionMap(production.title, production._lat, production._lng);
        }

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
            const born = actData.born instanceof Date ? actData.born : new Date(actData.born);
            const actor = system.createPerson(actData.name, actData.lastname1, born, actData.lastname2 || '', actData.picture || '');
            if (!system._actors.has(actor.toString())) {
                system.addActor(actor);
            }
        }

        // Directores
        for (const dirData of data.directors) {
            const born = dirData.born instanceof Date ? dirData.born : new Date(dirData.born);
            const director = system.createPerson(dirData.name, dirData.lastname1, born, dirData.lastname2 || '', dirData.picture || '');
            if (!system._directors.has(director.toString())) {
                system.addDirector(director);
            }
        }

        // Producciones
        for (const prodData of data.productions) {
            const publication = prodData.publication instanceof Date ? prodData.publication : new Date(prodData.publication);
            let production;
            if (prodData.type === 'Movie') {
                // En el JSON la duración viene como 'duration' directamente (no anidada en resource)
                const resource = prodData.duration ? new Resource(prodData.duration, prodData.link || '') : (prodData.resource ? new Resource(prodData.resource.duration, prodData.resource.link) : null);
                production = new Movie(prodData.title, publication, prodData.nationality, prodData.synopsis, prodData.image, resource);
            } else {
                production = new Serie(prodData.title, publication, prodData.nationality, prodData.synopsis, prodData.image, [], [], prodData.seasons || 0);
            }
            // DWEC07 - Punto 11: recuperar coordenadas guardadas si existen
            if (prodData.lat !== undefined && prodData.lng !== undefined) {
                production._lat = prodData.lat;
                production._lng = prodData.lng;
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

        //DWEC07 - Punto 3: Lectura inicial de la cookie de sesión. Si existe la cookie 'activeUser' y el usuario sigue dado de alta en el modelo, lo recuperamos y abrimos sesión sin pedirel formulario. En caso contrario, se muestra el botón de
        // "Iniciar sesión" en el header.
        const username = getCookie('activeUser');
        if (username) {
            const user = this[MODEL].getUser(username);
            if (user) {
                this[USER] = user;
                this[VIEW].showAuthUserBadge(user.username);
                this[VIEW].bindLogout(this.handleLogout);
                // Punto 6: recuperar menú favoritos si había sesión guardada
                this[VIEW].showFavoritesMenu();
                this[VIEW].bindFavorites(this.handleShowFavorites);
                // Punto 9: recuperar botón backup si había sesión guardada
                this[VIEW].showBackupBtn();
                this[VIEW].bindBackupBtn(this.handleBackup);
            } else {
                // La cookie apunta a un usuario que ya no existe → limpiamos
                deleteCookie('activeUser');
                this._renderLoggedOutHeader();
            }
        } else {
            this._renderLoggedOutHeader();
        }

        // Re-renderizar inicio
        this.onInit();
    }

    /*GESTIÓN DEL HEADER DE AUTENTICACIÓN (DWEC07)*/
    /*botón "Iniciar sesión" en el header y lo enlaza */
    _renderLoggedOutHeader() {
        this[VIEW].showLoginLink();
        this[VIEW].bindLoginLink(this.handleLoginForm);
    }

    /*  HANDLERS DE FORMULARIOS (DWEC06) */
    // 1. CREAR PRODUCCIÓN
    handleOpenCreateProductionForm = () => {
        const system = this[MODEL];

        const categories = [];
        for (const c of system.categories) categories.push(c);

        const actors = [];
        for (const a of system.actors) actors.push(a);

        const directors = [];
        for (const d of system.directors) directors.push(d);

        const existingTitles = [];
        for (const p of system.productions) existingTitles.push(p.title);

        this[VIEW].showCreateProductionForm(
            { categories, actors, directors, existingTitles },
            (data) => this.handleCreateProduction(data)
        );
    }

    handleCreateProduction = (data) => {
        const system = this[MODEL];
        try {
            // 1. Crear la producción
            let production;
            if (data.type === 'Movie') {
                const resource = new Resource(data.duration, 'N/A');
                production = new Movie(
                    data.title, data.publication, data.nationality,
                    data.synopsis, data.image, resource, []
                );
            } else {
                production = new Serie(
                    data.title, data.publication, data.nationality,
                    data.synopsis, data.image, [], [], data.seasons
                );
            }
            system.addProduction(production);

            // 2. Asignar categorías
            for (const catName of data.categories) {
                const cat = this._findCategoryByName(catName);
                if (cat) {
                    try { system.assignCategory(cat, production); } catch (e) { /* ya asignada */ }
                }
            }

            // 3. Asignar director
            const director = this._findDirectorByKey(data.director);
            if (director) {
                try { system.assignDirector(director, production); } catch (e) { /* ya asignado */ }
            }

            // 4. Asignar actores con su rol (firma del modelo: actor, prod, role, prod2, role2, ...)
            for (const actorKey of data.actors) {
                const actor = this._findActorByKey(actorKey);
                if (actor) {
                    try {
                        system.assignActor(actor, production, data.roles[actorKey] || 'Sin especificar');
                    } catch (e) { /* ya asignado */ }
                }
            }

            // DWEC07 - Punto 10: guardar coordenadas si se seleccionó localización
            if (data.lat !== undefined && data.lng !== undefined) {
                production._lat = data.lat;
                production._lng = data.lng;
            }

            // Cerrar el modal antes de mostrar la ficha
            this[VIEW].closeModal();
            this[VIEW].showToast(`Producción "${production.title}" creada correctamente.`, 'success');
            this._showProduction(production.title);
        } catch (err) {
            this[VIEW].showToast(`Error al crear la producción: ${err.message}`, 'error');
        }
    }

    //2. ELIMINAR PRODUCCIÓN
    handleOpenDeleteProductionForm = (preselectedTitle = null) => {
        const system = this[MODEL];
        const productions = [];
        for (const p of system.productions) productions.push(p);

        if (productions.length === 0) {
            this[VIEW].showToast('No hay producciones para eliminar.', 'error');
            return;
        }

        this[VIEW].showDeleteProductionForm(
            { productions, preselectedTitle },
            (data) => this.handleDeleteProduction(data)
        );
    }

    handleDeleteProduction = (data) => {
        const system = this[MODEL];
        try {
            const production = this._findProductionByTitle(data.title);
            if (!production) throw new Error('Producción no encontrada.');

            // Integridad referencial: desligar de categorías, directores y actores
            for (const cat of system.categories) {
                try { system.deassignCategory(cat, production); } catch (e) { /* no estaba */ }
            }
            for (const dir of system.directors) {
                try { system.deassignDirector(dir, production); } catch (e) { /* no estaba */ }
            }
            for (const act of system.actors) {
                try { system.deassignActor(act, production); } catch (e) { /* no estaba */ }
            }

            system.removeProduction(production);

            this[VIEW].showToast(`Producción "${data.title}" eliminada correctamente.`, 'success');
            this.onInit();
        } catch (err) {
            this[VIEW].showToast(`Error al eliminar la producción: ${err.message}`, 'error');
        }
    }

    //3. GESTIONAR REPARTO Y DIRECTOR
    handleOpenCastForm = (preselectedTitle = null) => {
        const system = this[MODEL];

        const productions = [];
        for (const p of system.productions) productions.push(p);

        const allActors = [];
        for (const a of system.actors) allActors.push(a);

        const allDirectors = [];
        for (const d of system.directors) allDirectors.push(d);

        if (productions.length === 0) {
            this[VIEW].showToast('No hay producciones disponibles.', 'error');
            return;
        }

        const getProductionState = (title) => {
            const prod = this._findProductionByTitle(title);
            if (!prod) return { directorKey: null, cast: [] };

            const dirs = this._getDirectorsOfProduction(prod);
            const directorKey = dirs.length > 0 ? dirs[0].toString() : null;

            const cast = [];
            try {
                for (const item of system.getCast(prod)) {
                    cast.push({ actor: item.actor.toString(), role: item.role });
                }
            } catch (e) { /* sin cast */ }

            return { directorKey, cast };
        };

        this[VIEW].showCastForm(
            { productions, allActors, allDirectors, getProductionState, preselectedTitle },
            (data) => this.handleUpdateCast(data)
        );
    }

    handleUpdateCast = (data) => {
        const system = this[MODEL];
        try {
            const production = this._findProductionByTitle(data.title);
            if (!production) throw new Error('Producción no encontrada.');

            // Estado actual
            const dirs = this._getDirectorsOfProduction(production);
            const currentDirectorKey = dirs.length > 0 ? dirs[0].toString() : null;
            const currentCast = [];
            try {
                for (const item of system.getCast(production)) {
                    currentCast.push({ actor: item.actor.toString(), role: item.role });
                }
            } catch (e) { /* sin cast */ }

            //DIRECTOR
            if (currentDirectorKey !== data.directorKey) {
                if (currentDirectorKey) {
                    const oldDir = this._findDirectorByKey(currentDirectorKey);
                    if (oldDir) {
                        try { system.deassignDirector(oldDir, production); } catch (e) { /* ignorar */ }
                    }
                }
                if (data.directorKey) {
                    const newDir = this._findDirectorByKey(data.directorKey);
                    if (newDir) {
                        try { system.assignDirector(newDir, production); } catch (e) { /* ya asignado */ }
                    }
                }
            }

            //ACTORES
            const currentSet = new Set(currentCast.map(c => c.actor));
            const desiredSet = new Set(data.actors.map(a => a.actor));
            const desiredMap = new Map(data.actors.map(a => [a.actor, a.role]));

            // Desasignar los que ya no están
            for (const actorKey of currentSet) {
                if (!desiredSet.has(actorKey)) {
                    const actor = this._findActorByKey(actorKey);
                    if (actor) {
                        try { system.deassignActor(actor, production); } catch (e) { /* ignorar */ }
                    }
                }
            }

            // Asignar los nuevos / actualizar rol cambiado (firma: actor, prod, role)
            for (const [actorKey, role] of desiredMap.entries()) {
                const actor = this._findActorByKey(actorKey);
                if (!actor) continue;
                const currentItem = currentCast.find(c => c.actor === actorKey);

                if (!currentItem) {
                    try {
                        system.assignActor(actor, production, role);
                    } catch (e) { /* ignorar */ }
                } else if (currentItem.role !== role) {
                    // Cambio de rol: desasignar y reasignar
                    try { system.deassignActor(actor, production); } catch (e) { /* ignorar */ }
                    try { system.assignActor(actor, production, role); } catch (e) { /* ignorar */ }
                }
            }

            this[VIEW].showToast(`Reparto de "${production.title}" actualizado correctamente.`, 'success');
            this._showProduction(production.title);
        } catch (err) {
            this[VIEW].showToast(`Error al actualizar el reparto: ${err.message}`, 'error');
        }
    }

    /* HANDLERS DE COOKIES (DWEC07 - Punto 1) */
    /*Se ejecuta cuando el usuario pulsa "Aceptar" en el aviso de cookies. Guarda una cookie "acceptedCookieMessage=true" que se mantendrá durante un año, de forma que el aviso no vuelva a mostrarse hasta que expire o el usuario borre sus cookies*/
    handleAcceptCookies = () => {
        setCookie('acceptedCookieMessage', 'true', 365);
        this[VIEW].hideCookiesMessage();
        this[VIEW].showToast('Has aceptado el uso de cookies.', 'success');
    }

    /*Se ejecuta cuando el usuario pulsa "Denegar" o cierra el aviso. No se guarda ninguna cookie (volverá a aparecer la próxima vez) y se bloquea el contenido de la página mostrand un mensaje que indica que debe aceptar para continuar*/
    handleDenyCookies = () => {
        this[VIEW].hideCookiesMessage();
        this[VIEW].showCookiesDeniedMessage();
    }

    /* HANDLERS DE AUTENTICACIÓN DWEC07Puntos 2, 3 y 4)*/

    /* Muestra el formulario de login en el <main> al pulsar el botón "Iniciar sesión" del header.*/
    handleLoginForm = () => {
        this[VIEW].showLoginForm();
        this[VIEW].bindLoginForm(this.handleLogin);
    }

    /**
     * Comprueba las credenciales que ha enviado el usuario.
     * - Si son válidas: guarda al usuario en el controlador, deja
     *   la cookie 'activeUser' (7 días) y dispara onOpenSession().
     * - Si son inválidas: muestra el mensaje de error.
     * @param {string} username  Usuario introducido en el form.
     * @param {string} password  Contraseña introducida.*/
    handleLogin = (username, password) => {
        if (this[MODEL].validateUser(username, password)) {
            this[USER] = this[MODEL].getUser(username);
            // DWEC07 - Punto 2: dejamos la cookie con duración 7 días
            setCookie('activeUser', this[USER].username, 7);
            this.onOpenSession();
        } else {
            this[VIEW].showInvalidLoginMessage();
        }
    }

    /*Cierra la sesión actual: borra la cookie y restablece el estado del header. Vuelve al inicio*/
    handleLogout = () => {
        const username = this[USER] ? this[USER].username : '';
        this.onCloseSession();
        this[VIEW].showToast(
            `Sesión cerrada${username ? `, ¡hasta pronto ${username}!` : '.'}`,
            'success'
        );
    }


    //DWEC07 - Punto 5: Manejador del botón favorito
    //Si no hay usuario autenticado, no se ejecuta la acción
    handleFavorito = (title) => {
        if (!this[USER]) return; // seguridad: solo usuarios autenticados

        const favs = getFavorites();
        const yaEsFavorito = favs.includes(title);

        if (yaEsFavorito) {
            // Quitar: filtrar el título fuera del array
            setFavorites(favs.filter(t => t !== title));
            this[VIEW].showFavoriteButton(title, false);
            this[VIEW].showToast(`"${title}" eliminada de favoritos`, 'success');
        } else {
            // Añadir: push al array y guardar
            favs.push(title);
            setFavorites(favs);
            this[VIEW].showFavoriteButton(title, true);
            this[VIEW].showToast(`"${title}" añadida a favoritos ⭐`, 'success');
        }
    }

    //DWEC07 - Punto 6. Muestra la lista de producciones favoritas
    //Punto 7. Solo accesible si hay usuario autenticado
    _showFavorites = (pushHistory = true) => {
        if (!this[USER]) return; // seguridad punto 7

        const titles = getFavorites();
        const productions = [];
        for (const title of titles) {
            const prod = this._findProductionByTitle(title);
            if (prod) productions.push(prod);
        }
        this[VIEW].showFavoritesList(productions);

        if (pushHistory) {
            this._pushHistory({ action: 'favorites' });
        }
    }

    handleShowFavorites = () => {
        this._showFavorites();
    }

    //DWEC07 Punto 13.Mapa global con todas las producciones que tengan
    _showGlobalMap = (pushHistory = true) => {
        const productionsConCoords = [];
        for (const prod of this[MODEL].productions) {
            if (prod._lat !== undefined && prod._lng !== undefined) {
                productionsConCoords.push(prod);
            }
        }
        this[VIEW].showGlobalMap(productionsConCoords);

        if (pushHistory) {
            this._pushHistory({ action: 'globalMap' });
        }
    }

    handleShowGlobalMap = () => {
        this._showGlobalMap();
    }

    //DWEC07 Punto 9. Backup de datos con fetch POST al writeJSONBackup.php
    handleBackup = () => {
        if (!this[USER]) return; // seguridad punto 7

        // Serializar el estado actual del modelo a JSON
        const system = this[MODEL];
        const backup = {
            categories: [],
            actors: [],
            directors: [],
            productions: [],
            categoryAssignments: [],
            directorAssignments: [],
            actorAssignments: [],
            users: []
        };

        for (const cat of system.categories) {
            backup.categories.push({ name: cat.name, description: cat.description });
        }
        for (const actor of system.actors) {
            backup.actors.push({ name: actor.name, lastname1: actor.lastname1, lastname2: actor.lastname2 || '', born: actor.born.toISOString().split('T')[0], picture: actor.picture || '' });
        }
        for (const director of system.directors) {
            backup.directors.push({ name: director.name, lastname1: director.lastname1, lastname2: director.lastname2 || '', born: director.born.toISOString().split('T')[0], picture: director.picture || '' });
        }
        for (const prod of system.productions) {
            const entry = { type: prod instanceof Movie ? 'Movie' : 'Serie', title: prod.title, publication: prod._publication.toISOString().split('T')[0], nationality: prod._nationality || '', synopsis: prod._synopsis || '', image: prod._image || '' };
            if (prod instanceof Movie && prod._resource) entry.duration = prod._resource.duration;
            if (prod instanceof Serie) entry.seasons = prod._seasons || 0;
            // DWEC07 - Punto 11: guardar coordenadas si existen
            if (prod._lat !== undefined && prod._lng !== undefined) {
                entry.lat = prod._lat;
                entry.lng = prod._lng;
            }
            backup.productions.push(entry);
        }
        for (const cat of system.categories) {
            try {
                for (const prod of system.getProductionsCategory(cat)) {
                    backup.categoryAssignments.push({ category: cat.name, production: prod.title });
                }
            } catch (e) { /* ignorar */ }
        }
        for (const director of system.directors) {
            try {
                for (const prod of system.getProductionsDirector(director)) {
                    backup.directorAssignments.push({ director: director.toString(), production: prod.title });
                }
            } catch (e) { /* ignorar */ }
        }
        for (const prod of system.productions) {
            try {
                for (const item of system.getCast(prod)) {
                    backup.actorAssignments.push({ actor: item.actor.toString(), production: prod.title, role: item.role });
                }
            } catch (e) { /* ignorar */ }
        }

        // Enviar al PHP con fetch POST + FormData
        const formData = new FormData();
        formData.append('jsonObj', JSON.stringify(backup, null, 2));

        fetch('writeJSONBackup.php', { method: 'post', body: formData })
            .then((response) => response.text())
            .then((filename) => {
                this[VIEW].showToast(`Backup guardado: ${filename}`, 'success');
            })
            .catch(() => {
                this[VIEW].showToast('Error al guardar el backup.', 'error');
            });
    }

    /*Evento que se dispara al iniciar correctamente una sesión.Repinta el header con el badge del usuario y muestra el inicio de la aplicación con un toast de bienvenida*/
    onOpenSession() {
        const username = this[USER].username;
        this[VIEW].showAuthUserBadge(username);
        this[VIEW].bindLogout(this.handleLogout);
        // DWEC07 Punto 6.Mostrar menú favoritos al abrir sesión
        this[VIEW].showFavoritesMenu();
        this[VIEW].bindFavorites(this.handleShowFavorites);
        // DWEC07 Punto 9.
        // Mostrar botón backup al abrir sesión
        this[VIEW].showBackupBtn();
        this[VIEW].bindBackupBtn(this.handleBackup);
        this.onInit();
        this[VIEW].showToast(`¡Hola, ${username}!`, 'success');
    }

    /*Evento que se dispara al cerrar la sesión. Limpia el usuario del controlador, borra la cookie y restablece el header al estado anónimo*/
    onCloseSession() {
        this[USER] = null;
        deleteCookie('activeUser');
        this._renderLoggedOutHeader();
        // DWEC07 - Punto 6. Ocultar menú favoritos al cerrar sesión.
        this[VIEW].removeFavoritesMenu();
        // DWEC07 Punto 9. Ocultar botón backup al cerrar sesión.
        this[VIEW].removeBackupBtn();
        this.onInit();
    }
}