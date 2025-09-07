import 'styled-components';
import { ClientConfig } from './types';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      accent: string;
      background: string;
      text: string;
    };
    fonts: {
      main: string;
    };
    config: ClientConfig;
  }
}
