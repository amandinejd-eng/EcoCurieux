# Lire le fichier original complet
$originalContent = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\code.txt" -Raw

# Lire le fichier actuel tronqué
$currentContent = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html" -Raw

# Trouver la section hero-bg-bubbles nettoyée dans le fichier actuel
$cleanBubblesPattern = '(?s)<div class="hero-bg-bubbles">.*?</div>'
if ($currentContent -match $cleanBubblesPattern) {
    $cleanBubblesSection = $matches[0]
    
    # Remplacer la section hero-bg-bubbles dans le fichier original par la version nettoyée
    $restoredContent = $originalContent -replace '(?s)<div class="hero-bg-bubbles">.*?</div>', $cleanBubblesSection
    
    # Écrire le fichier restauré
    $restoredContent | Set-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"
    
    Write-Host "Fichier restauré avec succès !"
} else {
    Write-Host "Erreur : section hero-bg-bubbles non trouvée"
}
