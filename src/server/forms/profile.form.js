'use strict';

/**
 * @file: This file contains the forms for profile. See https://github.com/caolan/forms for a reference guide.
 */

import forms, {fields, validators} from 'forms'; // eslint-disable-line object-curly-spacing

export const profileEditForm = forms.create({
  displayname: fields.string({
    required: validators.required('Du skal have et brugernavn!')
  }),
  description: fields.string(),
  email: fields.string({
    validators: [validators.email('Du skal skrive en gyldig email!')]
  }),
  phone: fields.tel(),
  fullName: fields.string(),
  birthday: fields.string({
    validators: [validators.date('Du skal en komplet dato for eksempel "23/08/2004".')]
  }),
  libraryId: fields.string({
    required: validators.required('Du skal huske at vælge et bibliotek!')
  }),
  loanerId: fields.string(),
  pincode: fields.string()
});
