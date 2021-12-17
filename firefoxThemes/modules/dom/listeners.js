/*Establish click event listener*/
function clickListener(el, func) {
  el.addEventListener('click', func, true);
}

/*Establish Multiple click event listeners*/
function multiClickListener(els, func) {
  for (const el of els) {
    clickListener(el, func)
  }
}
export {clickListener,multiClickListener}