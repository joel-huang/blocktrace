import requests
import unittest
import random
import string
import time
import warnings

##
# The REST API requires an access token in order for http requests to be accepted
# There are two different tokens with different access rights
# User token has read-only access, while the admin token can also create new users and delete them
## 

# Tokens are not shown here for security reasons
admin_access_token = "INSERT ADMIN TOKEN HERE"
user_access_token = "INSERT USER TOKEN HERE"

# Link to REST server
rest_link = "https://173.193.102.98:31090/api/User"

# Function which randomly generates a string for testing purposes
def generate_random_string():
	length = random.randint(5,10)
	output = ""
	for i in range(length):
		output += random.choice(string.ascii_letters)
	return output

# Function which randomly generates user data for testing purposes
def generate_random_data():
	data = {
	  "$class": "org.acme.biznet.User",
	  "hashed_id": generate_random_string(),
	  "userData": {
		"$class": "org.acme.biznet.UserData",
		"name": generate_random_string(),
		"encrypted_id": generate_random_string(),
		"postcode": generate_random_string(),
		"birthdate": generate_random_string(),
		"merkle_root": generate_random_string(),
		"rsa_public_key": generate_random_string()
	  },
	  "access": True
	}

	return data

class TestBlockchainREST(unittest.TestCase):
	##
	# Test creation of new user by admin
	# Ensure that data can be read by admin after user is successfully created
	# delete user afterwards
	##
	def testAdminNewUser(self):
		warnings.filterwarnings("ignore")
		print("testing creation of new user by admin")
		for i in range(100):
			print("test %d"%i)
			data = generate_random_data()
			request = requests.post(rest_link + "?access_token=%s"%admin_access_token, json = data, verify = False)
			self.assertEqual(200, request.status_code)
			time.sleep(1)
			request = requests.get(rest_link + "/%s/?access_token=%s"%(data["hashed_id"],admin_access_token), verify = False)
			try:
				self.assertEqual(200, request.status_code)
			finally:
				request = requests.delete(rest_link + "/%s/?access_token=%s"%(data["hashed_id"],admin_access_token), verify = False)
				self.assertEqual(204, request.status_code)

	##
	# Test reading of user data by non-admin user
	# User is first created, and later deleted, by admin
	##
	def testUserRead(self):
		warnings.filterwarnings("ignore")
		print("testing reading of user info by non-admin")
		for i in range(100):
			print("test %d"%i)
			data = generate_random_data()
			request = requests.post(rest_link + "?access_token=%s"%admin_access_token, json = data, verify = False)
			self.assertEqual(200, request.status_code)
			time.sleep(1)
			request = requests.get(rest_link + "/%s/?access_token=%s"%(data["hashed_id"],user_access_token), verify = False)
			try:
				self.assertEqual(200, request.status_code)
			finally:
				request = requests.delete(rest_link + "/%s/?access_token=%s"%(data["hashed_id"],admin_access_token), verify = False)
				self.assertEqual(204, request.status_code)

	# Test that non-admins cannot create users in blockchain
	def testUserCantCreate(self):
		warnings.filterwarnings("ignore")
		print("testing prevention of user creation by non-admins")
		for i in range(100):
			print("test %d"%i)
			data = generate_random_data()
			request = requests.post(rest_link + "?access_token=%s"%user_access_token, json = data, verify = False)
			self.assertFalse(request.status_code == 200)
			#Try to get this user, the user shouldnt exist, resulting in HTTP response of 404
			time.sleep(1)
			request = requests.get(rest_link + "/%s/?access_token=%s"%(data["hashed_id"],user_access_token), verify = False)
			self.assertEqual(404,request.status_code)




if __name__ == "__main__":
	unittest.main()

