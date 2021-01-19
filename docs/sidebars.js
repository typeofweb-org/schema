module.exports = {
  sidebar: [
    {
      'Getting started': ['introduction', 'setup'],
      'API Reference': [
        'validate',
        {
          Validators: [
            'validators/oneOf',
            'validators/string',
            'validators/number',
            'validators/boolean',
            'validators/date',
            'validators/object',
            'validators/array',
            'validators/unknown',
          ],
          Modifiers: [
            'modifiers/nullable',
            'modifiers/optional',
            'modifiers/nil',
            'modifiers/nonEmpty',
            'modifiers/minLength',
          ],
          Utilities: ['utilities/pipe', 'utilities/typeOf'],
        },
      ],
    },
  ],
};
