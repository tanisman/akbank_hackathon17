"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug = require("debug");
const express = require("express");
const path = require("path");
var bodyParser = require('body-parser');
const index_1 = require("./routes/index");
const newwallet_1 = require("./routes/newwallet");
const payWithAkce_1 = require("./routes/payWithAkce");
const payViaAkce_1 = require("./routes/payViaAkce");
const rewardAkce_1 = require("./routes/rewardAkce");
const spents_1 = require("./routes/spents");
const spendData_1 = require("./routes/spendData");
const marketData_1 = require("./routes/marketData");
var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/', index_1.default);
app.use('/newWallet', newwallet_1.default);
app.use('/payWithAkce', payWithAkce_1.default);
app.use('/payViaAkce', payViaAkce_1.default);
app.use('/rewardAkce', rewardAkce_1.default);
app.use('/spents', spents_1.default);
app.use('/spendData', spendData_1.default);
app.use('/marketData', marketData_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err['status'] = 404;
    next(err);
});
// error handlers
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use((err, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});
app.set('port', process.env.PORT || 3000);
var server = app.listen(app.get('port'), function () {
    debug('Express server listening on port ' + server.address().port);
});
//# sourceMappingURL=app.js.map