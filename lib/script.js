/*
	A transaction processor function is the logical operation
	of a transaction defined in a model file. 

	Transaction processor functions are automatically invoked
	by the runtime when transactions are submitted using the
	BusinessNetworkConnection API.
*/


/**
* Creates a new user.
* @param {org.acme.biznet.createUser} createUser The createUser transaction.
* @transaction
*/
function createUser(createUser) {
  
  	var newUser;

    return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
        
      	// create new instance of a User
        newUser = getFactory().newResource('org.acme.biznet', 'User', createUser.hashed_id);

        newUser.hashed_id = createUser.hashed_id;
        newUser.userData = createUser.userData;
        newUser.access = true;

      	return userRegistry.add(newUser);
    })
    .then(function () {
        // Emit an event for the new user creation.
        var event = getFactory().newEvent('org.acme.biznet', 'NewUserCreated');
        event.user = newUser;
        emit(event);
    });
}

/**
* Updates the user data, for use with re-encryption
* @param {org.acme.biznet.updateUserEncryptedData} updateUserData The updateUserData transaction.
* @transaction
*/
function updateUserEncryptedData(updateUserEncryptedData) {
  
  	// Store the old data.
    var oldName;
  	var oldEncryptedId;
  	var oldPostcode;
  	var oldBirthdate;
  	var oldMerkleRoot;
  	var oldRSAkey;

  	return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
    	return userRegistry.get(updateUserEncryptedData.hashed_id);
  	})
    .then(function (user) {
  		
      	// Check if user access not allowed, stop and rollback if not allowed.
      	if (!user.access) throw new Error("User has disallowed access to this action.");
      
      	oldName = user.userData.name;
      	oldEncryptedId = user.userData.encrypted_id;
      	oldPostcode = user.userData.postcode;
      	oldBirthdate = user.userData.birthdate;
      	oldMerkleRoot = user.userData.merkle_root;
      	oldRSAkey = user.userData.rsa_public_key;
      
      	// Update the user data field with the new encrypted data.
      	user.userData.name = updateUserEncryptedData.newData.name;
        user.userData.encrypted_id = updateUserEncryptedData.newData.encrypted_id;
      	user.userData.postcode = updateUserEncryptedData.newData.postcode;
        user.userData.birthdate = updateUserEncryptedData.newData.birthdate;
      	user.userData.merkle_root = updateUserEncryptedData.newData.merkle_root;
      	user.userData.rsa_public_key = updateUserEncryptedData.newData.rsa_public_key;
      
      	// Update the registry.
      	getParticipantRegistry('org.acme.biznet.User')
      	.then(function(userRegistry) {
        	return userRegistry.update(user);
        });
      
        // Emit an event for the modified user data.
        var event = getFactory().newEvent('org.acme.biznet', 'UserEncryptedDataUpdated');
        event.user = user;
        event.oldName = oldName;
        event.oldEncryptedId = oldEncryptedId;
        event.oldPostcode = oldPostcode;
        event.oldBirthdate = oldBirthdate;
        event.oldMerkleRoot = oldMerkleRoot
      	event.oldRSAkey = oldRSAkey;
        event.newName = user.userData.name;
        event.newEncryptedId = user.userData.encrypted_id;
        event.newPostcode = user.userData.postcode;
        event.newBirthdate = user.userData.birthdate;
      	event.newMerkleRoot = user.userData.merkle_root;
      	event.newRSAkey = user.userData.rsa_public_key;
        emit(event);
  	});
}

/**
* Grants access to the user data.
* @param {org.acme.biznet.grantAccess} userGrantAccess The grantAccess transaction.
* @transaction
*/
function grantAccess(userGrantAccess) {

    return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
    	return userRegistry.get(userGrantAccess.hashed_id);
    })
    .then(function (existingUser) {
      
      	// Update the access rights
      	var existingAccessValue = existingUser.access;
      	existingUser.access = true;
      
      	// Update the registry.
      	getParticipantRegistry('org.acme.biznet.User')
      	.then(function(userRegistry) {
        	return userRegistry.update(existingUser);
        });
      	
        // Emit an event for the new user creation.
        var event = getFactory().newEvent('org.acme.biznet', 'UserAccessRightsChanged');
        event.user = existingUser;
      	event.oldValue = existingAccessValue;
      	event.newValue = existingUser.access;
        emit(event);
    });
}

/**
* Revokes access to the user data.
* @param {org.acme.biznet.revokeAccess} userRevokeAccess The revokeAccess transaction.
* @transaction
*/
function revokeAccess(userRevokeAccess) {

    return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
    	return userRegistry.get(userRevokeAccess.hashed_id);
    })
    .then(function (existingUser) {
      
      	// Update the access rights
      	var existingAccessValue = existingUser.access;
      	existingUser.access = false;
      
       	// Update the registry.
      	getParticipantRegistry('org.acme.biznet.User')
      	.then(function(userRegistry) {
        	return userRegistry.update(existingUser);
        });
      	
        // Emit an event for the new user creation.
        var event = getFactory().newEvent('org.acme.biznet', 'UserAccessRightsChanged');
        event.user = existingUser;
      	event.oldValue = existingAccessValue;
      	event.newValue = existingUser.access;
        emit(event);
    });
}

/*
	Internal private functions
*/