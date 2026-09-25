Add-Type -AssemblyName System.IO.Compression.FileSystem

function Inspect-ZipEntries($zipPath) {
    Write-Output "=== $(Split-Path $zipPath -Leaf) ==="
    $zip = [System.IO.Compression.ZipFile]::OpenRead($zipPath)
    $zip.Entries | Select-Object FullName, Length | Format-Table -AutoSize
    $zip.Dispose()
}

Inspect-ZipEntries "C:\Users\Admin\Desktop\2026-2027 Files\DLL\SKILL-CLAUDE\Updated skill\multigrade-english-math.skill"
Inspect-ZipEntries "C:\Users\Admin\Desktop\2026-2027 Files\DLL\SKILL-CLAUDE\Updated skill\files (3)\multigrade-science-g3.skill"
