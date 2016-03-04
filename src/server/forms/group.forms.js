'use strict';

/**
 * @file: This file contains the forms for groups. See https://github.com/caolan/forms for a reference guide.
 */

import forms, {fields, validators} from 'forms'; // eslint-disable-line object-curly-spacing

export const groupCreateForm = forms.create({
  'group-name': fields.string({
    required: validators.required('Du skal udfylde navnet!')
  }),
  'group-description': fields.string({
    required: validators.required('Du skal have en beskrivelse!')
  }),
  'group-colour-picker_colour': fields.string({
    required: validators.required('Husk at vælge en farve!')
  })
});
