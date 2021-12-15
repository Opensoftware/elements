function colorBlock(theme, color, label) {
  let colorBlock = `<div class="color-block">
                <div style="background-color: ${ color }; color: ${ label };">
                  <div class="color-block__buffer">
                    <p class="color-block__label">
                      ${ theme }
                    </p>
                    <div class="spacer-40"></div>
                    <p class="color-block__hex">
                      ${ color }
                    </p>
                  </div>
                </div>
              </div>
  `;
  return colorBlock;
}

module.exports = {
  colorBlock: colorBlock,
}