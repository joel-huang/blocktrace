# Blocktrace, a decentralized identity management system

## Files
* `/hyperledger` contains the Hyperledger blockchain logic, smart contracts and authentication cards
* `/KYCBackendServer` contains the backend server, which interfaces with the blockchain and handles cryptography
* `/kyc-admin-app` contains the application used by the service to obtain and verify new customer requests

## Installation and Development
* Always develop on Composer Playground (in the demo, at http://173.193.98:31080). When done, export as `.bna`
* Extract the `.bna`: Using `7z` or equivalent, run `7z e -o./hyperledger devtest.bna` or equivalent.
* Extract the contents of `blocktrace/hyperledger` with the extracted `.bna`, and re-run `generate_jsdoc.bat`.
* Finally, `git add`/`commit`/`push`.

## Description
* Development repository for Blocktrace, a Hyperledger Fabric blockchain back-end supporting remote and decentralized identity verification for businesses to securely onboard customers with no hassle
* Deployed on IBM Cloud using Kubernetes
* REST server and RESTful API at https://173.193.102.98:31090/explorer

## About 

## Blocktrace Hyperledger Model
* `User` Participants, an abstraction of real-world identity holders (people), contain encrypted `UserData` objects, which can be modified or accessed through the RESTful API or the smart contract API. The API is only accessible by a back-end server with the correct authentication token, or the requesting business that has been given authorization by the holder of the identity.

## Smart Contract Documentation
* The smart contract API provides functionality not provided through the RESTful API. This includes actions that modify the blockchain registries.
* Ensure `jsdoc` is installed. If not, `npm install -g jsdoc`.
* Run `generate_jsdoc.bat` to generate the HTML documentation.
