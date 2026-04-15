"use strict";

//Clase heredada de Error que es clase nativa de JavaScript. Todos los errores del proyecto heedan de esta clase.
class VideoSystemException extends Error {
    constructor(message) {
        if (!message) {
            throw new Error("VideoSystemException requiere un mensaje.");
        }
        super(message);
        this.name = this.constructor.name;
    }
}

/* Se lanza cuando se intenta instanciar un constructor no permitido*/
class InvalidAccessConstructorException extends VideoSystemException {
    constructor(className) {
        super(`No se puede instanciar ${className}. El constructor no está permitido.`);
    }
}

/*Se lanza cuando un parámetro obligatorio está vacío*/
class EmptyValuesException extends VideoSystemException {
    constructor(parameterName) {
        super(`El parámetro "${parameterName}" no puede estar vacío.`);
    }
}

/*Se lanza cuando un parámetro no cumple el tipo esperado*/
class ParameterValidationException extends VideoSystemException {
    constructor(parameterName, expectedType) {
        super(`El tipo de "${parameterName}" es inválido. Se esperaba ${expectedType}.`);
    }
}

/*Se lanza cuando un valor no cumple una restricción lógica*/
class InvalidValueException extends VideoSystemException {
    constructor(parameterName, details) {
        super(`El valor de "${parameterName}" es inválido. ${details}`);
    }
}

/*Se lanza cuando se intenta instanciar una clase abstracta*/
class AbstractClassException extends VideoSystemException {
    constructor(className) {
        super(`No se puede instanciar la clase abstracta "${className}".`);
    }
}