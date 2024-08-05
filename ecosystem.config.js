require('@dotenvx/dotenvx').config();

module.exports = {
  apps: [
    {
      name: 'pr',
      script: 'npx ts-node script.ts',
      env_production: {
        NODE_ENV: 'production',
        TEST_USER_EMAIL: process.env.TEST_USER_EMAIL,
        TEST_USER_PASSWORD: process.env.TEST_USER_PASSWORD,
      },
    },
  ],

  deploy: {
    production: {
      key: process.env.SSH_KEY,
      user: process.env.SSH_USERNAME,
      host: process.env.SSH_HOSTMACHINE,
      ssh_options: 'ForwardAgent=yes',
      ref: 'origin/main',
      repo: process.env.GIT_REPOSITORY,
      path: process.env.DESTINATION_PATH,
      'pre-deploy-local': '',
      'post-deploy':
        'source ~/.nvm/nvm.sh && npm install && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
    },
  },
};
