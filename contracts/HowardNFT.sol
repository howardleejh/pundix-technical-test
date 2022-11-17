// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ERC721 Howard NFT Contract
/// @author Howard Lee
/// @notice ERC721 compliant Howard tokens contract with burnable extension
/// @custom:version 1.0.0

contract HowardNFT is ERC721Burnable, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public MAX_SUPPLY;
    uint256 public immutable SALE_PRICE;
    bool public isPaused;

    receive() external payable {}

    constructor() ERC721("Howard NFT", "HNFT") {
        MAX_SUPPLY = 5_000;
        SALE_PRICE = 0.01 * 10**18;
        /// @notice increment done on constructor so that NFT id starts from 1
        _tokenIds.increment();
    }

    event minted(address indexed _buyer, uint256 _tokenId);
    event burned(address indexed _burner, uint256 _tokenId);
    event fundsWithdrawn(uint256 _amount);
    event activatePause(uint256 _timestamp);
    event activateUnPause(uint256 _timestamp);

    modifier unpaused() {
        require(isPaused == false, "isPaused: true");
        _;
    }

    /// @notice public mint function for users to mint nft with the price of 0.01ETH
    /// @dev allows for refund if user sends in too much ETH for mint
    function publicMint() external payable unpaused {
        require(_tokenIds.current() <= MAX_SUPPLY, "fully minted");
        require(msg.value >= SALE_PRICE, "not enough ethereum");
        (bool sent, ) = address(this).call{value: SALE_PRICE}("");
        require(sent, "Failed to send Ether");
        (bool refunded, ) = msg.sender.call{value: msg.value - SALE_PRICE}("");
        require(refunded, "Failed to refund ether");
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        emit minted(msg.sender, _tokenIds.current());
        _tokenIds.increment();
    }

    /// @dev function only for owner to withdraw ETH from NFT sales
    function withdrawEther() external onlyOwner {
        require(address(this).balance > 0, "No ETH");
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
        emit fundsWithdrawn(address(this).balance);
    }

    /// @notice allows for users to burn NFTs though this is not the convention
    /// @dev usually only team is allowed to burn NFTs
    function burn(uint256 _tokenId) public virtual override unpaused {
        require(
            _isApprovedOrOwner(_msgSender(), _tokenId),
            "ERC721: caller is not token owner or approved"
        );
        MAX_SUPPLY -= 1;
        _burn(_tokenId);
        emit burned(msg.sender, _tokenId);
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
        emit activateUnPause(block.timestamp);
    }
}
