#!/bin/bash

# Fetch all ITB coin objects
coins=$(sui client objects --json | jq -c '.[] | select(.data.type | contains("itb::ITB"))')

# Check if no coins found
if [ -z "$coins" ]; then
   echo "No ITB coins found"
   exit 1
fi

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

burn_amount=$1
split_coin=$(sui client split-coin --coin-id $base_coin --amounts "$burn_amount")

# Refresh coin list after split
coins=$(sui client objects --json | jq -c '.[] | select(.data.type | contains("itb::ITB"))')
split_coin_id=$(echo "$coins" | jq -r 'select(.data.content.fields.balance == "'$burn_amount'") | .data.objectId')

treasury_cap=0xcbeb6a18e14a27f78dd60fd0220dac2c51f784d5f05a7501b6ed0e5257a7bafc
package_id=0x3d9c22b536e38cb5cbe198cd22c1bf71b421de215be3383c633580e5bf792245

# Burn
sui client call \
   --package $package_id \
   --module itb \
   --function burn \
   --args $treasury_cap "$split_coin_id" \
   --gas-budget 10000000