/* jshint esversion: 6 */

const OCCP_MESSAGE_PER_ACTION = {
    "RemoteStartTransaction": {
        "connectorId": 1,
        "idTag": "ABC123"
    },
    "RemoteStopTransaction": {
        "transactionId": "<ENTER THE CORRESPONDING INTEGER HERE>"
    },
    "SetChargingProfile": {
        "connectorId": 1,
        "csChargingProfiles": {
            "chargingProfileId": "<ENTER UNIQUE INTEGER HERE>",
            "transactionId": "<ENTER THE CORRESPONDING INTEGER HERE>",
            "stackLevel": 0,
            "chargingProfilePurpose": "TxProfile",
            "chargingProfileKind": "Relative",
            "chargingSchedule": {
                "chargingRateUnit": "A",
                "chargingSchedulePeriod": [{
                    "startPeriod": 0,
                    "limit": 10
                }]
            }
        }
    },
    "UnlockConnector": {
        "connectorId": 1
    }
};
