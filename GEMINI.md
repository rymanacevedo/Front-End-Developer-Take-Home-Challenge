# Project Guidelines for Astro Angular Application

This document outlines the guidelines, best practices, and coding styles for contributing to this Angular project, leveraging the Astro UX Design System and Biome. By adhering to these standards, we ensure consistency, maintainability, and high quality across our codebase.

## 1. Project Overview

This is an Angular application built to present Ground Resources Management (GRM) operator data using the Astro UX Design System components.

*   **Angular Version:** `~20.2.0`
*   **Astro Components:** `@astrouxds/angular` `~7.26.1`
*   **Code Formatting & Linting:** Biome `2.2.0`
*   **Package Manager:** `bun`

## 2. Getting Started

### 2.1 Prerequisites

*   **Node.js:** We recommend using the latest LTS version of Node.js.
*   **Angular CLI:** Ensure you have the Angular CLI installed globally:
    ```bash
    bun install -g @angular/cli
    ```

### 2.2 Setup

1.  **Fork the Repository:** Create a fork of this repository on GitHub.
2.  **Clone Your Fork:**
    ```bash
    git clone https://github.com/YOUR_GITHUB_USERNAME/Developer-Take-Home-Challenge.git
    cd Developer-Take-Home-Challenge
    ```
3.  **Install Dependencies:**
    ```bash
    bun install
    ```

### 2.3 Development Workflow

1.  **Start the Development Server:**
   This is ran in another terminal. No need to run.
    ```bash
    bun start
    ```
    This will serve the application at `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

2.  **Build for Production:**
   No need to run.
    ```bash
    bun run build
    ```
    This command builds the project, typically for deployment. The build artifacts will be stored in the `dist/` directory.

3.  **Watch for Changes (Development Build):**
   No need to run.
    ```bash
    bun run watch
    ```
    This command watches files for changes and performs a development build, similar to `ng serve` but without a development server.

4.  **Run Tests:**
   No need to run.
    ```bash
    bun test
    ```
    This command executes the unit tests via Karma.

## 3. Code Structure and Organization

We follow a modular, feature-based architecture to keep the codebase organized and scalable.

*   **`app/`**: Root application folder.
    *   **`core/`**: Contains singleton services, components, and modules used application-wide (e.g., authentication, logging, data services). These should be provided once in the `AppModule`.
        *   *Example:* `data.service.ts`, `auth.guard.ts`
    *   **`shared/`**: Contains components, pipes, and directives that are used across multiple feature modules but don't provide application-wide singleton services. These modules should not provide services.
        *   *Example:* `loading-spinner.component.ts`, `format-timestamp.pipe.ts`
    *   **`features/`**: Contains specific feature modules, each encapsulating related components, services, and routing. Each feature module should be lazy-loaded where appropriate.
        *   *Example:* `dashboard/`, `alerts/`
    *   **`assets/`**: Static assets like images, JSON data files (e.g., `_data.json`).
    *   **`environments/`**: Environment-specific configuration files.

## 4. Naming Conventions

Consistency in naming is crucial for readability and maintainability.

*   **Folders:** Kebab-case (`kebab-case`).
    *   *Example:* `my-feature`, `shared-components`
*   **Files:** Kebab-case (`kebab-case`).
    *   *Example:* `my-component.component.ts`, `my-service.service.ts`, `my-pipe.pipe.ts`
*   **Classes/Interfaces/Enums:** PascalCase (`PascalCase`).
    *   *Example:* `DashboardComponent`, `IAlert`, `AlertSeverity`
*   **Properties/Methods:** camelCase (`camelCase`).
    *   *Example:* `alertMessage`, `loadData()`
*   **Constants:** `UPPER_SNAKE_CASE` with `const` declaration.
    *   *Example:* `const MAX_ALERTS = 100;`
*   **Prefixes:**
    *   Components: `[ComponentName]Component`
    *   Services: `[ServiceName]Service`
    *   Modules: `[ModuleName]Module`
    *   Pipes: `[PipeName]Pipe`
    *   Directives: `[DirectiveName]Directive`

## 5. Angular Best Practices

### 5.0 Control Flow

* **Modern Control Flow:** Use new built-in control flow syntax instead of structural directives.
  * Use `@if` instead of `*ngIf`
  * Use `@for` instead of `*ngFor`
  * Use `@switch` instead of `[ngSwitch]`
  * Use `@empty` as fallback in `@for` loops
  * Use `@defer` for lazy loading template content

Examples:
```typescript
// Modern Control Flow
@for (item of items; track item.id) {
  <div>{{ item.name }}</div>
}

