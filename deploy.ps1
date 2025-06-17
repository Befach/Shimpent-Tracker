# Create .env.local file
Write-Host "Creating .env.local file..."
$envContent = @"
NEXT_PUBLIC_SUPABASE_URL=$env:NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$env:NEXT_PUBLIC_SUPABASE_ANON_KEY
"@
Set-Content -Path ".env.local" -Value $envContent

# Install dependencies
Write-Host "Installing dependencies..."
npm install

# Build the application
Write-Host "Building the application..."
npm run build

# Deploy to Firebase
Write-Host "Deploying to Firebase..."
npx firebase-tools deploy --only hosting

Write-Host "Deployment completed!" 