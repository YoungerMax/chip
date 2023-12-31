import os
import requests

API_KEY = os.environ['API_KEY']

# 1. Create entity secret
entity_secret = os.urandom(32).hex()

print('Entity secret: ' + entity_secret)

# 2. Encrypt entity secret
# 2.1 Get public key
url = "https://api.circle.com/v1/w3s/config/entity/publicKey"

headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + API_KEY
}

response = requests.get(url, headers=headers)
public_key_string = response.json()['data']['publicKey']
print('Public key:\n' + public_key_string)

# 2.2 Encrypt
import base64
import codecs
# Installed by `pip install pycryptodome`
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Hash import SHA256


# The following sample codes generate a distinct entity secret ciphertext with each execution.

entity_secret = bytes.fromhex(entity_secret)

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

entity_secret_ciphertext = encrypted_data_base64.decode()
print("Entity secret ciphertext:", entity_secret_ciphertext)

input('\n\nInput the entity secret ciphertext into the Configurator now. Then press enter\n\n')


# # 3. Create wallet set
# import uuid


# url = "https://api.circle.com/v1/w3s/developer/walletSets"

# payload = {
#     "idempotencyKey": str(uuid.uuid4()),
#     "entitySecretCipherText": new_ciphertext(),
#     "name": input('Enter wallet set name: ')
# }
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": "Bearer " + API_KEY
# }

# response = requests.post(url, json=payload, headers=headers)

# print('Wallet set created!')
# print(response.text)

# wallet_set_id = input('Please enter the wallet set id: ')

# # 4. Create wallet
# import requests

# url = "https://api.circle.com/v1/w3s/developer/wallets"

# payload = {
#     "idempotencyKey": str(uuid.uuid4()),
#     "entitySecretCipherText": new_ciphertext(),
#     "blockchains": ["AVAX-FUJI", "ETH-GOERLI"],
#     "count": 1,
#     "walletSetId": wallet_set_id
# }
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": "Bearer " + API_KEY
# }

# #uc8a4rWNR8ZQk3Ncw1D0QnrcIL1k0nC0BPVJY/sDE5nKmI8BdayfhnXnqssaKtx2EvAXXPpFNCh8OkL1MdjRfHd6P2TyTeRRm9nL9x8Cok4KyCnTPZlBfBxIoQlC0HIgN5OlNCdA1cRsGnLHhECAklD7IIfuF/y/KssIPyDj2LJ+xZEGWLZVGVq0m//on656GMHmCNr3rc0MPBRcMoR32Pt0iDYaim1Tk4e1gGG6Qx1qtZOY6qp7InAME3cuaYlIXZfpLadAK1tTE2dK2FxqiCoyHQkDORxG0CDfcVbhS5GdaOKsXL8oEy2KLeibJA/3BPxTgknYuFGpK5/A6sHCw4huuq2EFlRFXC19HYe0Vkl8UBW8gnYOGP3zGDh+SMT4vNUnwyNTqoQFLAo/g/1/HbRxot8pB3ets16EdXOn/aNtS8EjFxBwD8biTUjwzctkJDhs+sFZcKF3YtSF9kbBI+XMaurz5EJZn4l+aXI7CJihdeMkSJmc+FOqfjEXKp6TQWlS30AtOGTyJrqS5nS91jZy094lRIt4Ox/9sK11ZMEDpVCDzSXvIozBdBay/neMB+l72kKPsH6nO2lyz/OtFvjIiVzG5ubt4r6S9H0atmvr94/Z3I/ijUDxR2el2X1ybre4X/4bLwSVf/Q5qbjoedVlh4kTDpDRFm1u5UImfzI=

# response = requests.post(url, json=payload, headers=headers)

# print('Wallet created!')
# print(response.text)


