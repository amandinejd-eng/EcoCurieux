# Lire le fichier original complet
$originalContent = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\code.txt" -Raw

# Trouver la position du début de la section hero-bg-bubbles
$startPattern = '<div class="hero-bg-bubbles">'
$startIndex = $originalContent.IndexOf($startPattern)

if ($startIndex -eq -1) {
    Write-Host "Section hero-bg-bubbles non trouvée"
    exit
}

# Trouver la position de la fin de la section hero-bg-bubbles (premier </div> après le début)
$endPattern = '</div>'
$endIndex = $originalContent.IndexOf($endPattern, $startIndex + $startPattern.Length)

# Compter les </div> pour trouver la bonne fermeture
$divCount = 0
$searchIndex = $startIndex
$finalEndIndex = -1

while ($searchIndex -lt $originalContent.Length) {
    $openIndex = $originalContent.IndexOf('<div', $searchIndex)
    $closeIndex = $originalContent.IndexOf('</div>', $searchIndex)
    
    if ($closeIndex -eq -1) { break }
    
    if ($openIndex -ne -1 -and $openIndex -lt $closeIndex) {
        $divCount++
        $searchIndex = $openIndex + 4
    } else {
        $divCount--
        if ($divCount -eq 0) {
            $finalEndIndex = $closeIndex + 6
            break
        }
        $searchIndex = $closeIndex + 6
    }
}

if ($finalEndIndex -eq -1) {
    Write-Host "Impossible de trouver la fin de la section"
    exit
}

# Notre section hero-bg-bubbles propre
$cleanBubbles = @"
  <div class="hero-bg-bubbles">
    <div class="hbb"><img src="Image/1. Stand d'accueil et d'information de la ferme pédagogique.png" alt="Stand d'accueil et d'information de la ferme pédagogique"></div>
    <div class="hbb"><img src="Image/2. Animation  nourrissage des chèvres en extérieur avec les enfants.jpg" alt="Animation nourrissage des chèvres en extérieur avec les enfants"></div>
    <div class="hbb"><img src="Image/3. Observation des cochons et découverte de leur habitat.jpg" alt="Observation des cochons et découverte de leur habitat"></div>
    <div class="hbb"><img src="Image/4. Sensibilisation au contact des chèvres en pâturage.jpg" alt="Sensibilisation au contact des chèvres en pâturage"></div>
    <div class="hbb"><img src="Image/5. Médiation animale  atelier contact et soin aux lapins.jpg" alt="Médiation animale atelier contact et soin aux lapins"></div>
    <div class="hbb"><img src="Image/6. Amandine assure le nourrissage d'un agneau au biberon.jpg" alt="Amandine assure le nourrissage d'un agneau au biberon"></div>
    <div class="hbb"><img src="Image/7. Échanges pédagogiques et transmission avec un groupe d'enfants.jpg" alt="Échanges pédagogiques et transmission avec un groupe d'enfants"></div>
    <div class="hbb"><img src="Image/8. Amandine avec ses perruches.jpg" alt="Amandine avec ses perruches"></div>
  </div>
"@

# Construire le contenu final
$beforeSection = $originalContent.Substring(0, $startIndex)
$afterSection = $originalContent.Substring($finalEndIndex)
$finalContent = $beforeSection + $cleanBubbles + $afterSection

# Écrire le fichier final
$finalContent | Set-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"

Write-Host "Fix ultime appliqué avec succès !"
