// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";
import "openzeppelin-contracts/contracts/access/Ownable.sol";

contract ITBToken is ERC20,Ownable{
        constructor() ERC20("ITB Token", "ITB") Ownable(msg.sender) {}

        function mint(address to,uint256 amount) public onlyOwner {
        _mint(to, amount);
    }
        function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }

        function burnFrom(address account, uint256 amount) public {
            _burn(account, amount);
        }
}
