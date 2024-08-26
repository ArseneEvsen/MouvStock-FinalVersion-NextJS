# MouvStock - Logiciel de gestion de stock

## Présentation

MouvStock est un logiciel de gestion de stock que j'ai conçu et développé avec le framework Next.js et le langage de programmation TypeScript.

Ce logiciel permet de gérer les différents cycles de vie des articles en magasin, à savoir : - la création de leurs caractéristiques (Nom, Marque, Catégorie, Code-barre, Stock, Prix, Image, Seuil d'alerte de stock bas) - leurs entrées dans l'inventaire - leurs modifications - leurs sorties, qu'elle soit due à des ventes ou par modification manuelle de leur stock

À l'aide de graphique, MouvStock permet de visualiser le chiffre d'affaires du magasin ou le nombre de ventes des articles, par semaine ou à l'année.

Afin de faire gagner du temps au magasin, MouvStock permet de suivre l'inventaire des articles avec des alertes de stock bas et des recherches par scan de code-barres.

## Installation

### Prérequis :

- Docker Desktop
- Git
- Editeur de code

## Etape 1 : Docker Compose

Après avoir pull ce repository, situé vous dans le dossier où se trouve le fichier "docker-compose.yml" puis dans le terminal de votre éditeur de code, tapez la commande suivante :

```
	docker-compose up --build
```

Cette ligne va build les images des différents conteneurs du projet (mysql et MouvStock)

## Etape 2 : instanciez le schéma de la base de données avec Prisma

Une fois que les images ont bien été créées et les conteneurs docker instanciées, toujours dans votre éditeur de code, tapez la commande suivante :

```
	docker-compose exec mouvstock npx prisma migrate dev --name init
```
## Etape 3 : Intégrez l'event "alerte stock bas" via mysqlworkbench

L'event côté base de données qui permet de vérifier si le stock d'un article est bas n'est pas encore intégré par défaut, pour l'intégrer veuillez à partir d'un client mysql (exemple : mysqlWorkbench) vous connecter au container mysql, dans un premier temps.

Ensuite, vérifiez que le scheduler est bien activé avec la ligne suivante :
```
	SHOW VARIABLES LIKE 'event_scheduler';
```

Pour l'activer : 
```
	SET GLOBAL event_scheduler = ON;
```

Voici le code pour créer l'event en base de données :
```
USE mouvstockdb;
DELIMITER //

CREATE EVENT UpdateProductStatesEvent
ON SCHEDULE EVERY 1 MINUTE
DO
BEGIN
    UPDATE product
    SET state = CASE
        WHEN stock <= stockLimit THEN 'Faible'
        ELSE 'Normal'
    END;
END //

DELIMITER ;
```

## Etape 4 : créez des catégories, des marques et des articles

Rendez-vous sur la page http://localhost:3000 et à l'aide du menu, découvrez les pages qui vous permettront de créer d'abord des catégories et des marques, pour ensuite créer des articles.
