# PowerShell equivalent of cp-build-assets.sh

# Create directory structure and copy preline.js
$prelineDestDir = "dist\node_modules\preline\dist"
if (!(Test-Path -Path $prelineDestDir)) {
    New-Item -ItemType Directory -Path $prelineDestDir -Force
}
Copy-Item -Path "node_modules\preline\dist\preline.js" -Destination $prelineDestDir

# Create directory structure and copy toastify.js
$toastifyDestDir = "dist\node_modules\toastify-js\src"
if (!(Test-Path -Path $toastifyDestDir)) {
    New-Item -ItemType Directory -Path $toastifyDestDir -Force
}
Copy-Item -Path "node_modules\toastify-js\src\toastify.js" -Destination $toastifyDestDir

Write-Host "Build assets copied successfully!" -ForegroundColor Green