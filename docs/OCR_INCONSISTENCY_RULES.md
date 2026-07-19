# Règles d’incohérence

Moteur : `src/features/document-intelligence/rules/`.

- Finance : solde, totaux lignes, dépassement budget, % > 100  
- Stock : théorique = initial + entrées − sorties, écart inventaire  
- Activités : total = femmes+hommes+filles+garçons  
- Bénéficiaires : catégories vs total, période dupliquée  

Anomalies = info / warning / high / critical — jamais accusation automatique.
