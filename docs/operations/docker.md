---
sidebar_position: 9
title: Wildduck Docker image
---

# Wildduck docker image

![Docker](/img/sprites/tangled_in_cables.png)


## Obtaining the Docker image
To pull the latest pre-built image of wildduck from GHCR:

```bash
docker pull ghcr.io/zone-eu/wildduck
```

It is also possible to pull a specific version of wildduck by specifying the version as the image tag.
(example, for version 1.55.1):
```bash
docker pull ghcr.io/zone-eu/wildduck:1.55.1
```
## Running wildduck using Docker
The image starts `server.js` with `/wildduck/config/default.toml` (see the [Dockerfile](https://github.com/zone-eu/wildduck/blob/master/Dockerfile)).

```bash
docker run ghcr.io/zone-eu/wildduck
```
This uses the included configuration, whose database URLs point to localhost. In a container, localhost is the container itself, so configure reachable MongoDB and Redis services. Set WildDuck options with `APPCONF_` environment variables (the variable path uses underscores) or mount a custom config directory:
1. Pass `APPCONF_*` env variables to configure options using [wild-config](https://github.com/zone-eu/wild-config)
    
    Assuming a Docker network named `wildduck` connects WildDuck to services named `mongo` and `redis`, this example publishes IMAP and keeps the API bound to the local host:
    ```bash
    docker run --rm \
      --network wildduck \
      -p 993:9993 \
      -p 127.0.0.1:8080:8080 \
      -e APPCONF_dbs_mongo='mongodb://mongo:27017/wildduck' \
      -e APPCONF_dbs_redis='redis://redis:6379/3' \
      -e APPCONF_api_host='0.0.0.0' \
      -e APPCONF_emailDomain='example.com' \
      -e APPCONF_smtp_setup_hostname='mail.example.com' \
      -e APPCONF_imap_setup_hostname='mail.example.com' \
      ghcr.io/zone-eu/wildduck
    ```

    More details available at the [wild-config](https://github.com/zone-eu/wild-config) documentation.
2. Mount a Docker volume with a custom configuration file:
    
    Replace the image's config directory with a host directory containing the required TOML files:
    ```bash
    docker run --rm -v /config/from/host:/wildduck/config:ro ghcr.io/zone-eu/wildduck
    ```

For a production setup, also configure certificates, network exposure, and the separate SMTP components. See [Configuration](/docs/operations/configuration), [Attachment Storage](/docs/operations/attachment-storage), and [Monitoring](/docs/operations/monitoring).
