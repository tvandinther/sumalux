# SIMULUX

## A complete server-client stack to bring all smart light vendors together under one app.

---

One day I came into my room containing Yeelight wifi lights and tried to turn them on with their app. No dice. The server in Singapore was down. What?! Why must I rely on a server many thousand kilometers away to turn on the lights right above my head. I reluctantly reached for the physical light switch as I began thinking of how I could fix this problem.

The solution I thought up is **Simulux**, which roughly translates from latin to **Together Light**. Simulux aims to abstract the logic between light vendors and represent them together, under the same app while bridging them using your own server (a Pi on a local network maybe?).

---
## Angular Client
The front-end app is written as an Angular SPA. Development is ongoing as features are continuously added. The project is currently in early phases.

---
## Light Vendors
The structure of the server code which looks after the abstraction is still under development. However, once there is a clear methodology in place I welcome collaborators to implement plugins for vendors currently not supported on this platform such as Phillips Hue and LiFX.

### Current Vendor Support
- Yeelight (partial)

---
## Database
I began developing the server to use MongoDB as its backend database. I dropped it in favour of Redis due to the current use case. The interface between the server and database has been abstracted using a connector. Any database can be used with the server code provided a custom connector class is written as well as a new model class for each facet of the app.

### Current Required Database Modules
- database.connector.ts
- database.lights.model.ts

---
## Docker
The development environment for this project has been set up for docker. A docker-compose file outlines the 3-container structure.

**Note: Currently this has been partially disabled due to an issue with sending and receiving multicast UDP with SSDP during Yeelight discovery. A stack overflow question regarding this issue can be found [here](https://stackoverflow.com/questions/63643571/how-can-i-send-and-receive-ssdp-from-a-docker-container).**

---
## Build Pipeline
A build pipeline is planned.

---
## Contributors
 - Tom van Dinther (Code Owner)

---
## License
[Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/)