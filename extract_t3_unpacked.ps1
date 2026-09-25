Add-Type -AssemblyName System.IO.Compression.FileSystem

function Extract-DocxRows($filePath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
    $entry = $zip.GetEntry("word/document.xml")
    $reader = New-Object System.IO.StreamReader($entry.Open())
    $xmlContent = $reader.ReadToEnd()
    $reader.Close()
    $zip.Dispose()

    [xml]$xml = $xmlContent
    $ns = New-Object System.Xml.XmlNamespaceManager($xml.NameTable)
    $ns.AddNamespace("w", "http://schemas.openxmlformats.org/wordprocessingml/2006/main")

    $rows = $xml.SelectNodes("//w:tr", $ns)
    $tableData = @()
    foreach ($r in $rows) {
        $cells = $r.SelectNodes(".//w:tc", $ns)
        $rowData = @()
        foreach ($c in $cells) {
            $pNodes = $c.SelectNodes(".//w:p", $ns)
            $pTexts = @()
            foreach ($p in $pNodes) {
                $tNodes = $p.SelectNodes(".//w:t", $ns)
                $pTexts += (($tNodes | ForEach-Object { $_.InnerText }) -join "")
            }
            $rowData += (($pTexts -join " ") -replace "\s+", " ").Trim()
        }
        $tableData += ,$rowData
    }
    return $tableData
}

$eng = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\ENGLISH-LANGUAGE\G3_English_Unpacked_BOW_11Weeks.docx"
$fil = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\FILIPINO-RL\G3_Filipino_Unpacked_BOW_11Weeks.docx"
$gmrc = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\GMRC\G3_GMRC_Unpacked_BOW_11weeks.docx"
$makabansa = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\MAKABANSA\G3_MAKABANSA_Unpacked_BOW_11weeks.docx"

@{
    eng_count = $eng.Count
    fil_count = $fil.Count
    gmrc_count = $gmrc.Count
    makabansa_count = $makabansa.Count
    eng = $eng
    fil = $fil
    gmrc = $gmrc
    makabansa = $makabansa
} | ConvertTo-Json -Depth 6 | Out-File -FilePath "C:\Users\Admin\Desktop\Reading HUB\t3_unpacked_raw.json" -Encoding utf8

Write-Host "Extracted unpacked raw tables successfully!"
