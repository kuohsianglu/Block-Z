export type Region = {
  label: string;
  value: string;
};

export const LORAWAN_REGIONS: Region[] = [
  { label: 'AS923', value: 'WISBLOCK_REGION_AS923' },
  { label: 'AU915', value: 'WISBLOCK_REGION_AU915' },
  { label: 'CN470', value: 'WISBLOCK_REGION_CN470' },
  { label: 'CN779', value: 'WISBLOCK_REGION_CN779' },
  { label: 'EU433', value: 'WISBLOCK_REGION_EU433' },
  { label: 'EU868', value: 'WISBLOCK_REGION_EU868' },
  { label: 'KR920', value: 'WISBLOCK_REGION_KR920' },
  { label: 'IN865', value: 'WISBLOCK_REGION_IN865' },
  { label: 'US915', value: 'WISBLOCK_REGION_US915' },
  { label: 'RU864', value: 'WISBLOCK_REGION_RU864' },
] as const;
