# SecurePay - Transaction Dashboard

> Dashboard moderne de gestion des transactions bancaires avec architecture Clean Architecture et React 19

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-61dafb)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646cff)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 🛠️ Stack Technique

| Catégorie | Technologie | Version | Justification |
|-----------|-------------|---------|---------------|
| **Framework** | React | 19.0.0 | Dernière version stable, support natif des Server Components, amélioration des performances |
| **Langage** | TypeScript | 5.6 | Type safety, meilleure DX, détection d'erreurs à la compilation |
| **Build Tool** | Vite | 6.0 | HMR ultra-rapide, build optimisé, meilleure expérience développeur |
| **State Management** | React Hooks | Natif | Pas de complexité externe nécessaire, Context API + useState suffisants pour ce scope |
| **Routing** | React Router | 7.1 | Standard de l'industrie, support des lazy loading et suspense |
| **UI/Styling** | Tailwind CSS | 3.4 | Utility-first, dark mode natif, responsive design rapide |
| **Animations** | Framer Motion | 11.15 | Animations fluides, API déclarative, support de layout animations |
| **Icônes** | Lucide React | 0.468 | Collection moderne, tree-shakeable, cohérence visuelle |
| **Tests** | Vitest | 2.1 | Compatible Vite, rapide, API similaire à Jest |
| **Testing Library** | React Testing Library | 16.1 | Best practices, tests centrés utilisateur |
| **Mock Data** | Faker.js | 9.3 | Génération de données réalistes pour développement et tests |

---

## 🚀 Installation

### Prérequis

- Node.js ≥ 18.x
- npm ≥ 9.x ou pnpm ≥ 8.x

### Installation des dépendances

```bash
# Cloner le repository
git clone https://github.com/wilson635/securepay.git
cd securepay

# Installer les dépendances
npm install

# Générer les données mock (500 transactions)
npm run generate:mock
```

---

## ▶️ Lancement

```bash
# Serveur de développement (port 5173)
npm run dev

# Build de production
npm run build

# Preview du build de production
npm run preview

# Linting TypeScript
npm run lint

# Génération de nouvelles données mock
npm run generate:mock
```

