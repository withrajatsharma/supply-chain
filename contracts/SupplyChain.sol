// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract SupplyChain {
    struct Parcel {
        uint256 id;
        string name;
        string description;
        string location;
        string service;
        address currentOwner;
        address[] trackingHistory;
        bool isLost;
        uint256 checkpointCount;
        string[] allLocations;
        uint code;
        uint256 latestCheckpoint; // Added latestCheckpoint property
    }

    mapping(uint256 => Parcel) public parcels;
    uint256 public nextParcelId;

    event ParcelRegistered(uint256 parcelId, string name, address owner);
    event CheckpointCompleted(uint256 parcelId, uint256 checkpoint, uint256 blockNumber);
    event ParcelTransferred(uint256 parcelId, address from, address to, uint256 checkpoint);
    event ParcelLost(uint256 parcelId);

    function registerParcel(
        string memory name,
        string memory description,
        string memory location,
        string memory service,
        uint256 numCheckpoints,
        string[] memory locations
    ) public {
        require(locations.length == numCheckpoints, "Locations length must match number of checkpoints");

        Parcel storage newParcel = parcels[nextParcelId];
        newParcel.id = nextParcelId;
        newParcel.name = name;
        newParcel.description = description;
        newParcel.location = location;
        newParcel.service = service;
        newParcel.currentOwner = msg.sender;
        newParcel.trackingHistory.push(msg.sender);
        newParcel.isLost = false;
        newParcel.checkpointCount = numCheckpoints;
        newParcel.allLocations = locations;
        newParcel.code = uint(keccak256(abi.encodePacked(block.timestamp, block.prevrandao, msg.sender))) % 10000; // Generates a random number between 0 and 9999
        newParcel.latestCheckpoint = 0; // Initialize latestCheckpoint

        emit ParcelRegistered(nextParcelId, name, msg.sender);
        nextParcelId++;
    }

    function transferParcel(
        uint256 parcelId,
        uint256 checkpoint
        // uint256 code
    ) public {
        Parcel storage parcel = parcels[parcelId];
        require(!parcel.isLost, "Cannot transfer a lost parcel");
        require(checkpoint > 0 && checkpoint <= parcel.checkpointCount, "Invalid checkpoint");
        // require(parcel.code == code, "Invalid code");

        // Update checkpoint
        parcel.latestCheckpoint = checkpoint; // Update latestCheckpoint
        parcel.trackingHistory.push(msg.sender);
        parcel.currentOwner = msg.sender;

        // Emit checkpoint completion event with block number and code
        emit CheckpointCompleted(parcelId, checkpoint, block.number);
        emit ParcelTransferred(parcelId, msg.sender, msg.sender, checkpoint);
    }

    function reportParcelLost(uint256 parcelId) public {
        Parcel storage parcel = parcels[parcelId];
        require(msg.sender == parcel.currentOwner, "Only current owner can report parcel lost");

        parcel.isLost = true;

        emit ParcelLost(parcelId);
    }

    function getParcelHistory(uint256 parcelId) public view returns (address[] memory) {
        return parcels[parcelId].trackingHistory;
    }

    function getParcelDetails(uint256 parcelId) public view returns (
        uint256 id,
        uint256 latestCheckpoint,
        string memory name,
        string memory description,
        string memory location,
        string memory service,
        uint256 checkpointCount,
        string[] memory allLocations,
        bool isLost


    ) {
        Parcel storage parcel = parcels[parcelId];
        require(msg.sender == parcel.currentOwner, "Only the current owner can view the parcel details");

        return (
            parcel.id,
            parcel.latestCheckpoint,
            parcel.name,
            parcel.description,
            parcel.location,
            parcel.service, 
            parcel.checkpointCount,
            parcel.allLocations,
            parcel.isLost
        );
    }

    function getNextLocation(uint256 parcelId) public view returns (string memory) {
        Parcel storage parcel = parcels[parcelId];
        uint256 nextCheckpoint = parcel.latestCheckpoint + 1;
        require(nextCheckpoint < parcel.checkpointCount, "Invalid checkpoint");
        return parcel.allLocations[nextCheckpoint];
    }

    function getParcelCount() public view returns (uint256) {
        return nextParcelId;
    }

    function getCode() public view returns (uint256) {
        return parcels[nextParcelId - 1].code;
    }
}
