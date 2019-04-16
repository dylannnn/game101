'use strict';

(function (app) {
    app.options = {
        useNodeServer: false, // use node server to serve the page
        apiURL: 'https://www.drukzo.nl.joao.hlop.nl/challenge.php',
        validation: {
            range: [0, 100],
            required: true,
            invalidMessage: {
                default: 'Form field input with error.',
                range: 'Please guess a number between {0} and {1}.',
                required: 'This field is required.',
            },
        },
        guessData: {},
        statuMessage: {
            'ERROR': 'Game master throw you an error.',
            'NOTFOUND': 'API enidpoint is missing.',
            'HIGHER': 'You should be more confidence and give a HIGHER number.',
            'LOWER': 'Hey, you\'ve over confidence. Try a LOWER number.' ,
            'BINGO': 'Congratulations! You just guess right.',
            'CORS': 'Access to XMLHttpRequest from this origin has been blocked by CORS policy. Please check README.md for more details.'
        },
        isDebug: false
    };
    /**
     * Init application
     * @param {object} options Config options
     */
    app.init = function (options) {
        // Merge options
        Object.assign(app.options, options);
        // Overwrite console.log()
        if (!app.options.isDebug) {
            console.log = function () {};
        }
        // Init events
        app.initEvents();
    }

    app.initEvents = function () {
        // Init Button Click Event
        document.addEventListener('click', function (event) {
            if (event.target.matches('.form-submit')) {

                // If disabled, do nothing
                var isDisabled = !!event.target.getAttribute('disabled');
                if (isDisabled) {
                    return false;
                }
                // Construct guessData
                app.options.guessData.player = event.target.getAttribute('data-user') || null;
                if (app.options.guessData.player) {
                    app.options.guessData.guess = document.getElementById('user' + app.options.guessData.player).value;
                } else {
                    app.options.guessData = {}
                }

                // Valid input
                // - show errors
                if (Object.keys(app.options.guessData).length > 0 && !app.validInput(event.target)) {
                    return false;
                }

                event.target.classList.add('loading');
                event.target.setAttribute('disabled', 'disabled');

                // - submit if input is valid
                app.guessNumber(event.target);
            }
        }, false);

        // Add focus event listener to user input field
        // - Clear validation message
        document.addEventListener('focus', function () {
            if (event.target.matches('.form-control')) {
                // Clear validation message
                var validationElmRef = event.target.parentNode.nextSibling.nextElementSibling;
                validationElmRef.innerText = '';
                validationElmRef.classList.remove('error');
                validationElmRef.classList.remove('success');
            }
        }, true);

        // Add blur event listener to user input field
        // - Valid the input
        document.addEventListener('keyup', function () {
            if (event.target.matches('.form-control')) {
                // Valid user input
                app.validInput(event.target.nextElementSibling);
            }
        }, true);

        // Add blur event listener to user input field
        // - Valid the input
        document.addEventListener('blur', function () {
            if (event.target.matches('.form-control')) {
                // Valid user input
                if (event.target.value !== '') {
                    app.validInput(event.target.nextElementSibling);
                }
            }
        }, true);
    }

    /**
     * Input validation
     * @param {HTMLELEMENT} playerElmRef The button that user clicked
     */
    app.validInput = function (playerElmRef) {
        var user = playerElmRef.getAttribute('data-user') || null;
        var userInput = document.getElementById('user' + user).value;
        var validationRef = playerElmRef.parentNode.nextSibling.nextElementSibling;

        if (userInput == '' && app.options.validation.required) {
            app.showError(validationRef, 'REQUIRED');
            return false;
        } else if (userInput < 0 || userInput > 100) {
            app.showError(validationRef, 'RANGE', [0, 100]);
            return false;
        }
        return true;
    }

    /**
     * Show Validation error
     * @param {HTMLELEMENT} validationMsgElmRef Validation message HTML reference
     * @param {string} type Error type.
     * @param {object | array} data Additional data that related to the error type
     */
    app.showError = function (validationMsgElmRef, type, data) {
        switch (type) {
            case 'REQUIRED':
                validationMsgElmRef.innerText = app.options.validation.invalidMessage.required;
                break;
            case 'RANGE':
                validationMsgElmRef.innerText = app.options.validation.invalidMessage.range.replace('{0}', data[0]).replace('{1}', data[1]);
                break;
            case 'CORS':
                validationMsgElmRef.innerText = app.options.statuMessage['CORS'];
                break;
            case 'NOTFOUND':
                validationMsgElmRef.innerText = app.options.statuMessage['NOTFOUND'];
                break;
            default:
                validationMsgElmRef.innerText = app.options.validation.invalidMessage.default;
        }
        validationMsgElmRef.classList.add('error');
    }

    /**
     * Show API response result
     * @param {HTMLELEMENT} validationMsgElmRef Validation message HTML element reference
     * @param {string} result API response result
     */
    app.showResult = function(validationMsgElmRef, result) {
        switch (result) {
            case 'lower':
                validationMsgElmRef.innerText = app.options.statuMessage['LOWER'];
                break;
            case 'higher':
                validationMsgElmRef.innerText = app.options.statuMessage['HIGHER'];
                break;
            case 'Bingo!!!':
                validationMsgElmRef.innerText = app.options.statuMessage['BINGO'];
                // Create animation for the winner
                document.getElementsByClassName('banner')[0].classList.add('game-winner');
                document.getElementsByClassName('banner')[0].innerHTML = app.options.statuMessage['BINGO'];
                // Disable player input and buttons
                var submitBtnList = document.getElementsByClassName('form-submit');
                var playerInputList = document.getElementsByClassName('form-control');
                for (var submitBtn of submitBtnList) {
                    submitBtn.setAttribute('disabled', 'disabled');
                }
                for (var playerInput of playerInputList) {
                    playerInput.setAttribute('disabled', 'disabled');
                }
                break;
            default:
                validationMsgElmRef.innerText = app.options.validation.invalidMessage.default;
        }
        
        validationMsgElmRef.classList.add('success');
    }

    /**
     * Send XHR GET request
     * @param {HTMLELEMENT} targetElmRef Submit button element reference
     */
    app.guessNumber = function (targetElmRef) {
        var data = null;
        var xhr = new XMLHttpRequest();
        
        // [TEST] Try to solve CORS and PHPSESSID issue
        if (app.options.useNodeServer) {
            xhr.withCredentials = true;
            app.options.apiURL = '/guess-number'
        }

        var requestStr = app.options.apiURL + '?' + Object.keys(app.options.guessData).map(function (key) {
            return key + '=' + app.options.guessData[key]
        }).join('&');
        
        xhr.open('GET', requestStr, true);
        xhr.setRequestHeader('cache-control', 'no-cache');
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader('Access-Control-Allow-Origin', '*');

        var validationMsgElmRef = targetElmRef.parentNode.nextSibling.nextElementSibling;

        xhr.onload = function (event) {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var response = JSON.parse(xhr.response);
                    if (response.hasOwnProperty('guess')) {
                        app.showResult(validationMsgElmRef, response.guess);
                    } else if (response.hasOwnProperty('error')) {
                        app.showError(validationMsgElmRef, 'ERROR');
                    }
                } else {
                    if (xhr.statusText == 'Not Found') {
                        
                        app.showError(validationMsgElmRef, 'NOTFOUND');
                    }
                    console.error(xhr.statusText);
                }

                targetElmRef.classList.remove('loading');
                targetElmRef.removeAttribute('disabled');
            }
        };
        xhr.onerror = function (event) {
            targetElmRef.classList.remove('loading');
            targetElmRef.removeAttribute('disabled');
            app.showError(targetElmRef.parentNode.nextSibling.nextElementSibling, 'CORS');
        };

        xhr.send(data);
    }
})(window.guessGame = window.guessGame || {})


window.onload = function () {
    guessGame.init({
        // useNodeServer: true, // use node server to serve the page
        isDebug: true
    });
}