@if (condition) {
  <div>Shown when true</div>
} @else {
  <div>Shown when false</div>
}
```


### 5.1 Components

*   **Single Responsibility:** Each component should have a clear, focused responsibility.
*   **Smart vs. Dumb Components:**
    *   **Smart (Container) Components:** Handle data fetching, state management, and passing data to dumb components. They interact with services.
    *   **Dumb (Presentational) Components:** Receive data via `@Input()`, emit events via `@Output()`, and focus purely on rendering UI.
*   **OnPush Change Detection:** Use `ChangeDetectionStrategy.OnPush` for performance where possible. This requires components to be immutable or to signal changes explicitly.
*   **Host Bindings:** Prefer `host` property in `@Component` decorator for simple host attributes/classes. For more complex interactions, use `HostBinding` and `HostListener`.
*   **Component-Scoped Styles:** Use `styles` or `styleUrls` in `@Component` for component-specific styles. Avoid global styles for individual components unless absolutely necessary.

### 5.2 Services

*   **Injectable:** Services should be decorated with `@Injectable()` and provided at the root (`{ providedIn: 'root' }`) or within a specific module/component.
*   **Business Logic & Data Access:** Services are responsible for business logic, interacting with APIs, and managing shared data. Keep components lean.
*   **Single Responsibility:** Similar to components, services should have a clear, focused purpose.
*   **Error Handling:** Implement robust error handling within services (e.g., using `catchError` from RxJS).

### 5.3 Modules

*   **Feature Modules:** Organize features into their own Angular modules. This enables lazy loading and better separation of concerns.
*   **Shared Module:** Declare and export common components, pipes, and directives that are used by many feature modules. *Do not* include services in the `SharedModule`.
*   **Core Module:** Import services that should be singletons across the application. Only `AppModule` should import `CoreModule`.

### 5.4 Observables and RxJS

*   **Use `async` Pipe:** Prefer the `async` pipe in templates to subscribe to observables and automatically unsubscribe, preventing memory leaks.
*   **Subscription Management:** If manual subscriptions are necessary, ensure you unsubscribe to prevent memory leaks, typically in `ngOnDestroy()`. Use operators like `takeUntil`, `take(1)`, or `first()` for completion.
*   **Operators:** Leverage RxJS operators for data transformation, filtering, and combination.

### 5.5 Templates and HTML

*   **Accessibility (A11y):** Strive for accessible HTML. Use semantic HTML, `aria-*` attributes, and ensure keyboard navigability, especially with interactive elements like Astro components.
*   **`*ngFor` with `trackBy`:** Always provide a `trackBy` function for `*ngFor` loops to improve rendering performance and prevent unnecessary DOM manipulation.
*   **Astro UX Design System:** Utilize Astro components (`rux-*`) for all UI elements where an equivalent exists. Adhere to their design guidelines for layout and visual hierarchy.

## 6. Styling and Formatting

Our project uses **Biome** for strict code formatting and linting. Developers **must** run Biome checks before committing.

### 6.1 Biome Configuration (`biome.json`)

The following rules from `biome.json` are strictly enforced:

*   **Indentation:** `2` spaces (`indentStyle: "space"`, `indentWidth: 2`)
*   **Line Endings:** `lf` (Unix style)
*   **Line Width:** `100` characters (`lineWidth: 100`)
*   **JavaScript/TypeScript:**
    *   **Quote Style:** Single quotes for strings (`quoteStyle: "single"`)
    *   **JSX Quote Style:** Double quotes for JSX attributes (`jsxQuoteStyle: "double"`)
    *   **Semicolons:** Omitted where possible (`semicolons: "asNeeded"`)
    *   **Trailing Commas:** Always present for multi-line arrays/objects (`trailingCommas: "all"`)
    *   **Arrow Function Parentheses:** Always present for single-argument arrow functions (`arrowParentheses: "always"`)
    *   **Bracket Spacing:** True for object/array literals and destructuring (`bracketSpacing: true`)
*   **Linter:** All recommended Biome linting rules are enabled.

### 6.2 Running Biome

It is recommended to integrate Biome into your IDE or run it pre-commit.
*   To format and lint your entire project:
    ```bash
    npx biome format --write .
    npx biome lint --apply .
    ```

### 6.3 Astro UX Design System Styling

*   **Component Usage:** Always prefer Astro components (`rux-button`, `rux-dialog`, `rux-card`, etc.) over native HTML elements for common UI patterns.
*   **Theming:** When customizing, use CSS variables provided by Astro UXDS to maintain theme consistency.
*   **Layout:** Utilize Astro layout components and utilities (e.g., `rux-container`, `rux-grid`) for consistent spacing and arrangement.

## 7. Testing

Unit tests are written using Jasmine and run with Karma.

*   **Component Tests:** Focus on testing component logic, input/output interactions, and rendering of child components. Avoid testing internal Angular mechanisms.
*   **Service Tests:** Test business logic, data manipulation, and interactions with external dependencies (mocked).
*   **Coverage:** Aim for reasonable test coverage, focusing on critical paths and complex logic.

## 8. Development Etiquette

*   **Commit Messages:** Write clear, concise, and descriptive commit messages. Follow a conventional commit style (e.g., `feat: add new dashboard feature`, `fix: resolve alert sorting bug`).
    *   *Note for Take-Home Challenge:* For this challenge, ensure you have multiple commits to demonstrate your progressive work and thought process, as requested.
*   **Pull Requests (PRs):**
    *   Create PRs early and often for visibility.
    *   Ensure your code passes all linting and testing checks before submitting.
    *   Provide a clear description of the changes, including why they were made and any relevant context.
    *   Request `@github/cskerbo` as a reviewer for your pull request, if available.
*   **Code Reviews:** Be constructive and respectful during code reviews. Focus on improving the codebase, not personal preferences.
*   **Documentation:** Update the `README.md` or other relevant documentation for any significant changes, new features, or setup instructions.
