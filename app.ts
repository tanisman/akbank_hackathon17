import debug = require('debug');
import express = require('express');
import path = require('path');
var bodyParser = require('body-parser');


import routes from './routes/index';
import newWallet from './routes/newwallet';
import payWithAkce from './routes/payWithAkce';
import payViaAkce from './routes/payViaAkce';
import rewardAkce from './routes/rewardAkce';
import spents from './routes/spents';
import spendData from './routes/spendData';
import marketData from './routes/marketData';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


app.use('/', routes);
app.use('/newWallet', newWallet);
app.use('/payWithAkce', payWithAkce);
app.use('/payViaAkce', payViaAkce);
app.use('/rewardAkce', rewardAkce);
app.use('/spents', spents);
app.use('/spendData', spendData);
app.use('/marketData', marketData);


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
    app.use((err: any, req, res, next) => {
        res.status(err['status'] || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use((err: any, req, res, next) => {
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
