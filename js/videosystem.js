"use strict";

const VideoSystem = (function () {
  // Control de instancia (Singleton)
  let instantiated;

  class VideoSystem {
    constructor(name) {
      // Evita instanciación múltiple
      if (instantiated) {
        throw new InvalidAccessConstructorException("VideoSystem");
      }

      // Validación del nombre obligartorio
      if (!name || typeof name !== "string" || name.trim() === "") {
        throw new EmptyValuesException("name");
      }

      // Nombre del sistema
      this._name = name;

      // Usuarios
      this._users = new Map();

      // Producciones
      this._productions = new Map();

      // Categorías
      this._categories = new Map();

      // Actores
      this._actors = new Map();

      // Directores
      this._directors = new Map();

      // Relaciones preparadas para los siguientes métodos
      this._categoryProductions = new Map();
      this._directorProductions = new Map();
      this._actorProductions = new Map();

      /* Categoría por defecto */
      this._defaultCategory = new Category("Default", "Default category");

      // Registrar categoría por defecto
      this._categories.set(this._defaultCategory.name, this._defaultCategory);

      // Inicializar su estructura de relación
      this._categoryProductions.set(this._defaultCategory.name, new Set());
      instantiated = this;
    }

    /* SINGLETON*/
    static getInstance(name = "VideoSystem") {
      if (!instantiated) {
        instantiated = new VideoSystem(name);
      }
      return instantiated;
    }

    /* Getter / Setter name */
    get name() {
      return this._name;
    }

    set name(value) {
      if (value === null || value === undefined) {
        throw new EmptyValuesException("name");
      }

      if (typeof value !== "string") {
        throw new ParameterValidationException("name", "String");
      }

      if (value.trim() === "") {
        throw new EmptyValuesException("name");
      }

      this._name = value;
    }

    /*GETTER categories*/
    get categories() {
      const categories = this._categories;

      return {
        *[Symbol.iterator]() {
          for (const category of categories.values()) {
            yield category;
          }
        },
      };
    }

    /* addCategory */
    addCategory(...categories) {
      for (const category of categories) {
        // Validación null
        if (category === null || category === undefined) {
          throw new ParameterValidationException("category", "Category");
        }

        // Validación tipo
        if (!(category instanceof Category)) {
          throw new ParameterValidationException("category", "Category");
        }

        // Control duplicado por clave lógica
        if (this._categories.has(category.name)) {
          throw new InvalidValueException(
            "category",
            "Category already exists.",
          );
        }

        // Añadir categoría
        this._categories.set(category.name, category);

        // Inicializar estructura de relación
        this._categoryProductions.set(category.name, new Set());
      }

      return this._categories.size;
    }

    /*removeCategory */
    removeCategory(category) {
      if (!category || !(category instanceof Category)) {
        throw new ParameterValidationException("category", "Category");
      }

      // Comprobar que existe
      if (!this._categories.has(category.name)) {
        throw new InvalidValueException("category", "Category not registered.");
      }

      // No permitir eliminar la categoría por defecto
      if (category.name === this._defaultCategory.name) {
        throw new InvalidValueException(
          "category",
          "Cannot remove default category.",
        );
      }

      // Obtener producciones asociadas
      const productionsToMove = this._categoryProductions.get(category.name);

      // Mover producciones a la categoría por defecto
      const defaultSet = this._categoryProductions.get(
        this._defaultCategory.name,
      );

      for (const production of productionsToMove) {
        defaultSet.add(production);
      }

      // Eliminar la categoría
      this._categories.delete(category.name);
      this._categoryProductions.delete(category.name);

      return this._categories.size;
    }

    /* GETTER users */

    get users() {
      const users = this._users;

      return {
        *[Symbol.iterator]() {
          for (const user of users.values()) {
            yield user;
          }
        },
      };
    }

    /* addUser*/

    addUser(...users) {
      for (const user of users) {
        // Validación null
        if (!user) {
          throw new ParameterValidationException("user", "User");
        }

        // Validación tipo
        if (!(user instanceof User)) {
          throw new ParameterValidationException("user", "User");
        }

        // Control duplicado por username
        if (this._users.has(user.username)) {
          throw new InvalidValueException(
            "username",
            "Username already exists.",
          );
        }

        // Control duplicado por email
        for (const existingUser of this._users.values()) {
          if (existingUser.email === user.email) {
            throw new InvalidValueException("email", "Email already exists.");
          }
        }

        // Añadir usuario
        this._users.set(user.username, user);
      }

      return this._users.size;
    }

    /* removeUser */
    removeUser(...users) {
      for (const user of users) {
        // Validación null
        if (!user) {
          throw new ParameterValidationException("user", "User");
        }

        // Validación tipo
        if (!(user instanceof User)) {
          throw new ParameterValidationException("user", "User");
        }

        // Comprobar existencia
        if (!this._users.has(user.username)) {
          throw new InvalidValueException("user", "User not registered.");
        }

        // Eliminar usuario
        this._users.delete(user.username);
      }

      return this._users.size;
    }

    /* GETTER productions*/

    get productions() {
      const productions = this._productions;

      return {
        *[Symbol.iterator]() {
          for (const production of productions.values()) {
            yield production;
          }
        },
      };
    }

    /* addProduction*/
    addProduction(...productions) {
      for (const production of productions) {
        // Validación null
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        // Validación tipo
        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        // Control duplicado por título
        if (this._productions.has(production.title)) {
          throw new InvalidValueException(
            "production",
            "Production already exists.",
          );
        }

        this._productions.set(production.title, production);
      }

      return this._productions.size;
    }

    /*removeProduction*/

    removeProduction(...productions) {
      for (const production of productions) {
        // Validación null
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        // Validación tipo
        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        // Comprobar existencia
        if (!this._productions.has(production.title)) {
          throw new InvalidValueException(
            "production",
            "Production not registered.",
          );
        }

        // Eliminar de categorías
        for (const set of this._categoryProductions.values()) {
          set.delete(production);
        }

        // Eliminar de directores
        for (const set of this._directorProductions.values()) {
          set.delete(production);
        }

        // Eliminar de actores
        for (const map of this._actorProductions.values()) {
          map.delete(production);
        }

        // Eliminar producción principal
        this._productions.delete(production.title);
      }

      return this._productions.size;
    }

    /*GETTER actors */
    get actors() {
      const actors = this._actors;

      return {
        *[Symbol.iterator]() {
          for (const actor of actors.values()) {
            yield actor;
          }
        },
      };
    }

    /* addActor*/
    addActor(...actors) {
      for (const actor of actors) {
        // Validación null
        if (!actor) {
          throw new ParameterValidationException("actor", "Person");
        }

        // Validación tipo
        if (!(actor instanceof Person)) {
          throw new ParameterValidationException("actor", "Person");
        }

        const key = actor.toString();

        // Control duplicado
        if (this._actors.has(key)) {
          throw new InvalidValueException("actor", "Actor already exists.");
        }

        this._actors.set(key, actor);

        // Inicializar estructura de relación actor → producciones
        this._actorProductions.set(key, new Map());
      }

      return this._actors.size;
    }

    /* removeActor */
    removeActor(...actors) {
      for (const actor of actors) {
        // Validación null
        if (!actor) {
          throw new ParameterValidationException("actor", "Person");
        }

        // Validación tipo
        if (!(actor instanceof Person)) {
          throw new ParameterValidationException("actor", "Person");
        }

        const key = actor.toString();

        // Comprobar existencia
        if (!this._actors.has(key)) {
          throw new InvalidValueException("actor", "Actor not registered.");
        }

        // Eliminar relaciones actor → producciones
        this._actorProductions.delete(key);

        // Eliminar actor principal
        this._actors.delete(key);
      }

      return this._actors.size;
    }

    /*GETTER directors*/

    get directors() {
      const directors = this._directors;

      return {
        *[Symbol.iterator]() {
          for (const director of directors.values()) {
            yield director;
          }
        },
      };
    }

    /* addDirector*/
    addDirector(...directors) {
      for (const director of directors) {
        // Validación null
        if (!director) {
          throw new ParameterValidationException("director", "Person");
        }

        // Validación tipo
        if (!(director instanceof Person)) {
          throw new ParameterValidationException("director", "Person");
        }

        const key = director.toString();

        // Control duplicado
        if (this._directors.has(key)) {
          throw new InvalidValueException(
            "director",
            "Director already exists.",
          );
        }

        this._directors.set(key, director);

        // Inicializar relación director → producciones
        this._directorProductions.set(key, new Set());
      }

      return this._directors.size;
    }

    /*removeDirector */

    removeDirector(...directors) {
      for (const director of directors) {
        // Validación null
        if (!director) {
          throw new ParameterValidationException("director", "Person");
        }

        // Validación tipo
        if (!(director instanceof Person)) {
          throw new ParameterValidationException("director", "Person");
        }

        const key = director.toString();

        // Comprobar existencia
        if (!this._directors.has(key)) {
          throw new InvalidValueException(
            "director",
            "Director not registered.",
          );
        }

        // Eliminar relación director → producciones
        this._directorProductions.delete(key);

        // Eliminar director principal
        this._directors.delete(key);
      }

      return this._directors.size;
    }

    /* assignCategory */
    assignCategory(category, ...productions) {
      if (!category) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!(category instanceof Category)) {
        throw new ParameterValidationException("category", "Category");
      }

      // Si no existe la categoría, se añade
      if (!this._categories.has(category.name)) {
        this.addCategory(category);
      }

      const categorySet = this._categoryProductions.get(category.name);

      for (const production of productions) {
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        // Si no existe la producción, se añade
        if (!this._productions.has(production.title)) {
          this.addProduction(production);
        }

        categorySet.add(production);
      }

      return categorySet.size;
    }

    /*deassignCategory */
    deassignCategory(category, ...productions) {
      if (!category) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!(category instanceof Category)) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!this._categories.has(category.name)) {
        throw new InvalidValueException("category", "Category not registered.");
      }

      const categorySet = this._categoryProductions.get(category.name);

      for (const production of productions) {
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        categorySet.delete(production);
      }

      return categorySet.size;
    }

    /*assignDirector */
    assignDirector(director, ...productions) {
      // Validación director
      if (!director) {
        throw new ParameterValidationException("director", "Person");
      }

      if (!(director instanceof Person)) {
        throw new ParameterValidationException("director", "Person");
      }

      const key = director.toString();

      // Si no existe el director, se añade
      if (!this._directors.has(key)) {
        this.addDirector(director);
      }

      const directorSet = this._directorProductions.get(key);

      for (const production of productions) {
        // Validación production
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        // Si no existe la producción, se añade
        if (!this._productions.has(production.title)) {
          this.addProduction(production);
        }

        directorSet.add(production);
      }

      return directorSet.size;
    }

    /* deassignDirector */
    deassignDirector(director, ...productions) {
      // Validación director
      if (!director) {
        throw new ParameterValidationException("director", "Person");
      }

      if (!(director instanceof Person)) {
        throw new ParameterValidationException("director", "Person");
      }

      const key = director.toString();

      if (!this._directors.has(key)) {
        throw new InvalidValueException("director", "Director not registered.");
      }

      const directorSet = this._directorProductions.get(key);

      for (const production of productions) {
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        directorSet.delete(production);
      }

      return directorSet.size;
    }

    /* assignActor */

    assignActor(actor, ...productionsData) {
      if (!actor) {
        throw new ParameterValidationException("actor", "Person");
      }

      if (!(actor instanceof Person)) {
        throw new ParameterValidationException("actor", "Person");
      }

      const key = actor.toString();

      // Si no existe el actor, se añade
      if (!this._actors.has(key)) {
        this.addActor(actor);
      }

      const actorMap = this._actorProductions.get(key);

      // Deben venir en pares: production, role
      if (productionsData.length % 2 !== 0) {
        throw new InvalidValueException(
          "assignActor",
          "Production and role must be in pairs.",
        );
      }

      for (let i = 0; i < productionsData.length; i += 2) {
        const production = productionsData[i];
        const role = productionsData[i + 1];

        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!role || typeof role !== "string") {
          throw new ParameterValidationException("role", "String");
        }

        // Si no existe producción, se añade
        if (!this._productions.has(production.title)) {
          this.addProduction(production);
        }

        actorMap.set(production, role);
      }

      return actorMap.size;
    }

    /* deassignActor*/
    deassignActor(actor, ...productions) {
      if (!actor) {
        throw new ParameterValidationException("actor", "Person");
      }

      if (!(actor instanceof Person)) {
        throw new ParameterValidationException("actor", "Person");
      }

      const key = actor.toString();

      if (!this._actors.has(key)) {
        throw new InvalidValueException("actor", "Actor not registered.");
      }

      const actorMap = this._actorProductions.get(key);

      for (const production of productions) {
        if (!production) {
          throw new ParameterValidationException("production", "Production");
        }

        if (!(production instanceof Production)) {
          throw new ParameterValidationException("production", "Production");
        }

        actorMap.delete(production);
      }

      return actorMap.size;
    }

    /* getCast */
    getCast(production) {
      if (!production) {
        throw new ParameterValidationException("production", "Production");
      }

      if (!(production instanceof Production)) {
        throw new ParameterValidationException("production", "Production");
      }

      const actors = this._actors;
      const actorProductions = this._actorProductions;

      return {
        *[Symbol.iterator]() {
          for (const [key, actor] of actors.entries()) {
            const productionsMap = actorProductions.get(key);

            if (productionsMap && productionsMap.has(production)) {
              yield {
                actor: actor,
                role: productionsMap.get(production),
              };
            }
          }
        },
      };
    }

    /* getProductionsDirector */
    getProductionsDirector(director) {
      if (!director) {
        throw new ParameterValidationException("director", "Person");
      }

      if (!(director instanceof Person)) {
        throw new ParameterValidationException("director", "Person");
      }

      const key = director.toString();

      if (!this._directors.has(key)) {
        throw new InvalidValueException("director", "Director not registered.");
      }

      const directorSet = this._directorProductions.get(key);

      return {
        *[Symbol.iterator]() {
          for (const production of directorSet) {
            yield production;
          }
        },
      };
    }

    /* getProductionsActor */
    getProductionsActor(actor) {
      if (!actor) {
        throw new ParameterValidationException("actor", "Person");
      }

      if (!(actor instanceof Person)) {
        throw new ParameterValidationException("actor", "Person");
      }

      const key = actor.toString();

      if (!this._actors.has(key)) {
        throw new InvalidValueException("actor", "Actor not registered.");
      }

      const actorMap = this._actorProductions.get(key);

      return {
        *[Symbol.iterator]() {
          for (const [production, role] of actorMap.entries()) {
            yield {
              production: production,
              role: role,
            };
          }
        },
      };
    }

    /* getProductionsCategory */
    getProductionsCategory(category) {
      if (!category) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!(category instanceof Category)) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!this._categories.has(category.name)) {
        throw new InvalidValueException("category", "Category not registered.");
      }

      const categorySet = this._categoryProductions.get(category.name);

      return {
        *[Symbol.iterator]() {
          for (const production of categorySet) {
            yield production;
          }
        },
      };
    }

    /* createPerson Flyweight*/
    createPerson(name, lastname1, born, lastname2 = "", picture = "") {
      const tempPerson = new Person(name, lastname1, born, lastname2, picture);
      const key = tempPerson.toString();

      // Buscar en actores
      if (this._actors.has(key)) {
        return this._actors.get(key);
      }

      // Buscar en directores
      if (this._directors.has(key)) {
        return this._directors.get(key);
      }

      // No existe → devolver nuevo SIN añadir
      return tempPerson;
    }

    /* createCategory (Flyweight) */
    createCategory(name, description = "") {
      if (this._categories.has(name)) {
        return this._categories.get(name);
      }

      return new Category(name, description);
    }

    /* createUser (Flyweight) */
    createUser(username, email, password) {
      if (this._users.has(username)) {
        return this._users.get(username);
      }

      return new User(username, email, password);
    }

    /* createProduction (Flyweight)*/
    createProduction(production) {
      if (!(production instanceof Production)) {
        throw new ParameterValidationException("production", "Production");
      }

      if (this._productions.has(production.title)) {
        return this._productions.get(production.title);
      }

      return production; // no lo añade
    }

    /*findProductions */
    findProductions(criteriaFunction, sortFunction = null) {
      if (typeof criteriaFunction !== "function") {
        throw new ParameterValidationException("criteriaFunction", "Function");
      }

      let result = [];

      for (const production of this._productions.values()) {
        if (criteriaFunction(production)) {
          result.push(production);
        }
      }

      if (sortFunction && typeof sortFunction === "function") {
        result.sort(sortFunction);
      }

      return {
        *[Symbol.iterator]() {
          for (const production of result) {
            yield production;
          }
        },
      };
    }

    /* filterProductionsInCategory*/
    filterProductionsInCategory(
      category,
      criteriaFunction,
      sortFunction = null,
    ) {
      if (!category) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!(category instanceof Category)) {
        throw new ParameterValidationException("category", "Category");
      }

      if (!this._categories.has(category.name)) {
        throw new InvalidValueException("category", "Category not registered.");
      }

      if (typeof criteriaFunction !== "function") {
        throw new ParameterValidationException("criteriaFunction", "Function");
      }

      const categorySet = this._categoryProductions.get(category.name);

      let result = [];

      for (const production of categorySet) {
        if (criteriaFunction(production)) {
          result.push(production);
        }
      }

      if (sortFunction && typeof sortFunction === "function") {
        result.sort(sortFunction);
      }

      return {
        *[Symbol.iterator]() {
          for (const production of result) {
            yield production;
          }
        },
      };
    }
  }

  return VideoSystem;
})();
