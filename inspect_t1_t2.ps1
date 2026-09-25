Add-Type -AssemblyName System.IO.Compression.FileSystem
function Read-DocxRows($filePath) {
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
    $output = @()
    foreach ($r in $rows) {
        $cells = $r.SelectNodes(".//w:tc", $ns)
        $rowText = @()
        foreach ($c in $cells) {
            $pNodes = $c.SelectNodes(".//w:p", $ns)
            $pTexts = @()
            foreach ($p in $pNodes) {
                $tNodes = $p.SelectNodes(".//w:t", $ns)
                $pTexts += (($tNodes | ForEach-Object { $_.InnerText }) -join "")
            }
            $rowText += (($pTexts -join " ") -replace "\s+", " ").Trim()
        }
        $output += ($rowText -join " | ")
    }
    return $output
}

Write-Output "=== G3_Term1_Complete_Week1-11_A4.docx ==="
$r1 = Read-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T1\G3_Term1_Complete_Week1-11_A4.docx"
Write-Output "Total rows: $($r1.Count)"
$r1 | Select-Object -First 25

Write-Output "`n=== G3_Term2_Weeks1-11_LearningCompetencies.docx ==="
$r2 = Read-DocxRows "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T2\G3_Term2_Weeks1-11_LearningCompetencies.docx"
Write-Output "Total rows: $($r2.Count)"
$r2 | Select-Object -First 25
