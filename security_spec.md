# Security Specification (TDD) for Trip Planner Firestore Rules

This document outlines the core security expectations, data invariants, and adversarial test scenarios for the Firestore rules.

## 1. Data Invariants
- A Trip document cannot be accessed or viewed unless the active user is the `owner` (matched by `ownerId` or `ownerEmail`) or a designated `collaborator` (matched by email in the `collaborators` list).
- A path variable `{tripId}` must always match standard ID configurations (`isValidId()`).
- No user can set or modify the `ownerId` of another user's Trip to spoof ownership.
- Public profiles in `/users/{userId}/public/profile` can only be written by the matching authenticated `userId`.

## 2. "Dirty Dozen" Payload Tests (Vulnerability Mitigations)
1. **Unauthenticated Read Campaign**: Reading a trip when not authenticated -> **REJECTED** (Auth Check)
2. **Trip Hijack via ID spoofing**: Creating a trip document under someone else's ID where `ownerId` contains a junk UID -> **REJECTED** (Owner Check)
3. **Ghost Fields Injection**: Sending a payload with unexpected keys (e.g., `isVerified: true` or `isAdmin: true` inside a user profile or trip document) -> **REJECTED** (Validation Check)
4. **Denial of Wallet Long String Attack**: Attempting to inject a 10MB string as the Trip title -> **REJECTED** (Size boundary: <= 100 chars)
5. **Path ID Poisoning**: Specifying a `tripId` with directory traversal characters (e.g., `../../hack`) -> **REJECTED** (isValidId Check)
6. **Cross-User Data Scraping**: Using `list` on `/trips` without a query constraint -> **REJECTED** (Secure List Query)
7. **PII Blanket Leak**: Attempting to query another user's profile with an empty schema -> **REJECTED** (Identity Check)
8. **Ownership Transfer Spoof**: A collaborator trying to update the trip ownership to themselves -> **REJECTED** (Update Guard)
9. **Negative Budget Sabotage**: Setting trip budget to -5000 dollars -> **REJECTED** (schema constraint budget >= 0)
10. **Blanket Write Attack**: Unregistered user writing random mock trip documents -> **REJECTED** (Auth/Verification verify)
11. **Impersonating Google Auth Profile**: Creating a profile containing an email address not matching the authenticated JWT token -> **REJECTED** (Token mismatch check)
12. **Malicious Date Attack**: Specifying an infinite or invalid format string for startDate -> **REJECTED** (Date structure size check).

## 3. Conflict Resolution Report (Audit Table)

| Attack Vector | Vulnerability Type | Resolution / Rule Block | Result |
|---|---|---|---|
| Identity Spoofing | Elevation of Privilege | `incoming().ownerId == request.auth.uid` | **PASSED** |
| State Shortcutting | Sequence Abuse | Validation Helper is ran on both create/update | **PASSED** |
| Resource Poisoning | Memory/IO Exploit | `.size() <= 128` on IDs and title, description checks | **PASSED** |
| Query Trust / Scraping | Data harvesting | `list: if resource.data.ownerId == request.auth.uid || ...` | **PASSED** |
| Anonymous write | Unauthenticated Spam | `request.auth != null` mandatory check | **PASSED** |
