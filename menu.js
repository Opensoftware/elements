function recursiveMenu(o, addClass) {
  let template = ``;

  let linkClass = 'main-menu__link';
  if(addClass) {
    linkClass += ` ${addClass}`;
  }

  function traverse(o) {
    let i;
    for (var k in o) {
      i = o[k];
      if (typeof i === 'string') {
        template += `<li class="main-menu__item" role="none">
                      <a class="${linkClass}" href="${i}" role="menuitem">
                        ${k}
                      </a>
                    </li>
                    `;
      } else if (typeof i === 'object') {
        template += `<li class="main-menu__item  main-menu__item--submenu" role="none">
                        <a class="${linkClass} ${linkClass}--submenu" role="menuitem">
                          ${k}
                        </a>
                      <ul class="main-menu__submenu" role="menu" aria-label="${k}">
                      `
        traverse(i);
        template += ` 
                      </ul>
                    </li>
                    `
      }
    }
  }

  traverse(o);
  return template;
}

module.exports = {
  recursiveMenu
}