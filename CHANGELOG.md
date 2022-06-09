# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Add an API route to generate a token
- If user is logged in, created token on API route contains their information
- If user is not logged in, created token contains guest information
- Sub field in token is a variable referencing jitsi xmpp domain

### Changed

- Rename code base to magnify
- Change the structure to a 4 part monorepo (frontend + backend) x (lib + demo)

[unreleased]: https://github.com/openfun/jitsi-magnify
