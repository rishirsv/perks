export const DECKSPEC_SCHEMA_BASE = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'kpmg-slidegen/skill/deckspec-combined-schema',
  title: 'KPMG SlideGen DeckSpec Combined Schema',
  description:
    'Single-file schema combining top-level deckSpec contract and per-slide slot/type rules for the current kpmg-diligence template.',
  type: 'object',
  additionalProperties: false,
  required: ['metadata', 'slides'],
  properties: {
    metadata: {
      $ref: '#/$defs/metadata',
    },
    slides: {
      type: 'array',
      minItems: 1,
      items: {
        $ref: '#/$defs/slide',
      },
    },
  },
  $defs: {
    metadata: {
      type: 'object',
      additionalProperties: false,
      properties: {
        title: {
          type: 'string',
          minLength: 1,
        },
        author: {
          type: 'string',
          minLength: 1,
        },
        company: {
          type: 'string',
          minLength: 1,
        },
        subject: {
          type: 'string',
          minLength: 1,
        },
        allowSparse: {
          type: 'boolean',
        },
        year: {
          type: 'number',
        },
        jurisdiction: {
          type: 'string',
        },
        legalStructure: {
          type: 'string',
        },
        documentClassification: {
          type: 'string',
        },
        officeContactText: {
          type: 'string',
        },
        footer: {
          $ref: '#/$defs/footer',
        },
        textAmount: {
          type: 'string',
          enum: ['sm', 'md', 'lg', 'xl'],
        },
        slideCountPolicy: {
          type: 'string',
          enum: ['user', 'auto'],
        },
        styleIntent: {
          type: 'string',
          enum: ['diligence', 'strategy', 'generic'],
        },
        splitPolicy: {
          description:
            'Advisory authoring hint only. Current runtime pagination does not enforce this metadata field.',
          type: 'string',
          enum: ['balanced', 'readability_first'],
        },
      },
    },
    footer: {
      type: 'object',
      additionalProperties: false,
      properties: {
        year: {
          type: 'number',
        },
        legalEntityName: {
          type: 'string',
          minLength: 1,
        },
        jurisdiction: {
          type: 'string',
          minLength: 1,
        },
        legalStructure: {
          type: 'string',
          minLength: 1,
        },
        documentClassification: {
          type: 'string',
        },
        officeContactText: {
          type: 'string',
        },
      },
    },
    textRun: {
      description: 'Allowed item in textArray slots.',
      oneOf: [
        {
          type: 'string',
          minLength: 1,
        },
        {
          type: 'object',
          additionalProperties: false,
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
            },
            subheader: {
              type: 'boolean',
            },
            header: {
              type: 'boolean',
            },
            children: {
              type: 'array',
              items: {
                $ref: '#/$defs/textRun',
              },
            },
          },
        },
      ],
    },
    textArrayMin1: {
      type: 'array',
      minItems: 1,
      items: {
        $ref: '#/$defs/textRun',
      },
    },
    table: {
      type: 'object',
      additionalProperties: false,
      required: ['headers', 'rows'],
      properties: {
        title: {
          type: 'string',
        },
        heading: {
          type: 'string',
        },
        headers: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'string',
          },
        },
        rows: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'array',
            items: {
              oneOf: [{ type: 'string' }, { type: 'number' }, { type: 'boolean' }, { type: 'null' }],
            },
          },
        },
      },
      'x-kpmg-rowWidthEqualsHeaders': true,
    },
    chartSeries: {
      type: 'object',
      additionalProperties: false,
      required: ['values'],
      properties: {
        name: {
          type: 'string',
        },
        labels: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        values: {
          type: 'array',
          minItems: 1,
          items: {
            type: 'number',
          },
        },
      },
      'x-kpmg-valuesAlignWithLabels': true,
    },
    chartAnnotation: {
      type: 'object',
      additionalProperties: false,
      required: ['anchor'],
      properties: {
        anchor: {
          type: 'string',
          enum: ['topLeft', 'topRight', 'bottomLeft', 'bottomRight'],
        },
        title: {
          type: 'string',
          minLength: 1,
          maxLength: 60,
        },
        text: {
          type: 'string',
          minLength: 1,
          maxLength: 120,
        },
      },
      anyOf: [{ required: ['title'] }, { required: ['text'] }],
    },
    chart: {
      type: 'object',
      additionalProperties: false,
      required: ['type', 'data'],
      properties: {
        type: {
          type: 'string',
          enum: ['bar', 'bar3d', 'line', 'pie', 'doughnut', 'area', 'scatter', 'radar'],
        },
        data: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/$defs/chartSeries',
          },
        },
        opts: {
          type: 'object',
          description: 'Pptx chart options pass-through for renderer customization.',
        },
        source: {
          type: 'string',
          minLength: 0,
          maxLength: 700,
        },
        annotations: {
          type: 'array',
          minItems: 1,
          maxItems: 4,
          items: {
            $ref: '#/$defs/chartAnnotation',
          },
        },
      },
    },
    bridgeStep: {
      type: 'object',
      additionalProperties: false,
      required: ['label'],
      properties: {
        label: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
        },
        kind: {
          type: 'string',
          enum: ['delta', 'subtotal'],
        },
        delta: {
          type: 'number',
        },
        value: {
          type: 'number',
        },
      },
      allOf: [
        {
          if: {
            properties: {
              kind: {
                const: 'subtotal',
              },
            },
            required: ['kind'],
          },
          then: {
            required: ['value'],
          },
          else: {
            required: ['delta'],
          },
        },
      ],
    },
    bridge: {
      type: 'object',
      additionalProperties: false,
      required: ['startValue', 'endValue', 'steps'],
      properties: {
        startLabel: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
        },
        endLabel: {
          type: 'string',
          minLength: 1,
          maxLength: 80,
        },
        startValue: {
          type: 'number',
        },
        endValue: {
          type: 'number',
        },
        tolerance: {
          type: 'number',
          minimum: 0,
        },
        decimals: {
          type: 'integer',
          minimum: 0,
          maximum: 4,
        },
        unitPrefix: {
          type: 'string',
          maxLength: 20,
        },
        unitSuffix: {
          type: 'string',
          maxLength: 20,
        },
        unit: {
          type: 'string',
          maxLength: 20,
        },
        steps: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/$defs/bridgeStep',
          },
        },
      },
    },
    column: {
      type: 'object',
      additionalProperties: false,
      properties: {
        heading: {
          type: 'string',
          minLength: 1,
        },
        title: {
          type: 'string',
          minLength: 1,
        },
        body: {
          $ref: '#/$defs/textArrayMin1',
        },
      },
      anyOf: [{ required: ['heading'] }, { required: ['title'] }],
    },
    businessStructureNode: {
      type: 'object',
      additionalProperties: false,
      required: ['label'],
      properties: {
        label: {
          type: 'string',
          minLength: 1,
          maxLength: 120,
        },
        pct: {
          oneOf: [
            {
              type: 'string',
              minLength: 1,
              maxLength: 30,
            },
            {
              type: 'number',
            },
          ],
        },
      },
    },
    businessStructureTierItem: {
      oneOf: [
        {
          type: 'string',
          minLength: 1,
          maxLength: 120,
        },
        {
          $ref: '#/$defs/businessStructureNode',
        },
      ],
    },
    businessStructureLink: {
      type: 'object',
      additionalProperties: false,
      required: ['fromTier', 'fromIndex', 'toTier', 'toIndex'],
      properties: {
        fromTier: {
          type: 'string',
          enum: ['top', 'mid', 'bottom'],
        },
        toTier: {
          type: 'string',
          enum: ['top', 'mid', 'bottom'],
        },
        fromIndex: {
          type: 'integer',
          minimum: 0,
        },
        toIndex: {
          type: 'integer',
          minimum: 0,
        },
        label: {
          type: 'string',
          maxLength: 50,
        },
      },
    },
    businessStructurePerimeter: {
      type: 'object',
      additionalProperties: false,
      properties: {
        enabled: {
          type: 'boolean',
        },
        label: {
          type: 'string',
          minLength: 1,
          maxLength: 120,
        },
        subLabel: {
          type: 'string',
          minLength: 1,
          maxLength: 120,
        },
      },
    },
    businessStructure: {
      type: 'object',
      additionalProperties: false,
      required: ['topTier', 'bottomTier'],
      properties: {
        topTier: {
          type: 'array',
          minItems: 2,
          maxItems: 6,
          items: {
            $ref: '#/$defs/businessStructureTierItem',
          },
        },
        midTier: {
          type: 'array',
          maxItems: 4,
          items: {
            $ref: '#/$defs/businessStructureTierItem',
          },
        },
        bottomTier: {
          type: 'array',
          minItems: 1,
          maxItems: 5,
          items: {
            $ref: '#/$defs/businessStructureTierItem',
          },
        },
        links: {
          type: 'array',
          minItems: 1,
          items: {
            $ref: '#/$defs/businessStructureLink',
          },
        },
        perimeter: {
          $ref: '#/$defs/businessStructurePerimeter',
        },
      },
    },
    contentsSection: {
      type: 'object',
      additionalProperties: false,
      required: ['number', 'title'],
      properties: {
        number: {
          type: 'string',
          minLength: 1,
        },
        title: {
          type: 'string',
          minLength: 1,
        },
        items: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
        pageRange: {
          description:
            'Runtime-managed output metadata for contents slides. Usually omitted in authored deckSpec and recomputed during pagination.',
          type: 'string',
        },
      },
    },
  },
};
