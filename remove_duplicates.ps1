# Lire tout le contenu
$content = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"

# Trouver les lignes à garder (jusqu'à la fin de la section hero-bg-bubbles)
$keepLines = @()
$foundEnd = $false
for ($i = 0; $i -lt $content.Count; $i++) {
    if ($content[$i] -match "  </div>" -and $i -gt 650) {
        $keepLines += $content[$i]
        $foundEnd = $true
    } elseif ($foundEnd -and $content[$i] -match "  <div class=") {
        break
    } elseif ($foundEnd) {
        $keepLines += $content[$i]
    } else {
        $keepLines += $content[$i]
    }
}

# Écrire le contenu nettoyé
$keepLines | Set-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"
