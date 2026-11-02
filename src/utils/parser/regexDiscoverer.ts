export interface EdiDelimiters {
  segment: string;
  element: string;
  composite: string;
}

/**
 * Scenario 01: Dynamic Delimiter Shift
 * Scans the first line of an EDI transmission (usually ISA segment)
 * to automatically discover character separators without hardcoding.
 */
export function discoverDelimiters(rawText: string): EdiDelimiters {
  const cleanText = rawText.trim();
  
  // Default fallbacks
  const defaults: EdiDelimiters = { segment: '~', element: '*', composite: ':' };

  if (!cleanText.startsWith('ISA')) {
    return defaults;
  }

  // In an ISA segment, the element separator is always at index 3
  const element = cleanText.charAt(3) || '*';
  
  // Split tentatively using this element separator to inspect the full ISA segment
  const elements = cleanText.split(element);
  if (elements.length < 17) {
    return defaults;
  }

  // Component/Composite element separator is located at ISA16
  const composite = elements[16]?.charAt(0) || ':';

  // The segment terminator immediately follows the ISA16 element (index 105 of raw ISA)
  const isaLineEndIndex = cleanText.indexOf(elements[16]);
  const segment = cleanText.charAt(isaLineEndIndex + elements[16].length) || '~';

  return { segment, element, composite };
}
