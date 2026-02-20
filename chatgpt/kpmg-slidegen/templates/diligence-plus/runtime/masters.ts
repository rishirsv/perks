export type MasterVariantKey =
  | 'white'
  | 'section'
  | 'sectionDark'
  | 'sectionLight'
  | 'cover'
  | 'closing'
  | 'summary';

export interface MasterOverlay {
  assetKey: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface MasterVariant {
  masterName: string;
  backgroundColor: string;
  includeFooter: boolean;
  overlays?: MasterOverlay[];
}

export interface FooterTextBox {
  x: number;
  y: number;
  w: number;
  h: number;
  fontFace: string;
  fontSize: number;
  color: string;
  text: string;
  align?: 'left' | 'right' | 'center';
}

export interface FooterChromeConfig {
  logo: { x: number; y: number; w: number; h: number };
  legalText: FooterTextBox;
  officeContactText: FooterTextBox;
  classificationText: FooterTextBox;
  separatorLine: { x: number; y: number; w: number; h: number; line: { color: string; pt: number } };
  slideNumber: { x: number; y: number; w: number; h: number; fontFace: string; fontSize: number; color: string; align: 'left' | 'right' | 'center' };
}

export interface DiligencePlusMasters {
  footerChrome: FooterChromeConfig;
  variants: Record<MasterVariantKey, MasterVariant>;
}

export const MASTERS: DiligencePlusMasters = {
  footerChrome: {
    logo: { x: 1.097, y: 6.854, w: 0.529, h: 0.215 },
    legalText: {
      x: 2.062,
      y: 6.854,
      w: 6.937,
      h: 0.202,
      fontFace: 'Arial',
      fontSize: 6,
      color: '666666',
      text:
        '© [year] [legal member firm name], a [jurisdiction] [legal structure] and a member firm of the KPMG global organization of independent member firms affiliated with KPMG International Limited, a private English company limited by guarantee. All rights reserved.',
    },
    officeContactText: {
      x: 8.95,
      y: 6.854,
      w: 0.82,
      h: 0.202,
      fontFace: 'Arial',
      fontSize: 6,
      color: '666666',
      text: '',
      align: 'left',
    },
    classificationText: {
      x: 9.807,
      y: 6.854,
      w: 2.041,
      h: 0.101,
      fontFace: 'Arial',
      fontSize: 6,
      color: '666666',
      text: 'Document Classification: KPMG Confidential',
      align: 'right',
    },
    separatorLine: {
      x: 11.892,
      y: 6.854,
      w: 0,
      h: 0.163,
      line: { color: '1E49E2', pt: 0.5 },
    },
    slideNumber: {
      x: 11.971,
      y: 6.854,
      w: 0.265,
      h: 0.163,
      fontFace: 'Arial',
      fontSize: 8,
      color: '00338D',
      align: 'right',
    },
  },
  variants: {
    white: { masterName: 'KPMG_WHITE', backgroundColor: 'FFFFFF', includeFooter: true },
    section: {
      masterName: 'KPMG_SECTION',
      backgroundColor: '1E49E2',
      includeFooter: false,
      overlays: [{ assetKey: 'gradientDividerWindow', x: 1.092, y: 1.067, w: 7.723, h: 5.365 }],
    },
    sectionDark: {
      masterName: 'KPMG_SECTION_DARK',
      backgroundColor: '1E49E2',
      includeFooter: false,
      overlays: [{ assetKey: 'gradientDividerWindow', x: 1.092, y: 1.067, w: 7.723, h: 5.365 }],
    },
    sectionLight: { masterName: 'KPMG_SECTION_LIGHT', backgroundColor: 'FFFFFF', includeFooter: false },
    cover: { masterName: 'KPMG_COVER', backgroundColor: '1E49E2', includeFooter: false },
    closing: {
      masterName: 'KPMG_CLOSING',
      backgroundColor: '1E49E2',
      includeFooter: false,
      overlays: [{ assetKey: 'gradientBackCover', x: 0, y: 0, w: 13.333, h: 7.5 }],
    },
    summary: {
      masterName: 'KPMG_SUMMARY',
      backgroundColor: 'FFFFFF',
      includeFooter: true,
      overlays: [{ assetKey: 'gradientAccentChip', x: 12.614, y: 0.113, w: 0.243, h: 0.243 }],
    },
  },
};
