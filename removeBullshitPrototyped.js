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

class RemovablePageAction extends PageAction {
   constructor(classToRemove) {
      super(classToRemove);
   }

   doAction() {
      document.querySelector(this.getName()).remove();
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

class RemoveRouterWrapperAndFooterPageAction extends RemovablePageAction {
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

let actions = [
   new PopupClosePageAction(),
   new RemoveScorePaddingPageAction(),
   new AdjustHeaderPageAction(),
   new RemovablePageAction(".turbo"),
   new RemovablePageAction(".cast"),
   new RemovablePageAction(".download-button"),
   new RemovablePageAction(".chat-wrapper"),
   new RemovablePageAction(".top-nav"),
   new RemovablePageAction(".prediction-wrapper"),
   new RemovablePageAction(".router-links"),
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
