const gulp = require('gulp');
const core = require('./node_modules/core/gulp_helper');
const pkg = require('./package.json');
const config_app_name = "covid19";
const cotstaff_root = "webapps/cdn/cotstaff/";
const cotstaff_version = "9.3.9";
const c3api = require('./dev_c3api_helper');
const deployTo = "SIT";
const app = config_app_name;
const script_app = config_app_name;
let options = {
  pkg, //pass in the contents of package.json
  embedArea: 'full',
  preprocessorContext: {
    CONFIG_APP_NAME: config_app_name,
    COTSTAFF_ROOT:cotstaff_root,
    COTSTAFF_VERSION:cotstaff_version,
    local: {
      ROOT_ENV: 'https://was-intra-sit.toronto.ca'
    },
    dev: {
      ROOT_ENV: 'https://was-intra-sit.toronto.ca'
    },
    qa: {
      ROOT_ENV: 'https://was-intra-qa.toronto.ca'
    },
    prod: {
      ROOT_ENV: 'https://insideto-secure.toronto.ca'
    }
  },
  environmentOverride: null,
  deploymentPath: null
};

core.embeddedApp.createTasks(gulp, options);

gulp.task('config', () => {
  return c3api.config.localToRemote({
    requestOptions: deployTo,
    localPath: './src/ssjs',
    qualifiedName: app
  })
    .then(() => {
      console.log('DONE');
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
});

gulp.task('da', () => {
  return c3api.da.localToRemote({
    RequestOptions: deployTo,
    app: app ,
    localPath: './api/da',
    deleteEntity: false,
    truncateEntity: true
  })
    .then(() => {
      console.log('DONE');
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
});

gulp.task('media', ['default'], () => {
  return c3api.da.mediaLocalToRemote({
    requestOptions: deployTo,
    app: app ,
    entitySet: 'Media',
    localPath: './src/scripts/Media/json'
  })
    .then(() => {
      console.log('DONE');
      return c3api.da.mediaLocalToRemote({
        requestOptions: deployTo,
        app: app ,
        entitySet: 'Media',
        localPath: './.tmp/webapps/'+ script_app +'/scripts/Media/js'
      })
        .then(() => {
          console.log('SECONDARY DONE');
        })
        .catch((error) => {
          console.error('SECONDARY ERROR', error);
        });
    })
    .then(() => {
      return c3api.da.mediaLocalToRemote({
        requestOptions: deployTo,
        app: app ,
        entitySet: 'Media',
        localPath: './src/styles/Media'
      })
        .then(() => {
          console.log('CSS DONE');
        })
        .catch((error) => {
          console.error('CSS ERROR', error);
        });
    })
    .then(() => {
      return c3api.da.mediaLocalToRemote({
        requestOptions: deployTo,
        app: app ,
        entitySet: 'Media',
        localPath: './src/html/Media'
      })
        .then(() => {
          console.log('HTML DONE');
        })
        .catch((error) => {
          console.error('CSS ERROR', error);
        });
    })
    .catch((error) => {
      console.error('ERROR', error);
    });
});

