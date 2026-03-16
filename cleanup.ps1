$content = Get-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"
$cleanContent = $content | Where-Object { $_ -notmatch "/2wBDAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5Ojf/2wBDAQoKCg0MDRoPDxo3JR8lNzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzf" }
$cleanContent | Set-Content "c:\Users\geoff\Desktop\EcoCurieux\modele1_v2 (16).html"
