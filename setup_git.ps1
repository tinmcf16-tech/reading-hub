$destZip = "$env:TEMP\MinGit.zip"
$extractPath = "C:\Users\Admin\MinGit"

Write-Host "Downloading MinGit..."
$url = "https://github.com/git-for-windows/git/releases/download/v2.55.0.windows.5/MinGit-2.55.0.5-64-bit.zip"
Invoke-WebRequest -Uri $url -OutFile $destZip

Write-Host "Extracting to $extractPath..."
if (Test-Path $extractPath) { Remove-Item -Recurse -Force $extractPath }
Expand-Archive -Path $destZip -DestinationPath $extractPath -Force
Remove-Item -Force $destZip

$gitExe = "$extractPath\cmd\git.exe"
if (Test-Path $gitExe) {
    Write-Host "MinGit successfully extracted to: $gitExe"
    & $gitExe --version
} else {
    Write-Error "Failed to find git.exe"
}
