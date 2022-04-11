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
}

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

var overlayAction = new PageAction(".overlay-wrapper", actionOverlayWrapper);
var scoresAction = new PageAction(".show_live_scores", actionScores);
var wrapperAction = new PageAction(".stream-wrapper", actionScores);
var actions = [overlayAction, scoresAction, wrapperAction];
// var popupClosed = false;
// var paddingRemoved = false;
// var headerHidden = false;
// var gameSelectorMoved = false;

document.onload = setTimeout(() => {
   console.debug("Removing bullshit");
   removeBullshit();
   console.debug("Bullshit removed");
}, retryTimeout);

function actionOverlayWrapper() {
   document.querySelector(".overlay-wrapper").querySelector("button").click();
}

function actionScores() {
   document.querySelector(".show_live_scores").style.padding = 0;
}

function actionWrapper() {
   document.querySelector(".stream-wrapper").querySelector("header").style.height = 0;
   var gameSelector = document.querySelector(".stream-wrapper").querySelector("header").querySelector(".selector");
   gameSelector.style.position = "absolute";
   gameSelector.style.top = "96%";
   gameSelector.style.left = "50%";
}

function removeBullshit() {
   var retry = false;

   for (let action of actions) {
      if (action.isComplete() === false) {
         try {
            action.actionToExecute;
            action.setIsComplete(true);
         } catch (error) {
            retry = true;
            if (retryCount > maxRetries) {
               console.error("Could perform the " + action.getName() + ":" + error);
               retry = false;
            } else {
               console.debug("Could perform the " + action.getName() + ", will retry in " + retryTimeout + "ms");
            }
         }
      }
   }

   // if (popupClosed === false) {
   //    try {
   //       document.querySelector(".overlay-wrapper").querySelector("button").click();
   //       popupClosed = true;
   //    } catch (error) {
   //       retry = true;
   //       if (retryCount > maxRetries) {
   //          console.error("Could not remove find the .overlay-wrapper to close the popup: " + error);
   //          retry = false;
   //       } else {
   //          console.debug("Could not click the popup button, will retry in " + retryTimeout + "ms");
   //       }
   //    }
   // }

   // if (paddingRemoved === false) {
   //    try {
   //       document.querySelector(".show_live_scores").style.padding = 0;
   //       paddingRemoved = true;
   //    } catch (error) {
   //       retry = true;
   //       if (retryCount > maxRetries) {
   //          console.error("Could not find the .show_live_scores to remove the padding: " + error);
   //          retry = false;
   //       } else {
   //          console.debug("Could not remove padding, will retry in " + retryTimeout + "ms");
   //       }
   //    }
   // }

   // if (headerHidden === false) {
   //    try {
   //       document.querySelector(".stream-wrapper").querySelector("header").style.height = 0;
   //       headerHidden = true;
   //    } catch (error) {
   //       retry = true;
   //       if (retryCount > maxRetries) {
   //          console.error("Could not find the .stream-wrapper header to hide it: " + error);
   //          retry = false;
   //       } else {
   //          console.debug("Could not hide the header, will retry in " + retryTimeout + "ms");
   //       }
   //    }
   // }

   // if (gameSelectorMoved === false) {
   //    try {
   //       var gameSelector = document
   //          .querySelector(".stream-wrapper")
   //          .querySelector("header")
   //          .querySelector(".selector");
   //       gameSelector.style.position = "absolute";
   //       gameSelector.style.top = "96%";
   //       gameSelector.style.left = "50%";
   //       gameSelectorMoved = true;
   //    } catch (error) {
   //       retry = true;
   //       if (retryCount > maxRetries) {
   //          console.error("Could not find the .selector to move it: " + error);
   //          retry = false;
   //       } else {
   //          console.debug("Could move the game selector, will retry in " + retryTimeout + "ms");
   //       }
   //    }
   // }

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
