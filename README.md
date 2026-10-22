# Wildduck-docs
> The official repository for Wildduck Mail Server documentation  
> *powered by Docusaurus*

The guides in `docs/` are maintained here. Check behavior and defaults against the [WildDuck source](https://github.com/zone-eu/wildduck), especially its configuration files, release notes, and in-depth guides.

The API reference in `docs/wildduck-api/` is generated automatically from WildDuck's OpenAPI specification and is ignored by Git. Update the source specification in WildDuck when the reference needs changes.

### Setup

Use Node.js 20 or later for the documentation site, matching the deployment workflow, then install dependencies:

```bash
npm ci
```

The WildDuck server itself has a separate runtime requirement, documented in the [installation guide](docs/getting-started/installation.md).


### Generating the MDX files required for OpenApi plugin to work
```bash
npm run gen-api-docs all
```

### Local Development

```bash
npm run start
```

This command starts a local development server and opens up a browser window. Most changes are reflected live without having to restart the server.

### Build

```bash
npm run build
```

This command generates static content into the `build` directory and can be served using any static contents hosting service.

### Cleaning up
To clean the generated API reference:

```bash
npm run clean-api-docs all
```

Regenerate the MDX files before the next build or local development session. The deployment workflow generates the API reference before building on each deployment.


> *Copyright Zone Media*