**Accès :** Ouvrir [http://localhost:5173](http://localhost:5173)

**Credentials de test :**
- Email : `admin@securepay.com`
- Password : `SecurePay2025!`

---

## 🧪 Tests

### Commandes

```bash
# Lancer tous les tests
npm test

# Tests avec interface UI interactive
npm run test:ui

# Tests avec rapport de couverture
npm run test:coverage

# Tests en mode watch
npm run test:watch
```

### Couverture actuelle

| Catégorie | Couverture |
|-----------|------------|
| Value Objects | 100% |
| Entities | 95% |
| Utils | 100% |
| Hooks | 75% |
| Components | 60% |
| **Global** | **≥ 60%** ✅ |

### Stratégie de tests

- **Unit Tests** : Value Objects, Utils, Entities
- **Integration Tests** : Hooks React, Use Cases
- **Component Tests** : UI Components avec React Testing Library
- **E2E** : Non implémentés (voir Améliorations futures)

---

## 🏗️ Architecture

### Vue d'ensemble

```
┌─────────────────────────────────────────────────────────┐
│                   PRESENTATION LAYER                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │    Pages     │  │  Components  │  │    Hooks     │  │
│  │ (Dashboard)  │  │ (Table, UI)  │  │ (useTransac) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ Uses
┌──────────────────────────▼──────────────────────────────┐
│                   APPLICATION LAYER                      │
│  ┌────────────────────────────────────────────────────┐ │
│  │                   USE CASES                        │ │
│  │  • GetTransactions  • GetTransactionDetail        │ │
│  │  • RetryTransaction • CancelTransaction           │ │
│  │  • ExportTransactions                             │ │
│  └────────────────────────────────────────────────────┘ │
└──────────────────────────┬──────────────────────────────┘
                           │ Depends on
┌──────────────────────────▼──────────────────────────────┐
│                      DOMAIN LAYER                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Entities   │  │Value Objects │  │ Repositories │  │
│  │ (Transaction)│  │(Money, IBAN) │  │  (Interface) │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           │ Implemented by
┌──────────────────────────▼──────────────────────────────┐
│                  INFRASTRUCTURE LAYER                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │ Repositories │  │    Mappers   │  │     DTOs     │  │
│  │    (Mock)    │  │  (DTO→Domain)│  │(API Contracts│  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Structure des dossiers

```
src/
├── core/                          # Logique métier pure
│   ├── domain/                    # Entités et règles métier
│   │   ├── entities/              # Transaction entity
│   │   ├── value-objects/         # Money, IBAN, TransactionId
│   │   ├── errors/                # Erreurs métier
│   │   └── repositories/          # Interfaces (ports)
│   └── use-cases/                 # Cas d'usage applicatifs
│       ├── get-transactions.ts
│       ├── get-transaction-detail.ts
│       ├── retry-transaction.ts
│       ├── cancel-transaction.ts
│       └── export-transactions.ts
│
├── infrastructure/                # Implémentations techniques
│   ├── mappers/                   # DTO ↔ Domain mapping
│   ├── repositories/              # Implémentations (adapters)
│
├── presentation/                  # Couche UI
│   ├── components/
│   │   ├── ui/                    # Components réutilisables
│   │   └── transactions/          # Features components
│   ├── hooks/                     # Custom React hooks
│   └── pages/                     # Pages de l'application
│
└── shared/                        # Utilitaires partagés
    └── types/                    # Types partagés
    └── utils/                     # Format, mask, etc.
```

---

## 🎯 Choix Techniques & Justifications

### 1. **Clean Architecture (Hexagonal Architecture)**

**Choix :** Séparation stricte en 4 couches (Domain, Use Cases, Infrastructure, Presentation)

**Justification :**
- ✅ **Testabilité** : Domain layer sans dépendances externes
- ✅ **Maintenabilité** : Modifications isolées par couche
- ✅ **Scalabilité** : Facile d'ajouter de nouvelles features
- ✅ **Indépendance** : Changement de framework/DB sans impact sur la logique métier

**Trade-off :** Plus de boilerplate initial, mais ROI positif à moyen/long terme

---

### 2. **Value Objects (Money, IBAN, TransactionId)**

**Choix :** Encapsulation des primitives dans des objets métier

**Justification :**
- ✅ **Type Safety** : `Money` vs `number`, prévient les erreurs de manipulation
- ✅ **Validation** : IBAN validé à la création (impossible d'avoir un IBAN invalide)
- ✅ **Immuabilité** : Objets read-only, évite les side-effects

**Exemple :**
```typescript
// ❌ Avant (primitives)
const amount = 15000;
const iban = "SN08SN0100152000048500019176";

// ✅ Après (Value Objects)
const amount = Money.create(15000, 'XOF');
const iban = IBAN.create("SN08SN0100152000048500019176");
```

---

### 3. **React Hooks personnalisés**

**Choix :** `useTransactions`, `useTransactionDetail`, `useExportTransactions`, `useDebounce`

**Justification :**
- ✅ **Réutilisabilité** : Logique partagée entre components
- ✅ **Séparation des responsabilités** : UI vs Business logic
- ✅ **Testabilité** : Hooks testables indépendamment

**Exemple :**
```typescript
const { transactions, loading, filters, setFilters } = useTransactions();
// Toute la logique fetch/filter/sort encapsulée
```

---

### 4. **Tailwind CSS**

**Choix :** Utility-first CSS framework

**Justification :**
- ✅ **Productivité** : Pas de context switching (CSS ↔ JS)
- ✅ **Dark Mode** : `dark:bg-gray-900` natif
- ✅ **Responsive** : `md:grid-cols-3` pour breakpoints
- ✅ **Tree-shaking** : Seules les classes utilisées sont incluses

**Alternative considérée :** CSS Modules (rejeté car moins flexible)

---

### 5. **Framer Motion**

**Choix :** Animations déclaratives

**Justification :**
- ✅ **Performance** : GPU-accelerated, 60fps
- ✅ **API déclarative** : `<motion.div animate={{ opacity: 1 }}>`
- ✅ **Layout animations** : Transitions automatiques lors de changements DOM

**Exemple :**
```tsx
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0 }}
>
  {/* Contenu */}
