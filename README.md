[![serverless](http://public.serverless.com/badges/v3.svg)](http://www.serverless.com) [![CircleCI](https://circleci.com/gh/craftship/yith/tree/master.svg?style=shield)](https://circleci.com/gh/craftship/yith/tree/master) [![JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
* * * 
# yith
#### Serverless private npm registry, proxy and cache.

### Overview
Yith is a simple npm registry to allow companies that wish to
keep their intellectual property.  It allows sharing of npm modules
within a company but additionally allows access to all of the
modules on npm.  It replaces npm authentication to be via github / github
enterprise.

It is compatiable with the latest version of the `npm` cli.

#### Setup Environment Config
You will need to ensure you have setup the relevant config for a GitHub
app and endpoint within a file name called `.config-{stage}`.  Replacing
`{stage}` with the relevant stage you are building (default is dev, e.g. `.config-dev`).

``` js
module.exports = {
  registry: 'https://registry.npmjs.org/',
  github: {
    endpoint: {
      protocol: 'https',
      host: 'github.com',
      pathPrefix: '/api/v3'
    },
    client_id: 'app_client_id',
    secret: 'app_secret'
  }
}
```

### Getting Started
1. Ensure you have elevated credentials set for your AWS account in `~/.aws/credentials`
2. `npm i`
3. `npm run build`
4. `npm set registry <url>` - url being the one shown in the terminal after deployment completes, such as:
`https://abcd12345.execute-api.eu-west-1.amazonaws.com/dev/registry/`

#### Supported Features
* `npm login` - via github / github enterprise (if 2FA enabled format username for npm login via cli as `username.otp` e.g. `craftship.123456`)
* `npm publish` - Stores all packages within S3 (Never publishes to real npm)
* `npm install` - Looks in S3 first, if it does not exist grabs from real npm
* `npm install@version`- Looks in S3 first, if it does not exist grabs from real npm
* `npm info` - Looks in S3 first, if it does not exist grabs from real npm

#### Roadmap
##### npm search
* Ability to search packages held within the private registry as well as npm itself

##### npm cache
* Upon fetching npm modules cache / store them within S3

##### user interface
* Showcase most popular packages on the home page
* Ability to browse private packages
* Statistics of package downloads and usage information

##### security
* ~~Add support for single sign on via github / github enterprise~~
* Show any security vulnerabilities of dependencies for packages
* Show any out dated depedencies for packages

##### discoverability
* Notify people via github messages of any new packages published
