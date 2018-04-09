/*
	A transaction processor function is the logical operation
	of a transaction defined in a model file. 

	Transaction processor functions are automatically invoked
	by the runtime when transactions are submitted using the
	BusinessNetworkConnection API.
*/


/**
* Creates a new user with a hashed_id and a UserData object, contatined in the
* createUser transaction passed into this function. The default user access value
* is true. The user will be added to the ParticipantRegistry.
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
* Deletes a user with a specific hashed_id.
* @param {org.acme.biznet.deleteUser} deleteUser The deleteUser transaction.
* @transaction
*/
function deleteUser(deleteUser) {
  
    return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
        return userRegistry.get(deleteUser.hashed_id);
    })
    .then(function (existingUser) {
        getParticipantRegistry('org.acme.biznet.User')
        .then(function(userRegistry) {
            return userRegistry.remove(existingUser);
        });
    })
    .then(function () {
        // Emit an event for the new user deletion.
        var event = getFactory().newEvent('org.acme.biznet', 'UserDeleted');
        event.deleted_id = deleteUser.hashed_id;
        emit(event);
    });
}

/**
* Updates the user data, for use with re-encryption. Throws an error if the 
* user access value is false.The user data is specified in the UserData object assigned to 
* this transaction. The ParticipantRegistry is updated and a UserEncryptedDataUpdated
* event is emitted.
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
* Grants access to the user data by setting the user access variable to true,
* then updates the ParticipantRegistry and emits a UserAccessRightsChanged event.
* @param {org.acme.biznet.grantAccess} userGrantAccess The grantAccess transaction.
* @transaction
*/
function grantAccess(userGrantAccess) {
    modifyAccess(userGrantAccess.hashed_id, true);
}

/**
* Revokes access to the user data by setting the user access variable to false,
* then updates the ParticipantRegistry and emits a UserAccessRightsChanged event.
* @param {org.acme.biznet.revokeAccess} userRevokeAccess The revokeAccess transaction.
* @transaction
*/
function revokeAccess(userRevokeAccess) {
	modifyAccess(userRevokeAccess.hashed_id, false);
}

/*
	Internal private functions
*/
function modifyAccess(hashed_id, modifier) {
      return getParticipantRegistry('org.acme.biznet.User')
    .then(function (userRegistry) {
    	return userRegistry.get(hashed_id);
    })
    .then(function (existingUser) {
      
      	// Update the access rights
      	var existingAccessValue = existingUser.access;
      	existingUser.access = modifier;
      
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