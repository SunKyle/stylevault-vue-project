#!/usr/bin/env node

/**
 * 清理空目录脚本
 */

const fs = require('fs');
const path = require('path');

// 项目根目录
const projectRoot = '/Users/sunxiaokai/Desktop/stylevault-vue-project';
const srcComponentsDir = path.join(projectRoot, 'src/components');

/**
 * 删除目录（如果为空）
 * @param {string} dirPath 目录路径
 */
function removeEmptyDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    if (files.length === 0) {
      fs.rmdirSync(dirPath);
      console.log(`删除空目录: ${dirPath}`);
      return true;
    } else {
      // 检查子目录是否为空
      let hasEmptySubDirs = false;
      files.forEach(file => {
        const subDirPath = path.join(dirPath, file);
        if (fs.statSync(subDirPath).isDirectory()) {
          if (removeEmptyDir(subDirPath)) {
            hasEmptySubDirs = true;
          }
        }
      });

      // 如果子目录被删除，再次检查当前目录是否为空
      if (hasEmptySubDirs) {
        const updatedFiles = fs.readdirSync(dirPath);
        if (updatedFiles.length === 0) {
          fs.rmdirSync(dirPath);
          console.log(`删除空目录: ${dirPath}`);
          return true;
        }
      }

      console.log(`目录不为空，不删除: ${dirPath}`);
      return false;
    }
  }
  return false;
}

/**
 * 执行清理
 */
function cleanupEmptyDirs() {
  console.log('开始清理空目录...');

  // 需要检查的目录列表
  const dirsToCheck = [
    'common',
    'features',
    'analytics',
    'clothing',
    'upload',
    'outfits'
  ];

  dirsToCheck.forEach(dir => {
    const dirPath = path.join(srcComponentsDir, dir);
    removeEmptyDir(dirPath);
  });

  console.log('清理完成!');
}

// 执行清理
cleanupEmptyDirs();
