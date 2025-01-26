// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import "../src/ITBToken.sol";

contract DeployITBToken is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy the contract
        ITBToken token = new ITBToken();

        console.log("Deployed ITBToken at:", address(token));

        vm.stopBroadcast();
    }
}
