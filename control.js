/* jshint esversion: 6 */

try {
    document.addEventListener("DOMContentLoaded", init, false);
} catch (err) {
    window.addEventListener("DOMContentLoaded", init, false )
}

function init() {
    const wsEndpoint = "monitor";
    const restEndpoint = "api/ocpp";
    const page1DOM = document.getElementById("page1");
    const page2DOM = document.getElementById("page2");
    const displayDOM = document.getElementById("display");
    const btnConnectDOM = document.getElementById("btn_connect");
    const btnSendDOM = document.getElementById("btn_send");
    const taMessageDOM = document.getElementById("ta_message");
    const slctChargingStationDOM = document.getElementById("slct_charging_station");
    const slctOCPPActionDOM = document.getElementById("slct_occp_action");
    const tfHostAddressDOM = document.getElementById("tf_hostaddress");
    let websocketAddress = "ws://" + tfHostAddressDOM.value + "/" + wsEndpoint;
    let restAddress = "http://" + tfHostAddressDOM.value + "/" + restEndpoint;
    let connecting = false;
    let connectionOpen = false;
    let waitingForDelay = false;

    btnConnectDOM.onclick = (event) => {
        websocketAddress = "ws://" + tfHostAddressDOM.value + "/" + wsEndpoint;
        restAddress = "http://" + tfHostAddressDOM.value + "/" + restEndpoint;

        setupConnection(websocketAddress);
        enableOrDisableElements();
        showDotsOnDisplay(() => connecting);
    };

    btnSendDOM.onclick = event => {
        waitingForDelay = true;
        setTimeout(() => {
            waitingForDelay = false;
            enableOrDisableElements();
        }, 5000);

        const message = taMessageDOM.value;
        const chargingStationName = getSelectedValue(slctChargingStationDOM);
        const ocppAction = getSelectedValue(slctOCPPActionDOM);

        sendMessageToChargingStation(chargingStationName, ocppAction, message);
        showOnDisplay("Message sent to " + chargingStationName);
    };

    slctOCPPActionDOM.onchange = event => {
        const ocppAction = getSelectedValue(slctOCPPActionDOM);
        const exampleMsgJSON = OCCP_MESSAGE_PER_ACTION[ocppAction];
        taMessageDOM.value = JSON.stringify(exampleMsgJSON) || "";

        enableOrDisableElements();
    };

    slctChargingStationDOM.onchange = event => {
        enableOrDisableElements();
    };

    taMessageDOM.onkeyup = event => {
        enableOrDisableElements();
    };

    function setupConnection(websocketAddress) {
        connecting = true;
        const client = new WebSocket(websocketAddress);

        showOnDisplay("Connecting to " + websocketAddress);

        client.onopen = () => {
            showOnDisplay("Connecting successfully established");
            connectionOpen = true;
            connecting = false;
            enableOrDisableElements();
        };

        client.onmessage = event => {
            const rawData = event.data;
            const jsonData = JSON.parse(rawData);
            const stationName = jsonData.station;
            const occpMessage = jsonData.data;

            let stationAlreadyKnown = false;
            for (let i = 0; i < slctChargingStationDOM.options.length; i++) {
                const optionValue = slctChargingStationDOM.options[i].value;
                stationAlreadyKnown = optionValue == stationName;
            }

            if (!stationAlreadyKnown) {
                const option = document.createElement("option");
                option.text = stationName;
                option.value = stationName;
                slctChargingStationDOM.add(option);
            }

            showOnDisplay(occpMessage);
            enableOrDisableElements();
        };

        client.onclose = (msg) => {
            showOnDisplay("Connection was closed", true);
            connectionOpen = false;
            connecting = false;
            enableOrDisableElements();
        };

        client.onerror = (msg) => {
            showOnDisplay("Establishing connection failed", true);
            enableOrDisableElements();
        };
    }

    function restyleJSON(code) {
        return code.replace(new RegExp("\n", "g"), "")
            .replace(new RegExp("{", "g"), "{<br/>")
            .replace(new RegExp("}", "g"), "<br/>}")
            .replace(new RegExp(",", "g"), ",<br/>");
    }

    function showOnDisplay(msg, isError) {
        let parsedMsg = msg;
        if (isError) {
            parsedMsg = "<span class='error'>" + parsedMsg + "</span>"
        }
        parsedMsg = "<br/>" + parsedMsg;
        displayDOM.innerHTML += parsedMsg;
        displayDOM.scrollTop = displayDOM.scrollHeight;
    }

    function showDotsOnDisplay(predicate) {
        function setTimer() {
            setTimeout(() => {
                if (predicate()) {
                    displayDOM.innerHTML += ".";
                    displayDOM.scrollTop = displayDOM.scrollHeight;
                    setTimer();
                }
            }, 1000);
        }

        if (predicate()) {
            setTimer();
        }
    }

    function setEnabled(elementDOM, enabled) {
        if (enabled) {
            elementDOM.removeAttribute("disabled");
        } else {
            elementDOM.setAttribute("disabled", "disabled");
        }
    }

    function enableOrDisableElements() {
        const btnSendEnabled =
            !waitingForDelay &&
            getSelectedValue(slctOCPPActionDOM) &&
            getSelectedValue(slctChargingStationDOM) &&
            taMessageDOM.value &&
            connectionOpen;
        const slctChargingStationEnabled =
            connectionOpen &&
            slctChargingStationDOM.options.length > 1;
        const slctOCPPActionEnabled =
            connectionOpen;
        const taMessageEnabled =
            connectionOpen &&
            getSelectedValue(slctOCPPActionDOM);
        const btnConnectEnabled =
            !connectionOpen &&
            !connecting;
        const tfHostAddressEnabled =
            !connectionOpen &&
            !connecting;

        setEnabled(btnSendDOM, btnSendEnabled);
        setEnabled(slctChargingStationDOM, slctChargingStationEnabled);
        setEnabled(slctOCPPActionDOM, slctOCPPActionEnabled);
        setEnabled(taMessageDOM, taMessageEnabled);
        setEnabled(btnConnectDOM, btnConnectEnabled);
        setEnabled(tfHostAddressDOM, tfHostAddressEnabled);
    }

    function getSelectedValue(selectDOM) {
        return selectDOM.options[selectDOM.selectedIndex].value;
    }

    function sendMessageToChargingStation(chargingStationName, action, msg) {
        const xhttp = new XMLHttpRequest();
        const payload = {
            "station_name": chargingStationName,
            "action": action,
            "content": msg
        };
        xhttp.open("POST", restAddress, true);
        xhttp.send(JSON.stringify(payload));
    }
}
