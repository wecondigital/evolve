/**
 * WhatsApp Message Builder Utility
 * Generates dynamic WhatsApp messages based on traffic source and page
 */

export interface TrafficSource {
  isGoogleAds: boolean;
  isMetaAds: boolean;
  source: 'google' | 'meta' | 'organic';
}

export interface PageConfig {
  path: string;
  topic: string;
}

const PAGE_TOPICS: Record<string, string> = {
  '/assimetria-craniana': 'tratamento de assimetria craniana',
  '/assimetria-craniana-mutirao': 'agendamento para assimetria craniana do Mutirão Mês das Crianças',
  '/torcicolo-congenito': 'tratamento de torcicolo congênito',
  '/fisioterapia-infantil': 'Fisioterapia Infantil',
  '/osteopatia-disquesia': 'tratamento de disquesia em bebês',
  '/osteopatia-colicas': 'tratamento de cólicas em bebês',
};

/**
 * Detects traffic source from URL parameters
 */
export function detectTrafficSource(url: string = window.location.href): TrafficSource {
  const urlParams = new URLSearchParams(new URL(url).search);

  const hasGclid = urlParams.has('gclid');
  const hasGbraid = urlParams.has('gbraid');
  const hasFbclid = urlParams.has('fbclid');

  const isGoogleAds = hasGclid || hasGbraid;
  const isMetaAds = hasFbclid;

  let source: 'google' | 'meta' | 'organic' = 'organic';
  if (isGoogleAds) {
    source = 'google';
  } else if (isMetaAds) {
    source = 'meta';
  }

  return {
    isGoogleAds,
    isMetaAds,
    source,
  };
}

/**
 * Gets the topic for the current page
 */
export function getPageTopic(pathname: string = window.location.pathname): string {
  return PAGE_TOPICS[pathname] || 'Osteopatia Pediátrica';
}

/**
 * Builds the WhatsApp message based on traffic source and page
 */
export function buildWhatsAppMessage(
  trafficSource?: TrafficSource,
  pageTopic?: string
): string {
  const source = trafficSource || detectTrafficSource();
  const topic = pageTopic || getPageTopic();

  if (source.isGoogleAds) {
    return `Olá! Vim do Google e gostaria de mais informações sobre ${topic}.`;
  }

  if (source.isMetaAds) {
    return `Olá! Vim do Meta (Facebook/Instagram) e gostaria de mais informações sobre ${topic}.`;
  }

  // Fallback for organic traffic
  return `Olá! Gostaria de mais informações sobre ${topic}.`;
}

/**
 * Gets the WhatsApp URL with the encoded message
 */
export function getWhatsAppUrl(message: string, phoneNumber: string = '5511959774208'): string {
  const encodedMessage = encodeURIComponent(message);
  return `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
}
