"use strict";
import { createParentContainer, createMousePointer, createUsername } from "./module.js";

const socket = io();
const input = document.querySelector("input");
const inputUser = document.querySelector(".user-container");
let erroMsg = document.querySelector(".error-msg")
const form = document.querySelector("form");

let currentPlayer = false;
let userList = {};


form.addEventListener("submit", (event) => {
   event.preventDefault();

   if (input.value.length < 10 && input.value.length != 0) {
    
      const newUser = {
         text: input.value,
      };
      socket.emit("new-user", newUser);
      currentPlayer = true;
      input.value = "";
      document.querySelector(".input-container").remove();
   }
   else{
    validation();
   }
});


socket.on("connect", () => {
   socket.on("fetch-users", (users) => {
      if (Object.keys(users).length === 0) return;
      userList = users;
      for (const user in users) {
         const parentContainer = createParentContainer(users[user].id);
         const mousePointer = createMousePointer();
         const username = createUsername(users[user].text);
         parentContainer.appendChild(mousePointer);
         parentContainer.appendChild(username);
         document.body.appendChild(parentContainer);
      }
   });
});

socket.on("new-user", (newUser) => {
   if (userList[newUser.id]) return;
   userList[newUser.id] = newUser;
   const parentContainer = createParentContainer(newUser.id);
   const mousePointer = createMousePointer();
   const username = createUsername(newUser.text);
   parentContainer.appendChild(mousePointer);
   parentContainer.appendChild(username);

   document.body.appendChild(parentContainer);
});

socket.on("mousemove", (user) => {
   if (userList[user.id]) {
      const container = document.querySelector(`[data-id='${userList[user.id].id}']`);
      container.style.left = user.coordinates.x + "px";
      container.style.top = user.coordinates.y + "px";
   }
});

socket.on("user-left", (user) => {
   if (userList[user.id]) {
      delete userList[user.id];
   }
});

document.addEventListener("mousemove", (event) => {
   if (currentPlayer) {
      socket.emit("mousemmove", { x: event.clientX, y: event.clientY });
   }
});


document.addEventListener("touchmove", (event) => {
   if (currentPlayer) {
      socket.emit("mousemmove", { x: event.touches[0].clientX, y: event.touches[0].clientY });
   }
});

input.addEventListener("keyup", () => {
    
    validation();
  });
  
function validation() {
    const input = document.querySelector("input");
    if(input.value.length > 10){
        input.style.border = "2px solid red";
        
        showError("Name must be lessthan 10 character")
    }
    else if(input.value.length ===0){
        input.style.border = "2px solid red";
        showError("Enter your name")
    }
    else{
        input.style.border = "2px solid green";
        erroMsg.textContent=""
    }
    
  }
  
  function showError(msg){
   
    erroMsg.style.display = "block";
    erroMsg.textContent=msg;
  }

