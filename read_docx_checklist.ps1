$path = 'C:\Users\Admin\Desktop\Reading HUB\Multigrade_Competency_Checklist_G1_G2_G3.docx'
if (-not (Test-Path $path)) {
    Write-Host "File not found: $path"
    exit
}

Add-Type -AssemblyName System.IO.Compression.FileSystem
$zip = [System.IO.Compression.ZipFile]::OpenRead($path)
$entry = $zip.GetEntry('word/document.xml')
$stream = $entry.Open()
$reader = New-Object System.IO.StreamReader($stream)
$xml = [xml]$reader.ReadToEnd()
$stream.Close()
$zip.Dispose()

$text = $xml.document.body.InnerText
Write-Host "Total length: $($text.Length)"
Write-Host "First 2000 chars:"
Write-Host ($text.Substring(0, [Math]::Min(2000, $text.Length)))

# Save text to file for easy inspection
[System.IO.File]::WriteAllText('C:\Users\Admin\Desktop\Reading HUB\multigrade_checklist_extracted.txt', $text)
Write-Host "Saved to multigrade_checklist_extracted.txt"
