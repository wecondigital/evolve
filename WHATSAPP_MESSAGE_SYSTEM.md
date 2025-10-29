# Sistema de Mensagens Dinâmicas do WhatsApp

## Visão Geral

O sistema de mensagens do WhatsApp foi implementado para gerar automaticamente mensagens personalizadas baseadas em:
1. **Origem do Tráfego**: Google Ads ou Meta Ads (Facebook/Instagram)
2. **Página Visitada**: Qual serviço específico o visitante está visualizando

## Como Funciona

### Detecção de Origem do Tráfego

O sistema detecta a origem através dos parâmetros da URL:

- **Google Ads**: Detectado via parâmetros `gclid` ou `gbraid`
- **Meta Ads**: Detectado via parâmetro `fbclid`
- **Tráfego Orgânico**: Quando nenhum parâmetro é encontrado

### Páginas e Tópicos Configurados

| Página | Tópico na Mensagem |
|--------|-------------------|
| `/assimetria-craniana` | assimetria craniana |
| `/assimetria-craniana-mutirao` | agendamento para assimetria craniana do Mutirão Mês das Crianças |
| `/torcicolo-congenito` | torcicolo congênito |
| `/fisioterapia-infantil` | Fisioterapia Infantil |
| `/osteopatia-disquesia` | disquesia em bebês |
| `/osteopatia-colicas` | cólicas em bebês |
| `/` (home) | Osteopatia Pediátrica |

## Exemplos de Mensagens Geradas

### Página: Assimetria Craniana

**Vindo do Google Ads:**
```
Olá! Vim do Google e gostaria de mais informações sobre Osteopatia Pediátrica para assimetria craniana.
```

**Vindo do Meta Ads:**
```
Olá! Vim do Meta (Facebook/Instagram) e gostaria de mais informações sobre Osteopatia Pediátrica para assimetria craniana.
```

**Tráfego Orgânico:**
```
Olá! Gostaria de mais informações sobre Osteopatia Pediátrica para assimetria craniana.
```

### Página: Torcicolo Congênito

**Vindo do Google Ads:**
```
Olá! Vim do Google e gostaria de mais informações sobre Osteopatia Pediátrica para torcicolo congênito.
```

**Vindo do Meta Ads:**
```
Olá! Vim do Meta (Facebook/Instagram) e gostaria de mais informações sobre Osteopatia Pediátrica para torcicolo congênito.
```

## Testando o Sistema

### URLs de Teste

Para testar as diferentes origens, adicione os parâmetros apropriados:

**Google Ads:**
```
https://seusite.com/assimetria-craniana?gclid=123456
https://seusite.com/torcicolo-congenito?gbraid=abcdef
```

**Meta Ads:**
```
https://seusite.com/osteopatia-colicas?fbclid=789xyz
https://seusite.com/fisioterapia-infantil?fbclid=456abc
```

**Tráfego Orgânico:**
```
https://seusite.com/assimetria-craniana
https://seusite.com/osteopatia-disquesia
```

## Arquivos Implementados

### `/src/lib/whatsappMessageBuilder.ts`
Módulo utilitário que contém toda a lógica de:
- Detecção de origem do tráfego
- Mapeamento de páginas para tópicos
- Geração de mensagens personalizadas

### `/src/components/LeadForm.astro`
Componente de formulário atualizado para:
- Importar e usar o módulo `whatsappMessageBuilder`
- Gerar mensagens dinâmicas antes do redirecionamento ao WhatsApp
- Manter compatibilidade com toda a funcionalidade existente

## Benefícios

1. **Melhor Experiência do Usuário**: Mensagem contextualizada desde o primeiro contato
2. **Rastreamento Aprimorado**: Equipe sabe imediatamente de onde o lead veio e qual serviço interessa
3. **Maior Taxa de Conversão**: Mensagem personalizada demonstra atenção ao interesse do visitante
4. **Analytics Melhorados**: Fácil identificar quais canais e serviços geram mais leads

## Manutenção

Para adicionar novos serviços/páginas, edite o arquivo `/src/lib/whatsappMessageBuilder.ts` e adicione a entrada correspondente no objeto `PAGE_TOPICS`:

```typescript
const PAGE_TOPICS: Record<string, string> = {
  // ... entradas existentes ...
  '/nova-pagina': 'descrição do novo serviço',
};
```
