export function colorFromId(id) {
   let hash = 0;
   for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
   }
   const hue = Math.abs(hash) % 360;
   return `hsl(${hue}, 72%, 58%)`;
}

export function createParentContainer(id, color) {
   const div = document.createElement("div");
   div.className = "cursor-container";
   div.setAttribute("data-id", id);
   div.style.position = "absolute";
   div.style.pointerEvents = "none";
   div.style.color = color;

   return div;
}

export function createMousePointer(color) {
   const iconElement = document.createElement("i");
   iconElement.classList.add("fas", "fa-mouse-pointer");
   iconElement.style.color = color;
   iconElement.style.fontSize = "22px";
   iconElement.style.filter = "drop-shadow(0 1px 3px rgba(0,0,0,0.6))";
   return iconElement;
}

export function createUsername(data, color) {
   const span = document.createElement("span");
   span.classList.add("username-span");
   span.textContent = data;
   span.style.backgroundColor = color;

   return span;
}
