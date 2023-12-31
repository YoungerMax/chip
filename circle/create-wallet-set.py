import os
import requests

url = 'https://api.circle.com/v1/w3s/developer/walletSets'
headers = {
    'accept': 'application/json',
    'content-type': 'application/json',
    'authorization': 'Bearer ' + os.environ['API_KEY']
}

ciphertext = input('ciphertext: ')

data = {
    "idempotencyKey": "4e56ca1f-8ad8-4cd0-b9d5-3837539125f5",
    "name": "Questions wallets",
    "entitySecretCiphertext": ciphertext
}

response = requests.post(url, headers=headers, json=data)

# Check the response status
if response.status_code == 200:
    # Process the response data
    data = response.json()
    # Do something with the data
    print(data)
else:
    print('Request failed with status code:', response.status_code)
    print(response.text)
