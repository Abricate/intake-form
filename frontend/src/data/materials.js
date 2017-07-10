import _ from 'lodash';

const CoroplastAndAcrylicColors = [
  'Red',
  'Yellow',
  'Green',
  'Blue',
  'Black',
  'White',
  'Clear',
];

export const Materials = [
  {
    label: 'Plastic',
    types: [
      'Acrylic',
      'Coroplast',
      'Delrin',
      'Edgelite',
      'Neoprene',
      'Silicon rubber',
    ],
    thicknesses: [
      '1/16"',
      '1/8"',
      '3/16"',
      '1/4',
      '3/8"',
      '1/2"',
      '3.2mm',
      '4mm',
      '6mm',
    ],
    colors: {
      'Coroplast': CoroplastAndAcrylicColors,
      'Acrylic': CoroplastAndAcrylicColors,
      'Delrin': ['Black', 'White']
    },
  },
  {
    label: 'Wood',
    types: [
      'Bamboo Ply',
      'Birch Plywood',
      'Cork',
      'Melamine',
      'MDF',
      'Walnut Plywood',
    ],
    thicknesses: [
      '3/16"',
      '1/4"',
      '3/8"',
      '1/2"',
      '5/8"',
      '.75"',
    ],
  },
  {
    label: 'Metal',
    types: [
      'Aluminum 5052',
      'Aluminum 6061',
      'Aluminum 6063',
      'Cold Rolled Steel 1083',
      'Hot Rolled Steel',
      'Stainless Steel 304',
    ],
    thicknesses: [
      '30 gage',
      '28 gage',
      '26 gage',
      '24 gage',
      '22 gage',
      '20 gage',
      '18 gage',
      '16 gage',
      '14 gage',
      '12 gage',
      '10 gage',
      '1/8"',
      '3/16"',
      '1/4"',
      '3/8"',
      '1/2"',
      '5/8"',
      '.75"',
      '1"',
    ],
  },
  {
    label: 'Fabric',
    types: [
      'Cotton',
      'Felt',
      'Leather',
      'Ripstop Nylon',
      'Silk'
    ]
  },
  {
    label: 'Paper / Laminate / Composite',
    types: [
      'Carbon fiber /16"',
      'Cardboard 1/8"',
      'Fiber glass 1/16"',
      'Flax composite 1/16"',
      'Foamcore 1/8"',
      'Foamcore 1/2"',
      'Mylar',
      'Paper 110lbs',
      'Pressboard 1/16"',
      'Rowmark 1/16"',
      'Worbla',
    ]
  },
  {
    label: 'Custom material',
    custom: true
  }
];

export const MaterialsByLabel = _.keyBy(Materials, 'label');
