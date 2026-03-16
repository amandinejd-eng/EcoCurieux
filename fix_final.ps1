# Lire le fichier original complet
$originalContent = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\code.txt" -Raw

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

# Remplacer la section hero-bg-bubbles dans le fichier original par la version nettoyée
$finalContent = $originalContent -replace '(?s)<div class="hero-bg-bubbles">.*?</div>', $cleanBubbles

# Écrire le fichier final
$finalContent | Set-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"

Write-Host "Fichier final créé avec succès !"
