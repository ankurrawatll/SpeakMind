const { execSync } = require('child_process');

console.log('Installing dependencies...');
try {
  // Install all dependencies including dev dependencies
  execSync('npm install --include=dev', { stdio: 'inherit' });
  
  // Install missing dependencies that are causing build errors
  const missingDeps = [
    'react-router-dom',
    'framer-motion',
    'lucide-react',
    '@types/node'
  ].join(' ');
  
  console.log('Installing missing dependencies...');
  execSync(`npm install ${missingDeps}`, { stdio: 'inherit' });
  
  // Run the build
  console.log('Running build...');
  execSync('npm run build', { stdio: 'inherit' });
  
  console.log('Build completed successfully!');
  process.exit(0);
} catch (error) {
  console.error('Build failed:', error);
  process.exit(1);
}
