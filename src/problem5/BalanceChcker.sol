// SPDX-License-Identifier: GPL-3.0
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

pragma solidity >=0.7.0 <0.9.0;


/** 
 * @title BalanceChecker
 * @dev Checks token balance 
 */
contract BalanceChecker {
    struct Balance {
        address token;
        uint256 balance;
    }

    /** 
     * @dev Retrieve all requested token balances of the target wallet
     * @param   wallet  the wallet address
     * @param   tokens  the array of token contract addresses
     */
    function getBalances(address wallet, address[] memory tokens) public view returns (Balance[] memory) {
        Balance[] memory result = new Balance[](tokens.length);
        for(uint i = 0; i < tokens.length; i++) {
            result[i].token = tokens[i];
            result[i].balance = getBalance(wallet, tokens[i]);
        }
        return result;
    }

    /** 
     * @dev Retrieve requested token balance of the target wallet
     * @param   wallet  the wallet address
     * @param   token  the token contract addresses
     */
    function getBalance(address wallet, address token) public view returns (uint256) {
        return ERC721(token).balanceOf(wallet);
    }
}
