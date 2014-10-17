module.exports = function(app) {
    var mainController = App.controller('main');
    app.get('/',         mainController.main);
}
