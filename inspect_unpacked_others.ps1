Add-Type -AssemblyName System.IO.Compression.FileSystem

function Inspect-Docx($path) {
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
    $text = ($pNodes | ForEach-Object {
        $t = $_.SelectNodes(".//w:t", $ns) | ForEach-Object { $_.InnerText }
        $t -join ""
    }) -join "`n"

    Write-Output "========================================"
    Write-Output "FILE: $(Split-Path $path -Leaf)"
    Write-Output "========================================"
    
    # Check for Week matches
    $weeks = [regex]::Matches($text, "(?i)(linggo\s*\d+|week\s*\d+|term\s*\d+|termino\s*\d+|kuwarter\s*\d+|quarter\s*\d+)") | ForEach-Object { $_.Value } | Select-Object -Unique
    Write-Output "Matches: $($weeks -join ', ')"
    
    # Show first 1000 chars of text
    Write-Output "First 600 chars:"
    Write-Output ($text.Substring(0, [Math]::Min(600, $text.Length)))
}

Inspect-Docx "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\FILIPINO-RL\G3_Filipino_Unpacked_BOW_11Weeks.docx"
Inspect-Docx "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\GMRC\G3_GMRC_Unpacked_BOW_11weeks.docx"
Inspect-Docx "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\MAKABANSA\G3_MAKABANSA_Unpacked_BOW_11weeks.docx"
