Update my existing **ToneMatrix AI – Marathi NLP Research** project to implement a fully functional **global Light/Dark Theme and English/Marathi Language System**.

**IMPORTANT:** First inspect my existing project structure, components, CSS files, Settings page, and routing. Modify the existing code instead of creating a separate demo or rebuilding the application. Preserve all current features, API integrations, model predictions, history, charts, and UI layout.

## 1. Global Light and Dark Theme

The theme selected in Settings must apply to the **entire website**, not only the Settings page.

Pages to update:
- Dashboard
- Sentiment Analysis
- Sarcasm Analysis
- Combined Sentiment & Sarcasm Analysis
- Analysis History
- Model Comparison
- Dataset Explorer
- Analytics
- Research Results
- About
- Settings

Requirements:
- Light Mode should display light backgrounds, readable dark text, white/light cards, and subtle borders.
- Dark Mode should display dark backgrounds, readable light text, dark cards, suitable borders, and consistent accent colors.
- Update the sidebar, header, navigation, dropdowns, forms, input fields, buttons, tables, modals, tooltips, alerts, empty states, loading states, and result cards.
- Update chart backgrounds, axes, legends, labels, grid lines, and tooltips to remain readable in both themes.
- Remove conflicting hardcoded colors from existing CSS and replace them with reusable CSS variables wherever appropriate.
- Maintain the existing purple/blue branding and overall design.
- Avoid white cards or black text appearing incorrectly in Dark Mode.
- Ensure icons, disabled buttons, hover states, focus states, and selected navigation items remain visible in both themes.

## 2. Centralized Theme Management

Implement a shared theme system using React Context or the project's existing state management.

Requirements:
- Create or reuse a global ThemeContext.
- Provide a shared theme state and update function.
- Apply the active theme to the root HTML element using a consistent attribute, such as `data-theme="light"` or `data-theme="dark"`.
- Store the user's selection in localStorage using a consistent key.
- Restore the saved theme when the website reloads.
- Changing the theme in Settings must update every page immediately without refreshing the website.
- Do not maintain separate, conflicting theme states in individual components.
- Ensure the application starts in Light Mode by default only when no saved preference exists.

## 3. Complete English and Marathi Language Switching

The language selected in Settings must translate the **entire website**, not just the Settings page.

Support:
- English
- मराठी (Marathi)

Translate all user-facing text, including:
- Sidebar menu items and section headings
- Dashboard titles, statistics, descriptions, and cards
- Page headings, subtitles, labels, and instructions
- Buttons, placeholders, search fields, and dropdown options
- Sentiment and sarcasm analysis forms
- Analysis results, sentiment labels, sarcasm labels, confidence descriptions, and recommendations
- Validation messages, API error messages, success messages, and notifications
- History filters, table headings, pagination, delete confirmations, and empty states
- Model comparison tables, model names where appropriate, metric labels, and chart labels
- Dataset Explorer headings, dataset descriptions, and table labels
- Analytics charts, axes, legends, summaries, and statistics
- Research Results and About page content
- All Settings labels, theme options, and language options
- Loading indicators, tooltips, accessibility labels, and other visible text

Use natural, readable Marathi. Preserve technical terms, API field names, model identifiers, and programming terminology where translation would make them confusing.

## 4. Centralized Language Management

Create or reuse a shared LanguageContext and a centralized translation dictionary.

Requirements:
- Provide a `useLanguage()` hook or an equivalent approach consistent with the project.
- Implement a translation function such as `t("dashboard")`.
- Use stable translation keys instead of scattering conditional English/Marathi strings throughout components.
- Keep English and Marathi dictionaries organized and complete.
- Update every page and shared component to use the translation system.
- Ensure dynamically generated labels, messages, chart legends, table values, and analysis result descriptions use the selected language.
- If any translation key is missing, fall back safely to English instead of displaying `undefined`.
- Save the selected language in localStorage.
- Restore the language after refreshing the website.
- Switching languages must update the entire interface immediately without a page reload.
- The language must remain consistent while navigating between routes.

## 5. Settings Page UI

Preserve my existing Settings page layout and improve its functionality.

**Appearance section:**
- Light Mode card with a sun icon.
- Dark Mode card with a moon icon.
- Clearly highlight the selected theme.
- Show a selected checkmark or equivalent indicator.

**Language section:**
- English option with an English interface description.
- मराठी (Marathi) option with a Marathi interface description.
- Clearly highlight the selected language.

Requirements:
- Clicking either option must update the entire application immediately.
- The active selection must match the saved preference.
- Maintain the existing purple accent color, rounded cards, spacing, and responsive design.
- Do not add duplicate theme or language selectors elsewhere unless the existing application already requires them.

## 6. Technical Implementation

- Inspect the current React and Vite project before editing.
- Reuse existing dependencies and architecture where possible.
- Add providers at the correct application entry point, such as `src/main.jsx`.
- Ensure providers wrap the complete application, including routing and shared layout components.
- Create reusable theme variables and organize CSS cleanly.
- Avoid duplicating contexts, translation dictionaries, event listeners, or localStorage logic.
- Do not break existing API calls, FastAPI endpoints, ML/DL/transformer models, prediction workflows, analysis history, or data visualizations.
- Do not translate internal API request/response keys or change backend behavior unless absolutely necessary.
- Keep all existing routes and navigation working.
- Maintain responsive layouts for desktop, tablet, and mobile.

## 7. Testing and Verification

After implementation:

1. Start the application and fix all compilation errors.
2. Verify every page in Light Mode.
3. Switch to Dark Mode and verify every page, including charts and forms.
4. Switch from English to Marathi and verify every page and navigation item.
5. Navigate between multiple pages to ensure the selected theme and language remain consistent.
6. Refresh the browser and verify both preferences persist.
7. Test the sentiment, sarcasm, and combined analysis workflows.
8. Verify history, delete actions, model comparison, datasets, and analytics still function.
9. Check for untranslated strings, missing translations, unreadable colors, console errors, and broken layouts.
10. Confirm that changing a preference updates the interface immediately without a reload.

## 8. Final Deliverables

Implement the changes directly in my existing project files. Do not just provide instructions or sample code.

When finished, report:
- Files created or modified.
- How global theme management works.
- How global language management works.
- Which pages were updated.
- Tests performed and their results.
- Any remaining issues or features that could not be completed.

**Final acceptance criteria:** A user should be able to select Dark Mode and Marathi in Settings, navigate to any page, and see the entire ToneMatrix AI application in Dark Mode and Marathi. The selections must remain active after navigation and browser refresh. The same must work for Light Mode and English.