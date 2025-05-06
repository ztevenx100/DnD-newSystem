import { APP_CONFIG } from './app';

export const THEME_CONFIG = {
    light: {
        primary: APP_CONFIG.THEME.PRIMARY_COLOR,
        secondary: APP_CONFIG.THEME.SECONDARY_COLOR,
        background: APP_CONFIG.THEME.BACKGROUND_COLOR,
        text: APP_CONFIG.THEME.TEXT_COLOR,
    },
    dark: {
        primary: '#0070f3',
        secondary: '#7928ca',
        background: '#000000',
        text: '#ffffff',
    },
} as const;

export type Theme = keyof typeof THEME_CONFIG; 