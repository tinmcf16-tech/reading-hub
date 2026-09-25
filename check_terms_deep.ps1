Add-Type -AssemblyName System.IO.Compression.FileSystem

function Check-File-Structure($path) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($path)
    $entry = $zip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()

    [xml]$xml = $xmlContent
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

    $pNodes = $xml.SelectNodes("//w:p", $ns)
    $lines = @()
    foreach ($p in $pNodes) {
        $tNodes = $p.SelectNodes(".//w:t", $ns)
        $t = ($tNodes | ForEach-Object { $_.InnerText }) -join ""
        if ($t -match "(?i)(term|termino|kuwarter|quarter|linggo\s*\d+|week\s*\d+)") {
            $lines += $t.Trim()
        }
    }
    
    Write-Output "=== $(Split-Path $path -Leaf) ==="
    $lines | Select-Object -Unique
}

Check-File-Structure "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\FILIPINO-RL\G3_Filipino_Unpacked_BOW_11Weeks.docx"
Check-File-Structure "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\GMRC\G3_GMRC_Unpacked_BOW_11weeks.docx"
Check-File-Structure "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\MAKABANSA\G3_MAKABANSA_Unpacked_BOW_11weeks.docx"
