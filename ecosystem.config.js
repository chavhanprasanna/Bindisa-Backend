module.exports = {
  apps: [
    {
      name: 'bindisa-backend',
      script: 'server.js',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        LOG_LEVEL: 'info',
        MAX_MEMORY: '512M'
      },
      instances: 'max',
      exec_mode: 'cluster',
      max_memory_restart: '512M',
      restart_delay: 1000,
      error_file: 'logs/error.log',
      out_file: 'logs/out.log',
      log_file: 'logs/combined.log',
      merge_logs: true,
      watch: false,
      ignore_watch: ['node_modules', 'logs']
    }
  ]
};
