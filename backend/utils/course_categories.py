from enum import Enum
from typing import List, Dict, Optional
from models.profile import AcademicLevel, Specialization

class CourseCategory(str, Enum):
    # Common categories for all levels
    MATH = "Mathématiques"
    LANGUAGES = "Langues"
    SOFT_SKILLS = "Compétences Transversales"
    PHYSICS = "Physique Fondamentale"
    COMPUTER_SCIENCE = "Informatique de Base"
    COMMUNICATION = "Techniques de Communication"
    PROJECT = "Projet Académique"
    
    # IIR (Ingénierie Informatique et Réseaux)
    ALGORITHMS = "Algorithmique"
    WEB_DEV = "Développement Web/Mobile"
    DATABASES = "Bases de Données"
    NETWORKS = "Réseaux Informatiques"
    CYBERSECURITY = "Cybersécurité"
    AI = "Intelligence Artificielle"
    CLOUD_COMPUTING = "Cloud Computing"
    IOT = "Internet des Objets"
    
    # GESI (Génie Electrique et Systèmes Intelligents)
    ELECTRONICS = "Électronique"
    AUTOMATION = "Automatisme Industriel"
    ENERGY_SYSTEMS = "Systèmes Énergétiques"
    INDUSTRIAL_NETWORKS = "Réseaux Industriels"
    RENEWABLE_ENERGY = "Énergies Renouvelables"
    INDUSTRY_40 = "Industrie 4.0"
    
    # Génie Industriel
    PRODUCTION_MGMT = "Gestion de Production"
    LOGISTICS = "Logistique"
    QUALITY_CONTROL = "Contrôle Qualité"
    INDUSTRIAL_MAINTENANCE = "Maintenance Industrielle"
    LEAN_MANAGEMENT = "Lean Management"
    INDUSTRIAL_SIMULATION = "Simulation Industrielle"
    
    # Génie Civil
    STRUCTURES = "Calcul de Structures"
    CONSTRUCTION_MATERIALS = "Matériaux de Construction"
    HYDRAULICS = "Hydraulique Appliquée"
    TOPOGRAPHY = "Topographie"
    URBAN_PLANNING = "Urbanisme"
    BIM = "Building Information Modeling"
    
    # Génie Financier
    FINANCIAL_ANALYSIS = "Analyse Financière"
    ACCOUNTING = "Comptabilité"
    AUDIT = "Audit Financier"
    RISK_MANAGEMENT = "Gestion des Risques"
    FINANCIAL_ENGINEERING = "Ingénierie Financière"
    FINTECH = "Technologies Financières"
def get_categories_by_specialization(
    specialization: Optional[Specialization] = None
) -> List[Dict[str, str]]:
    """Returns course categories based only on specialization (all years combined)"""
    
    # Core categories for all students
    categories = [
        {"value": CourseCategory.MATH, "label": "Mathématiques"},
        {"value": CourseCategory.LANGUAGES, "label": "Langues"},
        {"value": CourseCategory.SOFT_SKILLS, "label": "Compétences Transversales"},
        {"value": CourseCategory.PHYSICS, "label": "Physique Fondamentale"},
        {"value": CourseCategory.COMPUTER_SCIENCE, "label": "Informatique de Base"},
        {"value": CourseCategory.COMMUNICATION, "label": "Techniques de Communication"},
        {"value": CourseCategory.PROJECT, "label": "Projet Académique"}
    ]
    
    if not specialization:
        return categories
    
    # IIR - Computer Engineering
    if specialization == Specialization.INFORMATIQUE:
        categories.extend([
            {"value": CourseCategory.ALGORITHMS, "label": "Algorithmique"},
            {"value": CourseCategory.WEB_DEV, "label": "Développement Web/Mobile"},
            {"value": CourseCategory.DATABASES, "label": "Bases de Données"},
            {"value": CourseCategory.NETWORKS, "label": "Réseaux Informatiques"},
            {"value": CourseCategory.CYBERSECURITY, "label": "Cybersécurité"},
            {"value": CourseCategory.AI, "label": "Intelligence Artificielle"},
            {"value": CourseCategory.CLOUD_COMPUTING, "label": "Cloud Computing"},
            {"value": CourseCategory.IOT, "label": "Internet des Objets"}
        ])
    
    # GESI - Electrical Engineering
    elif specialization == Specialization.ELECTRIQUE:
        categories.extend([
            {"value": CourseCategory.ELECTRONICS, "label": "Électronique"},
            {"value": CourseCategory.AUTOMATION, "label": "Automatisme Industriel"},
            {"value": CourseCategory.ENERGY_SYSTEMS, "label": "Systèmes Énergétiques"},
            {"value": CourseCategory.INDUSTRIAL_NETWORKS, "label": "Réseaux Industriels"},
            {"value": CourseCategory.RENEWABLE_ENERGY, "label": "Énergies Renouvelables"},
            {"value": CourseCategory.INDUSTRY_40, "label": "Industrie 4.0"}
        ])
    
    # Industrial Engineering
    elif specialization == Specialization.INDUSTRIEL:
        categories.extend([
            {"value": CourseCategory.PRODUCTION_MGMT, "label": "Gestion de Production"},
            {"value": CourseCategory.LOGISTICS, "label": "Logistique"},
            {"value": CourseCategory.QUALITY_CONTROL, "label": "Contrôle Qualité"},
            {"value": CourseCategory.INDUSTRIAL_MAINTENANCE, "label": "Maintenance Industrielle"},
            {"value": CourseCategory.LEAN_MANAGEMENT, "label": "Lean Management"},
            {"value": CourseCategory.INDUSTRIAL_SIMULATION, "label": "Simulation Industrielle"}
        ])
    
    # Civil Engineering
    elif specialization == Specialization.CIVIL:
        categories.extend([
            {"value": CourseCategory.STRUCTURES, "label": "Calcul de Structures"},
            {"value": CourseCategory.CONSTRUCTION_MATERIALS, "label": "Matériaux de Construction"},
            {"value": CourseCategory.HYDRAULICS, "label": "Hydraulique Appliquée"},
            {"value": CourseCategory.TOPOGRAPHY, "label": "Topographie"},
            {"value": CourseCategory.URBAN_PLANNING, "label": "Urbanisme"},
            {"value": CourseCategory.BIM, "label": "Building Information Modeling"}
        ])
    
    # Financial Engineering
    elif specialization == Specialization.FINANCIER:
        categories.extend([
            {"value": CourseCategory.FINANCIAL_ANALYSIS, "label": "Analyse Financière"},
            {"value": CourseCategory.ACCOUNTING, "label": "Comptabilité"},
            {"value": CourseCategory.AUDIT, "label": "Audit Financier"},
            {"value": CourseCategory.RISK_MANAGEMENT, "label": "Gestion des Risques"},
            {"value": CourseCategory.FINANCIAL_ENGINEERING, "label": "Ingénierie Financière"},
            {"value": CourseCategory.FINTECH, "label": "Technologies Financières"}
        ])
    
    return categories