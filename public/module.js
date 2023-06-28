export function createParentContainer(id) {
   const div = document.createElement("div");
   div.setAttribute("data-id", id);
   div.style.position = "absolute";

   return div;
}

export function createMousePointer() {
   // const div = document.createElement("div");
   // div.style.width = "20px";
   // div.style.height = "20px";
   // div.style.backgroundColor = setBg();
   // div.style.borderRadius = "50%";
   // div.style.margin = "auto";
   // div.style.marginBottom = "10px";

   // return div;
//   <i class="fa-sharp fa-solid fa-arrow-pointer"></i>
 
   const iconElement = document.createElement("i");
  iconElement.classList.add("fas", "fa-mouse-pointer"); 
  iconElement.style.color = setBg();
  return iconElement;
 }

export function createUsername(data) {
   const span = document.createElement("span");
   span.style.fontSize = "20px";
   span.classList.add("username-span")
   span.textContent = data;

   return span;
}

export function setBg() {
   const randomColor = Math.floor(Math.random() * 0xffffff).toString(16);
   return "#" + randomColor;
}
