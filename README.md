# yith
#### Serverless private npm registry, proxy and cache.

### Overview
Yith is a simple npm registry to allow companies that wish to keep their intellectual property.  It allows sharing of npm modules within a company but additionally allows access to all of the modules on npm.

It is compatiable with the latest version of the `npm` cli.

### Getting Started
1. Ensure you have administrator credentials set for you AWS account in `~/.aws/credentials`
2. `npm i`
3. `npm run build`
4. `npm set registry <url>` - url being the one shown in the terminal after deployment completes, such as:
`https://abcd12345.execute-api.eu-west-1.amazonaws.com/dev/registry/`

#### Supported Features
* `npm publish`
* `npm install`
* `npm install@version`
* `npm info`

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
* Add support for single sign on via github / github enterprise
* Show any security vulnerabilities of dependencies for packages
* Show any out dated depedencies for packages

##### discoverability
* Notify people via github messages of any new packages published
