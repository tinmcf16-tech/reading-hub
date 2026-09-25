Add-Type -AssemblyName System.IO.Compression.FileSystem

function Get-DocxTextSummary($filePath) {
    $zip = [System.IO.Compression.ZipFile]::OpenRead($filePath)
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

    $hasT1 = $text -match "TERM 1|Term 1|1st Term"
    $hasT2 = $text -match "TERM 2|Term 2|2nd Term"
    $hasT3 = $text -match "TERM 3|Term 3|3rd Term"
    
    [PSCustomObject]@{
        File = (Split-Path $filePath -Leaf)
        Length = $text.Length
        HasTerm1 = $hasT1
        HasTerm2 = $hasT2
        HasTerm3 = $hasT3
        Snippet = $text.Substring(0, [Math]::Min(300, $text.Length)) -replace "\r?\n", " "
    }
}

$files = @(
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\ENGLISH-LANGUAGE\G3_English_Unpacked_BOW_11Weeks.docx",
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\FILIPINO-RL\G3_Filipino_Unpacked_BOW_11Weeks.docx",
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\GMRC\G3_GMRC_Unpacked_BOW_11weeks.docx",
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Unpacked Competencies\MAKABANSA\G3_MAKABANSA_Unpacked_BOW_11weeks.docx",
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T1\G3_Term1_Complete_Week1-11_A4.docx",
    "C:\Users\Admin\Desktop\2026-2027 Files\DLL\Combined Competencies\T2\G3_Term2_Weeks1-11_LearningCompetencies.docx"
)

$results = foreach ($f in $files) {
    if (Test-Path $f) {
        Get-DocxTextSummary $f
    }
}

$results | Format-Table -AutoSize
