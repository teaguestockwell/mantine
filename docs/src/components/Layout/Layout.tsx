import React, { useState } from 'react';
import { MantineProvider, ColorSchemeProvider, ColorScheme, Global } from '@mantine/core';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import rtlPlugin from 'stylis-plugin-rtl';
import { LayoutInner, LayoutProps } from './LayoutInner';
import { DirectionContext } from './DirectionContext';
import { GreycliffCF } from '../../fonts/GreycliffCF/GreycliffCF';

const THEME_KEY = 'mantine-color-scheme';

export default function Layout({ children, location }: LayoutProps) {
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: THEME_KEY,
    defaultValue: 'light',
    getInitialValueInEffect: true,
  });

  const toggleColorScheme = (value?: ColorScheme) => {
    const newColorScheme = value || (colorScheme === 'dark' ? 'light' : 'dark');
    document.documentElement.style.setProperty('color-scheme', newColorScheme);
    setColorScheme(newColorScheme);
  };

  const toggleDirection = () => setDir((current) => (current === 'rtl' ? 'ltr' : 'rtl'));

  useHotkeys([
    ['mod+J', () => toggleColorScheme()],
    ['mod + shift + L', () => toggleDirection()],
  ]);

  return (
    <DirectionContext.Provider value={{ dir, toggleDirection }}>
      <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
        <GreycliffCF />
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            dir,
            colorScheme,
            headings: { fontFamily: 'Greycliff CF, sans serif' },
          }}
          emotionOptions={
            dir === 'rtl' ? { key: 'mantine-rtl', stylisPlugins: [rtlPlugin] } : { key: 'mantine' }
          }
        >
          <Global
            styles={(theme) => ({
              body: {
                color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[8],
                fontSize: 15,
              },
            })}
          />
          <div dir={dir}>
            <LayoutInner location={location}>{children}</LayoutInner>
          </div>
        </MantineProvider>
      </ColorSchemeProvider>
    </DirectionContext.Provider>
  );
}
