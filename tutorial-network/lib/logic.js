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
	
	// TODO: check get.user.access
	// TODO: do http GET to retrieve 

}

function publishBlock(publish) {

}

function grantAccess(userGrantAccess) {
	userGrantAccess.user.access = true;
}

function revokeAccess(userRevokeAccess) {
	userRevokeAccess.user.access = false;
}

function grantAccess(adminGrantAccess) {
	adminGrantAccess.user.access = true;
}

function revokeAccess(adminRevokeAccess) {
	adminRevokeAccess.user.access = false;
}