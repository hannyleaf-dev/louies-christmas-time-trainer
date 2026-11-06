'use strict';
/* Start the game */
(async function start() {
  Store.load();
  setupChristmas();
  setupTopbar();
  setupHoverSpeech();
  await Voice.init();
  go('splash');
})();
