"use strict";

/* Arranque del MVC al termoinar de cargar la página */
window.addEventListener('load', () => {

    // Instanciar MVC
    const model = VideoSystem.getInstance('VideoSystem');
    const view = new VideoSystemView();
    const controller = new VideoSystemController(model, view);

    controller.onLoad({
        /* CATEGORÍAS  */
        categories: [
            { name: 'Terror', description: 'Suspense, sustos y lo paranormal' },
            { name: 'Ciencia Ficción', description: 'Futuros posibles, tecnología y exploración espacial' },
            { name: 'Acción', description: 'Aventura, adrenalina y grandes persecuciones' },
        ],

        /* ACTORES (16) */
        actors: [
            { name: 'Sigourney', lastname1: 'Weaver', born: new Date(1949, 9, 8),
              picture: 'https://media.themoviedb.org/t/p/w300_and_h450_face/wTSnfktNBLd6kwQxgvkqYw6vEon.jpg' },
            { name: 'John', lastname1: 'Hurt', born: new Date(1940, 0, 22),
              picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRu91hZwExJwOg1q7Z2nofvHIqGXpGWGBYkJg&s' },
            { name: 'James', lastname1: 'McAvoy', born: new Date(1979, 3, 21),
              picture: 'https://m.media-amazon.com/images/M/MV5BMTQzNzIxOTYzMl5BMl5BanBnXkFtZTcwNjYxNTk1Nw@@._V1_FMjpg_UX1000_.jpg' },
            { name: 'Anya', lastname1: 'Taylor-Joy', born: new Date(1996, 3, 16),
              picture: 'https://m.media-amazon.com/images/M/MV5BNGFhYTZiMGMtNTgwMi00ZWY3LTlhNDEtMTY4MDI2YzlmNDI2XkEyXkFqcGc@._V1_.jpg' },
            { name: 'Patrick', lastname1: 'Wilson', born: new Date(1973, 6, 3),
              picture: 'https://m.media-amazon.com/images/M/MV5BMTkzNzcxNzcxMF5BMl5BanBnXkFtZTgwOTM1ODUzMTE@._V1_FMjpg_UX1000_.jpg' },
            { name: 'Vera', lastname1: 'Farmiga', born: new Date(1973, 7, 6),
              picture: 'https://images.mubicdn.net/images/cast_member/23765/cache-650230-1628157376/image-w856.jpg' },
            { name: 'Michael B.', lastname1: 'Jordan', born: new Date(1987, 1, 9),
              picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/23/Michael_B_Jordan_-_Sinners_%28cropped%29.jpg/250px-Michael_B_Jordan_-_Sinners_%28cropped%29.jpg' },
            { name: 'Hailee', lastname1: 'Steinfeld', born: new Date(1996, 11, 11),
              picture: 'https://upload.wikimedia.org/wikipedia/commons/2/20/Hailee_Steinfeld_%2821604481176%29_%28cropped%29-001.jpg' },
            { name: 'Leonardo', lastname1: 'DiCaprio', born: new Date(1974, 10, 11),
              picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Leonardo_DiCaprio_-_BFI_Southbank_3_%28crop%29.jpg/250px-Leonardo_DiCaprio_-_BFI_Southbank_3_%28crop%29.jpg' },
            { name: 'Tom', lastname1: 'Hardy', born: new Date(1977, 8, 15),
              picture: 'https://image.tmdb.org/t/p/w500/d81K0RH8UX7tZj49tZaQhZ9ewH.jpg' },
            { name: 'Harrison', lastname1: 'Ford', born: new Date(1942, 6, 13),
              picture: 'https://image.tmdb.org/t/p/w500/zVnHagUvXkR2StdOtquEwsiwSVt.jpg' },
            { name: 'Rutger', lastname1: 'Hauer', born: new Date(1944, 0, 23),
              picture: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Rutger_Hauer_%282018%29.jpg' },
            { name: 'Matt', lastname1: 'Damon', born: new Date(1970, 9, 8),
              picture: 'https://image.tmdb.org/t/p/w500/n2Dk0dHCh0UhEqmcjGz0ZY6Z5Um.jpg' },
            { name: 'Jessica', lastname1: 'Chastain', born: new Date(1977, 2, 24),
              picture: 'https://image.tmdb.org/t/p/w500/oxXIMzJLhgvyVDhtnmLpi8iRtVN.jpg' },
            { name: 'Samuel L.', lastname1: 'Jackson', born: new Date(1948, 11, 21),
              picture: 'https://image.tmdb.org/t/p/w500/nCJJ3NVksYNxIzEHcyC1XziwPVj.jpg' },
            { name: 'Alfred', lastname1: 'Molina', born: new Date(1953, 4, 24),
              picture: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/AlfredMolinaByJustinHoch2009.jpg/250px-AlfredMolinaByJustinHoch2009.jpg' },
        ],

        /* DIRECTORES (9) */
        directors: [
            { name: 'Ridley', lastname1: 'Scott', born: new Date(1937, 10, 30),
              picture: 'https://image.tmdb.org/t/p/w500/zABJmN9opmqD4orWl3KSdCaSo7Q.jpg' },
            { name: 'M. Night', lastname1: 'Shyamalan', born: new Date(1970, 7, 6),
              picture: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnzIV4F9YotPIluzPGHmDDzUqz1ei5b4VxNg&s' },
            { name: 'James', lastname1: 'Wan', born: new Date(1977, 1, 26),
              picture: 'https://pics.filmaffinity.com/016750410276030-nm_200.jpg' },
            { name: 'Ryan', lastname1: 'Coogler', born: new Date(1986, 4, 23),
              picture: 'https://image.tmdb.org/t/p/w500/mEF1ppuFmFqQEYWTo6aTJQYYu4T.jpg' },
            { name: 'Christopher', lastname1: 'Nolan', born: new Date(1970, 6, 30),
              picture: 'https://image.tmdb.org/t/p/w500/xuAIuYSmsUzKlUMBFGVZaWsY3DZ.jpg' },
            { name: 'Steven', lastname1: 'Spielberg', born: new Date(1946, 11, 18),
              picture: 'https://image.tmdb.org/t/p/w500/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg' },
            { name: 'George', lastname1: 'Miller', born: new Date(1945, 2, 3),
              picture: 'https://image.tmdb.org/t/p/w500/vXQPE3cGp7IYDtMmUzvMeB7rCOi.jpg' },
            { name: 'Martin', lastname1: 'Scorsese', born: new Date(1942, 10, 17),
              picture: 'https://image.tmdb.org/t/p/w500/9U9Y5GQuWX3EZy39B8nkk4NY01S.jpg' },
            { name: 'Quentin', lastname1: 'Tarantino', born: new Date(1963, 2, 27),
              picture: 'https://image.tmdb.org/t/p/w500/1gjcpAa99FAOWGnrUvHEXXsRs7o.jpg' },
        ],

        /* PRODUCCIONES/PELICULAS (12)  */
        productions: [
            // TERROR (4)
            { type: 'Movie', title: 'Alien, el octavo pasajero',
              publication: new Date(1979, 4, 25), nationality: 'USA',
              synopsis: 'La tripulación de una nave comercial es acechada por una criatura alienígena letal después de responder a una señal de socorro.',
              image: 'https://image.tmdb.org/t/p/w500/vfrQk5IPloGg1v9Rzbh2Eg3VGyM.jpg',
              resource: { duration: 117, link: 'alien.mp4' } },

            { type: 'Movie', title: 'Múltiple',
              publication: new Date(2017, 0, 20), nationality: 'USA',
              synopsis: 'Un hombre con trastorno de identidad disociativo y 23 personalidades secuestra a tres adolescentes mientras una 24ª personalidad amenaza con emerger.',
              image: 'https://pics.filmaffinity.com/split-172094905-large.jpg',
              resource: { duration: 117, link: 'multiple.mp4' } },

            { type: 'Movie', title: 'Expediente Warren',
              publication: new Date(2013, 6, 19), nationality: 'USA',
              synopsis: 'Los investigadores paranormales Ed y Lorraine Warren ayudan a una familia aterrorizada por una oscura presencia en su casa de campo.',
              image: 'https://image.tmdb.org/t/p/w500/wVYREutTvI2tmxr6ujrHT704wGF.jpg',
              resource: { duration: 112, link: 'conjuring.mp4' } },

            { type: 'Movie', title: 'Sinners',
              publication: new Date(2025, 3, 18), nationality: 'USA',
              synopsis: 'Dos hermanos gemelos regresan a su ciudad natal con intención de empezar de nuevo, pero descubren que un mal aún mayor los espera.',
              image: 'https://image.tmdb.org/t/p/w500/yqsuxjSIRUpOBrQQQkbfVtEm5Hk.jpg',
              resource: { duration: 137, link: 'sinners.mp4' } },

            // CIENCIA FICCIÓN (4)
            { type: 'Movie', title: 'Inception',
              publication: new Date(2010, 6, 16), nationality: 'USA',
              synopsis: 'Un ladrón que roba secretos del subconsciente es contratado para implantar una idea en la mente de un objetivo.',
              image: 'https://image.tmdb.org/t/p/w500/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg',
              resource: { duration: 148, link: 'inception.mp4' } },

            { type: 'Movie', title: 'Blade Runner',
              publication: new Date(1982, 5, 25), nationality: 'USA',
              synopsis: 'Un cazador de replicantes (blade runner) debe eliminar a cuatro humanos artificiales fugados en un Los Ángeles distópico.',
              image: 'https://image.tmdb.org/t/p/w500/63N9uy8nd9j7Eog2axPQ8lbr3Wj.jpg',
              resource: { duration: 117, link: 'bladerunner.mp4' } },

            { type: 'Movie', title: 'The Martian',
              publication: new Date(2015, 9, 2), nationality: 'USA',
              synopsis: 'Un astronauta queda abandonado en Marte y debe sobrevivir con ingenio mientras la NASA planea su rescate.',
              image: 'https://image.tmdb.org/t/p/w500/5BHuvQ6p9kfc091Z8RiFNhCwL4b.jpg',
              resource: { duration: 144, link: 'martian.mp4' } },

            { type: 'Movie', title: 'Glass',
              publication: new Date(2019, 0, 18), nationality: 'USA',
              synopsis: 'Tras los eventos de Múltiple y El Protegido, David Dunn persigue a La Bestia mientras el misterioso Elijah Price orquesta un plan en la sombra.',
              image: 'https://image.tmdb.org/t/p/w500/svIDTNUoajS8dLEo7EosxvyAsgJ.jpg',
              resource: { duration: 129, link: 'glass.mp4' } },

            // ACCIÓN (4)
            { type: 'Movie', title: 'Indiana Jones: En busca del arca perdida',
              publication: new Date(1981, 5, 12), nationality: 'USA',
              synopsis: 'El arqueólogo y aventurero Indiana Jones recorre el mundo buscando el Arca de la Alianza antes que los nazis.',
              image: 'https://image.tmdb.org/t/p/w500/ceG9VzoRAVGwivFU403Wc3AHRys.jpg',
              resource: { duration: 115, link: 'indianajones.mp4' } },

            { type: 'Movie', title: 'Infiltrados',
              publication: new Date(2006, 9, 6), nationality: 'USA',
              synopsis: 'Un policía se infiltra en la mafia irlandesa de Boston mientras un topo de la mafia se infiltra en la policía estatal.',
              image: 'https://image.tmdb.org/t/p/w500/tGLO9zw5ZtCeyyEWgbYGgsFxC6i.jpg',
              resource: { duration: 151, link: 'infiltrados.mp4' } },

            { type: 'Movie', title: 'Mad Max: Fury Road',
              publication: new Date(2015, 4, 15), nationality: 'Australia',
              synopsis: 'En un páramo desértico postapocalíptico, Furiosa y Max se rebelan contra un tirano para liberar a un grupo de mujeres cautivas.',
              image: 'https://image.tmdb.org/t/p/w500/hA2ple9q4qnwxp3hKVNhroipsir.jpg',
              resource: { duration: 120, link: 'madmax.mp4' } },

            { type: 'Movie', title: 'Django desencadenado',
              publication: new Date(2012, 11, 25), nationality: 'USA',
              synopsis: 'Un esclavo liberado se une a un cazarrecompensas alemán para rescatar a su esposa de un cruel terrateniente en el sur profundo.',
              image: 'https://image.tmdb.org/t/p/w500/7oWY8VDWW7thTzWh3OKYRkWUlD5.jpg',
              resource: { duration: 165, link: 'django.mp4' } },
        ],

        /* ASIGNACIONES CATEGORÍA */
        categoryAssignments: [
            // Terror
            { category: 'Terror', production: 'Alien, el octavo pasajero' },
            { category: 'Terror', production: 'Múltiple' },
            { category: 'Terror', production: 'Expediente Warren' },
            { category: 'Terror', production: 'Sinners' },
            // Ciencia Ficción
            { category: 'Ciencia Ficción', production: 'Inception' },
            { category: 'Ciencia Ficción', production: 'Blade Runner' },
            { category: 'Ciencia Ficción', production: 'The Martian' },
            { category: 'Ciencia Ficción', production: 'Glass' },
            // Acción
            { category: 'Acción', production: 'Indiana Jones: En busca del arca perdida' },
            { category: 'Acción', production: 'Infiltrados' },
            { category: 'Acción', production: 'Mad Max: Fury Road' },
            { category: 'Acción', production: 'Django desencadenado' },
        ],

        /*ASIGNACIONES DIRECTOR (1 por producción)  */
        directorAssignments: [
            // Ridley Scott: Alien, Blade Runner, The Martian
            { director: 'Ridley Scott', production: 'Alien, el octavo pasajero' },
            { director: 'Ridley Scott', production: 'Blade Runner' },
            { director: 'Ridley Scott', production: 'The Martian' },
            // M. Night Shyamalan: Múltiple, Glass
            { director: 'M. Night Shyamalan', production: 'Múltiple' },
            { director: 'M. Night Shyamalan', production: 'Glass' },
            // James Wan: Expediente Warren
            { director: 'James Wan', production: 'Expediente Warren' },
            // Ryan Coogler: Sinners
            { director: 'Ryan Coogler', production: 'Sinners' },
            // Christopher Nolan: Inception
            { director: 'Christopher Nolan', production: 'Inception' },
            // Steven Spielberg: Indiana Jones
            { director: 'Steven Spielberg', production: 'Indiana Jones: En busca del arca perdida' },
            // George Miller: Mad Max
            { director: 'George Miller', production: 'Mad Max: Fury Road' },
            // Martin Scorsese: Infiltrados
            { director: 'Martin Scorsese', production: 'Infiltrados' },
            // Quentin Tarantino: Django
            { director: 'Quentin Tarantino', production: 'Django desencadenado' },
        ],

        /* ASIGNACIONES ACTOR (mínimo 2 por producción)*/
        actorAssignments: [
            // Alien — Sigourney Weaver, John Hurt
            { actor: 'Sigourney Weaver', production: 'Alien, el octavo pasajero', role: 'Teniente Ellen Ripley' },
            { actor: 'John Hurt', production: 'Alien, el octavo pasajero', role: 'Kane' },

            // Múltiple — James McAvoy, Anya Taylor-Joy
            { actor: 'James McAvoy', production: 'Múltiple', role: 'Kevin Wendell Crumb / La Horda' },
            { actor: 'Anya Taylor-Joy', production: 'Múltiple', role: 'Casey Cooke' },

            // Expediente Warren — Patrick Wilson, Vera Farmiga
            { actor: 'Patrick Wilson', production: 'Expediente Warren', role: 'Ed Warren' },
            { actor: 'Vera Farmiga', production: 'Expediente Warren', role: 'Lorraine Warren' },

            // Sinners — Michael B. Jordan, Hailee Steinfeld
            { actor: 'Michael B. Jordan', production: 'Sinners', role: 'Smoke / Stack' },
            { actor: 'Hailee Steinfeld', production: 'Sinners', role: 'Mary' },

            // Inception — DiCaprio, Tom Hardy
            { actor: 'Leonardo DiCaprio', production: 'Inception', role: 'Dom Cobb' },
            { actor: 'Tom Hardy', production: 'Inception', role: 'Eames' },

            // Blade Runner — Harrison Ford, Rutger Hauer
            { actor: 'Harrison Ford', production: 'Blade Runner', role: 'Rick Deckard' },
            { actor: 'Rutger Hauer', production: 'Blade Runner', role: 'Roy Batty' },

            // The Martian — Matt Damon, Jessica Chastain
            { actor: 'Matt Damon', production: 'The Martian', role: 'Mark Watney' },
            { actor: 'Jessica Chastain', production: 'The Martian', role: 'Comandante Melissa Lewis' },

            // Glass — James McAvoy, Samuel L. Jackson
            { actor: 'James McAvoy', production: 'Glass', role: 'Kevin Wendell Crumb / La Horda' },
            { actor: 'Samuel L. Jackson', production: 'Glass', role: 'Elijah Price / Mr. Glass' },

            // Indiana Jones — Harrison Ford, Alfred Molina
            { actor: 'Harrison Ford', production: 'Indiana Jones: En busca del arca perdida', role: 'Indiana Jones' },
            { actor: 'Alfred Molina', production: 'Indiana Jones: En busca del arca perdida', role: 'Satipo' },

            // Infiltrados — Matt Damon, DiCaprio
            { actor: 'Matt Damon', production: 'Infiltrados', role: 'Colin Sullivan' },
            { actor: 'Leonardo DiCaprio', production: 'Infiltrados', role: 'Billy Costigan' },

            // Mad Max: Fury Road — Tom Hardy, Anya Taylor-Joy
            { actor: 'Tom Hardy', production: 'Mad Max: Fury Road', role: 'Max Rockatansky' },
            { actor: 'Anya Taylor-Joy', production: 'Mad Max: Fury Road', role: 'Furiosa (joven)' },

            // Django desencadenado — DiCaprio, Samuel L. Jackson
            { actor: 'Leonardo DiCaprio', production: 'Django desencadenado', role: 'Calvin J. Candie' },
            { actor: 'Samuel L. Jackson', production: 'Django desencadenado', role: 'Stephen' },
        ],

        /* USUARIOS*/
        users: [
            { username: 'admin', email: 'admin@videosystem.com', password: 'admin123' },
        ],
    });

});
