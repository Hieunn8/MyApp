const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Hỗ trợ path alias @/ → thư mục gốc project
config.resolver.alias = {
  '@': path.resolve(__dirname),
};

module.exports = config;
