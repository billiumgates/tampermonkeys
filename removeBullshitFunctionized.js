"use strict";

class PageAction {
   constructor(actionName, functionToExecute) {
      this.name = actionName;
      this.complete = false;
      this.actionToExecute = functionToExecute;
   }

   getName() {
      return this.name;
   }
   setName(newName) {
      this.name = newName;
   }
   isComplete() {
      return this.complete;
   }
   setIsComplete(completed) {
      this.complete = completed;
   }

   doAction() {
      this.actionToExecute();
   }
}

let popupFunction = function actionOverlayWrapper() {
   console.debug("Closing the popup");
   document.querySelector(".overlay-wrapper").querySelector("button").click();
};

let scoresFunction = function actionScores() {
   document.querySelector(".show_live_scores").style.padding = 0;
};

let headerFunction = function actionWrapper() {
   document.querySelector(".stream-wrapper").querySelector("header").style.height = 0;
   var gameSelector = document.querySelector(".stream-wrapper").querySelector("header").querySelector(".selector");
   gameSelector.style.position = "absolute";
   gameSelector.style.top = "96%";
   gameSelector.style.left = "50%";
};

var retryTimeout = 500;
var retryCount = 0;
var maxRetries = 40;
var removableClasses = [
   ".turbo",
   ".cast",
   ".download-button",
   ".chat-wrapper",
   ".top-nav",
   ".prediction-wrapper",
   ".router-links",
   ".router-wrapper",
];
var removableMap = new Map();
for (const c of removableClasses) {
   removableMap.set(c, c);
}

let overlayAction = new PageAction(".overlay-wrapper", popupFunction);
let scoresAction = new PageAction(".show_live_scores", scoresFunction);
let wrapperAction = new PageAction(".stream-wrapper", headerFunction);
let actions = [overlayAction, scoresAction, wrapperAction];

document.onload = setTimeout(() => {
   console.debug("Removing bullshit");
   removeBullshit();
   console.debug("Bullshit removed");
}, retryTimeout);

function removeBullshit() {
   var retry = false;

   for (let action of actions) {
      if (action.isComplete() === false) {
         try {
            action.doAction();
            action.setIsComplete(true);
         } catch (error) {
            retry = true;
            if (retryCount > maxRetries) {
               console.error("Could not perform the action " + action.getName() + ":" + error);
               retry = false;
            } else {
               console.debug(
                  "Could not perform the action " + action.getName() + ", will retry in " + retryTimeout + "ms",
               );
            }
         }
      }
   }

   for (const [key, value] of removableMap.entries()) {
      try {
         if (key === ".router-wrapper") {
            //Remove the footer at the bottom of the page
            document.querySelector(key).nextElementSibling.remove();
         }
         document.querySelector(key).remove();
         console.debug("Removed the item identified by selector: " + key);
      } catch (error) {
         retry = true;
         if (retryCount > maxRetries) {
            console.error("Could not remove find the " + key + " element: " + error);
            retry = false;
         } else {
            console.debug("Could not remove find the " + key + " element, will retry in " + retryTimeout + "ms");
         }
      }
   }

   if (retry === true) {
      retryCount++;
      setTimeout(() => {
         console.debug("Retrying");
         removeBullshit();
      }, retryTimeout);
   }
}
