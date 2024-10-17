export function randString(length) {
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export const regions = [
  {
    label: 'Alberta',
    value: 'ALBERTA',
  },
  {
    label: 'British Columbia',
    value: 'BRITISH_COLUMBIA',
  },
  {
    label: 'Manitoba',
    value: 'MANITOBA',
  },
  {
    label: 'Newfound and Labrador',
    value: 'NEWFOUNDLAND_AND_LABRADOR',
  },
  {
    label: 'new Brunswick',
    value: 'NEW_BRUNSWICK',
  },
  {
    label: 'Northwest Territories',
    value: 'NORTHWEST_TERRITORIES',
  },

  {
    label: 'Nova Scotia',
    value: 'NOVA_SCOTIA',
  },

  {
    label: 'Nunavut',
    value: 'NUNAVUT',
  },
  {
    label: 'Ontario',
    value: 'ONTARIO',
  },
  {
    label: 'Prince Edward Island',
    value: 'PRINCE_EDWARD_ISLAND',
  },
  {
    label: 'Qubec',
    value: 'QUEBEC',
  },
  {
    label: 'Saskatchewan',
    value: 'SASKATCHEWAN',
  },
  {
    label: 'Yukon',
    value: 'YUKON',
  },
];
