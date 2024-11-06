# home-assistant-styles-manager

Manage Home Assistant styles per DOM elements

[![Deployment Status](https://github.com/elchininet/home-assistant-styles-manager/actions/workflows/deploy.yaml/badge.svg)](https://github.com/elchininet/home-assistant-styles-manager/actions/workflows/deploy.yaml)
[![Tests](https://github.com/elchininet/home-assistant-styles-manager/actions/workflows/tests.yaml/badge.svg)](https://github.com/elchininet/home-assistant-styles-manager/actions/workflows/tests.yaml)
[![Coverage Status](https://coveralls.io/repos/github/elchininet/home-assistant-styles-manager/badge.svg?branch=master)](https://coveralls.io/github/elchininet/home-assistant-styles-manager?branch=master)
[![npm version](https://badge.fury.io/js/home-assistant-styles-manager.svg)](https://badge.fury.io/js/home-assistant-styles-manager)
[![downloads](https://img.shields.io/npm/dw/home-assistant-styles-manager)](https://www.npmjs.com/package/home-assistant-styles-manager)

## Install

#### npm

```bash
npm install home-assistant-styles-manager
```

#### yarn

```bash
yarn add home-assistant-styles-manager
```

#### PNPM

```bash
pnpm add home-assistant-styles-manager
```

## API

### Class instantiation

The `HomeAssistantStylesManager` class can be instantiated sending an optional options object.

```typescript
new HomeAssistantStylesManager([options])
```

#### Options object

| Parameter      | Optional      | Description                                         |
| -------------- | ------------- | --------------------------------------------------- |
| prefix         | yes           | prefix that will be used for the styles ids         |
| delay          | yes           | namespace that will be used for the warnings        |

### Public methods

#### getStyleElement

Given an `HTMLElement` or a `ShadowRoot` element, returns the style element associated with it.

```typescript
getStyleElement(root: HTMLElement | ShadowRoot): HTMLStyleElement | null
```

#### addStyle

Given a CSS string or a CSS object and an `HTMLElement` or a `ShadowRoot` element, it adds a style element containing the CSS string or replace its content with the CSS string if it already exists.

```typescript
addStyle(
  css: string | Record<string, Record<string, string> | false>,
  root: HTMLElement | ShadowRoot
): void
```

#### removeStyle

Given an `HTMLElement` or a `ShadowRoot` element, it removes the style element associated to it (if it exists).

```typescript
removeStyle(root: HTMLElement | ShadowRoot): void
```