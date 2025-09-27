// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint32, externalEuint32} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

contract AgeVerifier is SepoliaConfig {
    event AgeVerified(address indexed user, bool isOldEnough);

    mapping(address => euint32) private _userAges;

    function verifyAge(externalEuint32 inputEuint32, bytes calldata inputProof) external {
        // Convert encrypted input to internal type
        euint32 encryptedAge = FHE.fromExternal(inputEuint32, inputProof);

        // Store encrypted age (optional)
        _userAges[msg.sender] = encryptedAge;

        // Grant access permissions
        FHE.allowThis(encryptedAge);
        FHE.allow(encryptedAge, msg.sender);

        // Emit event — frontend will handle actual >=18 check
        emit AgeVerified(msg.sender, true);
    }

    // --- MOCK FUNCTION for local testing ---
    function verifyAgeMock(uint32 age) external {
        euint32 encryptedAge = FHE.asEuint32(age); // no proof required
        _userAges[msg.sender] = encryptedAge;
        emit AgeVerified(msg.sender, age >= 18);
    }

    function getEncryptedAge(address user) external view returns (euint32) {
        return _userAges[user];
    }
}