</motion.div>
```

---

### 6. **Mock Repository Pattern**

**Choix :** Repository interface + Mock implementation

**Justification :**
- ✅ **Développement indépendant** : Pas besoin de backend fonctionnel
- ✅ **Tests** : Mock facilement remplaçable par un stub
- ✅ **Future-proof** : Remplacer `MockTransactionRepository` par `ApiTransactionRepository` sans changer les use cases

**Implémentation :**
```typescript
// Interface (Domain layer)
interface TransactionRepository {
  findAll(filters: TransactionFilters): Promise<Transaction[]>;
  findById(id: TransactionId): Promise<Transaction | null>;
}

// Mock (Infrastructure layer)
class MockTransactionRepository implements TransactionRepository {
  async findAll(filters: TransactionFilters): Promise<Transaction[]> {
    // Simulation avec faker.js
  }
}
```

---

## ⚠️ Compromis & Limitations

### Ce qui n'a pas été fait

| Fonctionnalité | Raison | Impact |
|----------------|--------|--------|
| **Tests E2E (Playwright)** | Temps limité, couverture unit/integration prioritaire | Pas de tests du parcours complet utilisateur |
| **Véritable API Backend** | Scope du test focalisé sur le frontend | Données mock uniquement |
| **Authentification JWT** | Mock login suffit pour démonstration | Pas de vraie sécurité |
| **Internationalisation (i18n)** | Interface en français uniquement | Support multi-langue manquant |
| **Pagination backend** | Pagination côté client | Performance dégradée avec >10k transactions |
| **Upload de fichiers** | Non requis dans le scope initial | Pas de justificatif de transaction uploadable |
| **WebSockets** | Mise à jour temps réel non prioritaire | Données statiques au chargement |
| **PWA** | Pas d'exigence offline-first | Pas d'utilisation hors ligne |

### Dettes techniques identifiées

1. **Gestion d'erreurs globale** : Pas de boundary error React pour catch les erreurs non gérées
2. **Logging/Monitoring** : Pas de Sentry/DataDog intégré
3. **Performance** : Pas de virtualisation pour la table (react-window) si >1000 lignes
4. **Accessibilité** : Pas d'audit WCAG 2.1 complet (focus management à améliorer)

---

## 🔮 Améliorations Futures

### Court terme (Sprint +1)

- [ ] **Tests E2E avec Playwright** : Parcours login → dashboard → détail → export
- [ ] **Storybook** : Documentation visuelle des composants UI
- [ ] **React Query** : Cache et invalidation automatique des données
- [ ] **Virtualization** : `react-window` pour tables de >1000 lignes
- [ ] **Error Boundary** : Composant de fallback global

### Moyen terme (3 mois)

- [ ] **API Backend réelle** : Remplacement du mock par appels REST/GraphQL
- [ ] **Authentification OAuth2** : SSO avec providers (Google, Azure AD)
- [ ] **Internationalisation** : Support FR/EN avec `react-i18next`
- [ ] **WebSockets** : Notifications temps réel des changements de statut
- [ ] **Advanced Filters** : Filtres par plage de dates, montant min/max
- [ ] **Bulk Actions** : Sélection multiple + actions en masse

### Long terme (6+ mois)

- [ ] **Analytics Dashboard** : Graphiques de tendances avec Recharts
- [ ] **Export formats** : PDF, Excel (XLSX) en plus du CSV
- [ ] **Audit Log** : Traçabilité de toutes les actions utilisateur
- [ ] **Role-Based Access Control (RBAC)** : Admin, Manager, Viewer
- [ ] **Mobile App** : React Native avec code partagé
- [ ] **AI/ML** : Détection de fraude avec patterns suspects


---

## 📄 License

MIT © 2025 SecurePay

---

## 📞 Contact & Support

- **Documentation** : [Guide d'intégration complet](./INTEGRATION_GUIDE.md)
- **Issues** : [GitHub Issues](https://github.com/votre-username/securepay-dashboard/issues)
- **Email** : support@securepay.com

---

**Dernière mise à jour** : 06 Janvier 2026  
**Version** : 1.0.0