import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const customPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{fuchsia.50}',
      100: '{fuchsia.100}',
      200: '{fuchsia.200}',
      300: '{fuchsia.300}',
      400: '{fuchsia.400}',
      500: '{fuchsia.500}',
      600: '{fuchsia.600}',
      700: '{fuchsia.700}',
      800: '{fuchsia.800}',
      900: '{fuchsia.900}',
      950: '{fuchsia.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{fuchsia.800}',
          inverseColor: '#ffffff',
          hoverColor: '{fuchsia.900}',
          activeColor: '{fuchsia.800}',
        },
        highlight: {
          background: '{fuchsia.950}',
          focusBackground: '{fuchsia.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
        outlined: {
          color: '{fuchsia.500}',
        },
      },
      dark: {
        primary: {
          color: '{fuchsia.50}',
          inverseColor: '{fuchsia.950}',
          hoverColor: '{fuchsia.100}',
          activeColor: '{fuchsia.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
        outlined: {
          color: '{fuchsia.500}',
        },
      },
    },
  },
});
