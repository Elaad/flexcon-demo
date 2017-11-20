# Instructions OCPP demo

1.	**Clone or download the frontend from https://github.com/Elaad/flexcon-demo.** This webtool allows you to read and send OCPP messages to a charging station.

2.	**Enter the websocket url in the textfield on top: 192.168.10.2:8080 and press ‘Connect’.** A websocket connection will be opened with the OCPP server of the Charge Point Operator (CPO).

3.	**Wait for incoming messages from a charging station (they appear on the black display).** When a message is received (it can take approximately 20 seconds), the corresponding charging station gets registered in the tool, allowing you to send a message to this charging station. 

4.	**Select a charging station in the select box on the left bottom of the screen.** The selected charging station will receive the messages you are about to send. 

5.	**Select an OCPP action in the select box on the right bottom of the screen.** After selecting an action, a message template is automatically entered in the text area below the black display.

6.	**Adjust the message template.** With most of the messages, you are free to enter your own values as long as you adhere to the template. Some messages however, require you to enter a value that was previously sent by the charging station (e.g. transactionId). 

7.	**Click on ‘Send’ when you’re finished with the message.** The message is now being sent to the OCPP server and ultimately to the charging station that you previously selected. Upon receiving your message, the charging station will interpret, validate and execute the action. When successful, you’ll notice a change like the changing of LED colors indicating a change of charging state.

