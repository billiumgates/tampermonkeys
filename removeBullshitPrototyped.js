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
      if (document.querySelector(selectorToRemove)) {
         document.querySelector(selectorToRemove).remove();
      } else {
         var error = `The element identified by the selector ${selectorToRemove} is no longer accessible and should be removed.`;
         console.debug(error);
         throw error;
      }
   }
}

class PopupClosePageAction extends PageAction {
   constructor() {
      super("Close Popup");
   }

   doAction() {
      if (
         document.querySelector(".overlay-wrapper") &&
         document.querySelector(".overlay-wrapper").querySelector("button")
      ) {
         document.querySelector(".overlay-wrapper").querySelector("button").click();
      } else {
         var error = `The element identified by the selector .overlay-wrapper is not accessible at this moment.`;
         console.debug(error);
         throw error;
      }
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
var maxRetries = 40;

var removableClassesOnLoad = [".cast", ".chat-wrapper", ".top-nav", ".router-links"];

let actions = [
   new PopupClosePageAction(),
   new RemoveScorePaddingPageAction(),
   new AdjustHeaderPageAction(),
   new RemovablePageActions(removableClassesOnLoad),
   new RemovablePageActions(".turbo"),
   new RemovablePageActions(".shadow-wrapper"),
   new RemoveRouterWrapperAndFooterPageAction(),
];

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
               console.trace(error);
            }
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
