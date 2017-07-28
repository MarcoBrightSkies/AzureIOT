'use strict';

var EventHubClient = require('azure-event-hubs').Client;
var connectionString = 'HostName=bskies-iot-test-hub.azure-devices.net;SharedAccessKeyName=iothubowner;SharedAccessKey=46T8CKFxNIuruJQxRllavUMKe5rP8mnNyv7I75RnONs=';
var printError = function (err) {
  console.log(err.message);
};

var printMessage = function (message) {
  console.log('Message received: ');
  console.log(JSON.stringify(message.body));
  console.log('');
};

var client = EventHubClient.fromConnectionString(connectionString);
client.open()
    .then(client.getPartitionIds.bind(client))
    .then(function (partitionIds) {
        return partitionIds.map(function (partitionId) {
            return client.createReceiver('$Default', partitionId, { 'startAfterTime' : Date.now()}).then(function(receiver) {
                console.log('Created partition receiver: ' + partitionId)
                receiver.on('errorReceived', printError);
                receiver.on('message', printMessage);
            });
        });
    })
    .catch(printError);