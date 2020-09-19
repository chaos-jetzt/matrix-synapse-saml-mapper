let registerField = document.getElementById("field-username");
let connectUsernameField = document.getElementById("connect-field-username");
let connectPasswordField = document.getElementById("connect-field-password");
let inputFields = document.getElementsByClassName("field");
let registerForm = document.getElementById("register-form");
let registerButton = document.getElementById("button-register-submit");
let connectForm = document.getElementById("connect-form");
let connectButton = document.getElementById("button-connect-submit");
let message = document.getElementById("message");
let tabLinkButtons = document.getElementsByClassName("tablinks");
let tabContentBlocks = document.getElementsByClassName("tabcontent");

// Remove input field placeholder if the text field is not empty
let switchClass = function(input) {
    if (input.value.length > 0) {
        input.classList.add('has-contents');
    }
    else {
        input.classList.remove('has-contents');
    }
};

// Submit username and receive response
let showMessage = function(messageText) {
    // Unhide the message text
    message.classList.remove("hidden");

    message.innerHTML = messageText;
};

let hideMessage = function() {
    // Hide the message text
    message.classList.add("hidden");
};

let onRegisterResponse = function(response, success) {
    // Display message
    showMessage(response);

    if(success) {
        registerForm.submit();
        return;
    }

    // Enable submit button and input field
    registerButton.classList.remove('button--disabled');
    registerButton.value = "Submit"
};


let onConnectResponse = function(response, success) {
    // Display message
    showMessage(response);

    if(success) {
        connectForm.submit();
        return;
    }

    // Enable submit button and input field
    connectButton.classList.remove('button--disabled');
    connectButton.value = "Submit"
};


let allowedUsernameCharacters = RegExp("[^a-z0-9\\.\\_\\=\\-\\/]");
let usernameIsValid = function(username) {
    return !allowedUsernameCharacters.test(username);
}
let allowedCharactersString = "" +
    "lowercase letters, " +
    "digits, " +
    "<code>.</code>, " +
    "<code>_</code>, " +
    "<code>-</code>, " +
    "<code>/</code>, " +
    "<code>=</code>";

let buildQueryString = function(params) {
    return Object.keys(params)
        .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
        .join('&');
}

let submitRegister = function(username) {
    if(username.length == 0) {
        onRegisterResponse("Please enter a username.", false);
        return;
    }
    if(!usernameIsValid(username)) {
        onRegisterResponse("Invalid username. Only the following characters are allowed: " + allowedCharactersString, false);
        return;
    }

    let check_uri = 'check?' + buildQueryString({"username": username});
    fetch(check_uri, {
        "credentials": "include",
    }).then((response) => {
        if(!response.ok) {
            // for non-200 responses, raise the body of the response as an exception
            return response.text().then((text) => { throw text });
        } else {
            return response.json()
        }
    }).then((json) => {
        if(json.error) {
            throw json.error;
        } else if(json.available) {
            onRegisterResponse("Success. Please wait a moment for your browser to redirect.", true);
        } else {
            onRegisterResponse("This username is not available, please choose another.", false);
        }
    }).catch((err) => {
        onRegisterResponse("Error checking username availability: " + err, false);
    });
}

let submitConnect = function(username, password) {
    if(username.length == 0) {
        onConnectResponse("Please enter a username.", false);
        return;
    }
    if(!usernameIsValid(username)) {
        onConnectResponse("Invalid username. Only the following characters are allowed: " + allowedCharactersString, false);
        return;
    }
    if(password.length == 0) {
        onConnectResponse("Please enter a password.", false);
        return;
    }

    details = {
        username: username,
        password: password
    }

    var formBody = [];
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");

    fetch('check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: formBody
    }).then((response) => {
        if(!response.ok) {
            // for non-200 responses, raise the body of the response as an exception
            return response.text().then((text) => { throw text });
        } else {
            return response.json()
        }
    }).then((json) => {
        if(json.error) {
            throw json.error;
        } else if(json.success) {
            onConnectResponse("Success. Please wait a moment for your browser to redirect.", true);
        } else {
            onConnectResponse("The credentials you entered are not valid.", false);
        }
    }).catch((err) => {
        onConnectResponse("Error checking credentials: " + err, false);
    });
}

let registerClickSubmit = function() {
    if(registerButton.classList.contains('button--disabled')) { return; }

    // Disable submit button and input field
    registerButton.classList.add('button--disabled');

    // Submit username
    registerButton.value = "Checking...";
    submitRegister(registerField.value);
};

let connectClickSubmit = function() {
    if(connectButton.classList.contains('button--disabled')) { return; }

    // Disable submit button and input field
    connectButton.classList.add('button--disabled');

    // Submit data
    connectButton.value = "Checking...";
    submitConnect(connectUsernameField.value, connectPasswordField.value);
};

registerButton.onclick = registerClickSubmit;
connectButton.onclick = connectClickSubmit;

// Listen for events on inputFields
for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener('keypress', function (event) {
        // Listen for Enter on input field
        if (event.which === 13) {
            event.preventDefault();
            if (inputFields[i].id === "field-username") {
                registerClickSubmit();
            } else {
                connectClickSubmit();
            }
            return true;
        }
        switchClass(inputFields[i]);
    });
    inputFields[i].addEventListener('change', function () {
        switchClass(inputFields[i]);
    });
}

for (let i = 0; i < tabLinkButtons.length; i++) {
    tabLinkButtons[i].addEventListener('click', function(event) {
        for (let i = 0; i < tabContentBlocks.length; i++) {
            tabContentBlocks[i].classList.remove("active");
        }

        for (let i = 0; i < tabLinkButtons.length; i++) {
            tabLinkButtons[i].classList.remove("active");
        }

        document.getElementById(event.target.dataset.tabid).classList.add('active')
        event.target.classList.add("active")
        hideMessage()
    })
}