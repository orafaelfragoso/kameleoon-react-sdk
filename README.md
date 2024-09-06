# React Kameleoon SDK

[![npm version](https://img.shields.io/npm/v/react-kameleoon-sdk.svg)](https://www.npmjs.com/package/react-kameleoon-sdk) 
[![Coverage Status](https://coveralls.io/repos/github/orafaelfragoso/kameleoon-react-sdk/badge.svg?branch=main)](https://coveralls.io/github/orafaelfragoso/kameleoon-react-sdk?branch=main)

The React Kameleoon SDK is a React-based wrapper for the Kameleoon JavaScript SDK, designed to streamline integration with React applications. It offers a simplified and type-safe way to interact with Kameleoon's features while addressing some limitations of the official React SDK. Key features include client initialization, offline support, improved typing, error tracking, and a customizable script component.

## Disclaimer

**Note:** This is not an official Kameleoon library. It was created to address issues with the official React SDK, such as limited typing support and the lack of offline capabilities. This library offers an improved developer experience by providing better typing, error tracking, and more flexible integration options.

## Table of Contents

- [Installation](#installation)
- [Usage Guide](#usage-guide)
  - [KameleoonProvider](#kameleoonprovider)
  - [useKameleoon Hook](#usekameleoon-hook)
  - [KameleoonScript Component](#kameleoonscript-component)
- [Custom Features](#custom-features)
  - [Offline Support and Queue Feature](#offline-support-and-queue-feature)
- [API Reference](#api-reference)
  - [useKameleoon Hook Methods](#usekameleoon-hook-methods)
  - [KameleoonProvider Props](#kameleoonprovider-props)
- [Kameleoon Resources](#kameleoon-resources)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Installation

To install the React Kameleoon SDK, use one of the following commands:

### Using npm

```bash
npm install react-kameleoon-sdk
```

### Using Yarn

```bash
yarn add react-kameleoon-sdk
```

### Using pnpm

```bash
pnpm add react-kameleoon-sdk
```

No additional configuration is required after installation.

## Usage Guide

### KameleoonProvider

The `KameleoonProvider` component initializes the Kameleoon client and provides it to your application. It must wrap your application's root component.

#### Example for Next.js

```jsx
import { KameleoonProvider } from 'react-kameleoon-sdk';

function MyApp({ Component, pageProps }) {
  return (
    <KameleoonProvider siteCode="your-site-code" enabled={true}>
      <Component {...pageProps} />
    </KameleoonProvider>
  );
}

export default MyApp;
```

### useKameleoon Hook

The `useKameleoon` hook provides access to various Kameleoon functionalities within your components.

#### Example Usage

```jsx
import { useKameleoon } from 'react-kameleoon-sdk';

function MyComponent() {
  const { isFeatureFlagActive } = useKameleoon();

  return (
    <div>
      {isFeatureFlagActive('my-feature-flag') ? 'Feature is active' : 'Feature is inactive'}
    </div>
  );
}
```

### KameleoonScript Component

The `KameleoonScript` component dynamically loads the Kameleoon script, with support for non-blocking and high-priority loading.

#### Example for Next.js

```jsx
import { KameleoonScript } from 'react-kameleoon-sdk';
import Script from 'next/script';

function App() {
  return (
    <>
      <KameleoonScript siteCode="your-site-code" component={(url) => <Script src={url} strategy="beforeInteractive" />} />
      {/* Your application components */}
    </>
  );
}
```

## Custom Features

### Offline Support and Queue Feature

The library includes offline support and a queue feature that allows tracking Kameleoon events and actions even when offline. This functionality ensures that queued actions are processed once the application is back online.

## API Reference

### useKameleoon Hook Methods

- `isFeatureFlagActive(flag: string): boolean`
- `getFeatureFlagVariationKey(flag: string): string | null`
- `getFeatureFlags(): Record<string, any>`
- `getVisitorFeatureFlags(): Record<string, any>`
- `getActiveFeatureFlags(): Record<string, any>`
- `getFeatureFlagVariable(flag: string, variable: string): any`
- `getFeatureFlagVariables(flag: string): Record<string, any>`
- `getVisitorCode(): string | null`
- `addData(data: Record<string, any>): void`
- `flush(): void`
- `getRemoteData(): Promise<any>`
- `getRemoteVisitorData(): Promise<any>`
- `getVisitorWarehouseAudience(): Promise<any>`
- `setLegalConsent(consent: boolean): void`
- `trackConversion(conversion: Record<string, any>): void`
- `getEngineTrackingCode(): string`
- `onEvent(event: string, callback: Function): void`

### KameleoonProvider Props

- `children: React.ReactNode`
- `enabled: boolean`
- `siteCode: string`

## Kameleoon Resources

- [Company Website](https://www.kameleoon.com)
- [Web Experiments Documentation](https://docs.kameleoon.com/web-experiments)
- [Feature Flags Documentation](https://docs.kameleoon.com/feature-flags)
- [JavaScript SDK Documentation](https://docs.kameleoon.com/javascript-sdk)
- [React SDK Documentation](https://docs.kameleoon.com/react-sdk)

## Contributing

We welcome contributions to the React Kameleoon SDK. Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a clear description of your changes.

For a detailed guide on contributing, please refer to the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.

## Author

This project was created by [Rafael Fragoso](mailto:rafael.fragoso@hurb.com). For more details, visit the [repository](https://github.com/orafaelfragoso/kameleoon-react-sdk).