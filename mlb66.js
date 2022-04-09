// ==UserScript==
// @name         MLB66Fix
// @namespace    https://mlb66.ir
// @version      0.3
// @description  Remove stupid shit
// @author       billiumgates
// @match        https://mlb66.ir
// @match        https://mlb66.ir/simulator
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mlb66.ir
// @updateURL    https://raw.githubusercontent.com/billiumgates/tampermonkeys/main/mlb66.js
// @downloadURL  https://raw.githubusercontent.com/billiumgates/tampermonkeys/main/mlb66.js
// @homepageURL  https://github.com/billiumgates/tampermonkeys/
// @grant        none
// ==/UserScript==

(function() {

    'use strict';
    var retryTimeout = 500;
    var retryCount = 0;
    var maxRetries = 40;
    var removableClasses = [".turbo", ".chat-wrapper", ".top-nav", ".prediction-wrapper", ".router-links", ".router-wrapper"];
    var removableMap = new Map();
    var popupClosed = false;
    for(const c of removableClasses) {
        removableMap.set(c, c);
    }

    document.onload =
        setTimeout(() => {
            console.debug("Removing bullshit");
            removeBullshit();
            console.debug("Bullshit removed");
        }, retryTimeout);

    function removeBullshit() {
        var retry = false;

        if(popupClosed === false) {
            try {
                document.querySelector('.overlay-wrapper').querySelector("button").click();
                popupClosed = true;
            }
            catch(error) {
                retry = true;
                if(retryCount > maxRetries) {
                    console.error("Could not remove find the .overlay-wrapper to close the popup: " + error);
                    retry = false;
                }
                else {
                    console.debug("Could not click the popup button, will retry in " + retryTimeout + "ms");
                }
            }
        }

        for(const [key, value] of removableMap.entries()) {
            try {
                if(key === ".router-wrapper") {
                    //Remove the footer at the bottom of the page
                    document.querySelector(key).nextElementSibling.remove();
                }
                document.querySelector(key).remove();
                console.debug("Removed the item identified by selector: " + key)
            }
            catch(error) {
                retry = true;
                if(retryCount > maxRetries) {
                    console.error("Could not remove find the " + key + " element: " + error);
                    retry = false;
                }
                else {
                    console.debug("Could not remove find the " + key + " element, will retry in " + retryTimeout + "ms");
                }
            }
        }
        if(retry === true) {
            retryCount++;
            setTimeout(() => {
                console.debug("Retrying");
                removeBullshit();
            }, retryTimeout)
        }
    }
})();
