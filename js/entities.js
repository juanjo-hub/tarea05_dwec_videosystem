"use strict";

/* PERSON */
class Person {
  constructor(name, lastname1, born, lastname2 = "", picture = "") {
    if (!name || !lastname1 || !born) {
      throw new EmptyValuesException("La persona debe tener al menos, un nombre, un primer apellido y una fecha de nacimiento.");
    }

    if (!(born instanceof Date)) {
      throw new ParameterValidationException("born", "Date");
    }

    this._name = name;
    this._lastname1 = lastname1;
    this._lastname2 = lastname2;
    this._born = born;
    this._picture = picture;
  }

  get name() {
    return this._name;
  }
  set name(value) {
    if (!value) throw new EmptyValuesException("name");
    this._name = value;
  }

  get lastname1() {
    return this._lastname1;
  }
  set lastname1(value) {
    if (!value) throw new EmptyValuesException("lastname1");
    this._lastname1 = value;
  }

  get lastname2() {
    return this._lastname2;
  }
  set lastname2(value) {
    this._lastname2 = value;
  }

  get born() {
    return this._born;
  }
  set born(value) {
    if (!(value instanceof Date)) {
      throw new ParameterValidationException("born", "Date");
    }
    this._born = value;
  }

  get picture() {
    return this._picture;
  }
  set picture(value) {
    this._picture = value;
  }

  toString() {
    return `${this._name} ${this._lastname1}`;
  }
}

/*CATEGORY*/
class Category {
  constructor(name, description = "") {
    if (!name) throw new EmptyValuesException("name");
    this._name = name;
    this._description = description;
  }

  get name() {
    return this._name;
  }

  set name(value) {
    if (!value) throw new EmptyValuesException("name");
    this._name = value;
  }

  get description() {
    return this._description;
  }
  set description(value) {
    this._description = value;
  }

  toString() {
    return `${this._name}`;
  }
}

/* RESOURCE */

class Resource {
  constructor(duration, link) {
    if (duration == null || link == null) {
      throw new EmptyValuesException("Se requiere la duración y el enlace del recurso.");
    }

    if (typeof duration !== "number") {
      throw new ParameterValidationException("duration", "Number");
    }

    if (duration <= 0) {
      throw new InvalidValueException("duration", "Debe ser un valor positivo.");
    }

    this._duration = duration;
    this._link = link;
  }

  get duration() {
    return this._duration;
  }
  set duration(value) {
    if (typeof value !== "number" || value <= 0) {
      throw new InvalidValueException("duration", "Debe ser un valor positivo.");
    }
    this._duration = value;
  }

  get link() {
    return this._link;
  }
  set link(value) {
    if (!value) throw new EmptyValuesException("link");
    this._link = value;
  }

  toString() {
    return `Duration: ${this._duration} minutes`;
  }
}

/* COORDINATE*/

class Coordinate {
  constructor(latitude, longitude) {
    if (latitude == null || longitude == null) {
      throw new EmptyValuesException("Latitud y longitud deben ser valores numéricos.");
    }

    if (typeof latitude !== "number" || typeof longitude !== "number") {
      throw new ParameterValidationException("latitude/longitude", "Number");
    }

    this._latitude = latitude;
    this._longitude = longitude;
  }

  get latitude() {
    return this._latitude;
  }
  get longitude() {
    return this._longitude;
  }

  toString() {
    return `(${this._latitude}, ${this._longitude})`;
  }
}

/*USER*/

class User {
  constructor(username, email, password) {
    if (!username || !email || !password) {
      throw new EmptyValuesException("Se requieren el nombre de usuario, el correo electrónico y la contraseña.");
    }

    this._username = username;
    this._email = email;
    this._password = password;
  }

  get username() {
    return this._username;
  }
  get email() {
    return this._email;
  }
  get password() {
    return this._password;
  }

  toString() {
    return `${this._username} (${this._email})`;
  }
}

/*PRODUCTION */

class Production {
  constructor(title, publication, nationality = "", synopsis = "", image = "") {
    if (new.target === Production) {
      throw new AbstractClassException("Production");
    }

    if (!title || !publication) {
      throw new EmptyValuesException("Se requieren el título y la fecha de publicación de la producción.");
    }

    if (!(publication instanceof Date)) {
      throw new ParameterValidationException("publication", "Date");
    }

    this._title = title;
    this._publication = publication;
    this._nationality = nationality;
    this._synopsis = synopsis;
    this._image = image;
  }

  get title() {
    return this._title;
  }

  toString() {
    return `${this._title} (${this._publication.getFullYear()})`;
  }
}

/*MOVIE*/

class Movie extends Production {
  constructor(
    title,
    publication,
    nationality,
    synopsis,
    image,
    resource = null,
    locations = [],
  ) {
    super(title, publication, nationality, synopsis, image);

    if (resource && !(resource instanceof Resource)) {
      throw new ParameterValidationException("resource", "Resource");
    }

    this._resource = resource;
    this._locations = locations;
  }

  toString() {
    return `Movie: ${super.toString()}`;
  }
}

/* SERIE , de la tarea04*/
class Serie extends Production {
  constructor(
    title,
    publication,
    nationality,
    synopsis,
    image,
    resources = [],
    locations = [],
    seasons = 0,
  ) {
    super(title, publication, nationality, synopsis, image);

    this._resources = resources;
    this._locations = locations;
    this._seasons = seasons;
  }

  toString() {
    return `Serie: ${super.toString()}`;
  }
}
