# What is emissary?

emissary is a service agent running on a machine to do various jobs.

- It contains a websocket server to allow remote clients to receive entitlement status events.
- Runs an AVA test runner test suite provided by the Seneschal service
- Reports availability to the Seneschal
- Submits xunit import requests to the Polarize service
  - Also sends a report to mimir on each test method completion for real-time data
- Log monitoring service
- File monitoring service
- Submits status to mimir reservation graph


## Websocket server

emissary is a websocket server and client.  It is a server for other remote clients to obtain entitlement status events
and also a client to the Seneschal, Polarize and Mimir services.

As such, emissary contains a small express based nodejs server that uses the ws npm module to do websocket communication
with other clients.

## AVA test runner

The Seneschal will determine what test suite to give to the emissary agent running on each Test Platform.  Emissary will
read in the suite file and execute it.  The emissary will send a message to the Seneschal when it is ready to execute
a test suite.

## Test Result reporting

The emissary will do two kinds of reporting:

- A final report of the test suite that is submitted as an xunit file to the polarize service
- A live update sent to the mimir database on each test method completion

When the final report is done, the seneschal will know it is done, because the seneschal will be listening for a message
on the CI Bus indicating it is complete.  Moreover, the seneschal can also receive live query updates from the mimir 
database (this is useful to see if a test suite got stuck or aborted early).

## Log monitoring service

The emissary can be asked to monitor a log file.  The list of requirements (from essential to nice to have) are:

- Search for a regex for each line
- Contextual search using backtracking
- Classification of errors
- Prediction of errors

Unlike the ELK approach, this will be done in real-time.
