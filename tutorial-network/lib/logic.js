/**
 * Track the trade of a commodity from one trader to another
 * @param {org.acme.biznet.Trade} trade - the trade to be processed
 * @transaction
 */
function tradeCommodity(trade) {
    trade.commodity.owner = trade.newOwner;
    return getAssetRegistry('org.acme.biznet.Commodity')
        .then(function (assetRegistry) {
            return assetRegistry.update(trade.commodity);
        });
}

function getUserData(get) {
	
	// check get.user.access
	
}

function createUser() {
	// create new instance of a User
	var userFactory = getFactory();
	var newUser = userFactory.newResource('org.acme', 'User', name);
	newUser.userID = 
}

function publish(publish) {

	// receive encrypted data and RSA public key from backend

	
	// send block id to backend
	sendBlockID();
	// new event
}

function postUserID(blockID) {
	// rest call to backend with user's block id
	//get url
	post(url, typed)
	/

}

function grantAccess(userGrantAccess) {
	userGrantAccess.user.access = true;
    return getParticipantRegistry('org.acme.biznet.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(userGrantAccess.user);
    	});
}

function revokeAccess(userRevokeAccess) {
	userRevokeAccess.user.access = false;
	return getParticipantRegistry('org.acme.biznet.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(userRevokeAccess.user);
    	});
}

function grantAccess(adminGrantAccess) {
	adminGrantAccess.user.access = true;
	return getParticipantRegistry('org.acme.biznet.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(adminGrantAccess.user);
    	});
}

function revokeAccess(adminRevokeAccess) {
	adminRevokeAccess.user.access = false;
	return getParticipantRegistry('org.acme.biznet.User')
        .then(function (participantRegistry) {
            return participantRegistry.update(adminRevokeAccess.user);
    	});
}