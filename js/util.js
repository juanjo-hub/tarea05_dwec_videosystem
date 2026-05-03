"use strict";

/* ============================================================
 *  UTIL.JS - Funciones de utilidad para la aplicación
 *  VideoSystem - DWEC07
 * ============================================================ */

// --- Cookies ---

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

function getCookie(cname) {
    const re = new RegExp(
        `(?:(?:^|.*;\\s*)${cname}\\s*\\=\\s*([^;]*).*$)|^.*$`
    );
    return document.cookie.replace(re, '$1');
}

function deleteCookie(cname) {
    setCookie(cname, '', 0);
}

/* ============================================================
 *  FAVORITOS - WebStorage (DWEC07 - Punto 5)
 *  Clave localStorage: 'vs_favorites'
 *  Valor: JSON con array de títulos de producción.
 *  Mismo patrón que el idioma en UT08.3 del profesor:
 *    localStorage.setItem / localStorage.getItem
 * ============================================================ */

// Lee los favoritos del localStorage. Devuelve [] si no hay nada.
function getFavorites() {
    try {
        return JSON.parse(localStorage.getItem('vs_favorites')) || [];
    } catch (e) {
        return [];
    }
}

// Guarda el array de favoritos en el localStorage.
function setFavorites(favs) {
    localStorage.setItem('vs_favorites', JSON.stringify(favs));
}

// Comprueba si un título ya está en favoritos.
function isFavorite(title) {
    return getFavorites().includes(title);
}
