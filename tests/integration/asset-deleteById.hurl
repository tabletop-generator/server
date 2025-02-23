POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1

{
  "name": "guy",
  "type": "character",
  "visibility": "private",
  "data": {
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes",
    "personality": "Manipulative and cunning",
    "background": "Born to a cursed bloodline",
    "abilities": "Eldritch blast",
    "equipment": "Obsidian staff",
    "motivation": "Seek power"
  }
}
HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

DELETE http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1
HTTP 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.message" == "Asset deleted successfully"

GET http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user1@email.com:password1

HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

DELETE http://localhost:8080/v1/assets/122e4444-e70b-15d3-a456-426614174000
[BasicAuth]
user1@email.com:password1
HTTP 404
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 404
jsonpath "$.error.message" == "Asset not found"

DELETE http://localhost:8080/v1/assets/not-a-uuid
[BasicAuth]
user1@email.com:password1
HTTP 400
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 400

DELETE http://localhost:8080/v1/assets/{{asset_uuid}}
HTTP 401
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 401
jsonpath "$.error.message" == "Unauthorized"

POST http://localhost:8080/v1/assets
[BasicAuth]
user1@email.com:password1

{
  "name": "guy",
  "type": "character",
  "visibility": "private",
  "data": {
    "race": "tiefling",
    "class": "warlock",
    "gender": "male",
    "alignment": "neutral_evil",
    "appearance": "Ash-gray skin, glowing red eyes",
    "personality": "Manipulative and cunning",
    "background": "Born to a cursed bloodline",
    "abilities": "Eldritch blast",
    "equipment": "Obsidian staff",
    "motivation": "Seek power"
  }
}
HTTP 201
[Captures]
asset_uuid: jsonpath "$.asset.uuid"

DELETE http://localhost:8080/v1/assets/{{asset_uuid}}
[BasicAuth]
user2@email.com:password2
HTTP 403
[Asserts]
jsonpath "$.status" == "error"
jsonpath "$.error.code" == 403
jsonpath "$.error.message" == "Forbidden"
