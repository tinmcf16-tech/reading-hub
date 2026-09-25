Add-Type -AssemblyName System.IO.Compression.FileSystem
$ErrorActionPreference = "Stop"

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

Write-Host "Extracting T1 table..."
$t1 = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T1\G3_Term1_Complete_Week1-11_A4.docx"
Write-Host "T1 rows: $($t1.Count)"

Write-Host "Extracting T2 table..."
$t2 = Extract-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T2\G3_Term2_Weeks1-11_LearningCompetencies.docx"
Write-Host "T2 rows: $($t2.Count)"

# Save raw extracted tables to JSON for inspection
@{
    t1 = $t1
    t2 = $t2
} | ConvertTo-Json -Depth 5 | Out-File -FilePath "C:\Users\Admin\Desktop\Reading HUB\t1_t2_tables.json" -Encoding utf8
Write-Host "Saved t1_t2_tables.json successfully!"
