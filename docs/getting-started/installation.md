---
sidebar_position: 3
title: Installation
---

# Installing WildDuck

![Installing WildDuck](/img/sprites/wiring_server.png)


WildDuck itself is an IMAP, POP3, and HTTP API server. Together with [Haraka](/docs/architecture/inbound-smtp) (inbound SMTP) and [ZoneMTA](/docs/architecture/outbound-smtp) (outbound SMTP), it functions as a complete mail server. Below are instructions for installing a complete mail server, or only WildDuck itself.

## Requirements

The current WildDuck release requires **Node.js 22.19.0 or later**, MongoDB, and Redis. See [Requirements](/docs/getting-started/introduction#requirements) for optional components. The standalone WildDuck image does not include the other mail-suite services.

## Complete mail server

### Scripted install
If you have a blank VPS and a free domain name that you can point to that VPS than you can try out the scripted all-included install

[Installation instructions](https://github.com/zone-eu/wildduck/tree/master/setup)

Install script installs and configures all required dependencies and services, including Let's Encrypt based certs, to run WildDuck as a mail server. Tested on Ubuntu 22.04+.


### Docker
This method can be used on both new or existing servers, no matter the distro. If it supports docker, it will work (amd64 and arm64 are both supported). Docker also makes updating or uninstalling all components quite easy.

[Installation instructions](https://github.com/nodemailer/wildduck-dockerized)

The `docker-compose.yml` together with the default configuration script will set up all required dependencies and services, including Let's Encrypt based certs, to run WildDuck as a mail server.

## WildDuck only
### Manual install

Assuming you have MongoDB and Redis running somewhere.

#### Step 1\. Get the code from github

```
$ git clone https://github.com/zone-eu/wildduck.git
$ cd wildduck
```

#### Step 2\. Install dependencies

Install dependencies from npm

```
$ npm install --omit=dev
```

#### Step 3\. Run the server

To use the [default config](https://github.com/zone-eu/wildduck/blob/master/config/default.toml) file, run the following:

```
node server.js
```

Or if you want to override default configuration options with your own, run the following (custom config file is merged with the default, so specify only these
values that you want to change):

```
node server.js --config=/etc/wildduck.toml
```

> For additional config options, see the _wild-config_ [documentation](https://github.com/zone-eu/wild-config).

#### Step 4\. Create a user account

Create an account with `POST /users`. See the [API reference](/docs/category/wildduck-api) for the request fields. Set up [API access control](/docs/security/access-tokens) before allowing other hosts to reach the management API.

For a graphical administration interface, see [WildDuck Admin](https://github.com/zone-eu/wildduck-admin), which connects to an existing WildDuck HTTP API.

#### Step 5\. Use an IMAP/POP3 client to log in

Use the account credentials, or an application-specific password when two-factor authentication is enabled. The standalone defaults are IMAP over TLS on **9993** and POP3 over TLS on **9995**. The scripted and Docker Compose installations may publish the standard ports 993 and 995 instead. Configure trusted [TLS certificates](/docs/operations/certificates) for client access.

### Docker Install
The easiest way to setup wildduck with a docker image is given below, for more documentation about configuration options in the docker image, refer to
the [in-depth page on Docker](/docs/operations/docker).


A GHCR image built using the [Dockerfile](https://github.com/zone-eu/wildduck/blob/master/Dockerfile) in the repo is also available

To pull the latest pre-built image of wildduck:

```
docker pull ghcr.io/zone-eu/wildduck
```

It is also possible to pull a specific version of wildduck by specifying the version as the image tag.
(example, for version 1.55.1):
```
docker pull ghcr.io/zone-eu/wildduck:1.55.1
```
On Linux, to run the image using the [default config](https://github.com/zone-eu/wildduck/blob/master/config/default.toml) and MongoDB and Redis from the host machine, use:
```
docker run --network=host ghcr.io/zone-eu/wildduck
```

For container networking and configuration overrides, see [Docker](/docs/operations/docker). For an existing deployment, read the [upgrade guidance](/docs/operations/operating-wildduck#upgrading) before updating WildDuck and its SMTP integrations.
