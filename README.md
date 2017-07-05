# What is emissary?

emissary is a service agent running on a machine to do various jobs.

- It contains a websocket server to allow remote clients to receive entitlement status events.
- Runs a test suite provided by the Seneschal service
- Reports availability to the Seneschal
- Submits xunit import requests to the Polarize service
- Log monitoring service
- File monitoring service 
