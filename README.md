# Deploying Backend on Google App Engine

The backend service is deployed along with various resources and services on GCP, such as:
- Identity Platform
  - Using this service, we don't need to write our own authentication code from scratch. It handles user identity and access management.
- Cloud Storage
  - Used to store user profile images. Cheapest option available.
- Firestore
  - Easy Integration with Identity Platform because both are on firebase. It is also easy to integrate with Android to make a real-time database service. Comes with a free quota.

## Install (use node 20) and Setup Cloud Environment
1. Enable Identity Platform API
1. Add Identity Provider as needed
1. Enable Firestore
1. Clone this branch
   ```
   git clone https://github.com/CH2-PS191/cc-ch2-ps191.git -b deploygcp
   ```
1. Install modules:
   ```
   npm ci
   ```
1. Deploy the [ML service on Cloud Run](https://github.com/CH2-PS191/cc-ch2-ps191/tree/deployml).
1. Change the url to your ML endpoint
   ```
   line 123: routes/conversations.js
   ``` 
1. Create Cloud Storage Bucket
1. Change bucket to your bucket name
   ```
   line 10: routes/users.js
   ``` 
1. Deploy on App Engine
   ```
   gcloud app deploy
   ```
1. Add the App Engine Service Account as Cloud Run Invoker

# Endpoints
## Update User Image

- Method: PUT
- Path URL: /user/update
- Authorization: idToken
- Body:
    - file: file
- Response (example):
```json
{	
	"publicUrl": "https://storage.googleapis.com/userimgempaq/12312i3iohsadujhahkdj.png"
}
```

## Add conversationId to userdata

- Method: POST
- Path URL: /user/conversationclaims
- Authorization: idToken
- Body:
```json
{
    "conversationId": string
}
```

- Response (example):

```json
{
    "conversationId": "jkhjkahdu1h312u3"
}
```

## Get Pakar List

- Method: GET
- Path URL: /user/pakar
- Authorization: idToken
- Response (example):
```json
{
	"pakar": [
    	{
        	"uid": "482dXUuqA4eWaJJkVab1X0Z5CT62",
        	"email": "psikiater9@example.com",
        	"emailVerified": false,
        	"displayName": "Dr. Irfan",
        	"disabled": false,
        	"metadata": {
            	"lastSignInTime": "Tue, 12 Dec 2023 12:20:10 GMT",
            	"creationTime": "Tue, 12 Dec 2023 12:20:10 GMT",
            	"lastRefreshTime": "Tue, 12 Dec 2023 12:20:10 GMT"
        	},
        	"providerData": [
            	{
                	"uid": "psikiater9@example.com",
                	"displayName": "Dr. Irfan",
                	"email": "psikiater9@example.com",
                	"providerId": "password"
            	}
        	],
        	"customClaims": {
            	"pakar": true
        	},
        	"tokensValidAfterTime": "Tue, 12 Dec 2023 12:20:10 GMT"
    	},
    	{
        	"uid": "C8U6BzlC9Tc1xLCDxa3YsApeBak1",
        	"email": "psikiater2@example.com",
        	"emailVerified": false,
        	"displayName": "Dr. Budi",
        	"disabled": false,
        	"metadata": {
            	"lastSignInTime": "Tue, 12 Dec 2023 12:19:27 GMT",
            	"creationTime": "Tue, 12 Dec 2023 12:19:27 GMT",
            	"lastRefreshTime": "Tue, 12 Dec 2023 12:19:27 GMT"
        	},
        	"providerData": [
            	{
                	"uid": "psikiater2@example.com",
                	"displayName": "Dr. Budi",
                	"email": "psikiater2@example.com",
                	"providerId": "password"
            	}
        	],
        	"customClaims": {
            	"pakar": true
        	},
        	"tokensValidAfterTime": "Tue, 12 Dec 2023 12:19:27 GMT"
    	},
    	{
        	"uid": "PAJHJRFv7jcaH9w2R0YGEcFcPiu2",
        	"email": "psikiater7@example.com",
        	"emailVerified": false,
        	"displayName": "Dr. Gita",
        	"disabled": false,
        	"metadata": {
            	"lastSignInTime": "Tue, 12 Dec 2023 12:19:56 GMT",
            	"creationTime": "Tue, 12 Dec 2023 12:19:56 GMT",
            	"lastRefreshTime": "Tue, 12 Dec 2023 12:19:56 GMT"
        	},
        	"providerData": [
            	{
                	"uid": "psikiater7@example.com",
                	"displayName": "Dr. Gita",
                	"email": "psikiater7@example.com",
                	"providerId": "password"
            	}
        	],
        	"customClaims": {
            	"pakar": true
        	}
	]
}
```

## Get Sebaya List

- Method: GET
- Path URL: /user/sebaya
- Authorization: idToken
- Response (example): same as above

## Get a User's Conversation List

- Method: GET
- Path URL: /conversation/
- Authorization: idToken
- Response (example):
```json
{
	"success": true,
	"conversations": [
    	{
        	"id": "1GDhIjjTpe60VjwWco3l",
        	"member": [
            	"bot",
            	"REdBWJoHs9PHLLrlgRtK3qdtMoB3"
        	]
    	},
    	{
        	"id": "8tHbdnCWF8QMggBkOc5s",
        	"member": [
            	"bot",
            	"REdBWJoHs9PHLLrlgRtK3qdtMoB3"
        	]
    	},
    	{
        	"id": "cchkifGHdWw26thLcJnv",
        	"member": [
            	"bot",
            	"REdBWJoHs9PHLLrlgRtK3qdtMoB3"
        	]
    	},
    	{
        	"id": "uw0jVDdlVJzkQRQLHoQl",
        	"member": [
            	"bot",
            	"REdBWJoHs9PHLLrlgRtK3qdtMoB3"
        	]
    	}
	]
}
```

## Get a User's Conversation with Pakar List

- Method: GET
- Path URL: /conversation/pakar
- Authorization: idToken
- Response (example):
```json
{
    "success": true,
    "conversations": [
        {
            "id": "Gm5hI6dBWSibFvq9Hvwi",
            "member": [
                "bot",
                "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
                "gyRbEsccogYUm8dQxyStGnvkM3E3"
            ]
        },
        {
            "id": "94YLeVgB7PmfnZ0MErle",
            "member": [
                "bot",
                "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
                "qlJA1ViLvUWp2hFPGGa3y9mAfzi2"
            ]
        }
    ]
}
```

## Get a User's Conversation with Sebaya List

- Method: GET
- Path URL: /conversation/sebaya
- Authorization: idToken
- Response (example):
```json
{
    "success": true,
    "conversations": [
        {
            "id": "g0zfRhe9o0DDSbzlqljx",
            "member": [
                "bot",
                "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
                "ZQqnw9T1ebZlQDcgIpt9YD2vjGG3"
            ]
        },
        {
            "id": "VpTDj8pqHxuH22HVlJ2b",
            "member": [
                "bot",
                "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
                "luNm5NFpUpMDy3wN9uwelQcDQsY2"
            ]
        }
    ]
}
```

## Create New Conversation

- Method: POST
- Path URL: /conversation/create
- Authorization: idToken
- Response (example):
```json
{
	"success": true,
	"message": "Dokumen berhasil ditambahkan dengan ID: awawawawa"
}
```

## Add Another Person to Conversation

- Method: PUT
- Path URL: /conversation/{conversationid}/update
- Authorization: idToken
- Body:
```json
{
    "pakarUid": string
}
```
- Response (example):
```json
{
	"success": true,
	"message": "Dokumen berhasil ditambahkan dengan ID: awawawawa"
}
```

## Send Message (with bot response)

- Method: POST
- Path URL: /conversation/{conversationid}/create
- Authorization: idToken
- Body:
```json
{
    "message": string
}
```
- Response (example):
```json
{
	"success": true,
	"message": "Dokumen berhasil ditambahkan dengan ID: nRFTBYWVGDvdNc5xIigV, s8yJToVnWbMzJ1S0EPPO",
	"response": "Saya turut berduka mendengarnya.Aku di sini Untukmu.Membicarakannya mungkin membantu.Jadi, beri tahu saya mengapa menurut Anda Anda merasa seperti ini?"
}
```

## Send Message (without bot response)

- Method: POST
- Path URL: /conversation/{conversationid}/selfcreate
- Authorization: idToken
- Body:
```json
{
    "message": string
}
```
- Response (example):
```json
{
	"success": true,
	"message": "Dokumen berhasil ditambahkan dengan ID: jhkJKHASFJKHjajshdajd"
}
```

## Get All Messages in Conversation

- Method: GET
- Path URL: /conversation/{conversationid}
- Authorization: idToken
- Response (example):
```json
{
	"success": true,
	"messages": [
    	{
        	"id": "dmvQIuliQ9AQjoIx4acY",
        	"uid": "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
        	"message": "halobeb",
        	"timestamp": {
            	"_seconds": 1702527888,
            	"_nanoseconds": 470000000
        	}
    	},
    	{
        	"id": "ygdCo6R7CR81gVtHE1Qh",
        	"uid": "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
        	"message": "apa",
        	"timestamp": {
            	"_seconds": 1702527947,
            	"_nanoseconds": 71000000
        	}
    	},
    	{
        	"id": "hNuShBFmKFUsPbIJ1Ci2",
        	"uid": "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
        	"message": "aku sedih huhuhu",
        	"timestamp": {
            	"_seconds": 1702533446,
            	"_nanoseconds": 164000000
        	}
    	},
    	{
        	"id": "jIjEW2W7c8Q0coR8Gab6",
        	"uid": "REdBWJoHs9PHLLrlgRtK3qdtMoB3",
        	"message": "tesya",
        	"timestamp": {
            	"_seconds": 1702537861,
            	"_nanoseconds": 162000000
        	}
    	}
	]
}
```
