Add-Type -AssemblyName System.IO.Compression.FileSystem
function Read-DocxTableText($filePath) {
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

$rows = Read-DocxTableText "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\ENGLISH-LANGUAGE\G3_English_Unpacked_BOW_11Weeks.docx"
Write-Output "Total rows: $($rows.Count)"
$rows | Select-Object -First 30
