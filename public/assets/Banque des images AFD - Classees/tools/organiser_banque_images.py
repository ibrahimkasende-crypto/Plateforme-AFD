#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Organise une banque d'images AFD sans modifier les originaux.

Usage:
  python organiser_banque_images.py --source "D:\\Maquette_AFD\\Banque des images AFD" --output "D:\\Maquette_AFD\\Banque des images AFD - Classees" --dry-run
  python organiser_banque_images.py --source "D:\\Maquette_AFD\\Banque des images AFD" --output "D:\\Maquette_AFD\\Banque des images AFD - Classees" --execute
"""

from __future__ import annotations

import argparse
import csv
import hashlib
import json
import re
import shutil
import sys
import traceback
import unicodedata
import uuid
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any

from PIL import ExifTags, Image, ImageOps


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".tif",
    ".tiff",
    ".bmp",
    ".heic",
    ".heif",
}

SECTOR_FOLDERS = {
    "sante": "01_sante",
    "education": "02_education",
    "protection": "03_protection",
    "vbg": "04_vbg",
    "nutrition": "05_nutrition",
    "wash": "06_wash",
    "agriculture": "07_agriculture",
    "securite_alimentaire": "08_securite_alimentaire",
    "autonomisation_economique": "09_autonomisation_economique",
    "entrepreneuriat_feminin": "10_entrepreneuriat_feminin",
    "inclusion_handicap": "11_inclusion_handicap",
    "enfance": "12_enfance",
    "jeunesse": "13_jeunesse",
    "formation": "14_formation",
    "renforcement_capacites": "15_renforcement_capacites",
    "distribution_humanitaire": "16_distribution_humanitaire",
    "missions_terrain": "17_missions_terrain",
    "coordination": "18_coordination",
    "gouvernance": "19_gouvernance",
    "partenariats": "20_partenariats",
    "plaidoyer": "21_plaidoyer",
    "sensibilisation": "22_sensibilisation",
    "reunions": "23_reunions",
    "visites_institutionnelles": "24_visites_institutionnelles",
    "communication": "25_communication",
    "evenements": "26_evenements",
    "administration": "27_administration",
    "autres": "28_autres",
    "a_verifier": "99_a_verifier",
}

CSV_COLUMNS = [
    "id",
    "original_filename",
    "original_path",
    "new_filename",
    "output_path",
    "extension",
    "file_size_bytes",
    "width",
    "height",
    "sha256",
    "duplicate_exact",
    "duplicate_visual",
    "duplicate_group_id",
    "title",
    "description",
    "primary_sector",
    "secondary_categories",
    "sub_sector",
    "activity",
    "project",
    "partner",
    "province",
    "territory",
    "locality",
    "beneficiaries",
    "people_type",
    "tags",
    "visible_text",
    "date_taken",
    "date_source",
    "gps_available",
    "confidence",
    "classification_reason",
    "website_category",
    "website_slug",
    "alt_text",
    "caption",
    "review_required",
    "processing_status",
    "error_message",
    "original_candidate",
    "parent_folder",
    "file_modified",
    "orientation",
    "exif_available",
    "gps_raw",
    "perceptual_hash",
]


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def strip_accents(value: str) -> str:
    decomposed = unicodedata.normalize("NFKD", value)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch))


def slugify(value: str, max_len: int = 80) -> str:
    value = strip_accents(value).lower()
    value = re.sub(r"[^a-z0-9]+", "_", value)
    value = re.sub(r"_+", "_", value).strip("_")
    if not value:
        value = "element"
    return value[:max_len].strip("_")


def normalise_key(value: str) -> str:
    value = strip_accents(value).lower().replace("\\", "/")
    value = re.sub(r"\s+", " ", value)
    return value


def list_to_csv(values: list[str]) -> str:
    return "; ".join(v for v in values if v)


def sha256_file(path: Path) -> str:
    h = hashlib.sha256()
    with path.open("rb") as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b""):
            h.update(chunk)
    return h.hexdigest()


def parse_filename_date(name: str) -> tuple[str, str]:
    # Examples: IMG_20260308_101758_878.jpg or 2026-03-08.
    match = re.search(r"(20\d{2})(\d{2})(\d{2})", name)
    if match:
        y, m, d = match.groups()
        return f"{y}-{m}-{d}", "filename"
    match = re.search(r"(20\d{2})[-_](\d{2})[-_](\d{2})", name)
    if match:
        y, m, d = match.groups()
        return f"{y}-{m}-{d}", "filename"
    return "", ""


def rational_to_float(value: Any) -> float:
    try:
        if hasattr(value, "numerator") and hasattr(value, "denominator"):
            return float(value.numerator) / float(value.denominator)
        if isinstance(value, tuple) and len(value) == 2:
            return float(value[0]) / float(value[1])
        return float(value)
    except Exception:
        return 0.0


def gps_to_decimal(values: Any, ref: str) -> float | None:
    try:
        degrees = rational_to_float(values[0])
        minutes = rational_to_float(values[1])
        seconds = rational_to_float(values[2])
        result = degrees + minutes / 60.0 + seconds / 3600.0
        if ref in {"S", "W"}:
            result *= -1
        return result
    except Exception:
        return None


def extract_metadata(path: Path) -> dict[str, Any]:
    data: dict[str, Any] = {
        "width": 0,
        "height": 0,
        "date_taken": "",
        "date_source": "",
        "gps_available": False,
        "gps_raw": "",
        "orientation": "",
        "exif_available": False,
        "perceptual_hash": "",
        "read_error": "",
    }
    try:
        with Image.open(path) as img:
            data["width"], data["height"] = img.size
            exif = img.getexif()
            decoded: dict[str, Any] = {}
            if exif:
                data["exif_available"] = True
                for key, value in exif.items():
                    tag = ExifTags.TAGS.get(key, key)
                    decoded[str(tag)] = value
                for date_key in ("DateTimeOriginal", "DateTimeDigitized", "DateTime"):
                    if decoded.get(date_key):
                        raw_date = str(decoded[date_key])
                        data["date_taken"] = raw_date.replace(":", "-", 2)
                        data["date_source"] = "exif"
                        break
                if decoded.get("Orientation"):
                    data["orientation"] = str(decoded["Orientation"])
                gps_info = decoded.get("GPSInfo")
                if gps_info and hasattr(gps_info, "items"):
                    gps_decoded = {
                        ExifTags.GPSTAGS.get(k, k): v for k, v in gps_info.items()
                    }
                    data["gps_available"] = True
                    lat = None
                    lon = None
                    if gps_decoded.get("GPSLatitude") and gps_decoded.get("GPSLatitudeRef"):
                        lat = gps_to_decimal(
                            gps_decoded["GPSLatitude"], gps_decoded["GPSLatitudeRef"]
                        )
                    if gps_decoded.get("GPSLongitude") and gps_decoded.get("GPSLongitudeRef"):
                        lon = gps_to_decimal(
                            gps_decoded["GPSLongitude"], gps_decoded["GPSLongitudeRef"]
                        )
                    if lat is not None and lon is not None:
                        data["gps_raw"] = f"{lat:.6f},{lon:.6f}"
                    else:
                        data["gps_raw"] = "present"
            if not data["date_taken"]:
                parsed_date, source = parse_filename_date(path.name)
                data["date_taken"] = parsed_date
                data["date_source"] = source
            data["perceptual_hash"] = dhash(img)
    except Exception as exc:
        data["read_error"] = f"{type(exc).__name__}: {exc}"
    return data


def dhash(img: Image.Image, hash_size: int = 8) -> str:
    image = ImageOps.exif_transpose(img).convert("L").resize(
        (hash_size + 1, hash_size), Image.Resampling.LANCZOS
    )
    flattened = image.get_flattened_data() if hasattr(image, "get_flattened_data") else image.getdata()
    pixels = list(flattened)
    bits = []
    for row in range(hash_size):
        row_start = row * (hash_size + 1)
        for col in range(hash_size):
            left = pixels[row_start + col]
            right = pixels[row_start + col + 1]
            bits.append(1 if left > right else 0)
    value = 0
    for bit in bits:
        value = (value << 1) | bit
    return f"{value:016x}"


def hamming_hex(a: str, b: str) -> int:
    if not a or not b:
        return 999
    return bin(int(a, 16) ^ int(b, 16)).count("1")


@dataclass
class Profile:
    key: str
    primary_sector: str
    secondary_categories: list[str]
    sub_sector: str
    activity: str
    filename_context: str
    title: str
    description: str
    project: str = ""
    partner: str = ""
    province: str = ""
    territory: str = ""
    locality: str = ""
    beneficiaries: list[str] = field(default_factory=list)
    people_type: list[str] = field(default_factory=list)
    tags: list[str] = field(default_factory=list)
    visible_text: str = ""
    confidence: str = "moyen"
    classification_reason: str = ""
    alt_text: str = ""
    caption: str = ""


PROFILES = [
    Profile(
        key="banque images 1/all children",
        primary_sector="enfance",
        secondary_categories=["protection", "missions_terrain", "sensibilisation"],
        sub_sector="enfants_en_contexte_communautaire",
        activity="activites_enfants",
        filename_context="site_communautaire",
        title="Enfants en contexte communautaire",
        description=(
            "Groupes d'enfants et quelques adultes visibles dans un environnement "
            "communautaire avec abris, maisons, espaces exterieurs et presence AFD sur certaines images."
        ),
        beneficiaries=["enfants", "communautes"],
        people_type=["enfants", "femmes", "personnel_afd"],
        tags=[
            "enfants",
            "activite_communautaire",
            "site_communautaire",
            "abris",
            "personnel_afd",
            "mission_terrain",
        ],
        visible_text="AFD visible sur certains vetements ou supports; banderoles visibles sur certaines images.",
        confidence="moyen",
        classification_reason=(
            "Planche-contact verifiee: enfants en groupe, abris et contexte communautaire visibles; "
            "le dossier confirme une serie centree sur les enfants."
        ),
        alt_text="Enfants reunis dans un contexte communautaire accompagne par l'AFD.",
        caption="Enfants et membres de la communaute photographies dans un environnement communautaire avec presence de l'AFD.",
    ),
    Profile(
        key="banque images 1/atelier de formation des prestataires de soins salama",
        primary_sector="sante",
        secondary_categories=["formation", "renforcement_capacites"],
        sub_sector="formation_prestataires_soins",
        activity="formation_prestataires_soins",
        filename_context="salama",
        title="Formation des prestataires de soins SALAMA",
        description=(
            "Atelier de formation en salle pour des prestataires de soins, avec participants, "
            "formateurs, documents, ordinateur, projecteur, banderole et exercices pratiques."
        ),
        project="SALAMA",
        beneficiaries=["prestataires_de_soins", "communautes"],
        people_type=["personnel_sante", "formateurs", "participants", "personnel_afd"],
        tags=[
            "sante",
            "formation",
            "renforcement_capacites",
            "prestataires_de_soins",
            "salle_formation",
            "documents",
            "presentation",
            "banderole",
            "equipements_protection",
        ],
        visible_text="Banderole de formation des prestataires; references SALAMA visibles sur plusieurs images.",
        confidence="eleve",
        classification_reason=(
            "Planche-contact verifiee: salle de formation, supports pedagogiques, participants, "
            "prestataires et exercices avec equipements de protection."
        ),
        alt_text="Participants a un atelier de formation des prestataires de soins du projet SALAMA.",
        caption="Atelier de formation des prestataires de soins dans le cadre du projet SALAMA, avec sessions en salle et exercices pratiques.",
    ),
    Profile(
        key="banque images 1/civilites avec les autorites territoriales mambasa",
        primary_sector="visites_institutionnelles",
        secondary_categories=["gouvernance", "partenariats"],
        sub_sector="civilites_autorites_territoriales",
        activity="civilites_autorites",
        filename_context="mambasa",
        title="Civilites avec les autorites territoriales de Mambasa",
        description=(
            "Photos officielles d'une equipe AFD avec des autorites territoriales devant un batiment administratif."
        ),
        territory="Mambasa",
        locality="Mambasa",
        beneficiaries=["institutions_locales"],
        people_type=["autorites", "personnel_afd"],
        tags=["visite_institutionnelle", "gouvernance", "autorites", "batiment_administratif", "photo_groupe"],
        visible_text="Panneau administratif visible sur le batiment.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: civilites officielles devant un batiment administratif a Mambasa.",
        alt_text="Equipe AFD lors de civilites avec des autorites territoriales a Mambasa.",
        caption="Rencontre institutionnelle de l'AFD avec des autorites territoriales a Mambasa.",
    ),
    Profile(
        key="banque images 1/civilites avec mcz hgr mambasa",
        primary_sector="visites_institutionnelles",
        secondary_categories=["sante", "gouvernance", "coordination"],
        sub_sector="visite_mcz_hgr",
        activity="visite_mcz_hgr",
        filename_context="mambasa",
        title="Visite institutionnelle MCZ HGR Mambasa",
        description=(
            "Visite et seance de travail avec des responsables de sante au Hopital General de Reference de Mambasa."
        ),
        partner="MCZ Mambasa; HGR Mambasa",
        territory="Mambasa",
        locality="Mambasa",
        beneficiaries=["structures_de_sante", "communautes"],
        people_type=["personnel_sante", "personnel_afd", "responsables_institutionnels"],
        tags=[
            "visite_institutionnelle",
            "sante",
            "hgr",
            "mcz",
            "reunion",
            "centre_sante",
            "photo_groupe",
            "panneau_visible",
        ],
        visible_text="Hopital General de Reference de Mambasa visible sur le panneau.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: panneau HGR Mambasa, reunion avec personnels et photos officielles.",
        alt_text="Equipe AFD en visite institutionnelle au HGR de Mambasa.",
        caption="Visite institutionnelle et echanges avec des responsables de sante au HGR de Mambasa.",
    ),
    Profile(
        key="banque images 1/dotation de ddlm salama",
        primary_sector="wash",
        secondary_categories=["distribution_humanitaire", "sante"],
        sub_sector="dispositifs_lavage_mains",
        activity="dotation_dispositifs_lavage_mains",
        filename_context="salama",
        title="Dotation de dispositifs de lavage des mains SALAMA",
        description=(
            "Remise de kits et dispositifs de lavage des mains a des beneficiaires, avec materiel, seaux, cartons et presence AFD."
        ),
        project="SALAMA",
        beneficiaries=["structures_locales", "communautes"],
        people_type=["beneficiaires", "personnel_afd", "personnel_sante"],
        tags=[
            "wash",
            "dotation",
            "distribution",
            "lavage_des_mains",
            "kits",
            "equipements",
            "documents",
            "sante",
        ],
        visible_text="Logos AFD visibles sur des seaux ou supports; mots au tableau visibles dans la salle.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: remise de seaux et kits de lavage des mains.",
        alt_text="Remise de dispositifs de lavage des mains dans le cadre du projet SALAMA.",
        caption="Dotation de dispositifs de lavage des mains et kits associes, avec presence de l'equipe AFD.",
    ),
    Profile(
        key="banque images 1/remise de documents coordination tshopo",
        primary_sector="gouvernance",
        secondary_categories=["coordination", "visites_institutionnelles", "partenariats"],
        sub_sector="remise_documents_officiels",
        activity="remise_documents",
        filename_context="coordination_tshopo",
        title="Remise de documents a la coordination Tshopo",
        description=(
            "Remise officielle de documents dans un cadre institutionnel, avec bureau, mairie, equipes et supports visibles."
        ),
        province="Tshopo",
        locality="Kisangani",
        beneficiaries=["institutions_locales", "coordination"],
        people_type=["autorites", "personnel_afd", "partenaires"],
        tags=["gouvernance", "coordination", "remise_documents", "visite_institutionnelle", "mairie", "photo_groupe"],
        visible_text="Ville de Kisangani, Mairie et APROCM visibles sur certaines images.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: documents remis, bureau officiel et panneaux institutionnels visibles.",
        alt_text="Remise officielle de documents a la coordination provinciale de la Tshopo.",
        caption="Remise de documents et rencontre institutionnelle avec la coordination de la Tshopo.",
    ),
    Profile(
        key="banque images 1/seance de travail avec caritas kisangani",
        primary_sector="coordination",
        secondary_categories=["reunions", "partenariats", "gouvernance"],
        sub_sector="seance_travail_partenaire",
        activity="seance_travail",
        filename_context="caritas_kisangani",
        title="Seance de travail avec CARITAS Kisangani",
        description=(
            "Seance de travail en salle avec partenaires, personnel AFD, ordinateurs, documents et photo de groupe devant un batiment diocesan."
        ),
        partner="CARITAS",
        locality="Kisangani",
        beneficiaries=["partenaires_techniques", "communautes"],
        people_type=["personnel_afd", "partenaires", "participants"],
        tags=["coordination", "reunion", "partenariat", "caritas", "documents", "ordinateurs", "salle_reunion", "photo_groupe"],
        visible_text="CARITAS/Bureaux diocesains visibles sur le batiment dans certaines images.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: reunion technique en salle et batiment partenaire visible.",
        alt_text="Reunion de coordination entre l'AFD et CARITAS a Kisangani.",
        caption="Seance de travail entre l'AFD et CARITAS a Kisangani, avec echanges techniques et documentation.",
    ),
    Profile(
        key="banque images 2/sensibilisation 8 mars camp kabila",
        primary_sector="sensibilisation",
        secondary_categories=["vbg", "protection", "sante", "evenements"],
        sub_sector="sensibilisation_journee_femme",
        activity="sensibilisation_8_mars",
        filename_context="camp_kabila",
        title="Sensibilisation du 8 mars au Camp Kabila",
        description=(
            "Activite de sensibilisation autour du 8 mars dans un cadre de sante ou communautaire, avec remise de materiel et banderole."
        ),
        locality="Camp Kabila",
        beneficiaries=["femmes", "communautes"],
        people_type=["femmes", "personnel_sante", "personnel_afd"],
        tags=["sensibilisation", "8_mars", "femmes", "protection", "vbg", "sante", "banderole", "kits"],
        visible_text="Banderole de sensibilisation et panneau de maternite visibles sur certaines images.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: banderole, activite du 8 mars et groupe de femmes/personnel visible.",
        alt_text="Sensibilisation communautaire organisee le 8 mars au Camp Kabila.",
        caption="Activite de sensibilisation du 8 mars au Camp Kabila avec equipe AFD, participants et supports visibles.",
    ),
    Profile(
        key="banque images 2/sensibilisation et dotation ddlm au site ceca 20 makoko 1",
        primary_sector="wash",
        secondary_categories=["sensibilisation", "distribution_humanitaire", "protection", "enfance"],
        sub_sector="lavage_mains_site_deplaces",
        activity="sensibilisation_dotation_lavage_mains",
        filename_context="site_ceca_20_makoko_1",
        title="Sensibilisation et dotation DDLM au site CECA-20 Makoko 1",
        description=(
            "Sensibilisation communautaire et dotation de dispositifs de lavage des mains sur un site avec abris, beneficiaires et materiel WASH."
        ),
        locality="CECA-20 Makoko 1",
        beneficiaries=["personnes_deplacees", "communautes", "enfants"],
        people_type=["beneficiaires", "enfants", "femmes", "personnel_afd", "animateurs"],
        tags=[
            "wash",
            "sensibilisation",
            "lavage_des_mains",
            "dotation",
            "ddlm",
            "site_deplaces",
            "abris",
            "kits",
            "activite_communautaire",
        ],
        visible_text="Logos AFD visibles sur les dispositifs; panneaux de site visibles sur certaines images.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: dispositifs de lavage des mains, demonstration et site avec abris visibles.",
        alt_text="Sensibilisation et dotation de dispositifs de lavage des mains au site CECA-20 Makoko 1.",
        caption="Activite WASH de sensibilisation et dotation de dispositifs de lavage des mains au site CECA-20 Makoko 1.",
    ),
    Profile(
        key="banque images 2/sensibilisation lavage des mains aux enfants du site ceca 20",
        primary_sector="wash",
        secondary_categories=["enfance", "sensibilisation", "protection"],
        sub_sector="hygiene_enfants",
        activity="sensibilisation_lavage_mains_enfants",
        filename_context="site_ceca_20",
        title="Sensibilisation au lavage des mains des enfants",
        description=(
            "Demonstration de lavage des mains avec des enfants autour de dispositifs WASH dans un site avec abris."
        ),
        locality="CECA-20",
        beneficiaries=["enfants", "communautes"],
        people_type=["enfants", "femmes", "personnel_afd", "animateurs"],
        tags=["wash", "lavage_des_mains", "hygiene", "enfants", "sensibilisation", "abris", "activite_communautaire"],
        visible_text="Logos AFD visibles sur les dispositifs de lavage des mains.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: enfants, demonstration d'hygiene et dispositif de lavage des mains.",
        alt_text="Enfants participant a une sensibilisation au lavage des mains au site CECA-20.",
        caption="Sensibilisation WASH aupres des enfants avec demonstration du lavage des mains.",
    ),
    Profile(
        key="banque images 2/sensiilisation cpn salama",
        primary_sector="sante",
        secondary_categories=["sensibilisation", "protection"],
        sub_sector="consultation_prenatale",
        activity="sensibilisation_cpn",
        filename_context="salama",
        title="Sensibilisation CPN SALAMA",
        description=(
            "Sensibilisation en sante autour de la consultation prenatale, organisee devant un centre avec groupe de femmes et personnel."
        ),
        project="SALAMA",
        beneficiaries=["femmes", "communautes"],
        people_type=["femmes", "personnel_sante", "personnel_afd", "animateurs"],
        tags=["sante", "sensibilisation", "cpn", "femmes", "centre_sante", "sante_maternelle", "ebola"],
        visible_text="Stop Ebola visible sur certains vetements; centre de sante visible.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: groupe de femmes, personnel et sensibilisation en contexte de sante.",
        alt_text="Sensibilisation CPN du projet SALAMA aupres de femmes reunies devant un centre.",
        caption="Sensibilisation autour de la consultation prenatale dans le cadre du projet SALAMA.",
    ),
    Profile(
        key="banque images 2/supervision formative aire de sente salama",
        primary_sector="sante",
        secondary_categories=["renforcement_capacites", "formation"],
        sub_sector="supervision_formative_sante",
        activity="supervision_formative",
        filename_context="salama",
        title="Supervision formative dans l'aire de sante SALAMA",
        description=(
            "Supervision formative en salle de soins ou de formation avec personnel de sante, demonstrations et supports muraux."
        ),
        project="SALAMA",
        beneficiaries=["personnel_sante", "communautes"],
        people_type=["personnel_sante", "personnel_afd", "formateurs"],
        tags=["sante", "supervision_formative", "renforcement_capacites", "personnel_sante", "centre_sante", "demonstration"],
        visible_text="Supports muraux et affiches de sante visibles dans la salle.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: personnel en tenue de sante, demonstration et supervision formative.",
        alt_text="Supervision formative avec personnel de sante dans l'aire de sante SALAMA.",
        caption="Supervision formative et renforcement des capacites du personnel de sante dans le cadre de SALAMA.",
    ),
    Profile(
        key="banque images 2/visite d_evaluation au site de personnes deplacees ceca-20 makoko 1",
        primary_sector="missions_terrain",
        secondary_categories=["protection", "wash", "coordination"],
        sub_sector="evaluation_site_deplaces",
        activity="visite_evaluation_site_deplaces",
        filename_context="site_ceca_20_makoko_1",
        title="Visite d'evaluation au site CECA-20 Makoko 1",
        description=(
            "Mission de terrain sur un site de personnes deplacees avec equipe AFD, echanges communautaires, abris et point d'eau."
        ),
        locality="CECA-20 Makoko 1",
        beneficiaries=["personnes_deplacees", "communautes"],
        people_type=["personnel_afd", "beneficiaires", "leaders_communautaires"],
        tags=["mission_terrain", "evaluation", "site_deplaces", "protection", "wash", "abris", "point_eau", "coordination"],
        visible_text="AFD visible sur les gilets; panneaux et marquages de site visibles sur certaines images.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: deplacement terrain, abris, point d'eau et echanges communautaires.",
        alt_text="Equipe AFD en visite d'evaluation au site CECA-20 Makoko 1.",
        caption="Visite d'evaluation au site CECA-20 Makoko 1 avec observations de terrain et echanges communautaires.",
    ),
    Profile(
        key="banque images 2/visite evaluation salama",
        primary_sector="missions_terrain",
        secondary_categories=["sante", "coordination", "gouvernance"],
        sub_sector="evaluation_site_sante",
        activity="visite_evaluation",
        filename_context="salama",
        title="Visite d'evaluation SALAMA",
        description=(
            "Visite d'evaluation dans un contexte de sante SALAMA, avec equipe, personnel local, documents et espaces de service."
        ),
        project="SALAMA",
        beneficiaries=["structures_de_sante", "communautes"],
        people_type=["personnel_afd", "personnel_sante", "responsables_locaux"],
        tags=["mission_terrain", "evaluation", "sante", "salama", "documents", "centre_sante", "coordination"],
        visible_text="Stop Ebola visible sur certains vetements; documents et affiches visibles dans les bureaux.",
        confidence="eleve",
        classification_reason="Planche-contact verifiee: visite de site, documents, personnel et contexte de sante.",
        alt_text="Equipe AFD lors d'une visite d'evaluation du projet SALAMA.",
        caption="Visite d'evaluation du projet SALAMA dans un contexte de sante et de coordination locale.",
    ),
]

DEFAULT_PROFILE = Profile(
    key="default",
    primary_sector="a_verifier",
    secondary_categories=["autres"],
    sub_sector="classification_a_verifier",
    activity="analyse_a_verifier",
    filename_context="a_verifier",
    title="Image a verifier",
    description="Image conservee pour verification manuelle faute de contexte visuel ou dossier suffisant.",
    beneficiaries=[],
    people_type=[],
    tags=["a_verifier"],
    visible_text="",
    confidence="faible",
    classification_reason="Aucun profil visuel valide n'a ete trouve pour ce dossier.",
    alt_text="Photo issue de la banque d'images AFD a verifier.",
    caption="Image conservee dans le dossier de verification pour analyse complementaire.",
)


def profile_for(path: Path, source: Path) -> Profile:
    rel = path.parent.relative_to(source)
    key = normalise_key(str(rel))
    for profile in sorted(PROFILES, key=lambda p: len(p.key), reverse=True):
        if normalise_key(profile.key) in key:
            return profile
    return DEFAULT_PROFILE


def collect_files(source: Path) -> tuple[list[Path], list[Path]]:
    images: list[Path] = []
    non_images: list[Path] = []
    for path in sorted(source.rglob("*")):
        if not path.is_file():
            continue
        if path.suffix.lower() in IMAGE_EXTENSIONS:
            images.append(path)
        else:
            non_images.append(path)
    return images, non_images


def apply_start_limit(files: list[Path], start_from: str, limit: int | None) -> list[Path]:
    if start_from:
        if start_from.isdigit():
            start_idx = max(int(start_from) - 1, 0)
            files = files[start_idx:]
        else:
            lowered = start_from.lower()
            idx = 0
            for i, path in enumerate(files):
                if lowered in str(path).lower():
                    idx = i
                    break
            files = files[idx:]
    if limit is not None and limit > 0:
        files = files[:limit]
    return files


def ensure_structure(output: Path) -> None:
    output.mkdir(parents=True, exist_ok=True)
    for folder in SECTOR_FOLDERS.values():
        (output / folder).mkdir(parents=True, exist_ok=True)
    (output / "tools").mkdir(parents=True, exist_ok=True)


def build_filename(profile: Profile, extension: str, counters: Counter[str]) -> str:
    sector_slug = slugify(profile.primary_sector, 36)
    activity_slug = slugify(profile.activity, 42)
    context_slug = slugify(profile.filename_context, 38)
    parts = ["afd", sector_slug, activity_slug]
    if context_slug:
        parts.append(context_slug)
    base = "_".join(parts)
    room = 120 - len(extension.lower()) - 5
    base = base[:room].rstrip("_")
    counters[base] += 1
    return f"{base}_{counters[base]:03d}{extension.lower()}"


def build_records(
    files: list[Path],
    source: Path,
    output: Path,
    detect_duplicates: bool,
    errors: list[dict[str, str]],
) -> list[dict[str, Any]]:
    counters: Counter[str] = Counter()
    records: list[dict[str, Any]] = []
    hash_groups: defaultdict[str, list[int]] = defaultdict(list)

    for path in files:
        profile = profile_for(path, source)
        file_id = str(uuid.uuid4())
        stat = path.stat()
        sha = ""
        try:
            sha = sha256_file(path)
        except Exception as exc:
            errors.append(error_entry(path, "hash_error", str(exc), "catalogue puis copie tentee", "a_verifier"))

        metadata = extract_metadata(path)
        if metadata["read_error"]:
            errors.append(
                error_entry(path, "image_read_error", metadata["read_error"], "copie conservee avec metadata partielle", "a_verifier")
            )
            profile = DEFAULT_PROFILE

        extension = path.suffix.lower()
        new_filename = build_filename(profile, extension, counters)
        sector_folder = SECTOR_FOLDERS.get(profile.primary_sector, SECTOR_FOLDERS["a_verifier"])
        review_required = profile.confidence == "faible" or bool(metadata["read_error"])
        if review_required:
            sector_folder = SECTOR_FOLDERS["a_verifier"]
        output_path = output / sector_folder / new_filename
        website_slug = slugify(Path(new_filename).stem, 110)

        record = {
            "id": file_id,
            "original_filename": path.name,
            "original_path": str(path),
            "new_filename": new_filename,
            "output_path": str(output_path),
            "extension": extension,
            "file_size_bytes": stat.st_size,
            "width": metadata["width"],
            "height": metadata["height"],
            "sha256": sha,
            "duplicate_exact": False,
            "duplicate_visual": False,
            "duplicate_group_id": "",
            "title": profile.title,
            "description": profile.description,
            "primary_sector": profile.primary_sector,
            "secondary_categories": profile.secondary_categories,
            "sub_sector": profile.sub_sector,
            "activity": profile.activity,
            "project": profile.project,
            "partner": profile.partner,
            "province": profile.province,
            "territory": profile.territory,
            "locality": profile.locality,
            "beneficiaries": profile.beneficiaries,
            "people_type": profile.people_type,
            "tags": profile.tags,
            "visible_text": profile.visible_text,
            "date_taken": metadata["date_taken"],
            "date_source": metadata["date_source"],
            "gps_available": metadata["gps_available"],
            "confidence": profile.confidence,
            "classification_reason": profile.classification_reason,
            "website_category": profile.primary_sector,
            "website_slug": website_slug,
            "alt_text": profile.alt_text[:150],
            "caption": profile.caption,
            "review_required": review_required,
            "processing_status": "planned",
            "error_message": metadata["read_error"],
            "original_candidate": True,
            "parent_folder": str(path.parent),
            "file_modified": datetime.fromtimestamp(stat.st_mtime).isoformat(timespec="seconds"),
            "orientation": metadata["orientation"],
            "exif_available": metadata["exif_available"],
            "gps_raw": metadata["gps_raw"],
            "perceptual_hash": metadata["perceptual_hash"],
            "_perceptual_hash": metadata["perceptual_hash"],
            "_gps_raw": metadata["gps_raw"],
        }
        if sha:
            hash_groups[sha].append(len(records))
        records.append(record)

    for group_no, (_, indexes) in enumerate((item for item in hash_groups.items() if len(item[1]) > 1), 1):
        group_id = f"exact_{group_no:04d}"
        for pos, idx in enumerate(indexes):
            records[idx]["duplicate_exact"] = True
            records[idx]["duplicate_group_id"] = group_id
            records[idx]["original_candidate"] = pos == 0

    if detect_duplicates:
        mark_visual_duplicates(records)
    return records


def mark_visual_duplicates(records: list[dict[str, Any]]) -> None:
    # Conservative dHash clustering. This flags probable copies/resized captures without deleting anything.
    clusters: list[list[int]] = []
    reps: list[str] = []
    threshold = 3
    for idx, record in enumerate(records):
        phash = record.get("_perceptual_hash") or ""
        if not phash:
            continue
        matched = False
        for cluster_idx, rep_hash in enumerate(reps):
            if hamming_hex(phash, rep_hash) <= threshold:
                clusters[cluster_idx].append(idx)
                matched = True
                break
        if not matched:
            reps.append(phash)
            clusters.append([idx])

    visual_no = 1
    for cluster in clusters:
        if len(cluster) <= 1:
            continue
        group_id = f"visual_{visual_no:04d}"
        visual_no += 1
        for pos, idx in enumerate(cluster):
            records[idx]["duplicate_visual"] = True
            if not records[idx]["duplicate_group_id"]:
                records[idx]["duplicate_group_id"] = group_id
                records[idx]["original_candidate"] = pos == 0


def error_entry(path: Path, error_type: str, message: str, action: str, status: str) -> dict[str, str]:
    return {
        "date": now_iso(),
        "fichier": str(path),
        "type_erreur": error_type,
        "message": message,
        "action_prise": action,
        "statut_final": status,
    }


def copy_records(records: list[dict[str, Any]], errors: list[dict[str, str]], resume: bool) -> None:
    for record in records:
        src = Path(record["original_path"])
        dst = Path(record["output_path"])
        try:
            dst.parent.mkdir(parents=True, exist_ok=True)
            if dst.exists():
                existing_hash = sha256_file(dst)
                if existing_hash == record["sha256"]:
                    record["processing_status"] = "already_exists" if resume else "copied_existing_same_hash"
                    continue
                dst = unique_path(dst)
                record["output_path"] = str(dst)
                record["new_filename"] = dst.name
                record["website_slug"] = slugify(dst.stem, 110)
            shutil.copy2(src, dst)
            copied_hash = sha256_file(dst)
            if copied_hash != record["sha256"]:
                record["processing_status"] = "copy_hash_mismatch"
                record["error_message"] = append_error(record["error_message"], "Hash copie different de l'original.")
                errors.append(error_entry(src, "copy_hash_mismatch", "Hash copie different de l'original.", "copie conservee pour verification", "erreur"))
            else:
                record["processing_status"] = "copied"
        except Exception as exc:
            record["processing_status"] = "copy_error"
            record["error_message"] = append_error(record["error_message"], f"{type(exc).__name__}: {exc}")
            errors.append(error_entry(src, "copy_error", str(exc), "catalogue marque en erreur", "erreur"))


def append_error(existing: str, message: str) -> str:
    if existing:
        return f"{existing} | {message}"
    return message


def unique_path(path: Path) -> Path:
    stem = path.stem
    suffix = path.suffix
    parent = path.parent
    for i in range(1, 10000):
        candidate = parent / f"{stem}_{i:03d}{suffix}"
        if not candidate.exists():
            return candidate
    raise RuntimeError(f"Impossible de creer un nom unique pour {path}")


def csv_ready(record: dict[str, Any]) -> dict[str, Any]:
    row = {key: record.get(key, "") for key in CSV_COLUMNS}
    for key in ("secondary_categories", "beneficiaries", "people_type", "tags"):
        if isinstance(row[key], list):
            row[key] = list_to_csv(row[key])
    row["duplicate_exact"] = str(bool(row["duplicate_exact"])).lower()
    row["duplicate_visual"] = str(bool(row["duplicate_visual"])).lower()
    row["gps_available"] = str(bool(row["gps_available"])).lower()
    row["exif_available"] = str(bool(row["exif_available"])).lower()
    row["review_required"] = str(bool(row["review_required"])).lower()
    row["original_candidate"] = str(bool(row["original_candidate"])).lower()
    return row


def write_csv(path: Path, rows: list[dict[str, Any]], columns: list[str]) -> None:
    with path.open("w", encoding="utf-8-sig", newline="") as f:
        writer = csv.DictWriter(f, fieldnames=columns, extrasaction="ignore")
        writer.writeheader()
        for row in rows:
            writer.writerow(row)


def write_catalogues(records: list[dict[str, Any]], output: Path, generate_csv: bool, generate_json: bool) -> None:
    if generate_csv:
        rows = [csv_ready(record) for record in records]
        write_csv(output / "catalogue_images.csv", rows, CSV_COLUMNS)
        correspondence_cols = [
            "original_filename",
            "original_path",
            "new_filename",
            "output_path",
            "primary_sector",
            "activity",
            "confidence",
            "review_required",
        ]
        write_csv(output / "renommage_correspondance.csv", rows, correspondence_cols)
        inventory_cols = [
            "original_filename",
            "original_path",
            "extension",
            "file_size_bytes",
            "width",
            "height",
            "sha256",
            "date_taken",
            "date_source",
            "gps_available",
            "parent_folder",
            "file_modified",
            "orientation",
            "exif_available",
            "gps_raw",
            "perceptual_hash",
        ]
        write_csv(output / "inventaire_images.csv", rows, inventory_cols)
        plan_cols = [
            "original_filename",
            "original_path",
            "new_filename",
            "output_path",
            "primary_sector",
            "activity",
            "confidence",
            "classification_reason",
        ]
        write_csv(output / "plan_renommage.csv", rows, plan_cols)

    if generate_json:
        payload = []
        for record in records:
            payload.append(
                {
                    "id": record["id"],
                    "originalFilename": record["original_filename"],
                    "newFilename": record["new_filename"],
                    "title": record["title"],
                    "description": record["description"],
                    "primarySector": record["primary_sector"],
                    "secondaryCategories": record["secondary_categories"],
                    "subSector": record["sub_sector"],
                    "activity": record["activity"],
                    "project": record["project"],
                    "partner": record["partner"],
                    "province": record["province"],
                    "territory": record["territory"],
                    "locality": record["locality"],
                    "beneficiaries": record["beneficiaries"],
                    "tags": record["tags"],
                    "visibleText": record["visible_text"],
                    "confidence": record["confidence"],
                    "reviewRequired": record["review_required"],
                    "website": {
                        "category": record["website_category"],
                        "slug": record["website_slug"],
                        "altText": record["alt_text"],
                        "caption": record["caption"],
                    },
                    "files": {
                        "originalPath": record["original_path"],
                        "outputPath": record["output_path"],
                        "sha256": record["sha256"],
                        "width": record["width"],
                        "height": record["height"],
                    },
                }
            )
        with (output / "catalogue_images.json").open("w", encoding="utf-8") as f:
            json.dump(payload, f, ensure_ascii=False, indent=2)


def write_errors(errors: list[dict[str, str]], output: Path) -> None:
    path = output / "journal_erreurs.log"
    with path.open("w", encoding="utf-8") as f:
        if not errors:
            f.write(f"{now_iso()} | Aucune erreur bloquante.\n")
            return
        for err in errors:
            f.write(
                f"{err['date']} | {err['fichier']} | {err['type_erreur']} | "
                f"{err['message']} | action={err['action_prise']} | statut={err['statut_final']}\n"
            )


def write_readme(output: Path) -> None:
    readme = output / "README.md"
    readme.write_text(
        """# Banque Images AFD - Classees

