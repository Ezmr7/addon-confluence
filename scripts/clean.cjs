#!/usr/bin/env node

const rimraf = require('rimraf');
const path = require('path');
const { promisify } = require('util');

// Promisify rimraf for using with async/await
const rimrafAsync = promisify(rimraf);

// List of directories to delete
const directoriesToDelete = ['dist', 'node_modules', 'storybook-static'];

/**
 * Deletes a directory asynchronously using rimraf.
 * @param {string} dir - The directory path to delete.
 */
const deleteDirectory = async (dir) => {
  const dirPath = path.resolve(__dirname, '..', dir);
  try {
    await rimrafAsync(dirPath);
    console.log(`✅ Deleted: ${dirPath}`);
  } catch (error) {
    console.error(`❌ Failed to delete ${dirPath}:`, error.message);
  }
};

/**
 * Main function to iterate over directories and delete them.
 */
const main = async () => {
  console.log('Starting cleanup process...');
  
  // Create an array of delete promises
  const deletePromises = directoriesToDelete.map((dir) => deleteDirectory(dir));

  // Wait for all deletions to complete
  await Promise.all(deletePromises);

  console.log('Cleanup process completed.');
};

// Execute the main function
main();