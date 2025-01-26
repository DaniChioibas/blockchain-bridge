#!/bin/bash

# Fetch all ITB coin objects for the address
coins=$(sui client objects $1 --json | jq -c '.[] | select(.data.type | contains("itb::ITB"))')

# Check if no coins found
if [ -z "$coins" ]; then
   echo "No ITB coins found"
   exit 1
fi

# Extract coin IDs
coin_ids=$(echo "$coins" | jq -r '.data.objectId')

# If only one coin, echo that coin
if [ $(echo "$coin_ids" | wc -l) -eq 1 ]; then
   echo "$coin_ids"
   exit 0
fi

# Multiple coins: merge and echo base coin
base_coin=$(echo "$coin_ids" | head -n 1)
for coin in $(echo "$coin_ids" | sed 1d); do
   sui client merge-coin --primary-coin $base_coin --coin-to-merge $coin --gas-budget 10000000
done

echo "$base_coin"