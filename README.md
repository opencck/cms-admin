## OpenCCK Admin
Nuxt admin panel for OpenCCK CMS

## Build Setup
```bash
# download
$ mkdir cck; cd cck
$ git clone git@bitbucket.org:Rekryt/cck.git .
$ git submodule init
$ git submodule update

# setup environtment
$ cp api/.example.env api/.env

# install app dependencies
$ npm install
$ composer install

# install api dependencies
$ cd api/includes
$ npm install
$ composer install
```

### Development
```bash
# serve with hot reload
$ npm run dev
```

### Production
```bash
# build for production
$ npm run build

# launch with npm
$ npm run start

# launch with pm2
$ pm2 start ecosystem.config.js
```
