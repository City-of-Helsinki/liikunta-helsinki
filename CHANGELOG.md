# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),

## [Unreleased]

## [1.1.2] - 2022-05-13

### Added

- Redirect user to error page on apollo client network errors

## [1.1.1] - 2022-05-02

### Fixed

- Disable the Sentry transactions tracing

## [1.1.0] - 2022-04-20

### Fixed

- Missing images on collection page for venue selections
- A11y: When advising about external links, or links that open in a new tab, include the info text by using aria-label
- A11y: Page scales for window size with the width of 320px
- Keyword overflow on search page

### Added

- Social links under other details on single location page
- Redirect user to error page on apollo client network errors

### Removed

- Location section from single location page sidebar

### Changed

- Let app know about its origin instead of its graphql endpoint
- Separate 'contact information' and 'other info' sections in single location page sidebar
- Limit collection description text to maximum of three rows
- Increase size of collection description text

## [1.0.0] - 2022-03-08

### Fixed

- Configured production environment to work from https://liikunta.hel.fi
