"use strict";

class PageAction {
   constructor(actionName) {
      if (this.constructor === PageAction) {
         throw new Error("Cannot instantiate Abstract Class");
      }
      this.name = actionName;
      this.complete = false;
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
      throw new Error("This method is abstract and must be implemented in concrete class.");
   }
}

class RemovablePageActions extends PageAction {
   constructor(classesToRemove) {
      super(classesToRemove);
   }

   doAction() {
      if (Array.isArray(this.getName()) === true) {
         for (let item of this.getName()) {
            this.remove(item);
         }
      } else {
         this.remove(this.getName());
      }
   }

   remove(selectorToRemove) {
      document.querySelector(selectorToRemove).remove();
   }
}

class PopupClosePageAction extends PageAction {
   constructor() {
      super("Close Popup");
   }

   doAction() {
      document.querySelector(".overlay-wrapper").querySelector("button").click();
   }
}

class RemoveScorePaddingPageAction extends PageAction {
   constructor() {
      super("Remove Score Padding");
   }

   doAction() {
      document.querySelector(".show_live_scores").style.padding = 0;
   }
}

class AdjustHeaderPageAction extends PageAction {
   constructor() {
      super("Adjust Header");
   }

   doAction() {
      document.querySelector(".stream-wrapper").querySelector("header").style.height = 0;
      var gameSelector = document.querySelector(".stream-wrapper").querySelector("header").querySelector(".selector");
      gameSelector.style.position = "absolute";
      gameSelector.style.top = "96%";
      gameSelector.style.left = "50%";
   }
}

class RemoveRouterWrapperAndFooterPageAction extends RemovablePageActions {
   constructor() {
      super(".router-wrapper");
   }

   doAction() {
      //Remove the footer at the bottom of the page
      document.querySelector(this.getName()).nextElementSibling.remove();
      super.doAction();
   }
}

var retryTimeout = 500;
var retryCount = 0;
var maxRetries = 5;

var removableClasses = [
   ".turbo",
   ".cast",
   ".download-button",
   ".chat-wrapper",
   ".top-nav",
   ".prediction-wrapper",
   ".router-links",
];

let actions = [
   new PopupClosePageAction(),
   new RemoveScorePaddingPageAction(),
   new AdjustHeaderPageAction(),
   new RemovablePageActions(removableClasses),
   new RemoveRouterWrapperAndFooterPageAction(),
];

document.onload = setTimeout(() => {
   console.debug("Removing bullshit");
   removeBullshit();
   console.debug("Bullshit removed");
}, retryTimeout);

//From here: https://stackoverflow.com/questions/38213668/promise-retry-design-patterns
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const retryOperation = (operation, delay, retries) =>
   new Promise((resolve, reject) => {
      return operation()
         .then(resolve)
         .catch((reason) => {
            if (retries > 0) {
               return wait(delay)
                  .then(retryOperation.bind(null, operation, delay, retries - 1))
                  .then(resolve)
                  .catch(reject);
            }
            return reject(reason);
         });
   });

function removeBullshit() {
   var retry = false;

   for (let action of actions) {
      retryOperation(action.doAction, retryTimeout, maxRetries).then(console.log).catch(console.log);
   }

   if (retry === true) {
      retryCount++;
      setTimeout(() => {
         console.debug("Retrying");
         removeBullshit();
      }, retryTimeout);
   }
}