Ce dossier contient une copie classee et renommee de la banque d'images AFD.
Les originaux restent dans le dossier source et ne sont ni modifies, ni deplaces, ni supprimes.

## Relancer en dry-run

```powershell
python ".\\tools\\organiser_banque_images.py" --source "D:\\Maquette_AFD\\Banque des images AFD" --output "D:\\Maquette_AFD\\Banque des images AFD - Classees" --dry-run --detect-duplicates
```

## Relancer en execution

```powershell
python ".\\tools\\organiser_banque_images.py" --source "D:\\Maquette_AFD\\Banque des images AFD" --output "D:\\Maquette_AFD\\Banque des images AFD - Classees" --execute --resume --detect-duplicates
```

## Fichiers principaux

- `catalogue_images.csv` : catalogue complet pour tableur ou import CMS.
- `catalogue_images.json` : catalogue structure pour integration web.
- `renommage_correspondance.csv` : lien entre l'ancien nom et le nouveau nom.
- `rapport_traitement.md` : bilan du traitement et recommandations.
- `journal_erreurs.log` : erreurs eventuelles et actions prises.
- `inventaire_images.csv` : inventaire technique des originaux.
- `plan_renommage.csv` : plan de nommage avant ou apres copie.

## Notes

Les classifications utilisent l'analyse visuelle des planches-contact et le contexte des dossiers comme information complementaire.
Les images de confiance faible sont envoyees dans `99_a_verifier`.
""",
        encoding="utf-8",
    )


def validate(records: list[dict[str, Any]], source_files: list[Path], output: Path, execute: bool) -> dict[str, Any]:
    validation: dict[str, Any] = {
        "catalogue_complete": len(records) == len(source_files),
        "duplicate_new_names": [],
        "invalid_web_names": [],
        "missing_copies": [],
        "hash_mismatches": [],
        "low_confidence_not_in_review": [],
        "json_valid": False,
        "csv_paths_exist": False,
    }
    names = Counter(record["new_filename"] for record in records)
    validation["duplicate_new_names"] = [name for name, count in names.items() if count > 1]
    name_re = re.compile(r"^[a-z0-9_]+\\.[a-z0-9]+$")
    for record in records:
        if not name_re.match(record["new_filename"]):
            validation["invalid_web_names"].append(record["new_filename"])
        if record["confidence"] == "faible" and SECTOR_FOLDERS["a_verifier"] not in record["output_path"]:
            validation["low_confidence_not_in_review"].append(record["new_filename"])
        if execute:
            dst = Path(record["output_path"])
            if not dst.exists():
                validation["missing_copies"].append(record["output_path"])
            else:
                try:
                    if sha256_file(dst) != record["sha256"]:
                        validation["hash_mismatches"].append(record["output_path"])
                except Exception:
                    validation["hash_mismatches"].append(record["output_path"])
    try:
        with (output / "catalogue_images.json").open("r", encoding="utf-8") as f:
            json.load(f)
        validation["json_valid"] = True
    except Exception:
        validation["json_valid"] = False
    validation["csv_paths_exist"] = all(
        (output / name).exists()
        for name in ("catalogue_images.csv", "renommage_correspondance.csv", "inventaire_images.csv", "plan_renommage.csv")
    )
    return validation


def write_report(
    records: list[dict[str, Any]],
    output: Path,
    source: Path,
    source_files: list[Path],
    non_images: list[Path],
    errors: list[dict[str, str]],
    validation: dict[str, Any],
    execute: bool,
) -> None:
    sector_counts = Counter(record["primary_sector"] for record in records)
    review_count = sum(1 for record in records if record["review_required"])
    without_date = sum(1 for record in records if not record["date_taken"])
    without_location = sum(1 for record in records if not any([record["province"], record["territory"], record["locality"]]))
    with_gps = sum(1 for record in records if record["gps_available"])
    with_text = sum(1 for record in records if record["visible_text"])
    exact_dup = sum(1 for record in records if record["duplicate_exact"])
    visual_dup = sum(1 for record in records if record["duplicate_visual"])
    copied = sum(1 for record in records if record["processing_status"] in {"copied", "already_exists", "copied_existing_same_hash"})
    not_recognized = sum(1 for record in records if record["confidence"] == "faible")

    folders = [folder for folder in SECTOR_FOLDERS.values()]
    report = []
    report.append("# Rapport de traitement - Banque Images AFD")
    report.append("")
    report.append(f"- Date du traitement : {now_iso()}")
    report.append(f"- Dossier source : `{source}`")
    report.append(f"- Dossier de sortie : `{output}`")
    report.append(f"- Mode : {'execution avec copie' if execute else 'dry-run sans copie'}")
    report.append("")
    report.append("## Synthese")
    report.append("")
    report.append(f"1. Nombre total de fichiers detectes : {len(source_files) + len(non_images)}")
    report.append(f"2. Nombre total d'images traitees : {len(records)}")
    report.append(f"3. Nombre d'images copiees : {copied}")
    report.append(f"4. Nombre d'images non reconnues : {not_recognized}")
    report.append(f"5. Nombre d'erreurs : {len(errors)}")
    report.append(f"6. Nombre de doublons exacts marques : {exact_dup}")
    report.append(f"7. Nombre de doublons visuels probables marques : {visual_dup}")
    report.append(f"8. Nombre d'images a verifier : {review_count}")
    report.append(f"9. Nombre d'images sans date de prise de vue : {without_date}")
    report.append(f"10. Nombre d'images sans lieu confirme : {without_location}")
    report.append(f"11. Nombre d'images avec GPS : {with_gps}")
    report.append(f"12. Nombre d'images avec texte visible renseigne : {with_text}")
    report.append("")
    report.append("## Images par secteur")
    report.append("")
    for sector, folder in SECTOR_FOLDERS.items():
        if sector == "a_verifier":
            label = "a_verifier"
        else:
            label = sector
        report.append(f"- {folder} : {sector_counts.get(label, 0)}")
    report.append("")
    report.append("## Dossiers crees")
    report.append("")
    for folder in folders:
        report.append(f"- `{output / folder}`")
    report.append("- `tools`")
    report.append("")
    report.append("## Fichiers non traites")
    report.append("")
    if non_images:
        for path in non_images[:200]:
            report.append(f"- `{path}`")
        if len(non_images) > 200:
            report.append(f"- ... {len(non_images) - 200} fichiers supplementaires non listes")
    else:
        report.append("- Aucun fichier non-image detecte.")
    report.append("")
    report.append("## Problemes rencontres")
    report.append("")
    if errors:
        for err in errors[:100]:
            report.append(f"- `{err['fichier']}` : {err['type_erreur']} - {err['message']}")
        if len(errors) > 100:
            report.append(f"- ... {len(errors) - 100} erreurs supplementaires dans `journal_erreurs.log`")
    else:
        report.append("- Aucune erreur bloquante.")
    report.append("- Aucun moteur OCR local n'a ete detecte; le champ `visible_text` combine les textes confirmes par inspection visuelle des planches-contact et le contexte dossier.")
    report.append("")
    report.append("## Validation finale")
    report.append("")
    report.append(f"- Chaque image source possede une entree catalogue : {validation['catalogue_complete']}")
    report.append(f"- Aucun nouveau nom duplique : {not validation['duplicate_new_names']}")
    report.append(f"- Noms compatibles Web : {not validation['invalid_web_names']}")
    report.append(f"- Copies manquantes : {len(validation['missing_copies'])}")
    report.append(f"- Hashs copies identiques aux originaux : {not validation['hash_mismatches']}")
    report.append(f"- JSON valide : {validation['json_valid']}")
    report.append(f"- CSV presents : {validation['csv_paths_exist']}")
    report.append(f"- Images faible confiance dans `99_a_verifier` : {not validation['low_confidence_not_in_review']}")
    report.append("")
    report.append("## Recommandations pour la mediatheque web")
    report.append("")
    report.append("- Importer `catalogue_images.json` comme source structuree pour les pages, filtres et fiches media.")
    report.append("- Utiliser `website.category`, `tags`, `primarySector` et `secondaryCategories` pour les filtres du site.")
    report.append("- Afficher `altText` pour l'accessibilite et `caption` comme legende sous les photos.")
    report.append("- Conserver `renommage_correspondance.csv` comme fichier de tracabilite entre originaux et copies classees.")
    report.append("- Revoir manuellement tout element marque `review_required=true` avant publication.")
    report.append("- Eviter d'afficher les noms de personnes; les descriptions restent volontairement non nominatives.")
    report.append("")
    report.append("## Apercu du plan de renommage")
    report.append("")
    for record in records[:20]:
        report.append(f"- `{record['original_filename']}` -> `{record['new_filename']}` ({record['primary_sector']}, {record['confidence']})")
    report.append("")
    (output / "rapport_traitement.md").write_text("\n".join(report), encoding="utf-8")


def print_preview(records: list[dict[str, Any]], output: Path, collisions: list[str]) -> None:
    print(f"Images inventoriees: {len(records)}")
    print(f"Noms proposes: {len({record['new_filename'] for record in records})}")
    print(f"Dossier de sortie: {output}")
    print("Dossiers destination:")
    for folder in SECTOR_FOLDERS.values():
        print(f" - {output / folder}")
    print(f"Collisions critiques: {len(collisions)}")
    if collisions:
        for name in collisions[:20]:
            print(f" - {name}")
    print("Apercu des 20 premiers renommages:")
    for record in records[:20]:
        print(f" - {record['original_filename']} -> {record['new_filename']} [{record['primary_sector']} / {record['confidence']}]")


def main() -> int:
    parser = argparse.ArgumentParser(description="Classer et renommer une banque d'images AFD sans toucher aux originaux.")
    parser.add_argument("--source", required=True, help="Dossier source contenant les images originales.")
    parser.add_argument("--output", required=True, help="Dossier de sortie pour les copies classees.")
    mode = parser.add_mutually_exclusive_group(required=True)
    mode.add_argument("--dry-run", action="store_true", help="Inventorie et prepare le plan sans copier les images.")
    mode.add_argument("--execute", action="store_true", help="Execute la copie et produit les livrables finaux.")
    parser.add_argument("--resume", action="store_true", help="Ne pas recopier les fichiers deja presents avec le meme hash.")
    parser.add_argument("--limit", type=int, default=None, help="Limiter le nombre d'images traitees.")
    parser.add_argument("--start-from", default="", help="Commencer a un index 1-base ou a un chemin contenant cette chaine.")
    parser.add_argument("--generate-csv", action="store_true", help="Generer les CSV. Active par defaut.")
    parser.add_argument("--generate-json", action="store_true", help="Generer le JSON. Active par defaut.")
    parser.add_argument("--detect-duplicates", action="store_true", help="Detecter les doublons exacts et visuels probables.")
    args = parser.parse_args()

    source = Path(args.source)
    output = Path(args.output)
    generate_csv = True if not args.generate_csv else args.generate_csv
    generate_json = True if not args.generate_json else args.generate_json
    errors: list[dict[str, str]] = []

    if not source.exists() or not source.is_dir():
        print(f"ERREUR: dossier source introuvable: {source}", file=sys.stderr)
        return 2

    ensure_structure(output)
    all_images, non_images = collect_files(source)
    selected_images = apply_start_limit(all_images, args.start_from, args.limit)
    records = build_records(selected_images, source, output, args.detect_duplicates, errors)

    name_counts = Counter(record["new_filename"] for record in records)
    collisions = [name for name, count in name_counts.items() if count > 1]
    print_preview(records, output, collisions)

    if collisions:
        print("Collision critique detectee. Les copies ne sont pas executees.", file=sys.stderr)
        write_catalogues(records, output, generate_csv, generate_json)
        write_errors(errors, output)
        validation = validate(records, selected_images, output, execute=False)
        write_report(records, output, source, selected_images, non_images, errors, validation, execute=False)
        write_readme(output)
        return 3

    if args.execute:
        copy_records(records, errors, args.resume)
    write_catalogues(records, output, generate_csv, generate_json)
    write_errors(errors, output)
    validation = validate(records, selected_images, output, execute=args.execute)
    write_report(records, output, source, selected_images, non_images, errors, validation, execute=args.execute)
    write_readme(output)
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception:
        traceback.print_exc()
        raise
