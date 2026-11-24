import {
  Sun,
  Moon,
  Languages,
  Cpu,
  Check,
  RotateCcw,
  Palette,
  Globe,
  Settings as SettingsIcon,
} from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import { useLanguage } from '../context/LanguageContext'

function Settings() {
  const { theme, setTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  const resetSettings = () => {
    setTheme('light')
    setLanguage('English')
  }

  return (
    <div className="tm-settings-page">
      <header className="tm-settings-hero">
        <p className="tm-settings-eyebrow">
          <SettingsIcon size={15} />
          {t('settingsEyebrow')}
        </p>
        <h2>{t('settingsTitle')}</h2>
        <p>{t('settingsSubtitle')}</p>
      </header>

      <section>
        <div className="tm-settings-section-title">
          <h3>{t('appearance')}</h3>
          <p>{t('appearanceDesc')}</p>
        </div>

        <div className="tm-settings-theme-grid">
          <button
            type="button"
            className={`tm-settings-theme-card ${theme === 'light' ? 'selected' : ''}`}
            onClick={() => setTheme('light')}
            aria-pressed={theme === 'light'}
          >
            <span className="tm-settings-theme-icon">
              <Sun size={25} />
            </span>
            <span>
              <strong>{t('lightMode')}</strong>
              <small>{t('lightModeDesc')}</small>
              {theme === 'light' && (
                <span className="tm-settings-selected">
                  <Check size={13} /> {t('currentlySelected')}
                </span>
              )}
            </span>
          </button>

          
        </div>
      </section>

      <section className="tm-settings-card">
        <div className="tm-settings-section-title">
          <h3>
            <Languages
              size={19}
              style={{ verticalAlign: 'middle', marginRight: 8 }}
            />
            {t('language')}
          </h3>
          <p>{t('languageDesc')}</p>
        </div>

        <div className="tm-settings-language-options">
          {[
            { value: 'English', label: t('englishLang'), native: t('englishInterface') },
          ].map((item) => (
            <button
              type="button"
              key={item.value}
              className={`tm-settings-language-button ${language === item.value ? 'selected' : ''}`}
              onClick={() => setLanguage(item.value)}
              aria-pressed={language === item.value}
            >
              <span>
                <strong>{item.label}</strong>
                <small>{item.native}</small>
              </span>
              {language === item.value && <Check size={18} />}
            </button>
          ))}
        </div>
      </section>

      <section className="tm-settings-card">
        <div className="tm-settings-section-title">
          <h3>{t('modelConfig')}</h3>
          <p>{t('modelConfigDesc')}</p>
        </div>

        <div className="tm-settings-info-row">
          <span className="tm-settings-info-label">
            <Cpu size={17} /> {t('appMode')}
          </span>
          <strong>{t('production')}</strong>
        </div>

        <div className="tm-settings-info-row">
          <span className="tm-settings-info-label">
            <Globe size={17} /> {t('framework')}
          </span>
          <strong>{t('reactVite')}</strong>
        </div>

        <div className="tm-settings-info-row">
          <span className="tm-settings-info-label">
            <Palette size={17} /> {t('appearance')}
          </span>
          <strong>{theme === 'dark' ? t('darkMode') : t('lightMode')}</strong>
        </div>
      </section>

      <footer className="tm-settings-footer">
        <span>
          <Check size={15} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          {t('savedAuto')}
        </span>

        <button
          type="button"
          className="tm-settings-reset"
          onClick={resetSettings}
        >
          <RotateCcw size={15} />
          {t('resetSettings')}
        </button>
      </footer>
    </div>
  )
}

export default Settings