# # 5. Deploy contract
# url = 'https://api.circle.com/v1/w3s/contracts/deploy'
# headers = {
#     "Content-Type": "application/json",
#     "Authorization": "Bearer " + API_KEY
# }
# payload = {  
#     "idempotencyKey": str(uuid.uuid4()),
#     "name": input('Contract name: '),  
#     "description": input('Description: '),  
#     "walletId": wallet_set_id,  
#     "blockchain": "ETH-GOERLI", 
#     "feeLevel": "MEDIUM",
#     "constructorSignature": "constructor(uint _questionId)",
#     "constructorParameters": ["1"],
#     "entitySecretCiphertext": new_ciphertext(),
#     "abiJSON": """
# [
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "uint256",
# 				"name": "_questionId",
# 				"type": "uint256"
# 			}
# 		],
# 		"stateMutability": "nonpayable",
# 		"type": "constructor"
# 	},
# 	{
# 		"inputs": [],
# 		"name": "answerPoster",
# 		"outputs": [
# 			{
# 				"internalType": "address",
# 				"name": "",
# 				"type": "address"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [],
# 		"name": "fund",
# 		"outputs": [],
# 		"stateMutability": "payable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [
# 			{
# 				"internalType": "address",
# 				"name": "_answerPoster",
# 				"type": "address"
# 			}
# 		],
# 		"name": "markAnswer",
# 		"outputs": [],
# 		"stateMutability": "nonpayable",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [],
# 		"name": "markedAnswer",
# 		"outputs": [
# 			{
# 				"internalType": "bool",
# 				"name": "",
# 				"type": "bool"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [],
# 		"name": "questionId",
# 		"outputs": [
# 			{
# 				"internalType": "uint256",
# 				"name": "",
# 				"type": "uint256"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	},
# 	{
# 		"inputs": [],
# 		"name": "questionPoster",
# 		"outputs": [
# 			{
# 				"internalType": "address",
# 				"name": "",
# 				"type": "address"
# 			}
# 		],
# 		"stateMutability": "view",
# 		"type": "function"
# 	}
# ]
#     """,
#     "bytecode": "0x608060405234801561000f575f80fd5b50604051610701380380610701833981810160405281019061003191906100ce565b335f806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550806002819055505f600160146101000a81548160ff021916908315150217905550506100f9565b5f80fd5b5f819050919050565b6100ad8161009b565b81146100b7575f80fd5b50565b5f815190506100c8816100a4565b92915050565b5f602082840312156100e3576100e2610097565b5b5f6100f0848285016100ba565b91505092915050565b6105fb806101065f395ff3fe608060405260043610610054575f3560e01c8063277951461461005857806332a51cd81461008057806397306897146100aa578063a4a0211c146100d4578063b06a5c52146100fe578063b60d428814610128575b5f80fd5b348015610063575f80fd5b5061007e600480360381019061007991906103e2565b610132565b005b34801561008b575f80fd5b506100946102d1565b6040516100a1919061041c565b60405180910390f35b3480156100b5575f80fd5b506100be6102f4565b6040516100cb919061041c565b60405180910390f35b3480156100df575f80fd5b506100e8610319565b6040516100f5919061044f565b60405180910390f35b348015610109575f80fd5b5061011261032c565b60405161011f9190610480565b60405180910390f35b610130610332565b005b600160149054906101000a900460ff1615610182576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161017990610519565b60405180910390fd5b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461020f576040517f08c379a0000000000000000000000000000000000000000000000000000000008152600401610206906105a7565b60405180910390fd5b60018060146101000a81548160ff0219169083151502179055508060015f6101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555060015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff166108fc4790811502906040515f60405180830381858888f193505050501580156102cd573d5f803e3d5ffd5b5050565b5f8054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b60015f9054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600160149054906101000a900460ff1681565b60025481565b600160149054906101000a900460ff1615610382576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040161037990610519565b60405180910390fd5b565b5f80fd5b5f73ffffffffffffffffffffffffffffffffffffffff82169050919050565b5f6103b182610388565b9050919050565b6103c1816103a7565b81146103cb575f80fd5b50565b5f813590506103dc816103b8565b92915050565b5f602082840312156103f7576103f6610384565b5b5f610404848285016103ce565b91505092915050565b610416816103a7565b82525050565b5f60208201905061042f5f83018461040d565b92915050565b5f8115159050919050565b61044981610435565b82525050565b5f6020820190506104625f830184610440565b92915050565b5f819050919050565b61047a81610468565b82525050565b5f6020820190506104935f830184610471565b92915050565b5f82825260208201905092915050565b7f54686973207175657374696f6e2068617320616c7265616479206265656e20615f8201527f6e73776572656400000000000000000000000000000000000000000000000000602082015250565b5f610503602783610499565b915061050e826104a9565b604082019050919050565b5f6020820190508181035f830152610530816104f7565b9050919050565b7f4f6e6c7920746865207175657374696f6e20706f737465722063616e206d61725f8201527f6b2074686520616e737765720000000000000000000000000000000000000000602082015250565b5f610591602c83610499565b915061059c82610537565b604082019050919050565b5f6020820190508181035f8301526105be81610585565b905091905056fea26469706673582212203b19b42b6b4d3bfd89ef02dd003e2c2421a083358658c4a5eb9e517568cc370964736f6c63430008160033"
# }


# response = requests.post(url, json=payload, headers=headers)

# print('Contract created!')
# print(response.text)
