import os
import codecs
import base64
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256
import requests
import os

url = 'https://api.circle.com/v1/w3s/config/entity/publicKey'
headers = {
    'accept': 'application/json',
    'authorization': 'Bearer ' + os.environ['API_KEY']
}

response = requests.get(url, headers=headers)
public_key_string = response.json()['data']['publicKey']

hex_encoded_entity_secret = os.urandom(32).hex()
print("Hex encoded entity secret:", hex_encoded_entity_secret)


entity_secret = bytes.fromhex(hex_encoded_entity_secret)

if len(entity_secret) != 32:
    print("invalid entity secret")
    exit(1)

public_key = RSA.importKey(public_key_string)

# encrypt data by the public key
cipher_rsa = PKCS1_OAEP.new(key=public_key, hashAlgo=SHA256)
encrypted_data = cipher_rsa.encrypt(entity_secret)

# encode to base64
encrypted_data_base64 = base64.b64encode(encrypted_data)

print("Hex encoded entity secret:", codecs.encode(entity_secret, 'hex').decode())
print("Entity secret ciphertext:", encrypted_data_base64.decode())