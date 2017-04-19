var cot_login_app;

/*
instantiate cot_login with an options parameter:
options: {
 appName: '', //Required, the name of your app, this will be sent to the CC AuthSession API call to login
 ccRoot: '', //Optional, defaults to '' (the current protocol and domain will be used), use this to specify the <protocol>:://<domain> to use for the CC AuthSession API call
 welcomeSelector: '', //Optional, a jquery selector string for the element where the login/logout information should be displayed
 onReady: function(cot_login_instance){}, //Optional, a function that will be called after this cot_login object is ready to be used
 onLogin: function(cot_login_instance){}, //Optional, a function that will be called after the user logs in successfully
}
 */
var cot_login = function(options) {
    this.options = options;
    if (!this.options['appName']) {
        throw new Error('Error: the appName option is required');
    }
    var that = this,
        modal = null;
    $("#app-utility-login").load('html/cot_login.html? #loginModal', function() {
        that.modal = $("#loginModal");

        that.modal.find("#cot_login").click(function() {
            that._login();
        });

        that.modal.find('input').keydown(function(e) {
            if ((e.charCode || e.keyCode || 0) === 13) {
                that._login();
            }
        });
        that._setUserName();

        (that.options['onReady'] || function(){})(that);
    });
};


cot_login.prototype.showLogin = function() {
    this.modal.modal();
};

cot_login.prototype.isLoggedIn = function() {
    return !!this._cookie('sid');
};

cot_login.prototype.logout = function() {
    this._removeCookie('sid');
    this._removeCookie('cot_uname');
    this._removeCookie('email');
    this._removeCookie('firstName');
    this._removeCookie('lastName');
    this._removeCookie('groups');
    this.sid = this.username = this.email = this.firstName = this.lastName = this.groups = '';
    this._setUserName();
    window.location.reload();
};

cot_login.prototype._setUserName = function() {
    cot_login_app = this;

    if (this.isLoggedIn()) {
        this._loadUserInfo();

        // User is logged in - display login name
        $(this.options['welcomeSelector']).html("<div class='welcomemsg'><b>User Name</b>: " + this.username + " (<a class='logout' onclick='cot_login_app.logout();'>Logout</a>)</div>");

        // Call the success callback function that is called when a user is logged
        (this.options['onLogin'] || function(){})(this);

    } else {
        // User is not logged in - display login link
        $(this.options['welcomeSelector']).html("<div class='welcomemsg'><a class='login' onclick='cot_login_app.showLogin();'>Login</a></div>");
    }
};

cot_login.prototype._login = function() {
    var that = this;
    this.modal.find(".btn").prop('disabled', true);

    $.post((this.options['ccRoot'] || '') + '/cc_sr_admin_v1/session?app=' + this.options.appName, { user: $("#username").val(), pwd: $("#password").val() }, function(data) {
        if (!data.error) {
            that._processLogin(data);

            that.modal.modal('hide');
        } else if (data.error === 'invalid_user_or_pwd') {
            that._displayLoginError('Invalid username or password');
        }

    }).fail(function(jqXHR, textStatus, error) {
        that._displayLoginError('Unable to log in. Please try again.');
        console.log("POST Request Failed: " + textStatus + ", " + error,  arguments);
    }).always(function(data) {
        that.modal.find(".btn").removeAttr('disabled').removeClass('disabled');
    });
};

cot_login.prototype._displayLoginError = function(s) {
    $('<div class="alert alert-danger" role="alert">' + s + '</div>')
        .prependTo(this.modal.find("#loginModalBody"))
        .fadeOut(5000, function () {
            $(this).remove();
        });
};

cot_login.prototype._processLogin = function(data) {
    var date = new Date();
    // Cookie session timeout to password expiry time from AuthSession API otherwise set to 1 hour
    if (data.passwordExpiryDate) {
        date.setTime(data.passwordExpiryDate);
    } else {
        date.setTime(date.getTime() + (60 * 60 * 1000));
    }

    this._cookie("sid", data.sid, {expires: date});
    this._cookie("cot_uname", data.userID, {expires: date});
    this._cookie("email", (data.email || '').toLowerCase(), {expires: date});
    if (data.cotUser) {
        this._cookie("firstName", data.cotUser.firstName, {expires: date});
        this._cookie("lastName", data.cotUser.lastName, {expires: date});
        this._cookie("groups", data.cotUser.groupMemberships, {expires: date});
    }

    this._setUserName();
}

cot_login.prototype._loadUserInfo = function() {
    this.sid = this._cookie('sid');
    this.username = this._cookie('cot_uname');
    this.email = this._cookie('email');
    this.firstName = this._cookie('firstName');
    this.lastName = this._cookie('lastName');
    this.groups = this._cookie('groups');
};

cot_login.prototype._cookie = function(key, value, options){
    if(key) {
        key = encodeURIComponent(this.options.appName) + '.' + key;
    }
    return $.cookie(key, value, options);
};

cot_login.prototype._removeCookie = function(s){
    return $.removeCookie(encodeURIComponent(this.options.appName) + '.' + s);
};