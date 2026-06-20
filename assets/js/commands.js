(function () {
  function completed(event) {
    if (event && typeof event.completed === 'function') event.completed();
  }
  Office.onReady(function () {
    if (Office.actions && Office.actions.associate) {
      Office.actions.associate('action', completed);
    }
  });
})();
