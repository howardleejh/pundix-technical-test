// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC20 Howard Tokens Contract
/// @author Howard Lee
/// @notice ERC20 compliant Howard tokens contract
/// @custom:version 1.0.0

contract HowardTokens is ERC20, Ownable {
    bool public isPaused;

    constructor() ERC20("Howard Tokens", "HTKNS") {
        _mint(msg.sender, 100_000 * 10**18);
    }

    /// @notice events to track contract transactions
    event minted(address indexed _to, uint256 _amount);
    event burned(address indexed _from, uint256 _amount);
    event activatePause(uint256 indexed _timestamp);
    event activateUnpause(uint256 indexed _timestamp);

    modifier unpaused() {
        require(isPaused == false, "isPaused: true");
        _;
    }

    /// @notice only owner can mint new tokens
    function mint(address _to, uint256 _amount) external onlyOwner unpaused {
        _mint(_to, _amount);
        emit minted(_to, _amount);
    }

    /// @notice only owner can burn existing tokens
    function burn(address _from, uint256 _amount) external onlyOwner unpaused {
        _burn(_from, _amount);
        emit burned(_from, _amount);
    }

    /// @notice allow to pause contract in case of any incoming attacks.
    function pause() external onlyOwner unpaused {
        isPaused = true;
        emit activatePause(block.timestamp);
    }

    /// @notice allow to unpause contract.
    function unPause() external onlyOwner {
        require(isPaused == true, "isPaused: false");
        isPaused = false;
        emit activateUnpause(block.timestamp);
    }
}
