# CCyber
The idea behind _CCyber_ is to provide a central, searchable hub for predominantly OSINT (Open Source Intelligence).
Currently the app is very much at alpha/proof-of-concept stage and has very limited use.

This repo is broken down into three parts:
* static website
* database (structure)
* API

The API will initially designed to be hosted on AWS and will contain:
* database functionality
* user authentication
* searching
* feed feeder capability
* tool functionality (such as ping, dns lookups, reverse dns, whois etc.)
 
**ccapi.interaction.js** will be used for in browser communications between API and static website