module.exports = {
  sidebar: [
    {
      'Getting started': ['installation', 'basic-example'],
      'API Reference': [
        'validate',
        {
          Validators: [
            'validators/oneof',
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
            'modifiers/nonempty',
            'modifiers/minlength',
          ],
          Utilities: ['utilities/pipe'],
        },
      ],
    },
  ],
};
