# SIMULUX

## A complete server-client stack to bring all smart light vendors together under one app.

---

One day I came into my room containing Yeelight wifi lights and tried to turn them on with their app. No dice. The server in Singapore was down. What?! Why must I rely on a server many thousand kilometers away to turn on the lights right above my head. I reluctantly reached for the physical light switch as I began thinking of how I could fix this problem.

The solution is **Simulux**, which roughly translates from latin to **Together Light**. Simulux aims to abstract the logic between smart light vendors and represent them together, under the same app while bridging them using your own server (a Pi on a local network maybe?).

---
## Angular SPA Client
The front-end app is written as an Angular SPA. Development is ongoing as features are continuously added. The project is currently in early phases.

---
## Go HTTP Server
The back-end HTTP server is written using Go. Go was chosen for its simplicity, speed and cross-compilation. The aim is for the complete app to be an easily installable binary + resource files and simply work on whichever computer you choose to run it on. The http server currently registers two primary route prefixes:
- **/api** - for its CRUD operations.
- **/** - for the SPA and its resources.

---
## Light Vendors
The structure of the server code which looks after the abstraction is still under development. However, once there is a clear methodology in place I welcome collaborators to implement plugins for vendors currently not supported on this platform such as Phillips Hue and LiFX.

### Current Vendor Support
- Yeelight (partial)

---
## Database
Simulux uses SQLite to store its application information. A relational database was chosen due to the nature of the relationships used in the application as well as the expectation for low data volumes. In essence, the data is high in complexity and low in volume. SQLite is chosen as the database vendor as it offers the right feature set while being extremely lightweight. It also operates without the need for a database server, simplifying the application further and removing possible failure points. This application needs to run as stable as possible without specialist user intervention.

---
## Build Pipeline
A build pipeline is planned.

---
## Contributors
 - Tom van Dinther (Code Owner)

---
## License
[Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/)