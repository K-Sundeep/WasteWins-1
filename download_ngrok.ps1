# Download and setup ngrok
Write-Host "Downloading ngrok..."

try {
    # Download ngrok
    Invoke-WebRequest -Uri "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip" -OutFile "ngrok.zip"
    Write-Host "✅ Downloaded ngrok.zip"
    
    # Extract ngrok
    Expand-Archive -Path "ngrok.zip" -DestinationPath "." -Force
    Write-Host "✅ Extracted ngrok.exe"
    
    # Clean up zip file
    Remove-Item "ngrok.zip"
    Write-Host "✅ Cleaned up zip file"
    
    Write-Host ""
    Write-Host "🎉 ngrok is ready!"
    Write-Host "Next steps:"
    Write-Host "1. Go to https://ngrok.com/signup to get your authtoken"
    Write-Host "2. Run: .\ngrok.exe config add-authtoken YOUR_TOKEN"
    Write-Host "3. Run: .\ngrok.exe http 5000"
    
} catch {
    Write-Host "❌ Error downloading ngrok: $($_.Exception.Message)"
    Write-Host ""
    Write-Host "Manual download:"
    Write-Host "1. Go to https://ngrok.com/download"
    Write-Host "2. Download Windows version"
    Write-Host "3. Extract ngrok.exe to this folder"
}
