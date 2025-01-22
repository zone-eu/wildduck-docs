# Wildduck-docs
> The official repository for Wildduck Mail Server documentation  
> *powered by Docusaurus*


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
If you wish to completely clean the generated docs:
1. Delete generated folder in `/docs`.
2. Run `npm run clean-api-docs all`  

After that you can regenerate the MDX files safely.


> *Copyright Zone Media*